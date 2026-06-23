"use client";

import { useEffect, useState } from "react";

interface ScratchpadData {
  text: string;
  updatedAt: number;
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `~ ${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `~ ${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `~ ${days} day${days > 1 ? "s" : ""} ago`;
}

export default function Scratchpad() {
  const [data, setData] = useState<ScratchpadData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchScratchpad() {
      try {
        const res = await fetch("/api/scratchpad");
        const json = await res.json();
        if (!cancelled && json.text) setData(json);
      } catch {
        // fail silently
      }
    }

    fetchScratchpad();
    return () => { cancelled = true; };
  }, []);

  if (!data || !data.text) return null;

  return (
    <div className="flex flex-col gap-3.5 px-12 py-10">
      <div className="flex flex-row items-center gap-2.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41]" />
        <span className="font-mono text-[10px] font-medium text-[#00FF41] tracking-[0.08em] uppercase">
          log
        </span>
      </div>
      <p className="font-mono text-[15px] text-[#F0F0EB] leading-relaxed">
        {data.text}
      </p>
      <span className="font-mono text-[10px] text-[#889988]">
        {relativeTime(data.updatedAt)}
      </span>
    </div>
  );
}
