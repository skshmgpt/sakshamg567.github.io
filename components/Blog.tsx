"use server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import fs from "fs/promises";
import path from "path";
import CodeBlock from "@/components/sacred/CodeBlock";
import ImageModal from "@/components/ImageModal";
import { createHeadingIdGenerator } from "@/lib/blog-headings";

function extractText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = node.props as { children?: React.ReactNode; className?: string };
    return extractText(props.children);
  }
  return "";
}

function extractLanguage(children: React.ReactNode): string | undefined {
  if (typeof children !== "object" || !children) return undefined;
  if (Array.isArray(children)) {
    for (const child of children) {
      const lang = extractLanguage(child);
      if (lang) return lang;
    }
    return undefined;
  }
  if ("props" in children) {
    const props = children.props as { className?: string; children?: React.ReactNode };
    if (props.className) {
      const match = /language-(\w+)/.exec(props.className);
      if (match) return match[1];
    }
    return extractLanguage(props.children);
  }
  return undefined;
}

export default async function Blog({ slug }: { slug: string }) {
  const content = await fs.readFile(
    path.join(process.cwd(), "blogs", `${slug}.md`),
    "utf-8",
  );
  const getHeadingId = createHeadingIdGenerator();

  return (
    <div className="flex flex-col">
      <div className="font-inter">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            pre: ({ children, ...props }) => {
              const lang = extractLanguage(children);
              return (
                <CodeBlock language={lang} {...props}>
                  {extractText(children).replace(/\n$/, "")}
                </CodeBlock>
              );
            },
            code: ({ children, ...props }) => (
              <code
                className="bg-[#111110] border border-[#1F1F1C] px-2 py-0.5 text-sm font-mono text-[#00FF41]"
                {...props}
              >
                {children}
              </code>
            ),
            h1: ({ children, ...props }) => {
              const id = getHeadingId(String(children));
              return (
                <h1
                  id={id}
                  className="text-3xl md:text-4xl font-bold text-[#F0F0EB] mt-12 mb-6 pb-3 border-b border-[#1F1F1C] first:mt-0 font-mono scroll-mt-6"
                  {...props}
                >
                  {children}
                </h1>
              );
            },
            h2: ({ children, ...props }) => {
              const id = getHeadingId(String(children));
              return (
                <h2
                  id={id}
                  className="text-2xl md:text-3xl font-bold text-[#F0F0EB] mt-10 mb-5 pb-2 border-b border-[#1F1F1C] font-mono scroll-mt-6"
                  {...props}
                >
                  {children}
                </h2>
              );
            },
            h3: ({ children, ...props }) => {
              const id = getHeadingId(String(children));
              return (
                <h3
                  id={id}
                  className="text-xl md:text-2xl font-bold text-[#F0F0EB] mt-8 mb-4 font-mono scroll-mt-6"
                  {...props}
                >
                  {children}
                </h3>
              );
            },
            h4: ({ children, ...props }) => {
              const id = getHeadingId(String(children));
              return (
                <h4
                  id={id}
                  className="text-lg md:text-xl font-semibold text-[#00FF41] mt-6 mb-3 font-mono scroll-mt-6"
                  {...props}
                >
                  {children}
                </h4>
              );
            },
            h5: ({ children, ...props }) => {
              const id = getHeadingId(String(children));
              return (
                <h5
                  id={id}
                  className="mt-5 mb-3 font-mono text-base font-semibold text-[#00FF41] scroll-mt-6"
                  {...props}
                >
                  {children}
                </h5>
              );
            },
            h6: ({ children, ...props }) => {
              const id = getHeadingId(String(children));
              return (
                <h6
                  id={id}
                  className="mt-5 mb-3 font-mono text-sm font-semibold uppercase tracking-[0.08em] text-[#889988] scroll-mt-6"
                  {...props}
                >
                  {children}
                </h6>
              );
            },
            p: ({ ...props }) => (
              <p
                className="text-[#889988] leading-[1.8] mb-5 text-base md:text-lg font-inter"
                {...props}
              />
            ),
            a: ({ ...props }) => (
              <a
                className="text-[#00FF41] hover:underline underline-offset-2 transition-colors"
                {...props}
              />
            ),
            ul: ({ ...props }) => (
              <ul
                className="list-disc ml-6 mb-6 text-[#889988] space-y-2 marker:text-[#00FF41]"
                {...props}
              />
            ),
            ol: ({ ...props }) => (
              <ol
                className="list-decimal ml-6 mb-6 text-[#889988] space-y-2 marker:text-[#00FF41] marker:font-semibold"
                {...props}
              />
            ),
            li: ({ ...props }) => (
              <li className="text-[#889988] leading-[1.7] pl-2 font-inter" {...props} />
            ),
            blockquote: ({ ...props }) => (
              <blockquote
                className="border-l-4 border-[#00FF41] pl-6 pr-4 py-2 my-6 bg-[#111110] italic text-[#889988]"
                {...props}
              />
            ),
            hr: ({ ...props }) => (
              <hr className="my-10 border-t border-[#1F1F1C]" {...props} />
            ),
            table: ({ ...props }) => (
              <div className="overflow-x-auto my-6">
                <table
                  className="min-w-full border-collapse border border-[#1F1F1C]"
                  {...props}
                />
              </div>
            ),
            thead: ({ ...props }) => (
              <thead className="bg-[#111110]" {...props} />
            ),
            th: ({ ...props }) => (
              <th
                className="border border-[#1F1F1C] px-4 py-3 text-left text-[#00FF41] font-semibold font-mono"
                {...props}
              />
            ),
            td: ({ ...props }) => (
              <td
                className="border border-[#1F1F1C] px-4 py-3 text-[#889988] font-inter"
                {...props}
              />
            ),
            tr: ({ ...props }) => (
              <tr className="hover:bg-[#111110] transition-colors" {...props} />
            ),
            strong: ({ ...props }) => (
              <strong className="text-[#F0F0EB] font-semibold" {...props} />
            ),
            em: ({ ...props }) => (
              <em className="text-[#889988] italic" {...props} />
            ),
            img: ({ src, alt }) => (
              <ImageModal src={src as string} alt={alt ?? ""} />
            ),
          }}
        >
          {content}
        </Markdown>
      </div>
    </div>
  );
}
