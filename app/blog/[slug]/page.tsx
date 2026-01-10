import Blog from "@/components/Blog";
import data from "@/public/data.json";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Find the blog title from data.json by matching the slug
  const blogEntry = Object.entries(data.blogs).find(
    ([_, blog]) => blog.slug === slug,
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

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Find the blog entry for structured data
  const blogEntry = Object.entries(data.blogs).find(
    ([_, blog]) => blog.slug === slug,
  );

  const title = blogEntry ? blogEntry[0] : slug;
  const description = blogEntry?.[1].description || "";
  const date = blogEntry?.[1].date || "";

  // Create structured data for the blog post
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
      <Blog slug={slug} />
    </>
  );
}
