import data from "../../public/data.json";
import ProjectDisplay from "@/components/ProjectDisplay";
const Projects = () => {
  return (
    <main
      className={`flex min-h-screen flex-col text-white p-8 md:p-16 lg:p-24 max-w-5xl mx-auto z-100 relative font-mono`}
    >
      <h1 className="text-3xl font-bold mb-8">projects</h1>
      {Object.entries(data["Projects"]).map(([Title, details]) => (
        <ProjectDisplay key={Title} title={Title} details={details} />
      ))}
    </main>
  );
};

export default Projects;
