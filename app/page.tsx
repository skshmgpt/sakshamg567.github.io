import {
  ArrowOutwardRounded,
  Email,
  GitHub,
  LinkedIn,
  X,
} from "@mui/icons-material";
import { Badge } from "@components/ui/badge";
import ProjectDisplay from "@components/ProjectDisplay";
import Social from "@components/Social";
import Medium from "@components/Medium";
import Image from "next/image";
import Link from "next/link";
import BlogDisplay from "@/components/BlogsDisplay";
import Noise from "@/components/Noise";
import { readFile } from "fs/promises";
import path from "path";

type Data = {
  Projects: {
    [key: string]: {
      description: string;
      stack: string;
      link: string;
    };
  };
  blogs: {
    [key: string]: {
      description: string;
      date: string;
      slug: string;
    };
  };
};

export default async function App() {
  const dataFile = await readFile(
    path.join(process.cwd(), "public/data.json"),
    "utf-8"
  );
  const data = JSON.parse(dataFile) as Data;

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
        className={`flex min-h-screen flex-col text-white px-8 md:px-16 lg:px-24 my-8 max-w-5xl mx-auto z-100 relative font-berkeley-mono`}
      >
        <div className="mt-10 md:mt-0 mb-10 flex sm:flex-row items-center gap-5 rounded-md justify-between">
          <div className="flex flex-row gap-5 items-center">
            <div className="scale-95 flex flex-col">
              <span className="font-semibold text-2xl sm:text-4xl -ml-1.5">
                saksham gupta
              </span>
              <span className="text-zinc-500 text-sm sm:text-base">
                @skshmgpt
              </span>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2 sm:gap-4 scale-75 sm:scale-90">
            <Badge asChild className="border border-zinc-800 p-2 rounded-md">
              <a href="https://x.com/skshmgpt">
                <X />
              </a>
            </Badge>
            <Badge asChild className="border border-zinc-800 p-2 rounded-md">
              <a href="https://github.com/skshmgpt">
                <GitHub />
              </a>
            </Badge>
          </div>
        </div>
        <section id="about">
          <p className="mb-3 text-zinc-400 mt-2">
            i&apos;m a 19 y\o cs undergrad. i love writing softwares and solving
            problems. interested in backend, distributed systems, networking and
            infra. when i&apos;m not cooking software, i&apos;m prolly in the
            kitchen doing real cooking :), or in the gym lifting some metal.
          </p>
        </section>
        <section className="mt-12">
          <div className="text-xs sm:text-sm">
            <h1 className="font-bold text-xl sm:text-2xl mb-7 text-white">
              shipping at
            </h1>
            <div className="flex flex-row place-content-between ">
              <div className="flex flex-row gap-3">
                <Image
                  src={"/fs.webp"}
                  width={50}
                  height={50}
                  alt=""
                  className="rounded-full object-contain object-left"
                />
                <div className="flex flex-col -gap-2">
                  <p className="font-bold">Freestand</p>
                  <p className="text-xs">full stack developer | intern</p>
                </div>
              </div>
              <p className="text-zinc-400">december 2025 - present</p>
            </div>
          </div>
        </section>

        <section id="Blogs" className="mt-12 ">
          <div className="text-gray-400 text-xs sm:text-sm">
            <h1 className="font-bold text-xl sm:text-2xl text-white mb-4">
              Blogs
            </h1>
            {Object.entries(data.blogs)
              .slice(2)
              .map(([title, details]) => (
                <div key={title} className="mb-5">
                  <BlogDisplay title={title} details={details} />
                </div>
              ))}
          </div>
          <div className="group p-0.5 cursor-pointer">
            <Link
              href="/blog"
              className="text-yellow-500 hover:underline items-center cursor-pointer"
            >
              all blogs
              <ArrowOutwardRounded className="scale-80 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300 ease-in-out -translate-y-[0.075rem] cursor-pointer p-0 m-0" />
            </Link>
          </div>
        </section>

        <section id="projects" className="mt-12">
          <div className="text-gray-400 text-xs sm:text-sm">
            <h1 className="font-bold text-xl sm:text-2xl text-white mb-7">
              projects
            </h1>
            {Object.entries(data.Projects)
              .slice(0, 2)
              .map(([Title, details]) => (
                <ProjectDisplay key={Title} title={Title} details={details} />
              ))}
          </div>
          <div className="group p-0.5 cursor-pointer">
            <Link
              href="/projects"
              className="text-yellow-500 hover:underline items-center cursor-pointer"
            >
              all projects
              <ArrowOutwardRounded className="scale-80 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300 ease-in-out -translate-y-[0.075rem] cursor-pointer p-0 m-0" />
            </Link>
          </div>
        </section>

        <hr className="my-5 border-zinc-800" />
        <section id="contact">
          <div className="flex flex-row flex-wrap justify-center gap-6 text-gray-400 leading-relaxed tracking-wide text-sm">
            <Social
              Icon={GitHub}
              Text={"Github"}
              Link={"https://github.com/skshmgpt"}
            />
            <Social Icon={X} Text={"Twitter"} Link={"https://x.com/skshmgpt"} />
            <Social
              Icon={LinkedIn}
              Text={"Linkedin"}
              Link={"https://linkedin.com/in/skshmgpt"}
            />
            <Social
              Icon={Medium}
              Text={"Medium"}
              Link={"https://skshmgpt.medium.com"}
            />
            <Social
              Icon={Email}
              Text={"Email"}
              Link={"mailto:saksham060306@gmail.com"}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
