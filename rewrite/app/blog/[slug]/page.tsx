import Blog from "@/components/Blog";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <Blog slug={slug} />;
}
