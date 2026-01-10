import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical articles on distributed systems, networking, backend development, and software engineering by Saksham Gupta.",
  openGraph: {
    title: "Blog | Saksham Gupta",
    description:
      "Technical articles on distributed systems, networking, backend development, and software engineering.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
