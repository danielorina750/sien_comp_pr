import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIEN Profile Builder",
  description: "Vercel-ready portal for managing SIEN projects and generating updated company profile PDFs."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
