"use client";
import Noise from "@/components/Noise";
import data from "../../public/data.json";
import ProjectDisplay from "@/components/ProjectDisplay";
const Projects = () => {
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
        className={`flex min-h-screen flex-col text-white p-8 md:p-16 lg:p-24 max-w-5xl mx-auto z-100 relative font-mono`}
      >
        <h1 className="text-3xl font-bold mb-8">projects</h1>
        {Object.entries(data["Projects"]).map(([Title, details]) => (
          <ProjectDisplay key={Title} title={Title} details={details} />
        ))}
      </main>
    </div>
  );
};

export default Projects;
