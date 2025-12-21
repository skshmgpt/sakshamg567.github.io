import data from '../data.json'
import { Email, GitHub, LinkedIn, X } from '@mui/icons-material'
import { Badge } from "./components/ui/badge"
import ProjectDisplay from './components/ProjectDisplay'
import Social from './components/Social'
import Lenis from 'lenis'
import Medium from './components/Medium'
import 'lenis/dist/lenis.css'
const App = () => {

  const lenis = new Lenis({
    autoRaf: true,
  })

  const skillBadge = (items) => {
    return (
      items.map((item, i) => (
        <Badge key={i} variant={"outline"} className="border border-zinc-700 text-gray-400 text-xs sm:text-sm px-2 py-1">{item}</Badge>
      ))
    )
  }
  return (
    <div className='bg-black'>
      <main className={`flex min-h-screen flex-col text-white p-8 md:p-16 lg:p-24 max-w-3xl mx-auto`}>
        <div className='mt-10 md:mt-0 mb-10 flex sm:flex-row items-center gap-5 rounded-md justify-between'>
          <div className='flex flex-row gap-5 items-center'>
            <div className='overflow-hidden flex items-center justify-center w-16 sm:w-20 rounded-full'>
              <img src="/pfp_x_ghibli.jpg" alt="" className='object-cover w-full h-full' />
            </div>
            <div className='scale-95 flex flex-col'>
              <span className='font-sans font-semibold text-2xl sm:text-4xl'>Saksham</span>
              <span className='font-mono text-zinc-500 leading-relaxed tracking-normal text-sm sm:text-base'>@skshmgpt</span>
            </div>
          </div>
          <div className='flex flex-row items-center gap-2 sm:gap-4 scale-75 sm:scale-90'>
            <Badge asChild className="border border-zinc-800 p-2">
              <a href="https://x.com/skshmgpt">
                <X />
              </a>
            </Badge>
            <Badge asChild className="border border-zinc-800 p-2">
              <a href="https://github.com/skshmgpt">
                <GitHub />
              </a>
            </Badge>
          </div>
        </div>
        <section id='about'>
          <div className="text-gray-400 leading-relaxed tracking-wide font-mono text-sm">
             <span className="font-bold text-white text-xl" >About Me</span> 
            <p className="mb-3 text-white mt-2">
              code, computer and music, pretty much sums me up.
            </p>
            <p className="mb-3 text-white mt-2">
              doing cool stuff
            </p>


          </div>
        </section>
                <hr className="my-5 border-zinc-800" />
        <section id="Projects">
          <div className="text-gray-400 leading-relaxed tracking-wide font-mono text-xs sm:text-sm">
            <h1 className="font-bold text-xl sm:text-2xl text-white mb-4">Projects</h1>
            {Object.entries(data["Projects"]).map(([Title, details]) => (
              <ProjectDisplay key={Title} title={Title} details={details} />
            ))}
          </div>
        </section>
        <hr className="my-5 border-zinc-800" />
        <section>
          <div className="text-gray-400 leading-relaxed tracking-wide font-mono text-xs sm:text-sm">
            <h1 className="font-bold text-xl sm:text-2xl mb-4 text-white">Skills</h1>
            {Object.entries(data["skills"]).map(([category, items]) => (
              <div key={category} className="mb-4 text-white">
                <span className="text-white mb-2 mr-3 block sm:inline text-sm sm:text-base">{category}</span>
                <div className="flex-wrap gap-1 sm:gap-2 flex mt-2 sm:mt-0 sm:inline-flex">
                  {skillBadge(items)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-5 border-zinc-800" />
        <section id="Blogs">
          <div className="text-gray-400 leading-relaxed tracking-wide font-mono text-xs sm:text-sm">
            <h1 className="font-bold text-xl sm:text-2xl text-white mb-4">Blogs</h1>
            {Object.entries(data["blogs"]).map(([title, details]) => (
              <ProjectDisplay key={title} title={title} details={details} />
            ))}
          </div>
        </section>
        <hr className="my-5 border-zinc-800" />
        <section id='contact'>
          <div className='flex flex-row flex-wrap justify-center gap-6 text-gray-400 leading-relaxed tracking-wide font-mono text-sm'>
            <Social
              Icon={GitHub}
              Text={"Github"}
              Link={"https://github.com/skshmgpt"}
            />
            <Social
              Icon={X}
              Text={"Twitter"}
              Link={"https://x.com/skshmgpt"}
            />
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
  )
}

export default App
