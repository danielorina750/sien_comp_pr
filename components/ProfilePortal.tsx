"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { defaultContact, seedProjects } from "@/data/seedProjects";
import { loadLocalProjects, resetLocalProjects, saveLocalProjects } from "@/lib/localStorage";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import type { CompanyContact, CompanyProfileOptions, Project, ProjectCategory, ProjectStatus } from "@/lib/types";

const categories: ProjectCategory[] = [
  "Residential",
  "Hospitality",
  "Healthcare",
  "Commercial",
  "Industrial",
  "Educational",
  "Sports",
  "Master Planning",
  "Agricultural Infrastructure"
];

const statuses: ProjectStatus[] = ["Completed", "Construction Ongoing", "Design Phase", "Partner Capability Showcase", "Draft"];

const defaultOptions: CompanyProfileOptions = {
  versionName: "SIEN Company Profile",
  preparedFor: "",
  includeCover: true,
  includeOverview: true,
  includeServices: true,
  includePortfolioAnalytics: true,
  includeCompliance: true,
  includeContact: true,
  includeOnlyFeatured: false,
  selectedProjectIds: []
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function listFromText(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function textFromList(items: string[]): string {
  return items.join("\n");
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file: File): Promise<string> {
  if (!supabase) return fileToDataUrl(file);
  const safeName = `${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
  const path = `projects/${safeName}`;
  const { error } = await supabase.storage.from("project-images").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("project-images").getPublicUrl(path);
  return data.publicUrl;
}

async function fetchSupabaseProjects(): Promise<Project[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    status: row.status,
    location: row.location,
    year: row.year ?? undefined,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    scope: row.scope ?? [],
    highlights: row.highlights ?? [],
    coverImage: { src: row.cover_image_url, alt: row.title },
    gallery: (row.gallery_images ?? []).map((src: string) => ({ src, alt: row.title })),
    featured: row.featured,
    published: row.published,
    includeInProfile: row.include_in_profile,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  })) as Project[];
}

async function saveSupabaseProject(project: Project): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("projects").upsert({
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.category,
    status: project.status,
    location: project.location,
    year: project.year ?? null,
    short_description: project.shortDescription,
    full_description: project.fullDescription,
    scope: project.scope,
    highlights: project.highlights,
    cover_image_url: project.coverImage.src,
    gallery_images: project.gallery.map((image) => image.src),
    featured: project.featured,
    published: project.published,
    include_in_profile: project.includeInProfile,
    updated_at: new Date().toISOString()
  });
  if (error) throw error;
}

async function deleteSupabaseProject(projectId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) throw error;
}

function createEmptyProject(): Project {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    slug: "",
    title: "",
    category: "Residential",
    status: "Design Phase",
    location: "Kenya",
    year: new Date().getFullYear().toString(),
    shortDescription: "",
    fullDescription: "",
    scope: [],
    highlights: [],
    coverImage: { src: "/seed/hillside.png", alt: "Project image" },
    gallery: [],
    featured: false,
    published: true,
    includeInProfile: true,
    createdAt: now,
    updatedAt: now
  };
}

export function ProfilePortal() {
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [activeProject, setActiveProject] = useState<Project>(createEmptyProject());
  const [options, setOptions] = useState<CompanyProfileOptions>(defaultOptions);
  const [contact, setContact] = useState<CompanyContact>(defaultContact);
  const [activeTab, setActiveTab] = useState<"projects" | "builder" | "settings">("projects");
  const [notice, setNotice] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const initial = loadLocalProjects();
    setProjects(initial);
    if (isSupabaseConfigured) {
      fetchSupabaseProjects()
        .then((remoteProjects) => {
          if (remoteProjects.length > 0) {
            setProjects(remoteProjects);
            saveLocalProjects(remoteProjects);
          }
        })
        .catch((error) => setNotice(`Supabase load failed, using local fallback: ${error.message}`));
    }
  }, []);

  const includedProjects = useMemo(
    () => projects.filter((project) => project.includeInProfile && (!options.includeOnlyFeatured || project.featured)),
    [projects, options.includeOnlyFeatured]
  );

  const stats = useMemo(() => {
    const sectors = new Set(includedProjects.map((project) => project.category));
    return {
      total: projects.length,
      included: includedProjects.length,
      published: projects.filter((project) => project.published).length,
      sectors: sectors.size
    };
  }, [projects, includedProjects]);

  function syncProjects(nextProjects: Project[]) {
    setProjects(nextProjects);
    saveLocalProjects(nextProjects);
  }

  async function handleImageUpload(file: File | undefined) {
    if (!file) return;
    setNotice("Uploading project image...");
    const imageUrl = await uploadImage(file);
    setActiveProject((project) => ({ ...project, coverImage: { src: imageUrl, alt: project.title || "Project image" } }));
    setNotice("Image ready.");
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setNotice("");
    try {
      const now = new Date().toISOString();
      const project: Project = {
        ...activeProject,
        slug: activeProject.slug || slugify(activeProject.title),
        coverImage: { ...activeProject.coverImage, alt: activeProject.title },
        updatedAt: now,
        createdAt: activeProject.createdAt || now
      };
      const nextProjects = projects.some((item) => item.id === project.id)
        ? projects.map((item) => (item.id === project.id ? project : item))
        : [project, ...projects];
      syncProjects(nextProjects);
      await saveSupabaseProject(project);
      setActiveProject(createEmptyProject());
      setNotice("Project saved. It is now available for the website and PDF builder.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Project save failed");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteProject(projectId: string) {
    if (!confirm("Delete this project?")) return;
    try {
      const nextProjects = projects.filter((project) => project.id !== projectId);
      syncProjects(nextProjects);
      await deleteSupabaseProject(projectId);
      setNotice("Project deleted.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Delete failed");
    }
  }

  async function generatePdf() {
    setIsGenerating(true);
    setNotice("Generating company profile PDF...");
    try {
      const selectedProjects = projects.filter((project) => project.includeInProfile && project.published);
      const response = await fetch("/api/generate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ options, contact, projects: selectedProjects })
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "PDF generation failed" }));
        throw new Error(error.message);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${slugify(options.versionName || "sien-company-profile")}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
      setNotice("PDF generated successfully.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "PDF generation failed");
    } finally {
      setIsGenerating(false);
    }
  }

  function resetDemo() {
    resetLocalProjects();
    setProjects(seedProjects);
    setActiveProject(createEmptyProject());
    setNotice("Demo data restored.");
  }

  return (
    <main className="portal-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <aside className="sidebar">
        <div className="brand-mark">
          <span>SIEN</span>
          <small>Profile Builder</small>
        </div>
        <nav className="portal-nav">
          <button className={activeTab === "projects" ? "active" : ""} onClick={() => setActiveTab("projects")}>Projects</button>
          <button className={activeTab === "builder" ? "active" : ""} onClick={() => setActiveTab("builder")}>PDF Builder</button>
          <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>Company Settings</button>
        </nav>
        <div className="connection-card">
          <span className={isSupabaseConfigured ? "dot ok" : "dot"} />
          <div>
            <strong>{isSupabaseConfigured ? "Supabase connected" : "Local demo mode"}</strong>
            <p>{isSupabaseConfigured ? "Projects will sync to Supabase." : "Add env vars to persist uploads."}</p>
          </div>
        </div>
      </aside>

      <section className="content-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Company Profile Management Portal</p>
            <h1>Generate updated SIEN company profiles from live project data.</h1>
          </div>
          <button className="ghost-button" onClick={resetDemo}>Reset demo</button>
        </header>

        <section className="metric-grid">
          <Metric label="Total projects" value={stats.total} />
          <Metric label="Included in PDF" value={stats.included} />
          <Metric label="Published" value={stats.published} />
          <Metric label="Sectors" value={stats.sectors} />
        </section>

        {notice ? <div className="notice">{notice}</div> : null}

        {activeTab === "projects" ? (
          <div className="workspace-grid">
            <ProjectForm
              activeProject={activeProject}
              setActiveProject={setActiveProject}
              onSubmit={saveProject}
              onImageUpload={handleImageUpload}
              isSaving={isSaving}
            />
            <ProjectList projects={projects} editProject={setActiveProject} deleteProject={deleteProject} />
          </div>
        ) : null}

        {activeTab === "builder" ? (
          <BuilderPanel
            options={options}
            setOptions={setOptions}
            projects={projects}
            generatePdf={generatePdf}
            isGenerating={isGenerating}
          />
        ) : null}

        {activeTab === "settings" ? (
          <SettingsPanel contact={contact} setContact={setContact} />
        ) : null}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ProjectForm({
  activeProject,
  setActiveProject,
  onSubmit,
  onImageUpload,
  isSaving
}: {
  activeProject: Project;
  setActiveProject: (project: Project | ((current: Project) => Project)) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onImageUpload: (file: File | undefined) => Promise<void>;
  isSaving: boolean;
}) {
  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <div className="form-header">
        <div>
          <p className="eyebrow">Project entry</p>
          <h2>{activeProject.title || "Add new project"}</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setActiveProject(createEmptyProject())}>New</button>
      </div>

      <label>Project title<input value={activeProject.title} onChange={(event) => setActiveProject((project) => ({ ...project, title: event.target.value, slug: slugify(event.target.value) }))} required /></label>
      <div className="two-cols">
        <label>Category<select value={activeProject.category} onChange={(event) => setActiveProject((project) => ({ ...project, category: event.target.value as ProjectCategory }))}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label>Status<select value={activeProject.status} onChange={(event) => setActiveProject((project) => ({ ...project, status: event.target.value as ProjectStatus }))}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
      </div>
      <div className="two-cols">
        <label>Location<input value={activeProject.location} onChange={(event) => setActiveProject((project) => ({ ...project, location: event.target.value }))} /></label>
        <label>Year<input value={activeProject.year ?? ""} onChange={(event) => setActiveProject((project) => ({ ...project, year: event.target.value }))} /></label>
      </div>
      <label>Short description<textarea rows={3} value={activeProject.shortDescription} onChange={(event) => setActiveProject((project) => ({ ...project, shortDescription: event.target.value }))} /></label>
      <label>Full description<textarea rows={5} value={activeProject.fullDescription} onChange={(event) => setActiveProject((project) => ({ ...project, fullDescription: event.target.value }))} /></label>
      <div className="two-cols">
        <label>Scope of work, one per line<textarea rows={6} value={textFromList(activeProject.scope)} onChange={(event) => setActiveProject((project) => ({ ...project, scope: listFromText(event.target.value) }))} /></label>
        <label>Design highlights, one per line<textarea rows={6} value={textFromList(activeProject.highlights)} onChange={(event) => setActiveProject((project) => ({ ...project, highlights: listFromText(event.target.value) }))} /></label>
      </div>
      <label>Project image<input type="file" accept="image/*" onChange={(event) => void onImageUpload(event.target.files?.[0])} /></label>
      <div className="image-preview"><img src={activeProject.coverImage.src} alt={activeProject.coverImage.alt} /></div>
      <div className="toggles">
        <label><input type="checkbox" checked={activeProject.featured} onChange={(event) => setActiveProject((project) => ({ ...project, featured: event.target.checked }))} /> Featured</label>
        <label><input type="checkbox" checked={activeProject.published} onChange={(event) => setActiveProject((project) => ({ ...project, published: event.target.checked }))} /> Published</label>
        <label><input type="checkbox" checked={activeProject.includeInProfile} onChange={(event) => setActiveProject((project) => ({ ...project, includeInProfile: event.target.checked }))} /> Include in PDF</label>
      </div>
      <button className="primary-button" type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save project"}</button>
    </form>
  );
}

function ProjectList({ projects, editProject, deleteProject }: { projects: Project[]; editProject: (project: Project) => void; deleteProject: (id: string) => void }) {
  return (
    <section className="card list-card">
      <div className="form-header">
        <div>
          <p className="eyebrow">Portfolio database</p>
          <h2>Projects</h2>
        </div>
      </div>
      <div className="project-list">
        {projects.map((project) => (
          <article className="project-row" key={project.id}>
            <img src={project.coverImage.src} alt={project.coverImage.alt} />
            <div>
              <strong>{project.title}</strong>
              <p>{project.category} / {project.status} / {project.location}</p>
              <small>{project.includeInProfile ? "Included in PDF" : "Website only"}</small>
            </div>
            <div className="row-actions">
              <button onClick={() => editProject(project)}>Edit</button>
              <button onClick={() => void deleteProject(project.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BuilderPanel({
  options,
  setOptions,
  projects,
  generatePdf,
  isGenerating
}: {
  options: CompanyProfileOptions;
  setOptions: (options: CompanyProfileOptions | ((current: CompanyProfileOptions) => CompanyProfileOptions)) => void;
  projects: Project[];
  generatePdf: () => Promise<void>;
  isGenerating: boolean;
}) {
  return (
    <section className="card builder-card">
      <p className="eyebrow">Profile builder</p>
      <h2>Generate updated company profile PDF</h2>
      <div className="two-cols wide">
        <label>Version name<input value={options.versionName} onChange={(event) => setOptions((current) => ({ ...current, versionName: event.target.value }))} /></label>
        <label>Prepared for<input value={options.preparedFor ?? ""} onChange={(event) => setOptions((current) => ({ ...current, preparedFor: event.target.value }))} placeholder="Optional client / tender name" /></label>
      </div>
      <div className="section-options">
        {([
          ["includeCover", "Cover page"],
          ["includeOverview", "Executive snapshot"],
          ["includeServices", "Services"],
          ["includePortfolioAnalytics", "Portfolio analytics"],
          ["includeCompliance", "Compliance"],
          ["includeContact", "Contact"],
          ["includeOnlyFeatured", "Only featured projects"]
        ] as const).map(([key, label]) => (
          <label key={key}><input type="checkbox" checked={Boolean(options[key])} onChange={(event) => setOptions((current) => ({ ...current, [key]: event.target.checked }))} /> {label}</label>
        ))}
      </div>
      <div className="builder-projects">
        <h3>Projects that can appear in PDF</h3>
        {projects.filter((project) => project.published).map((project) => (
          <div className="builder-project" key={project.id}>
            <span>{project.title}</span>
            <small>{project.category}</small>
            <strong>{project.includeInProfile ? "Included" : "Excluded"}</strong>
          </div>
        ))}
      </div>
      <button className="primary-button large" onClick={() => void generatePdf()} disabled={isGenerating}>{isGenerating ? "Generating PDF..." : "Generate updated profile PDF"}</button>
    </section>
  );
}

function SettingsPanel({ contact, setContact }: { contact: CompanyContact; setContact: (contact: CompanyContact) => void }) {
  return (
    <section className="card form-card compact">
      <p className="eyebrow">Company details</p>
      <h2>Profile contact information</h2>
      <label>Company name<input value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} /></label>
      <label>Website<input value={contact.website} onChange={(event) => setContact({ ...contact, website: event.target.value })} /></label>
      <label>Email<input value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} /></label>
      <label>Phone<input value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} /></label>
      <label>Address<textarea rows={3} value={contact.address} onChange={(event) => setContact({ ...contact, address: event.target.value })} /></label>
    </section>
  );
}
