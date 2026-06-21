import BlogDisplay from "@/components/BlogsDisplay";
import DividerSlash from "@/components/DividerSlash";
import Noise from "@/components/Noise";
import { readFile } from "fs/promises";
import path from "path";
import { calculateReadTime } from "@/lib/utils";
import type { Metadata } from "next";

type BlogData = {
  blogs: {
    [key: string]: {
      description: string;
      date: string;
      slug: string;
    };
  };
};

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Articles on databases, networks, and systems internals by Saksham Gupta.",
};

export default async function Blogs() {
  const dataFile = await readFile(
    path.join(process.cwd(), "public/data.json"),
    "utf-8"
  );
  const data = JSON.parse(dataFile) as BlogData;

  const blogsWithReadTime = await Promise.all(
    Object.entries(data.blogs).map(async ([title, details]) => {
      const content = await readFile(
        path.join(process.cwd(), "blogs", `${details.slug}.md`),
        "utf-8"
      );
      const readTime = calculateReadTime(content);
      return { title, details: { ...details, readTime } };
    })
  );

  return (
    <div>
      <Noise
        patternSize={250}
        patternScaleX={1}
        patternScaleY={1}
        patternRefreshInterval={2}
        patternAlpha={7}
      />
      <main className="container-grid relative z-10">
      <div className="px-12 py-10">
        <h1 className="font-mono text-[10px] font-medium text-[#00FF41] tracking-[0.08em] uppercase">
          writing
        </h1>
      </div>

      <DividerSlash />

      <div className="flex flex-col px-12 py-10">
        <div className="flex flex-col divide-y divide-[#1F1F1C]">
          {blogsWithReadTime.map(({ title, details }) => (
            <BlogDisplay key={title} title={title} details={details} />
          ))}
        </div>
      </div>
    </main>
    </div>
  );
}
