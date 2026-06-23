import Image from "next/image";
import Link from "next/link";
import Noise from "@/components/Noise";
import DividerSlash from "@/components/DividerSlash";
import Scratchpad from "@/components/Scratchpad";
import SpotifyNowPlaying from "@/components/SpotifyNowPlaying";
import { Suspense } from "react";
import HomepageBlogs from "@/components/HomepageBlogs";
import HomepageProjects from "@/components/HomepageProjects";
import { GitHubContributions, GitHubContributionsFallback } from "@/components/github-contributions/github-contributions";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCachedContributions } from "@/lib/get-cached-contributions";

const sectionFallback = (
  <div className="flex h-24 items-center justify-center font-mono text-[11px] text-[#889988]">
    loading...
  </div>
);

export default function App() {
  return (
    <>
      <Noise
        patternSize={250}
        patternScaleX={1}
        patternScaleY={1}
        patternRefreshInterval={2}
        patternAlpha={7}
      />

      <main className="container-grid relative z-10">
        {/* Hero — static */}
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
            cs undergrad. i build backend systems and full stack apps.
            fellow programming enthusiast. currently taming agents to write
            code while i doomscroll twitter. i also write about databases,
            networks, systems internals, and whatever i find cool. 
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
              href="https://skshmgpt.medium.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
            >
              md
            </a>
            <a
              data-nav
              href="mailto:saksham060306@gmail.com"
              className="font-mono text-[11px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
            >
              em
            </a>
          </div>

          <SpotifyNowPlaying />
        </div>

        <DividerSlash />

        {/* Scratchpad — live */}
        <Scratchpad />

        <DividerSlash />

        {/* Currently — static */}
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
                shipping stuff end to end, working across frontend, database
                designing, and basically all things fullstack.
              </p>
            </div>
            <span className="font-mono text-[10px] text-[#00FF41] tracking-[0.04em] shrink-0">
              dec 2025 – present
            </span>
          </div>
        </div>

        <DividerSlash />

        {/* GitHub contributions — streams */}
        <div className="px-12 py-10">
          <Suspense fallback={<GitHubContributionsFallback />}>
            <TooltipProvider>
              <GitHubContributions
                contributions={getCachedContributions("skshmgpt")}
                githubProfileUrl="https://github.com/skshmgpt"
              />
            </TooltipProvider>
          </Suspense>
        </div>

        <DividerSlash />

        {/* Writing — streams */}
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
          <Suspense fallback={sectionFallback}>
            <HomepageBlogs count={3} />
          </Suspense>
        </div>

        <DividerSlash />

        {/* Projects — streams */}
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
          <Suspense fallback={sectionFallback}>
            <HomepageProjects count={3} />
          </Suspense>
        </div>

        <DividerSlash />

        {/* Footer — static */}
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
                href="https://skshmgpt.medium.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
              >
                md
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
    </>
  );
}
