"use server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import fs from "fs/promises";
import path from "path";
import "highlight.js/styles/github-dark.css";

export default async function Blog({ slug }) {
  const content = await fs.readFile(
    path.join(process.cwd(), "blogs", `${slug}.md`),
    "utf-8",
  );

  return (
    <div className="flex flex-col text-white p-8 md:p-16 lg:p-24 max-w-5xl mx-auto relative">
      <div className="markdown-body prose prose-invert max-w-none">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            pre: ({ node, ...props }) => (
              <pre
                className="overflow-x-auto rounded-lg bg-[#333333] p-4 my-4"
                {...props}
              />
            ),
            code: ({ node, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <code className={`${className}`} {...props}>
                  {children}
                </code>
              ) : (
                <code
                  className="bg-[#333333] border-0 px-1.5 py-0.5 rounded text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            h1: ({ node, ...props }) => (
              <h1
                className="text-4xl font-bold text-yellow-500 mt-8 mb-4"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-3xl font-bold text-yellow-500 mt-6 mb-3"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-2xl font-bold text-yellow-500 mt-4 mb-2"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p className="text-gray-300 leading-relaxed mb-4" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a className="text-yellow-500 hover:underline" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc ml-6 mb-4 text-gray-300" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal ml-6 mb-4 text-gray-300" {...props} />
            ),
          }}
        >
          {content}
        </Markdown>
      </div>
    </div>
  );
}
