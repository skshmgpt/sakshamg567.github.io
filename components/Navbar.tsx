"use client";

import { useRouter } from "next/navigation";
import { useVimNav } from "@/hooks/use-vim-nav";
import { useTiksSounds } from "@/hooks/use-tiks-sounds";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ROUTES = ["/", "/about", "/blog", "/projects"] as const;

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { play } = useTiksSounds();

  useVimNav();

  useEffect(() => {
    ROUTES.forEach((route) => router.prefetch(route));
  }, [router]);

  const handleNav = (path: string) => {
    play("click");
    router.push(path);
  };

  const linkStyle = (path: string) =>
    `font-mono text-[11px] transition-colors cursor-pointer px-4 border-l border-[#1F1F1C] ${
      pathname === path ? "text-[#00FF41]" : "text-[#889988] hover:text-[#F0F0EB]"
    }`;

  return (
    <div className="flex flex-row justify-center pt-12 pb-10 z-50 relative">
      <div className="flex flex-row items-center">
        <div className="font-mono text-[11px] text-[#00FF41] px-4">~</div>
        <button data-nav onClick={() => handleNav("/")} className={linkStyle("/")}>
          index
        </button>
        <button data-nav onClick={() => handleNav("/about")} className={linkStyle("/about")}>
          about
        </button>
        <button data-nav onClick={() => handleNav("/blog")} className={linkStyle("/blog")}>
          writing
        </button>
        <button data-nav onClick={() => handleNav("/projects")} className={linkStyle("/projects")}>
          projects
        </button>
      </div>
    </div>
  );
}
