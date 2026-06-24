import React from "react";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CompanyContact, CompanyProfileOptions, Project } from "@/lib/types";

const PAGE_SIZE: [number, number] = [1200, 675];

const colors = {
  ink: "#062B21",
  forest: "#0B3A2E",
  moss: "#A8E845",
  cream: "#F3EFE4",
  white: "#F8F7F2",
  darkText: "#083126",
  mutedDark: "#53645D"
};

const styles = StyleSheet.create({
  exactPage: {
    position: "relative",
    width: "100%",
    height: "100%",
    padding: 0,
    backgroundColor: colors.ink
  },
  fullPageImage: {
    position: "absolute",
    left: 0,
    top: 0,
    width: PAGE_SIZE[0],
    height: PAGE_SIZE[1]
  },
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
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(168,232,69,0.12)"
  },
  gridLineHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(168,232,69,0.10)"
  },
  footer: {
    position: "absolute",
    left: 38,
    bottom: 24,
    fontSize: 8,
    color: "rgba(248,247,242,0.72)",
    letterSpacing: 0.65
  },
  footerLight: {
    position: "absolute",
    left: 38,
    bottom: 24,
    fontSize: 8,
    color: "rgba(6,43,33,0.62)",
    letterSpacing: 0.65
  },
  pageNumber: {
    position: "absolute",
    right: 38,
    bottom: 24,
    fontSize: 9,
    color: "rgba(248,247,242,0.72)"
  },
  pageNumberLight: {
    position: "absolute",
    right: 38,
    bottom: 24,
    fontSize: 9,
    color: "rgba(6,43,33,0.70)"
  },
  eyebrowDark: {
    fontSize: 8,
    textTransform: "uppercase",
    color: colors.white,
    opacity: 0.78,
    letterSpacing: 0.8,
    marginBottom: 46
  },
  eyebrowMoss: {
    fontSize: 8,
    textTransform: "uppercase",
    color: colors.moss,
    letterSpacing: 0.9,
    marginBottom: 20
  },
  projectLayout: {
    position: "relative",
    height: "100%",
    flexDirection: "row"
  },
  projectImageLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 690,
    height: 675,
    objectFit: "cover"
  },
  projectImageRight: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 690,
    height: 675,
    objectFit: "cover"
  },
  projectOverlayLeft: {
    position: "absolute",
    left: 64,
    top: 78,
    width: 420,
    minHeight: 500,
    borderRadius: 34,
    paddingTop: 46,
    paddingRight: 36,
    paddingBottom: 38,
    paddingLeft: 36,
    border: "1.5px solid #A8E845",
    backgroundColor: "rgba(8,59,44,0.95)"
  },
  projectOverlayRight: {
    position: "absolute",
    right: 64,
    top: 78,
    width: 420,
    minHeight: 500,
    borderRadius: 34,
    paddingTop: 46,
    paddingRight: 36,
    paddingBottom: 38,
    paddingLeft: 36,
    border: "1.5px solid #A8E845",
    backgroundColor: "rgba(8,59,44,0.95)"
  },
  projectOverlayLight: {
    position: "absolute",
    right: 76,
    top: 82,
    width: 380,
    minHeight: 500,
    borderRadius: 34,
    paddingTop: 46,
    paddingRight: 34,
    paddingBottom: 38,
    paddingLeft: 34,
    backgroundColor: "#FFFFFF",
    color: colors.darkText
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 42,
    flexWrap: "wrap"
  },
  tagMoss: {
    fontSize: 7.5,
    textTransform: "uppercase",
    color: colors.ink,
    backgroundColor: colors.moss,
    borderRadius: 12,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 10,
    paddingLeft: 10,
    fontWeight: 700
  },
  tagWhite: {
    fontSize: 7.5,
    textTransform: "uppercase",
    color: colors.ink,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 10,
    paddingLeft: 10
  },
  tagPale: {
    fontSize: 7.5,
    textTransform: "uppercase",
    color: colors.ink,
    backgroundColor: "#F8F7F2",
    borderRadius: 12,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 10,
    paddingLeft: 10
  },
  categoryText: {
    fontSize: 8,
    color: colors.moss,
    textTransform: "uppercase",
    marginBottom: 14
  },
  projectTitle: {
    fontSize: 34,
    lineHeight: 1,
    color: colors.white,
    fontWeight: 700,
    marginBottom: 20
  },
  projectTitleLight: {
    fontSize: 34,
    lineHeight: 1,
    color: colors.darkText,
    fontWeight: 700,
    marginBottom: 20
  },
  projectDescription: {
    fontSize: 11,
    lineHeight: 1.45,
    color: "rgba(248,247,242,0.78)"
  },
  projectDescriptionLight: {
    fontSize: 11,
    lineHeight: 1.45,
    color: "rgba(6,43,33,0.70)"
  },
  intelligenceBlock: {
    marginTop: 110
  },
  intelligenceTitle: {
    fontSize: 10,
    color: colors.white,
    fontWeight: 700,
    marginBottom: 12
  },
  intelligenceTitleLight: {
    fontSize: 10,
    color: colors.darkText,
    fontWeight: 700,
    marginBottom: 12
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 9,
    gap: 8
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: colors.moss
  },
  bulletText: {
    flex: 1,
    fontSize: 9.3,
    lineHeight: 1.25,
    color: "rgba(248,247,242,0.78)"
  },
  bulletTextLight: {
    flex: 1,
    fontSize: 9.3,
    lineHeight: 1.25,
    color: "rgba(6,43,33,0.70)"
  },
  bigPageNumber: {
    position: "absolute",
    right: 35,
    bottom: 35,
    color: colors.moss,
    fontSize: 42,
    fontWeight: 700
  }
});

const footerText = "SIEN GROUP PROFILE - ARCHITECTURE / ENGINEERING / DEVELOPMENT";

const exactProjectPages: Record<string, number> = {
  "the-kitale-country-manor": 9,
  "kitale-country-manor": 9,
  "hill-side-residential-home": 10,
  "rongai-residential-home": 11,
  "asembo-bay-kendu": 12,
  "ngong-apartments": 13,
  "kahawa-highrise-apartments": 14,
  "nyanchwa-city-stay-apartments": 15,
  "ekrano-resort": 16,
  "kimuka-resort": 17,
  "hbvm-narok-hospital": 18,
  "kanyimbo-hospital": 19,
  "ugc-level-4-hospital": 20,
  "guardian-mall": 21,
  "kansons-square": 22,
  "ragos-industrial-park": 23,
  "kisii-school-stem-complex": 24,
  "kisii-stadium": 25,
  "trans-west-pbsa": 26,
  "transwest-pbsa": 26
};

function pageName(page: number): string {
  return `page-${String(page).padStart(2, "0")}.jpg`;
}

function templateImageSrc(templateBase: string, page: number): string {
  return `${templateBase.replace(/\/$/, "")}/${pageName(page)}`;
}

function ExactTemplatePage({ templateBase, page }: { templateBase: string; page: number }) {
  return (
    <Page size={PAGE_SIZE} style={styles.exactPage}>
      <Image src={templateImageSrc(templateBase, page)} style={styles.fullPageImage} />
    </Page>
  );
}

function Footer({ page, light = false }: { page: number; light?: boolean }) {
  return (
    <>
      <Text style={light ? styles.footerLight : styles.footer}>{footerText}</Text>
      <Text style={light ? styles.pageNumberLight : styles.pageNumber}>{String(page).padStart(2, "0")}</Text>
    </>
  );
}

function Grid() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={`v-${i}`} style={[styles.gridLineVertical, { left: 85 + i * 220 }]} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <View key={`h-${i}`} style={[styles.gridLineHorizontal, { top: 85 + i * 145 }]} />
      ))}
    </>
  );
}

function bullets(items: string[]) {
  const source = items.length > 0 ? items : ["Concept architecture", "Civil engineering design", "Site supervision", "Design coordination"];
  return source.slice(0, 4);
}

function normalizeTag(value: string): string {
  return value.toUpperCase();
}

function DynamicProjectPage({ project, page, variant }: { project: Project; page: number; variant: "dark-left" | "dark-right" | "light" }) {
  const isLight = variant === "light";
  const imageOnLeft = variant === "dark-right" || variant === "light";
  const projectImageStyle = imageOnLeft ? styles.projectImageLeft : styles.projectImageRight;
  const contentStyle = isLight ? styles.projectOverlayLight : imageOnLeft ? styles.projectOverlayRight : styles.projectOverlayLeft;
  const titleStyle = isLight ? styles.projectTitleLight : styles.projectTitle;
  const descriptionStyle = isLight ? styles.projectDescriptionLight : styles.projectDescription;
  const intelligenceTitleStyle = isLight ? styles.intelligenceTitleLight : styles.intelligenceTitle;
  const bulletTextStyle = isLight ? styles.bulletTextLight : styles.bulletText;

  return (
    <Page size={PAGE_SIZE} style={isLight ? styles.pageLight : styles.pageDark}>
      <Grid />
      <Text style={[styles.eyebrowDark, { color: isLight ? colors.darkText : colors.white }]}>{normalizeTag(project.category)} PORTFOLIO</Text>
      <Image src={project.coverImage.src} style={projectImageStyle} />
      <View style={contentStyle}>
        <View>
          <View style={styles.tagRow}>
            <Text style={styles.tagMoss}>{normalizeTag(project.status)}</Text>
            <Text style={isLight ? styles.tagPale : styles.tagWhite}>{normalizeTag(project.location)}</Text>
          </View>
          <Text style={styles.categoryText}>{normalizeTag(project.category)} / PORTFOLIO</Text>
          <Text style={titleStyle}>{project.title}</Text>
          <Text style={descriptionStyle}>{project.shortDescription}</Text>
        </View>
        <View style={styles.intelligenceBlock}>
          <Text style={intelligenceTitleStyle}>Design intelligence</Text>
          {bullets(project.highlights).map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={bulletTextStyle}>{item}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.bigPageNumber}>{String(page).padStart(2, "0")}</Text>
      </View>
      <Footer page={page} light={isLight} />
    </Page>
  );
}

function getIncludedProjects(options: CompanyProfileOptions, projects: Project[]): Project[] {
  return projects.filter((project) => {
    if (!project.includeInProfile) return false;
    if (!project.published) return false;
    if (options.includeOnlyFeatured && !project.featured) return false;
    if (options.selectedProjectIds.length > 0 && !options.selectedProjectIds.includes(project.id)) return false;
    return true;
  });
}

export function ProfileDocument({
  options,
  contact,
  projects,
  templateBase
}: {
  options: CompanyProfileOptions;
  contact: CompanyContact;
  projects: Project[];
  templateBase: string;
}) {
  const includedProjects = getIncludedProjects(options, projects);
  const exactProjects: Project[] = [];
  const dynamicProjects: Project[] = [];

  includedProjects.forEach((project) => {
    if (exactProjectPages[project.slug]) exactProjects.push(project);
    else dynamicProjects.push(project);
  });

  let dynamicPage = 31;

  return (
    <Document title={`${contact.name} - ${options.versionName}`} author={contact.name} subject="Company profile">
      {options.includeCover ? <ExactTemplatePage templateBase={templateBase} page={1} /> : null}
      {options.includeOverview ? (
        <>
          <ExactTemplatePage templateBase={templateBase} page={2} />
          <ExactTemplatePage templateBase={templateBase} page={3} />
          <ExactTemplatePage templateBase={templateBase} page={4} />
        </>
      ) : null}
      {options.includeServices ? <ExactTemplatePage templateBase={templateBase} page={5} /> : null}
      {options.includePortfolioAnalytics ? (
        <>
          <ExactTemplatePage templateBase={templateBase} page={6} />
          <ExactTemplatePage templateBase={templateBase} page={7} />
        </>
      ) : null}

      <ExactTemplatePage templateBase={templateBase} page={8} />

      {exactProjects
        .sort((a, b) => (exactProjectPages[a.slug] ?? 999) - (exactProjectPages[b.slug] ?? 999))
        .map((project) => (
          <ExactTemplatePage key={`exact-${project.id}`} templateBase={templateBase} page={exactProjectPages[project.slug]} />
        ))}

      {dynamicProjects.map((project, index) => {
        const variant = index % 3 === 2 ? "light" : index % 2 === 0 ? "dark-right" : "dark-left";
        return <DynamicProjectPage key={`dynamic-${project.id}`} project={project} page={dynamicPage++} variant={variant} />;
      })}

      {options.includePortfolioAnalytics ? <ExactTemplatePage templateBase={templateBase} page={27} /> : null}
      {options.includeCompliance ? (
        <>
          <ExactTemplatePage templateBase={templateBase} page={28} />
          <ExactTemplatePage templateBase={templateBase} page={29} />
        </>
      ) : null}
      {options.includeContact ? <ExactTemplatePage templateBase={templateBase} page={30} /> : null}
    </Document>
  );
}
