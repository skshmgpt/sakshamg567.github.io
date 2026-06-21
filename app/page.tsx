import ProjectDisplay from "@components/ProjectDisplay";
import Image from "next/image";
import Link from "next/link";
import BlogDisplay from "@/components/BlogsDisplay";
import Noise from "@/components/Noise";
import DividerSlash from "@/components/DividerSlash";
import Scratchpad from "@/components/Scratchpad";
import SpotifyPlaceholder from "@/components/SpotifyPlaceholder";
import { readFile } from "fs/promises";
import path from "path";
import { calculateReadTime } from "@/lib/utils";
import { Suspense } from "react";
import { GitHubContributions, GitHubContributionsFallback } from "@/components/github-contributions/github-contributions";
import { getCachedContributions } from "@/lib/get-cached-contributions";
import { TooltipProvider } from "@/components/ui/tooltip";

type Data = {
  Projects: {
    [key: string]: {
      description: string;
      stack: string;
      link: string;
    };
  };
  blogs: {
    [key: string]: {
      description: string;
      date: string;
      slug: string;
    };
  };
};

export default async function App() {
  const dataFile = await readFile(
    path.join(process.cwd(), "public/data.json"),
    "utf-8"
  );
  const data = JSON.parse(dataFile) as Data;

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

  const contributions = getCachedContributions("skshmgpt");

  return (
    <Suspense fallback={<GitHubContributionsFallback />}>
      <div>
        <Noise
          patternSize={250}
          patternScaleX={1}
          patternScaleY={1}
          patternRefreshInterval={2}
          patternAlpha={7}
        />

        <main className="container-grid relative z-10">
          {/* Hero */}
          <div className="flex flex-col gap-4.5 px-12 py-10">
            <div className="flex flex-row items-center gap-2.5">
              <Image
                src="/sonic.gif"
                height={26}
                width={26}
                alt=""
                className="rounded-full object-contain"
              />
              <h1 className="font-mono text-[26px] font-semibold text-[#F0F0EB] tracking-[-0.02em]">
                saksham gupta
              </h1>
            </div>
            <p className="font-mono text-[14px] text-[#889988] leading-relaxed max-w-xl">
              cs undergrad at maharaja agrasen institute of technology. i build
              backend systems and developer tools. currently engineering at
              freestand. i write about databases, networks, and systems
              internals.
            </p>
            <div className="flex flex-row gap-5">
              <a
                data-nav
                href="https://github.com/skshmgpt"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-[#00FF41] hover:underline"
              >
                gh
              </a>
              <a
                data-nav
                href="https://x.com/skshmgpt"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
              >
                tw
              </a>
              <a
                data-nav
                href="https://linkedin.com/in/skshmgpt"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
              >
                li
              </a>
              <a
                data-nav
                href="mailto:saksham060306@gmail.com"
                className="font-mono text-[11px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
              >
                em
              </a>
            </div>

            <SpotifyPlaceholder />
          </div>

          <DividerSlash />

          {/* Scratchpad */}
          <Scratchpad />

          <DividerSlash />

          {/* Currently */}
          <div className="flex flex-col gap-4 px-12 py-10">
            <span className="font-mono text-[10px] font-medium text-[#00FF41] tracking-[0.08em] uppercase">
              currently
            </span>
            <div className="flex flex-row justify-between items-start">
              <div className="flex flex-col gap-1.5">
                <h3 className="font-mono text-[17px] font-medium text-[#F0F0EB]">
                  Freestand
                </h3>
                <span className="font-mono text-[12px] text-[#889988]">
                  full-stack developer · intern
                </span>
                <p className="font-mono text-[13px] text-[#889988] leading-relaxed mt-1.5 max-w-md">
                  Building fintech infrastructure — payment systems, developer
                  dashboards, and internal tooling across the stack.
                </p>
              </div>
              <span className="font-mono text-[10px] text-[#00FF41] tracking-[0.04em] shrink-0">
                dec 2025 – present
              </span>
            </div>
          </div>

          <DividerSlash />

          {/* GitHub contributions */}
          <div className="px-12 py-10">
            <TooltipProvider>
              <GitHubContributions
                contributions={contributions}
                githubProfileUrl="https://github.com/skshmgpt"
              />
            </TooltipProvider>
          </div>

          <DividerSlash />

          {/* Writing */}
          <div className="flex flex-col px-12 py-10">
            <div className="flex flex-row justify-between items-center mb-7">
              <span className="font-mono text-[10px] font-medium text-[#00FF41] tracking-[0.08em] uppercase">
                writing
              </span>
              <Link
                data-nav
                href="/blog"
                className="font-mono text-[11px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
              >
                all posts →
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-[#1F1F1C]">
              {blogsWithReadTime.slice(0, 3).map(({ title, details }) => (
                <BlogDisplay key={title} title={title} details={details} />
              ))}
            </div>
          </div>

          <DividerSlash />

          {/* Projects */}
          <div className="flex flex-col px-12 py-10">
            <div className="flex flex-row justify-between items-center mb-7">
              <span className="font-mono text-[10px] font-medium text-[#00FF41] tracking-[0.08em] uppercase">
                projects
              </span>
              <Link
                data-nav
                href="/projects"
                className="font-mono text-[11px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
              >
                all projects →
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-[#1F1F1C]">
              {Object.entries(data.Projects)
                .slice(0, 3)
                .map(([title, details]) => (
                  <ProjectDisplay key={title} title={title} details={details} />
                ))}
            </div>
          </div>

          <DividerSlash />

          {/* Footer */}
          <footer className="flex flex-col gap-6 px-12 py-10">
            <div className="flex flex-row justify-between items-start">
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[11px] text-[#00FF41]">~</span>
                <span className="font-mono text-[11px] text-[#F0F0EB]">
                  saksham gupta
                </span>
                <span className="font-mono text-[10px] text-[#889988]">
                  cs · backend · tools
                </span>
                <span className="font-mono text-[10px] text-[#889988]">
                  maharaja agrasen institute of technology
                </span>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <a
                  data-nav
                  href="https://github.com/skshmgpt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-[#F0F0EB] hover:text-[#00FF41] transition-colors"
                >
                  gh
                </a>
                <a
                  data-nav
                  href="https://x.com/skshmgpt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
                >
                  tw
                </a>
                <a
                  data-nav
                  href="https://linkedin.com/in/skshmgpt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
                >
                  li
                </a>
                <a
                  data-nav
                  href="mailto:saksham060306@gmail.com"
                  className="font-mono text-[11px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
                >
                  em
                </a>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <span className="font-mono text-[10px] text-[#889988]">
                built w/ next.js · deployed on vercel
              </span>
              <div className="flex flex-row gap-4">
                <a
                  data-nav
                  href="https://github.com/skshmgpt/sakshamg567.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
                >
                  source
                </a>
                <span className="font-mono text-[10px] text-[#889988]">rss</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </Suspense>
  );
}
