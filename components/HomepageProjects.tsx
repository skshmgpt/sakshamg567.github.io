import ProjectDisplay from "@components/ProjectDisplay";
import { readFile } from "fs/promises";
import path from "path";

export default async function HomepageProjects({ count = 3 }: { count?: number }) {
  const dataFile = await readFile(
    path.join(process.cwd(), "public/data.json"),
    "utf-8"
  );
  const data = JSON.parse(dataFile) as {
    Projects: { [key: string]: { description: string; stack: string; link: string } };
  };

  return (
    <div className="flex flex-col divide-y divide-[#1F1F1C]">
      {Object.entries(data.Projects)
        .slice(0, count)
        .map(([title, details]) => (
          <ProjectDisplay key={title} title={title} details={details} />
        ))}
    </div>
  );
}
