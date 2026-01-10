import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Portfolio of projects by Saksham Gupta including FTP servers, Redis clones, URL shorteners, and full-stack web applications built with Next.js, Go, C, and TypeScript.",
  openGraph: {
    title: "Projects | Saksham Gupta",
    description:
      "Portfolio of projects including FTP servers, Redis clones, URL shorteners, and full-stack applications.",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
