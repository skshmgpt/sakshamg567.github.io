import type { Metadata } from "next";
import Image from "next/image";
import DividerSlash from "@/components/DividerSlash";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Saksham Gupta — CS undergrad, backend engineer, builder of tools.",
};

export default function About() {
  return (
    <main className="container-grid relative z-10">
      <div className="flex flex-col gap-5 px-12 py-10">
        <div className="flex flex-row items-center gap-3">
          <Image
            src="/sonic.gif"
            height={40}
            width={40}
            alt=""
            className="rounded-full object-contain"
          />
          <h1 className="font-mono text-[26px] font-semibold text-[#F0F0EB] tracking-[-0.02em]">
            about
          </h1>
        </div>
      </div>

      <DividerSlash />

      <div className="flex flex-col gap-6 px-12 py-10">
        <p className="font-mono text-[14px] text-[#F0F0EB] leading-relaxed">
          i&apos;m a 20 y/o computer science undergrad at maharaja agrasen
          institute of technology. i started programming after seeing
          chatgpt in 2023 and basically decided this is what i&apos;m going
          to do — build ai. sadly, that didn&apos;t happen, but i explored
          a ton of stuff since then and fell in love with backend and
          distributed systems. i&apos;m deeply interested in how things work
          under the hood — databases, networks, operating systems, and
          distributed systems. i spend most of my time building backend
          systems, writing about internals, and tinkering with infrastructure.
        </p>

        <p className="font-mono text-[14px] text-[#889988] leading-relaxed">
          currently, i&apos;m working as a full-stack developer intern at
          freestand sampling solutions, shipping full-stack solutions —
          building a custom agent-first wms and a bunch of other stuff.
          i work across the stack with typescript, next.js, and go
          services.
        </p>

        <p className="font-mono text-[14px] text-[#889988] leading-relaxed">
          when i&apos;m not coding, you&apos;ll find me reading papers on
          distributed systems, wrestling with my neovim config, lifting at the
          gym, listening to music, or reading literature. i believe in building
          things that teach me something — every project and blog post is me
          trying to understand a system deeply enough to explain it.
        </p>
      </div>

      <DividerSlash />

      <div className="flex flex-col gap-4 px-12 py-10">
        <span className="font-mono text-[10px] font-medium text-[#00FF41] tracking-[0.08em] uppercase">
          education
        </span>
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-mono text-[17px] font-medium text-[#F0F0EB]">
              Maharaja Agrasen Institute of Technology
            </h3>
            <span className="font-mono text-[12px] text-[#889988]">
              b.tech · computer science
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#00FF41] tracking-[0.04em] shrink-0">
            2023 – 2027
          </span>
        </div>
      </div>

      <DividerSlash />

      <div className="flex flex-col gap-5 px-12 py-10">
        <span className="font-mono text-[10px] font-medium text-[#00FF41] tracking-[0.08em] uppercase">
          links
        </span>
        <div className="flex flex-row gap-5">
          <a
            data-nav
            href="https://github.com/skshmgpt"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[12px] text-[#F0F0EB] hover:text-[#00FF41] transition-colors"
          >
            github
          </a>
          <a
            data-nav
            href="https://x.com/skshmgpt"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[12px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
          >
            twitter
          </a>
          <a
            data-nav
            href="https://linkedin.com/in/skshmgpt"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[12px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
          >
            linkedin
          </a>
          <a
            data-nav
            href="https://skshmgpt.medium.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[12px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
          >
            medium
          </a>
          <a
            data-nav
            href="mailto:saksham060306@gmail.com"
            className="font-mono text-[12px] text-[#889988] hover:text-[#F0F0EB] transition-colors"
          >
            mail
          </a>
        </div>
      </div>

      <DividerSlash />

      <div className="flex flex-col gap-5 px-12 py-10">
        <span className="font-mono text-[10px] font-medium text-[#00FF41] tracking-[0.08em] uppercase">
          colophon
        </span>
        <p className="font-mono text-[13px] text-[#889988] leading-relaxed">
          built with next.js, typescript, and tailwind css. set in berkeley
          mono. written on a macbook air m4 with 24gb ram. edited in neovim
          (btw). deployed on vercel.
        </p>
      </div>
    </main>
  );
}
