"use client";

import { useTiksSounds } from "@/hooks/use-tiks-sounds";

export default function ProjectDisplay({ title, details }: {
  title: string;
  details: { description: string; stack: string; link: string; github?: string };
}) {
  const { description, stack, link } = details;
  const { play } = useTiksSounds();

  const stackArray = stack ? stack.split(", ") : [];

  const handleClick = () => {
    play("click");
    window.open(link, "_blank", "noopener noreferrer");
  };

  return (
    <div
      data-nav
      className="flex flex-row justify-between items-start cursor-pointer group py-3"
      onClick={handleClick}
    >
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-2.5 items-baseline">
          <h3 className="font-mono text-[15px] font-medium text-[#F0F0EB] group-hover:text-[#00FF41] transition-colors">
            {title}
          </h3>
          {stackArray.length > 0 && (
            <span className="font-mono text-[9px] text-[#00FF41]">
              {stackArray.slice(0, 2).join("·")}
            </span>
          )}
        </div>
        <p className="font-mono text-[11px] text-[#889988] leading-relaxed line-clamp-1">
          {description}
        </p>
      </div>
      <span className="font-mono text-[12px] text-[#889988] shrink-0 mt-1 group-hover:text-[#00FF41] transition-colors">
        ↗
      </span>
    </div>
  );
}
