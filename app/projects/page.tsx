import DividerSlash from "@/components/DividerSlash";
import ProjectDisplay from "@/components/ProjectDisplay";
import Noise from "@/components/Noise";
import { readFile } from "fs/promises";
import path from "path";
import type { Metadata } from "next";

type ProjectData = {
  Projects: {
    [key: string]: {
      description: string;
      stack: string;
      link: string;
    };
  };
};

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Backend systems, developer tools, and open-source projects by Saksham Gupta.",
};

export default async function Projects() {
  const dataFile = await readFile(
    path.join(process.cwd(), "public/data.json"),
    "utf-8"
  );
  const data = JSON.parse(dataFile) as ProjectData;

  return (
    <div>
      <Noise
        patternSize={250}
        patternScaleX={1}
        patternScaleY={1}
        patternRefreshInterval={2}
        patternAlpha={7}
      />
      <main className="container-grid relative z-10">
      <div className="px-12 py-10">
        <h1 className="font-mono text-[10px] font-medium text-[#00FF41] tracking-[0.08em] uppercase">
          projects
        </h1>
      </div>

      <DividerSlash />

      <div className="flex flex-col px-12 py-10">
        <div className="flex flex-col divide-y divide-[#1F1F1C]">
          {Object.entries(data.Projects).map(([title, details]) => (
            <ProjectDisplay key={title} title={title} details={details} />
          ))}
        </div>
      </div>
    </main>
    </div>
  );
}
