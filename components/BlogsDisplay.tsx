"use client";
import { useRouter } from "next/navigation";
export default function BlogDisplay({
  title,
  details,
}: {
  title: string;
  details: { description: string; date: string; slug: string; readTime?: string };
}) {
  const { description, date, slug, readTime } = details;
  const router = useRouter();
  return (
    <div
      className="text-white hover:cursor-pointer group"
      onClick={() => router.push(`/blog/${slug}`)}
    >
      <h3 className="font-bold text-lg mb-1 group-hover:underline">{title}</h3>
      <div className="flex flex-wrap gap-2 text-sm text-gray-400">
        <span>{date}</span>
        {readTime && (
          <>
            <span className="hidden sm:inline">•</span>
            <span>{readTime}</span>
          </>
        )}
      </div>
    </div>
  );
}
