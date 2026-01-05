"use client";
import BlogDisplay from "@/components/BlogsDisplay";
import data from "../../public/data.json";
import Noise from "@/components/Noise";
const Blogs = () => {
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
        {Object.entries(data["blogs"])
          .map(([title, details]) => (
            <>
              <div className="mb-3">
                <BlogDisplay key={title} title={title} details={details} />
              </div>
            </>
          ))}
      </main>
    </div>
  );
};

export default Blogs;
