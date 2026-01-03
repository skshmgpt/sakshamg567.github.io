"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "h") {
        router.push("/");
      } else if (e.key === "b") {
        router.push("/blog");
      } else if (e.key === "p") {
        router.push("/projects");
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [router]);

  return (
    <div className="flex flex-row mt-15 px-8 md:px-16 lg:px-24 max-w-5xl mx-auto z-100 relative font-mono text-white gap-10 *:hover:text-yellow-500">
      <button onClick={() => router.push("/")}>[h] home</button>
      <button onClick={() => router.push("/blogs")}>[b] blogs</button>
      <button onClick={() => router.push("/projects")}>[p] projects</button>
    </div>
  );
}
