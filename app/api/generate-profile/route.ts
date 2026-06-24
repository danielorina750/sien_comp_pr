import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { join } from "node:path";
import type { Readable } from "node:stream";
import { ProfileDocument } from "@/lib/pdf/ProfileDocument";
import type { ProfilePayload, Project } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function absolutizeImageUrl(src: string, origin: string): string {
  if (!src) return src;
  if (src.startsWith("data:")) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return new URL(src, origin).toString();
}

function normalizeProjects(projects: Project[], origin: string): Project[] {
  return projects.map((project) => ({
    ...project,
    scope: Array.isArray(project.scope) ? project.scope : [],
    highlights: Array.isArray(project.highlights) ? project.highlights : [],
    gallery: Array.isArray(project.gallery) ? project.gallery : [],
    coverImage: {
      ...project.coverImage,
      src: absolutizeImageUrl(project.coverImage?.src ?? "", origin),
      alt: project.coverImage?.alt || project.title
    }
  }));
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ProfilePayload;
    const origin = new URL(request.url).origin;
    const normalizedProjects = normalizeProjects(payload.projects ?? [], origin);
    const templateBase = join(process.cwd(), "public", "pdf-template");

    const document = React.createElement(ProfileDocument as any, {
      options: payload.options,
      contact: payload.contact,
      projects: normalizedProjects,
      templateBase
    });

    const stream = (await renderToStream(document as any)) as Readable;

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const pdf = Buffer.concat(chunks);

    const fileName = `${payload.options?.versionName || "sien-company-profile"}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName || "sien-company-profile"}.pdf"`,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("PDF generation failed", error);
    return Response.json(
      { message: error instanceof Error ? error.message : "PDF generation failed" },
      { status: 500 }
    );
  }
}
