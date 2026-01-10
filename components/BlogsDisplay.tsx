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
      className="text-white *:hover:cursor-pointer *:hover:underline"
      onClick={() => router.push(`/blog/${slug}`)}
    >
      <div className="flex justify-between items-start mb-0.5">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="flex gap-3 text-gray-400">
          {readTime && <span>{readTime}</span>}
          <p>{date}</p>
        </div>
      </div>
    </div>
  );
}
