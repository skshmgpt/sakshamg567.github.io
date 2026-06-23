import Blog from "@/components/Blog";
import BlogWrapper from "@/components/BlogWrapper";
import BlogTOC from "@/components/BlogTOC";
import SidebarLayout from "@/components/sacred/SidebarLayout";
import { extractHeadings } from "@/lib/blog-headings";
import data from "@/public/data.json";
import type { Metadata } from "next";
import fs from "fs/promises";
import path from "path";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const blogEntry = Object.entries(data.blogs).find(
    ([, blog]) => blog.slug === slug,
  );

  const title = blogEntry ? blogEntry[0] : slug;
  const description = blogEntry?.[1].description || `Blog post: ${title}`;
  const date = blogEntry?.[1].date || "";

  return {
    title: `${title}`,
    description: description,
    authors: [{ name: "Saksham Gupta" }],
    openGraph: {
      title: `${title}`,
      description: description,
      type: "article",
      publishedTime: date,
      authors: ["Saksham Gupta"],
      images: [
        {
          url: `/${slug}.webp`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}`,
      description: description,
      creator: "@skshmgpt",
      images: [`/${slug}.webp`],
    },
  };
}

export async function generateStaticParams() {
  return Object.entries(data.blogs).map(([, blog]) => ({
    slug: blog.slug,
  }));
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const content = await fs.readFile(
    path.join(process.cwd(), "blogs", `${slug}.md`),
    "utf-8",
  );
  const headings = extractHeadings(content);

  const blogEntry = Object.entries(data.blogs).find(
    ([, blog]) => blog.slug === slug,
  );

  const title = blogEntry ? blogEntry[0] : slug;
  const description = blogEntry?.[1].description || "";
  const date = blogEntry?.[1].date || "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    image: `https://skshmgpt.tech/${slug}.webp`,
    datePublished: date,
    author: {
      "@type": "Person",
      name: "Saksham Gupta",
      url: "https://skshmgpt.tech",
    },
    publisher: {
      "@type": "Person",
      name: "Saksham Gupta",
      url: "https://skshmgpt.tech",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://skshmgpt.tech/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SidebarLayout
        sidebar={<BlogTOC headings={headings} />}
        defaultSidebarWidth={36}
        isShowingHandle
        className="h-[calc(100vh-6.75rem)] border-y border-[#1F1F1C]"
      >
        <main
          data-blog-scroll-container
          className="h-full min-h-0 overflow-y-auto overscroll-contain scroll-smooth"
        >
          <div className="mx-auto flex max-w-3xl flex-col px-6 py-8 md:px-12 lg:px-16">
            <div className="mb-10 border-b border-[#1F1F1C] pb-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#00FF41]">
                writing / {date}
              </div>
              <h1 className="mt-4 font-mono text-3xl font-bold leading-tight text-[#F0F0EB] md:text-5xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-4 max-w-2xl font-inter text-base leading-7 text-[#889988] md:text-lg">
                  {description}
                </p>
              ) : null}
            </div>
            <BlogWrapper slug={slug}>
              <Blog slug={slug} />
            </BlogWrapper>
          </div>
        </main>
      </SidebarLayout>
    </>
  );
}
