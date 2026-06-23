import BlogDisplay from "@/components/BlogsDisplay";
import { readFile } from "fs/promises";
import path from "path";
import { calculateReadTime } from "@/lib/utils";

export default async function HomepageBlogs({ count = 3 }: { count?: number }) {
  const dataFile = await readFile(
    path.join(process.cwd(), "public/data.json"),
    "utf-8"
  );
  const data = JSON.parse(dataFile) as {
    blogs: { [key: string]: { description: string; date: string; slug: string } };
  };

  const entries = Object.entries(data.blogs).slice(0, count);

  const blogsWithReadTime = await Promise.all(
    entries.map(async ([title, details]) => {
      const content = await readFile(
        path.join(process.cwd(), "blogs", `${details.slug}.md`),
        "utf-8"
      );
      const readTime = calculateReadTime(content);
      return { title, details: { ...details, readTime } };
    })
  );

  return (
    <div className="flex flex-col divide-y divide-[#1F1F1C]">
      {blogsWithReadTime.map(({ title, details }) => (
        <BlogDisplay key={title} title={title} details={details} />
      ))}
    </div>
  );
}
