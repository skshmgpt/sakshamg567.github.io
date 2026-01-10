import Noise from "@/components/Noise";
import ProjectDisplay from "@/components/ProjectDisplay";
import { readFile } from "fs/promises";
import path from "path";

type ProjectData = {
  Projects: {
    [key: string]: {
      description: string;
      stack: string;
      link: string;
    };
  };
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
      <main
        className={`flex min-h-screen flex-col text-white p-8 md:p-16 lg:p-24 max-w-5xl mx-auto z-100 relative font-berkeley-mono`}
      >
        <h1 className="text-3xl font-bold mb-8">projects</h1>
        {Object.entries(data.Projects).map(([Title, details]) => (
          <ProjectDisplay key={Title} title={Title} details={details} />
        ))}
      </main>
    </div>
  );
}
