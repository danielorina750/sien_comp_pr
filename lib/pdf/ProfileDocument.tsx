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
    padding: 0,
    backgroundColor: colors.ink,
    color: colors.white,
    fontFamily: "Helvetica"
  },
  pageLight: {
    position: "relative",
    width: "100%",
    height: "100%",
    padding: 0,
    backgroundColor: colors.cream,
    color: colors.ink,
    fontFamily: "Helvetica"
  },
  darkVeil: {
    position: "absolute",
    left: 0,
    top: 0,
    width: PAGE_SIZE[0],
    height: PAGE_SIZE[1],
    backgroundColor: "rgba(6,43,33,0.18)"
  },
  lightVeil: {
    position: "absolute",
    left: 0,
    top: 0,
    width: PAGE_SIZE[0],
    height: PAGE_SIZE[1],
    backgroundColor: "rgba(243,239,228,0.12)"
  },
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(168,232,69,0.12)"
  },
  gridLineVerticalLight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(6,43,33,0.07)"
  },
  gridLineHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(168,232,69,0.10)"
  },
  gridLineHorizontalLight: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(6,43,33,0.06)"
  },
  portfolioLabelDark: {
    position: "absolute",
    left: 38,
    top: 36,
    fontSize: 8,
    textTransform: "uppercase",
    color: "rgba(248,247,242,0.78)",
    letterSpacing: 0.75
  },
  portfolioLabelLight: {
    position: "absolute",
    left: 38,
    top: 36,
    fontSize: 8,
    textTransform: "uppercase",
    color: "rgba(6,43,33,0.70)",
    letterSpacing: 0.75
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
  imageFullLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 690,
    height: 675,
    objectFit: "cover"
  },
  imageFullRight: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 690,
    height: 675,
    objectFit: "cover"
  },
  stackedImageWrap: {
    position: "absolute",
    left: 64,
    top: 70,
    width: 580,
    height: 535
  },
  stackedImageTop: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 580,
    height: 255,
    objectFit: "cover",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  stackedImageBottom: {
    position: "absolute",
    left: 0,
    top: 275,
    width: 580,
    height: 260,
    objectFit: "cover",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  fallbackImagePaneLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 690,
    height: 675,
    backgroundColor: "rgba(168,232,69,0.08)",
    borderRightWidth: 1,
    borderRightColor: "rgba(168,232,69,0.22)"
  },
  fallbackImagePaneRight: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 690,
    height: 675,
    backgroundColor: "rgba(168,232,69,0.08)",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(168,232,69,0.22)"
  },
  fallbackText: {
    position: "absolute",
    left: 88,
    top: 318,
    fontSize: 14,
    color: "rgba(248,247,242,0.55)",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  projectOverlayLeft: {
    position: "absolute",
    left: 64,
    top: 78,
    width: 440,
    minHeight: 510,
    borderRadius: 34,
    paddingTop: 42,
    paddingRight: 36,
    paddingBottom: 38,
    paddingLeft: 36,
    border: "1.5px solid #A8E845",
    backgroundColor: "rgba(8,59,44,0.96)"
  },
  projectOverlayRight: {
    position: "absolute",
    right: 64,
    top: 78,
    width: 440,
    minHeight: 510,
    borderRadius: 34,
    paddingTop: 42,
    paddingRight: 36,
    paddingBottom: 38,
    paddingLeft: 36,
    border: "1.5px solid #A8E845",
    backgroundColor: "rgba(8,59,44,0.96)"
  },
  projectOverlayLightLeft: {
    position: "absolute",
    left: 70,
    top: 82,
    width: 390,
    minHeight: 505,
    borderRadius: 34,
    paddingTop: 42,
    paddingRight: 34,
    paddingBottom: 38,
    paddingLeft: 34,
    backgroundColor: "#FFFFFF",
    color: colors.darkText
  },
  projectOverlayLightRight: {
    position: "absolute",
    right: 76,
    top: 82,
    width: 390,
    minHeight: 505,
    borderRadius: 34,
    paddingTop: 42,
    paddingRight: 34,
    paddingBottom: 38,
    paddingLeft: 34,
    backgroundColor: "#FFFFFF",
    color: colors.darkText
  },
  tagRow: {
    flexDirection: "row",
    marginBottom: 34,
    flexWrap: "wrap"
  },
  tagMoss: {
    fontSize: 7.2,
    textTransform: "uppercase",
    color: colors.ink,
    backgroundColor: colors.moss,
    borderRadius: 12,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 10,
    paddingLeft: 10,
    marginRight: 8,
    marginBottom: 6,
    fontWeight: 700
  },
  tagWhite: {
    fontSize: 7.2,
    textTransform: "uppercase",
    color: colors.ink,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 10,
    paddingLeft: 10,
    marginRight: 8,
    marginBottom: 6
  },
  tagPale: {
    fontSize: 7.2,
    textTransform: "uppercase",
    color: colors.ink,
    backgroundColor: "#F8F7F2",
    borderRadius: 12,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 10,
    paddingLeft: 10,
    marginRight: 8,
    marginBottom: 6
  },
  categoryText: {
    fontSize: 8,
    color: colors.moss,
    textTransform: "uppercase",
    marginBottom: 14
  },
  projectTitle: {
    fontSize: 31,
    lineHeight: 1.05,
    color: colors.white,
    fontWeight: 700,
    marginBottom: 18
  },
  projectTitleLight: {
    fontSize: 31,
    lineHeight: 1.05,
    color: colors.darkText,
    fontWeight: 700,
    marginBottom: 18
  },
  projectDescription: {
    fontSize: 10.8,
    lineHeight: 1.42,
    color: "rgba(248,247,242,0.78)"
  },
  projectDescriptionLight: {
    fontSize: 10.8,
    lineHeight: 1.42,
    color: "rgba(6,43,33,0.70)"
  },
  intelligenceBlock: {
    marginTop: 68
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
    marginBottom: 9
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 8,
    backgroundColor: colors.moss
  },
  bulletText: {
    flex: 1,
    fontSize: 9.1,
    lineHeight: 1.25,
    color: "rgba(248,247,242,0.78)"
  },
  bulletTextLight: {
    flex: 1,
    fontSize: 9.1,
    lineHeight: 1.25,
    color: "rgba(6,43,33,0.70)"
  },
  rule: {
    width: 92,
    height: 1,
    backgroundColor: colors.moss,
    marginTop: 24
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

export const exactProjectPages: Record<string, number> = {
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

function Grid({ light = false }: { light?: boolean }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={`v-${i}`} style={[light ? styles.gridLineVerticalLight : styles.gridLineVertical, { left: 85 + i * 220 }]} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <View key={`h-${i}`} style={[light ? styles.gridLineHorizontalLight : styles.gridLineHorizontal, { top: 85 + i * 145 }]} />
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

function projectImages(project: Project): string[] {
  const images = [project.coverImage?.src, ...project.gallery.map((image) => image.src)].filter(Boolean) as string[];
  return images.length > 0 ? images : [];
}

type DynamicVariant = "dark-image-left" | "dark-image-right" | "light-image-left" | "stacked-left";

function FallbackPane({ side }: { side: "left" | "right" }) {
  return (
    <View style={side === "left" ? styles.fallbackImagePaneLeft : styles.fallbackImagePaneRight}>
      <Text style={styles.fallbackText}>Project image</Text>
    </View>
  );
}

export function DynamicProjectPage({ project, page, variant }: { project: Project; page: number; variant: DynamicVariant }) {
  const isLight = variant === "light-image-left";
  const isStacked = variant === "stacked-left";
  const imageOnLeft = variant === "dark-image-left" || variant === "light-image-left" || isStacked;
  const images = projectImages(project);
  const primaryImage = images[0];
  const secondaryImage = images[1] || images[0];
  const contentStyle = isLight
    ? imageOnLeft
      ? styles.projectOverlayLightRight
      : styles.projectOverlayLightLeft
    : imageOnLeft
      ? styles.projectOverlayRight
      : styles.projectOverlayLeft;
  const titleStyle = isLight ? styles.projectTitleLight : styles.projectTitle;
  const descriptionStyle = isLight ? styles.projectDescriptionLight : styles.projectDescription;
  const intelligenceTitleStyle = isLight ? styles.intelligenceTitleLight : styles.intelligenceTitle;
  const bulletTextStyle = isLight ? styles.bulletTextLight : styles.bulletText;

  return (
    <Page size={PAGE_SIZE} style={isLight ? styles.pageLight : styles.pageDark}>
      <Grid light={isLight} />
      <View style={isLight ? styles.lightVeil : styles.darkVeil} />
      <Text style={isLight ? styles.portfolioLabelLight : styles.portfolioLabelDark}>{normalizeTag(project.category)} PORTFOLIO</Text>

      {isStacked ? (
        <View style={styles.stackedImageWrap}>
          {primaryImage ? <Image src={primaryImage} style={styles.stackedImageTop} /> : <FallbackPane side="left" />}
          {secondaryImage ? <Image src={secondaryImage} style={styles.stackedImageBottom} /> : null}
        </View>
      ) : primaryImage ? (
        <Image src={primaryImage} style={imageOnLeft ? styles.imageFullLeft : styles.imageFullRight} />
      ) : (
        <FallbackPane side={imageOnLeft ? "left" : "right"} />
      )}

      <View style={contentStyle}>
        <View>
          <View style={styles.tagRow}>
            <Text style={styles.tagMoss}>{normalizeTag(project.status)}</Text>
            <Text style={isLight ? styles.tagPale : styles.tagWhite}>{normalizeTag(project.location)}</Text>
          </View>
          <Text style={styles.categoryText}>{normalizeTag(project.category)} / PORTFOLIO</Text>
          <Text style={titleStyle}>{project.title}</Text>
          <Text style={descriptionStyle}>{project.shortDescription || project.fullDescription}</Text>
        </View>
        <View style={styles.intelligenceBlock}>
          <Text style={intelligenceTitleStyle}>Design intelligence</Text>
          {bullets(project.highlights.length > 0 ? project.highlights : project.scope).map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={bulletTextStyle}>{item}</Text>
            </View>
          ))}
          <View style={styles.rule} />
        </View>
        <Text style={styles.bigPageNumber}>{String(page).padStart(2, "0")}</Text>
      </View>
      <Footer page={page} light={isLight} />
    </Page>
  );
}

export function getIncludedProjects(options: CompanyProfileOptions, projects: Project[]): Project[] {
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
        const variant: DynamicVariant =
          project.gallery.length > 0
            ? "stacked-left"
            : index % 3 === 2
              ? "light-image-left"
              : index % 2 === 0
                ? "dark-image-left"
                : "dark-image-right";
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
