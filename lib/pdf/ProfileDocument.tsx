import React from "react";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CompanyContact, CompanyProfileOptions, Project } from "@/lib/types";

const colors = {
  ink: "#062B21",
  forest: "#0B3A2E",
  moss: "#A8E845",
  cream: "#F3EFE4",
  white: "#F8F7F2",
  muted: "#B9C2B8",
  line: "rgba(168,232,69,0.34)"
};

const styles = StyleSheet.create({
  pageDark: {
    position: "relative",
    width: "100%",
    height: "100%",
    padding: 42,
    backgroundColor: colors.ink,
    color: colors.white,
    fontFamily: "Helvetica"
  },
  pageLight: {
    position: "relative",
    width: "100%",
    height: "100%",
    padding: 42,
    backgroundColor: colors.cream,
    color: colors.ink,
    fontFamily: "Helvetica"
  },
  footer: {
    position: "absolute",
    left: 42,
    bottom: 24,
    fontSize: 8,
    color: "rgba(248,247,242,0.72)",
    letterSpacing: 0.7
  },
  footerLight: {
    position: "absolute",
    left: 42,
    bottom: 24,
    fontSize: 8,
    color: "rgba(6,43,33,0.62)",
    letterSpacing: 0.7
  },
  pageNumber: {
    position: "absolute",
    right: 42,
    bottom: 24,
    fontSize: 9,
    color: "rgba(248,247,242,0.7)"
  },
  pageNumberLight: {
    position: "absolute",
    right: 42,
    bottom: 24,
    fontSize: 9,
    color: "rgba(6,43,33,0.7)"
  },
  label: {
    fontSize: 9,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: colors.moss,
    marginBottom: 12
  },
  heroTitle: {
    fontSize: 64,
    lineHeight: 0.95,
    fontWeight: 700,
    maxWidth: 520
  },
  heading: {
    fontSize: 38,
    lineHeight: 1.02,
    fontWeight: 700,
    marginBottom: 12
  },
  body: {
    fontSize: 12,
    lineHeight: 1.55,
    color: "rgba(248,247,242,0.78)"
  },
  bodyDark: {
    fontSize: 12,
    lineHeight: 1.55,
    color: "rgba(6,43,33,0.72)"
  },
  coverGrid: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    gap: 28
  },
  coverLeft: {
    width: "42%",
    justifyContent: "center"
  },
  coverRight: {
    width: "58%",
    borderRadius: 22,
    overflow: "hidden",
    border: `1.4px solid ${colors.moss}`
  },
  coverImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  pill: {
    alignSelf: "flex-start",
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 100,
    backgroundColor: colors.moss,
    color: colors.ink,
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase"
  },
  statRow: {
    display: "flex",
    flexDirection: "row",
    gap: 18,
    marginTop: 32
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    border: "1px solid rgba(6,43,33,0.12)"
  },
  statValue: {
    fontSize: 34,
    fontWeight: 700,
    color: colors.ink
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(6,43,33,0.62)",
    marginTop: 4
  },
  servicesGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    marginTop: 24
  },
  serviceCard: {
    width: "31%",
    minHeight: 118,
    borderRadius: 18,
    padding: 18,
    border: "1px solid rgba(168,232,69,0.55)",
    backgroundColor: "rgba(8,59,44,0.82)"
  },
  serviceNumber: {
    fontSize: 11,
    color: colors.moss,
    marginBottom: 12
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 8
  },
  projectPage: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    gap: 28
  },
  projectImageBlock: {
    width: "56%",
    borderRadius: 24,
    overflow: "hidden",
    border: `1.4px solid ${colors.moss}`,
    backgroundColor: colors.forest
  },
  projectImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  projectContent: {
    width: "44%",
    padding: 28,
    borderRadius: 28,
    border: `1.5px solid ${colors.moss}`,
    backgroundColor: "rgba(8,59,44,0.92)",
    justifyContent: "space-between"
  },
  metaRow: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    flexWrap: "wrap"
  },
  metaTag: {
    fontSize: 8,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 9,
    paddingRight: 9,
    borderRadius: 100,
    backgroundColor: colors.moss,
    color: colors.ink,
    textTransform: "uppercase",
    fontWeight: 700
  },
  metaTagWhite: {
    fontSize: 8,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 9,
    paddingRight: 9,
    borderRadius: 100,
    backgroundColor: "#FFFFFF",
    color: colors.ink,
    textTransform: "uppercase"
  },
  projectTitle: {
    fontSize: 32,
    lineHeight: 1.05,
    fontWeight: 700,
    marginBottom: 18
  },
  bullet: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: colors.moss
  },
  bulletText: {
    fontSize: 10,
    lineHeight: 1.35,
    color: "rgba(248,247,242,0.78)",
    flex: 1
  },
  complianceGrid: {
    display: "flex",
    flexDirection: "row",
    gap: 22,
    marginTop: 28
  },
  complianceCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    padding: 18,
    minHeight: 250,
    border: "1px solid rgba(6,43,33,0.12)"
  },
  contactGrid: {
    display: "flex",
    flexDirection: "row",
    gap: 22,
    marginTop: 28
  },
  contactCard: {
    flex: 1,
    borderRadius: 18,
    padding: 18,
    border: `1.2px solid ${colors.moss}`,
    backgroundColor: "rgba(8,59,44,0.8)"
  },
  contactLabel: {
    fontSize: 9,
    textTransform: "uppercase",
    color: colors.moss,
    marginBottom: 8
  },
  contactValue: {
    fontSize: 13,
    color: colors.white,
    lineHeight: 1.3
  }
});

const footerText = "SIEN GROUP PROFILE - ARCHITECTURE / ENGINEERING / DEVELOPMENT";

function Footer({ page, light = false }: { page: number; light?: boolean }) {
  return (
    <>
      <Text style={light ? styles.footerLight : styles.footer}>{footerText}</Text>
      <Text style={light ? styles.pageNumberLight : styles.pageNumber}>{String(page).padStart(2, "0")}</Text>
    </>
  );
}

function projectImage(projects: Project[]): string | undefined {
  return projects.find((project) => project.coverImage?.src)?.coverImage.src;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View>
      {items.slice(0, 5).map((item) => (
        <View key={item} style={styles.bullet}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const services = [
  ["01", "Architecture", "Concept design, master planning, interiors, landscape and visual development."],
  ["02", "Engineering", "Structural, civil, MEP and technical design coordination."],
  ["03", "Project Management", "Site execution, material control, inspections and cost containment."],
  ["04", "Urban Planning", "Zoning, physical planning subdivisions, registrations and maps."],
  ["05", "Development Advisory", "Municipal guidelines, land validation and regulatory filing support."],
  ["06", "Real Estate Finance", "Feasibility, quantity budgeting and investment return framing."]
] as const;

export function ProfileDocument({
  options,
  contact,
  projects
}: {
  options: CompanyProfileOptions;
  contact: CompanyContact;
  projects: Project[];
}) {
  const includedProjects = projects.filter((project) => {
    if (!project.includeInProfile) return false;
    if (options.includeOnlyFeatured && !project.featured) return false;
    if (options.selectedProjectIds.length > 0 && !options.selectedProjectIds.includes(project.id)) return false;
    return true;
  });

  let page = 1;
  const heroImage = projectImage(includedProjects);
  const sectors = Array.from(new Set(includedProjects.map((project) => project.category)));
  const statuses = Array.from(new Set(includedProjects.map((project) => project.status)));

  return (
    <Document title={`${contact.name} - ${options.versionName}`} author={contact.name} subject="Company profile">
      {options.includeCover ? (
        <Page size={[1200, 675]} style={styles.pageDark}>
          <View style={styles.coverGrid}>
            <View style={styles.coverLeft}>
              <Text style={styles.label}>SIEN Group / Premium Profile</Text>
              <Text style={styles.heroTitle}>Designed Systems. Engineered Landmarks.</Text>
              <Text style={[styles.body, { marginTop: 24, maxWidth: 420 }]}>
                A multi-disciplinary design, development and infrastructure consulting firm unifying complex engineering with sophisticated aesthetic planning for long-term spatial and commercial asset value.
              </Text>
              <Text style={[styles.pill, { marginTop: 26 }]}>Est. 2019 / Architecture + Engineering</Text>
            </View>
            <View style={styles.coverRight}>{heroImage ? <Image src={heroImage} style={styles.coverImage} /> : null}</View>
          </View>
          <Footer page={page++} />
        </Page>
      ) : null}

      {options.includeOverview ? (
        <Page size={[1200, 675]} style={styles.pageLight}>
          <Text style={styles.label}>Executive Snapshot</Text>
          <Text style={styles.heading}>Architecture with institutional confidence</Text>
          <Text style={[styles.bodyDark, { maxWidth: 900 }]}>
            SIEN Group combines design thinking, engineering control, planning intelligence, cost discipline and site execution into one accountable delivery framework.
          </Text>
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>2019</Text>
              <Text style={styles.statLabel}>Established operational foundation</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{includedProjects.length}</Text>
              <Text style={styles.statLabel}>Projects included in this profile</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{sectors.length}</Text>
              <Text style={styles.statLabel}>Built sectors represented</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>6</Text>
              <Text style={styles.statLabel}>Core disciplines under one studio</Text>
            </View>
          </View>
          <View style={[styles.statCard, { marginTop: 28, backgroundColor: colors.ink }]}>
            <Text style={{ color: colors.moss, fontSize: 12, textTransform: "uppercase", marginBottom: 10 }}>Value proposition</Text>
            <Text style={styles.body}>Reduce fragmentation across the project cycle by aligning concept design, statutory planning, engineering detail, cost control and construction supervision under one coordinated studio.</Text>
          </View>
          <Footer page={page++} light />
        </Page>
      ) : null}

      {options.includeServices ? (
        <Page size={[1200, 675]} style={styles.pageDark}>
          <Text style={styles.label}>Service Engine</Text>
          <Text style={styles.heading}>From idea to asset: a controlled delivery engine</Text>
          <Text style={[styles.body, { maxWidth: 850 }]}>The profile is structured around capability, control, evidence and portfolio proof.</Text>
          <View style={styles.servicesGrid}>
            {services.map(([number, title, description]) => (
              <View key={title} style={styles.serviceCard}>
                <Text style={styles.serviceNumber}>{number}</Text>
                <Text style={styles.serviceTitle}>{title}</Text>
                <Text style={styles.body}>{description}</Text>
              </View>
            ))}
          </View>
          <Footer page={page++} />
        </Page>
      ) : null}

      {options.includePortfolioAnalytics ? (
        <Page size={[1200, 675]} style={styles.pageLight}>
          <Text style={styles.label}>Portfolio Intelligence</Text>
          <Text style={styles.heading}>A diversified project portfolio</Text>
          <Text style={[styles.bodyDark, { maxWidth: 850 }]}>This dynamic edition was generated from the portal, using only the projects selected for the company profile.</Text>
          <View style={styles.statRow}>
            <View style={[styles.statCard, { minHeight: 290 }]}>
              <Text style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Portfolio distribution by sector</Text>
              {sectors.map((sector) => (
                <View key={sector} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                  <Text style={styles.bodyDark}>{sector}</Text>
                  <Text style={{ fontSize: 12, fontWeight: 700 }}>{includedProjects.filter((project) => project.category === sector).length}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.statCard, { minHeight: 290, backgroundColor: colors.ink }]}>
              <Text style={{ fontSize: 18, fontWeight: 700, color: colors.white, marginBottom: 18 }}>Project status pipeline</Text>
              {statuses.map((status) => (
                <View key={status} style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text style={{ fontSize: 10, color: colors.white }}>{status}</Text>
                    <Text style={{ fontSize: 10, color: colors.moss }}>{includedProjects.filter((project) => project.status === status).length}</Text>
                  </View>
                  <View style={{ height: 12, backgroundColor: "rgba(255,255,255,0.14)", borderRadius: 99 }}>
                    <View style={{ width: `${Math.max(18, (includedProjects.filter((project) => project.status === status).length / Math.max(1, includedProjects.length)) * 100)}%`, height: 12, backgroundColor: colors.moss, borderRadius: 99 }} />
                  </View>
                </View>
              ))}
            </View>
          </View>
          <Footer page={page++} light />
        </Page>
      ) : null}

      <Page size={[1200, 675]} style={styles.pageDark}>
        <View style={{ justifyContent: "center", height: "100%" }}>
          <Text style={styles.label}>Selected Project Portfolio</Text>
          <Text style={[styles.heroTitle, { maxWidth: 780 }]}>Curated builds across East Africa</Text>
          <Text style={[styles.body, { marginTop: 24, maxWidth: 650 }]}>Residential, hospitality, healthcare, commercial, industrial, educational, sports, agricultural infrastructure and master-planning work presented as a controlled capability narrative.</Text>
        </View>
        <Footer page={page++} />
      </Page>

      {includedProjects.map((project, index) => (
        <Page key={project.id} size={[1200, 675]} style={styles.pageDark}>
          <View style={styles.projectPage}>
            {index % 2 === 0 ? (
              <>
                <View style={styles.projectImageBlock}><Image src={project.coverImage.src} style={styles.projectImage} /></View>
                <ProjectContent project={project} />
              </>
            ) : (
              <>
                <ProjectContent project={project} />
                <View style={styles.projectImageBlock}><Image src={project.coverImage.src} style={styles.projectImage} /></View>
              </>
            )}
          </View>
          <Footer page={page++} />
        </Page>
      ))}

      {options.includeCompliance ? (
        <Page size={[1200, 675]} style={styles.pageLight}>
          <Text style={styles.label}>Statutory Compliance</Text>
          <Text style={styles.heading}>Registered. Compliant. Project-ready.</Text>
          <Text style={[styles.bodyDark, { maxWidth: 780 }]}>Compliance content is intentionally separated from the project pages, giving reviewers a clean evidence section without crowding the portfolio narrative.</Text>
          <View style={styles.complianceGrid}>
            <View style={styles.complianceCard}>
              <Text style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Certificate of Incorporation</Text>
              <Text style={styles.bodyDark}>SAIGA INDEX ENTERPRISE LIMITED</Text>
              <Text style={[styles.bodyDark, { marginTop: 12 }]}>Private Limited Company under the Companies Act, 2015</Text>
              <Text style={[styles.bodyDark, { marginTop: 12 }]}>Company Number: PVT-6LU5A5L</Text>
              <Text style={[styles.bodyDark, { marginTop: 12 }]}>Registration date: 1 October 2019</Text>
            </View>
            <View style={styles.complianceCard}>
              <Text style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Kenya Revenue Authority</Text>
              <Text style={styles.bodyDark}>Active Tax Obligation Profile</Text>
              <Text style={[styles.bodyDark, { marginTop: 12 }]}>Registered for PAYE and Corporate Tax obligations</Text>
              <Text style={[styles.bodyDark, { marginTop: 12 }]}>Identification No: P051844189W</Text>
              <Text style={[styles.bodyDark, { marginTop: 12 }]}>Effective status: Active since 01/10/2019</Text>
            </View>
          </View>
          <Footer page={page++} light />
        </Page>
      ) : null}

      {options.includeContact ? (
        <Page size={[1200, 675]} style={styles.pageDark}>
          <Text style={styles.label}>Connect With Our Team</Text>
          <Text style={styles.heroTitle}>Ready to begin a landmark?</Text>
          <Text style={[styles.body, { marginTop: 22, maxWidth: 600 }]}>Consult on architectural drafting, structural engineering, planning approvals, construction materials supplies and project feasibility studies.</Text>
          <View style={styles.contactGrid}>
            <View style={styles.contactCard}><Text style={styles.contactLabel}>Headquarters</Text><Text style={styles.contactValue}>{contact.address}</Text></View>
            <View style={styles.contactCard}><Text style={styles.contactLabel}>Email</Text><Text style={styles.contactValue}>{contact.email}</Text></View>
            <View style={styles.contactCard}><Text style={styles.contactLabel}>Phone</Text><Text style={styles.contactValue}>{contact.phone}</Text></View>
            <View style={styles.contactCard}><Text style={styles.contactLabel}>Web</Text><Text style={styles.contactValue}>{contact.website}</Text></View>
          </View>
          <Footer page={page++} />
        </Page>
      ) : null}
    </Document>
  );
}

function ProjectContent({ project }: { project: Project }) {
  return (
    <View style={styles.projectContent}>
      <View>
        <View style={styles.metaRow}>
          <Text style={styles.metaTag}>{project.status}</Text>
          <Text style={styles.metaTagWhite}>{project.location}</Text>
          <Text style={styles.metaTagWhite}>{project.category}</Text>
        </View>
        <Text style={styles.projectTitle}>{project.title}</Text>
        <Text style={styles.body}>{project.shortDescription}</Text>
      </View>
      <View>
        <Text style={[styles.label, { marginBottom: 10 }]}>Design intelligence</Text>
        <BulletList items={project.highlights} />
      </View>
    </View>
  );
}
