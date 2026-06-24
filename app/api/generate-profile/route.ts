import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { pdf } from "@react-pdf/renderer";
import { ProfileDocument } from "@/components/pdf/ProfileDocument";
import type { CompanyContact, CompanyProfileOptions, Project } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type GenerateProfilePayload = {
  options: CompanyProfileOptions;
  contact: CompanyContact;
  projects: Project[];
};

function normalizeProjects(projects: Project[]): Project[] {
  return projects
    .filter((project) => project.includeInPdf !== false)
    .map((project) => ({
      ...project,
      scope: Array.isArray(project.scope) ? project.scope : [],
      highlights: Array.isArray(project.highlights) ? project.highlights : [],
      gallery: Array.isArray(project.gallery) ? project.gallery : [],
    }));
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as GenerateProfilePayload;

    if (!payload.projects || !Array.isArray(payload.projects)) {
      return NextResponse.json(
        { error: "No projects were provided for PDF generation." },
        { status: 400 }
      );
    }

    const normalizedProjects = normalizeProjects(payload.projects);

    const document = React.createElement(ProfileDocument as any, {
      options: payload.options,
      contact: payload.contact,
      projects: normalizedProjects,
    });

    const buffer = await pdf(document).toBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="SIEN-Company-Profile.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);

    return NextResponse.json(
      {
        error: "PDF generation failed",
        details: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
