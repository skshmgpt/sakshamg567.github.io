import { ArrowOutwardRounded } from "@mui/icons-material";
import { Badge } from "./ui/badge";

export default function ProjectDisplay({ title, details }) {
  const { description, stack, link, github } = details;
  let stackArray = [];
  if (stack) {
    stackArray = stack.split(", ");
  }

  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <div className="mb-6 p-8 border border-zinc-800 hover:border-yellow-500 transition-all duration-500 hover:text-yellow-500 text-white hover:cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{title}</h3>
          <div className="flex gap-2">
            <ArrowOutwardRounded />
          </div>
        </div>
        <p className="text-gray-400 mb-3">{description}</p>
        {stackArray.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {stackArray.map((tech, i) => (
              <Badge
                key={i}
                variant="outline"
                className="border border-zinc-700 text-gray-400 text-xs rounded-sm"
              >
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
