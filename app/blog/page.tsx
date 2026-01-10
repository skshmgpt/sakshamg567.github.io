import BlogDisplay from "@/components/BlogsDisplay";
import Noise from "@/components/Noise";
import { readFile } from "fs/promises";
import path from "path";

type BlogData = {
  blogs: {
    [key: string]: {
      description: string;
      date: string;
      slug: string;
    };
  };
};

export default async function Blogs() {
  const dataFile = await readFile(
    path.join(process.cwd(), "public/data.json"),
    "utf-8"
  );
  const data = JSON.parse(dataFile) as BlogData;

  return (
    <div>
      <Noise
        patternSize={250}
        patternScaleX={1}
        patternScaleY={1}
        patternRefreshInterval={2}
        patternAlpha={7}
      />
      <main
        className={`flex max-h-screen flex-col text-white p-8 md:p-16 lg:p-24 max-w-5xl mx-auto z-100 relative font-berkeley-mono`}
      >
        <h1 className="text-3xl font-bold mb-8">blogs</h1>
        {Object.entries(data.blogs)
          .map(([title, details]) => (
            <div key={title} className="mb-3">
              <BlogDisplay title={title} details={details} />
            </div>
          ))}
      </main>
    </div>
  );
}
