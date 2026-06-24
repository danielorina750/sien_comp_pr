import type { Project } from "@/lib/types";
import { seedProjects } from "@/data/seedProjects";

const PROJECTS_KEY = "sien-profile-builder-projects-v1";

export function loadLocalProjects(): Project[] {
  if (typeof window === "undefined") return seedProjects;
  const raw = window.localStorage.getItem(PROJECTS_KEY);
  if (!raw) return seedProjects;
  try {
    const parsed = JSON.parse(raw) as Project[];
    return Array.isArray(parsed) ? parsed : seedProjects;
  } catch {
    return seedProjects;
  }
}

export function saveLocalProjects(projects: Project[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function resetLocalProjects(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROJECTS_KEY);
}
