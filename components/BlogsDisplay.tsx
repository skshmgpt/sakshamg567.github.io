"use client";
import { useRouter } from "next/navigation";
import { useTiksSounds } from "@/hooks/use-tiks-sounds";

export default function BlogDisplay({
  title,
  details,
}: {
  title: string;
  details: { description: string; date: string; slug: string; readTime?: string };
}) {
  const { description, date, slug, readTime } = details;
  const router = useRouter();
  const { play } = useTiksSounds();

  const handleClick = () => {
    play("click");
    router.push(`/blog/${slug}`);
  };

  return (
    <div
      data-nav
      className="flex flex-row justify-between items-start cursor-pointer group py-3"
      onClick={handleClick}
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-mono text-[15px] font-medium text-[#F0F0EB] group-hover:text-[#00FF41] transition-colors">
          {title}
        </h3>
        {description && (
          <p className="font-mono text-[11px] text-[#889988] leading-relaxed line-clamp-1">
            {description}
          </p>
        )}
        <div className="flex flex-row gap-3 mt-0.5">
          <span className="font-mono text-[9px] text-[#889988]">{date}</span>
        </div>
      </div>
      {readTime && (
        <span className="font-mono text-[10px] text-[#889988] shrink-0 mt-1">
          {readTime}
        </span>
      )}
    </div>
  );
}
