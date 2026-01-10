"use server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import fs from "fs/promises";
import path from "path";
import "highlight.js/styles/github-dark.css";
import Image from "next/image";
import { calculateReadTime } from "@/lib/utils";

export default async function Blog({ slug }: { slug: string }) {
  const content = await fs.readFile(
    path.join(process.cwd(), "blogs", `${slug}.md`),
    "utf-8",
  );

  const readTime = calculateReadTime(content);

  return (
    <div className="flex flex-col text-white p-6 md:p-12 lg:p-16 max-w-4xl mx-auto relative">
      <div className="mb-4 text-gray-400 text-sm">
        {readTime}
      </div>
      <div className="markdown-body prose prose-invert max-w-none font-inter">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            pre: ({ node, ...props }) => (
              <pre
                className="overflow-x-auto rounded-lg bg-zinc-900 border border-zinc-800 p-5 my-6 shadow-lg"
                {...props}
              />
            ),
            code: ({ node, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <code className={`${className} text-sm`} {...props}>
                  {children}
                </code>
              ) : (
                <code
                  className="bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded text-sm text-yellow-400 font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            h1: ({ node, ...props }) => (
              <h1
                className="text-4xl md:text-5xl font-bold text-yellow-500 mt-12 mb-6 pb-3 border-b border-zinc-800 first:mt-0"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-3xl md:text-4xl font-bold text-yellow-500 mt-10 mb-5 pb-2 border-b border-zinc-800"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-2xl md:text-3xl font-bold text-yellow-500 mt-8 mb-4"
                {...props}
              />
            ),
            h4: ({ node, ...props }) => (
              <h4
                className="text-xl md:text-2xl font-semibold text-yellow-400 mt-6 mb-3"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p
                className="text-gray-300 leading-[1.8] mb-5 text-base md:text-lg"
                {...props}
              />
            ),
            a: ({ node, ...props }) => (
              <a
                className="text-yellow-500 hover:text-yellow-400 underline decoration-yellow-500/30 hover:decoration-yellow-400 transition-colors"
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="list-disc ml-6 mb-6 text-gray-300 space-y-2 marker:text-yellow-500"
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal ml-6 mb-6 text-gray-300 space-y-2 marker:text-yellow-500 marker:font-semibold"
                {...props}
              />
            ),
            li: ({ node, ...props }) => (
              <li className="text-gray-300 leading-[1.7] pl-2" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-yellow-500 pl-6 pr-4 py-2 my-6 bg-zinc-900/50 italic text-gray-400 rounded-r"
                {...props}
              />
            ),
            hr: ({ node, ...props }) => (
              <hr
                className="my-10 border-t-2 border-zinc-800"
                {...props}
              />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-6">
                <table
                  className="min-w-full border-collapse border border-zinc-800 rounded-lg"
                  {...props}
                />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-zinc-900" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th
                className="border border-zinc-800 px-4 py-3 text-left text-yellow-500 font-semibold"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td
                className="border border-zinc-800 px-4 py-3 text-gray-300"
                {...props}
              />
            ),
            tr: ({ node, ...props }) => (
              <tr className="hover:bg-zinc-900/30 transition-colors" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="text-white font-semibold" {...props} />
            ),
            em: ({ node, ...props }) => (
              <em className="text-gray-200 italic" {...props} />
            ),
            img: ({ src, alt }) => (
              <div className="relative w-full my-8">
                <Image
                  src={src as string}
                  alt={alt ?? ""}
                  width={1200}
                  height={630}
                  className="rounded-lg border border-zinc-800 shadow-xl w-full h-auto"
                />
              </div>
            ),
          }}
        >
          {content}
        </Markdown>
      </div>
    </div>
  );
}
