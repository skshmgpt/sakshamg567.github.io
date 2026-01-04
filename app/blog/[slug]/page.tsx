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

  return {
    title: `${title} | Saksham Gupta`,
    description: blogEntry ? blogEntry[1].description : `Blog post: ${title}`,
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <Blog slug={slug} />;
}
