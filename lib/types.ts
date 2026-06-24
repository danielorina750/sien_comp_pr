export type ProjectCategory =
  | "Residential"
  | "Hospitality"
  | "Healthcare"
  | "Commercial"
  | "Industrial"
  | "Educational"
  | "Sports"
  | "Master Planning"
  | "Agricultural Infrastructure";

export type ProjectStatus =
  | "Completed"
  | "Construction Ongoing"
  | "Design Phase"
  | "Partner Capability Showcase"
  | "Draft";

export interface ProjectImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  location: string;
  year?: string;
  shortDescription: string;
  fullDescription: string;
  scope: string[];
  highlights: string[];
  coverImage: ProjectImage;
  gallery: ProjectImage[];
  featured: boolean;
  published: boolean;
  includeInProfile: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyProfileOptions {
  versionName: string;
  preparedFor?: string;
  includeCover: boolean;
  includeOverview: boolean;
  includeServices: boolean;
  includePortfolioAnalytics: boolean;
  includeCompliance: boolean;
  includeContact: boolean;
  includeOnlyFeatured: boolean;
  selectedProjectIds: string[];
}

export interface CompanyContact {
  name: string;
  website: string;
  email: string;
  phone: string;
  address: string;
}

export interface ProfilePayload {
  options: CompanyProfileOptions;
  contact: CompanyContact;
  projects: Project[];
}
