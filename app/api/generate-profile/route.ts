import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import type { Readable } from "node:stream";
import { PDFDocument } from "pdf-lib";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DynamicProjectsDocument, exactProjectPages, getIncludedProjects } from "@/lib/pdf/ProfileDocument";
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

function pageIndex(pageNumber: number): number {
  return pageNumber - 1;
}

async function copyPages(source: PDFDocument, target: PDFDocument, pageNumbers: number[]) {
  if (pageNumbers.length === 0) return;
  const copiedPages = await target.copyPages(source, pageNumbers.map(pageIndex));
  copiedPages.forEach((page) => target.addPage(page));
}

async function appendDynamicPages(target: PDFDocument, projects: Project[], startPage: number) {
  if (projects.length === 0) return;

  const dynamicDocument = React.createElement(DynamicProjectsDocument as any, {
    projects,
    startPage
  });

  const stream = (await renderToStream(dynamicDocument as any)) as Readable;
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const dynamicPdf = await PDFDocument.load(Buffer.concat(chunks));
  const dynamicPages = await target.copyPages(dynamicPdf, dynamicPdf.getPageIndices());
  dynamicPages.forEach((page) => target.addPage(page));
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ProfilePayload;
    const origin = new URL(request.url).origin;
    const normalizedProjects = normalizeProjects(payload.projects ?? [], origin);
    const includedProjects = getIncludedProjects(payload.options, normalizedProjects);

    // EXACT TEMPLATE MODE:
    // The approved SIEN Updated 2 PDF is copied page-for-page so the generated
    // company profile remains visually identical to the source design. Existing
    // SIEN portfolio pages are not redrawn from data. Only new portal projects
    // that do not already exist in the approved PDF are appended after page 30.
    const dynamicProjects = includedProjects.filter((project) => !exactProjectPages[project.slug]);

    const templatePdfPath = join(process.cwd(), "public", "pdf-template", "sien-updated-2.pdf");
    const templateBytes = await readFile(templatePdfPath);
    const sourcePdf = await PDFDocument.load(templateBytes);
    const outputPdf = await PDFDocument.create();

    await copyPages(sourcePdf, outputPdf, Array.from({ length: sourcePdf.getPageCount() }, (_, index) => index + 1));
    await appendDynamicPages(outputPdf, dynamicProjects, sourcePdf.getPageCount() + 1);

    const pdfBytes = await outputPdf.save({ useObjectStreams: true });
    const fileName = `${payload.options?.versionName || "sien-company-profile"}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    return new Response(Buffer.from(pdfBytes), {
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
