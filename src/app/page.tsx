import Image from "next/image";
import Link from "next/link";
import { Github, Mail, Linkedin, MapPin, FolderGit2, User, Briefcase, GraduationCap } from "lucide-react";

const WEBRING_URL = "https://mac-csse-webring.vercel.app/";
const MY_SITE = "goshanraj.ca";

const personalInfo = {
  name: "hey, I&apos;m Gosh!",
  title: "computer science student at McMaster University",
  bio: "interested in software development and building AI agents",
  email: "govindag@mcmaster.ca",
  github: "github.com/goshanraj-g",
  linkedin: "linkedin.com/in/goshanrajgovindaraj",
  location: "Toronto, ON",
};

const openSourceContributions = [
  {
    name: "LlamaIndex",
    description: "integrated web tools for agentic web",
    url: "https://github.com/run-llama/llama_index",
    stats: "5M+ monthly downloads",
  },
  {
    name: "Ruby",
    description: "optimized the new ZJIT compiler, check out the article",
    articleURL: "https://railsatscale.com/2025-12-24-launch-zjit/",
    url: "https://github.com/ruby/ruby",
    stats: "Ruby Programming Language",
  },
];

const experiences = [
  {
    id: 1,
    title: "Software Engineering Intern",
    organization: "IBM",
    period: "January - Present",
    description: "building the tools that teach the world 🧠",
    image: "/images/experiences/ibm.png",
    alt: "IBM",
    link: "https://ibm.com/",
  },
  {
    id: 2,
    title: "Machine Learning Research Assistant",
    organization: "McMaster University",
    period: "Aug. 2025 - Present",
    description: "building models to predict and prevent athlete injuries 📊",
    image: "/images/education/mcmaster.png",
    alt: "McMaster University",
    link: "https://www.mcmaster.ca/",
  },
  {
    id: 3,
    title: "Community Manager",
    organization: "Google Developer Groups",
    period: "Sept. 2024 - Apr. 2025",
    description: "leading and organizing tech workshops 🛠",
    image: "/images/experiences/gdsc.png",
    alt: "Google Developer Groups",
    link: "https://gdg.community.dev/",
  },
];

const projects = [
  {
    id: 1,
    title: "CampusThread",
    description:
      "AI agents crowdsourcing university knowledge for 100+ students",
    tags: ["TypeScript", "React", "Python", "FastAPI", "AWS", "Gemini AI"],
    link: "https://campusthread.vercel.app/",
    image: "/images/projects/campusthread.png",
  },
  {
    id: 2,
    title: "Look Alive",
    description: "real-time eye tracking for screen fatigue prevention",
    tags: ["OpenCV", "Mediapipe", "Python"],
    link: "https://github.com/goshanraj-g/lookalive",
    image: "/images/projects/lookalive.png",
  },
  {
    id: 3,
    title: "Medinator",
    description: "AI health assistant for lifestyle risk assessment",
    tags: ["Next.js", "Flask", "scikit-learn"],
    link: "https://github.com/goshanraj-g/medinator",
    image: "/images/projects/medinator-demo.png",
  },
  {
    id: 4,
    title: "Multi-threaded Terminal Chat App",
    description:
      "chat room written in C++17 on top of Winsock 2 using socket programming and multi-threading",
    tags: ["C++", "Multi-threading", "Socket Programming"],
    link: "https://github.com/goshanraj-g/terminal-chat",
    image: "/images/projects/terminal-chat.png",
  },
  {
    id: 5,
    title: "Gradely",
    description:
      "smart, interactive dashboard that helps students track their grades, set academic goals, and plan for success",
    tags: ["Next.js", "TailwindCSS", "React", "FastAPI", "PostgreSQL"],
    link: "https://github.com/goshanraj-g/gradely",
    image: "/images/projects/calculation-preview.png",
  },
  {
    id: 6,
    title: "FastFahr",
    description:
      "modern, purpose-built platform for buying and selling German cars with clean design, smooth experience",
    tags: ["React.js", "CSS", "PHP", "MySQL"],
    link: "https://github.com/goshanraj-g/fast-fahr",
    image: "/images/projects/fast-fahr.png",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen text-gray-900 font-sans">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-10 flex flex-col-reverse md:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              hey, i&apos;m gosh!
            </h1>
            <p className="text-lg text-gray-600 mb-2 font-medium">{personalInfo.title}</p>
            <p className="text-gray-500 mb-4 text-sm leading-relaxed max-w-md">
              {personalInfo.bio}
            </p>

            <div className="flex items-center gap-4 text-gray-500 mb-5 text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-gray-400" />
                <span>{personalInfo.location}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors text-sm font-medium"
              >
                <Mail size={14} />
                <span>Email</span>
              </Link>
              <Link
                href={`https://${personalInfo.github}`}
                target="_blank"
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors text-sm font-medium"
              >
                <Github size={14} />
                <span>GitHub</span>
              </Link>
              <Link
                href={`https://${personalInfo.linkedin}`}
                target="_blank"
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors text-sm font-medium"
              >
                <Linkedin size={14} />
                <span>LinkedIn</span>
              </Link>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-40 h-48 overflow-hidden rounded-xl shadow-sm border border-gray-100">
              <Image
                src="/images/profile-picture/profilepicture.JPG"
                alt="Profile picture"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </header>

        {/* About Me */}
        <section className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <User size={14} />
            <span>About</span>
          </h2>
          <ul className="space-y-2 text-sm text-gray-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">→</span>
              <span>
                software engineering intern @ IBM to help build
                tools that teach 10M+ people
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">→</span>
              <span>
                currently doing research in sports analytics & data @ McMaster
                University
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">→</span>
              <span>
                i&apos;m into fitness, music, sports and exploring new places
              </span>
            </li>
          </ul>
        </section>

        {/* Experience */}
        <section className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <Briefcase size={14} />
            <span>Work Experience</span>
          </h2>
          <div className="space-y-4">
            {experiences.map((experience) => (
              <div key={experience.id} className="group flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded bg-white border border-gray-200 p-1 flex items-center justify-center">
                    <Image
                      src={experience.image}
                      alt={experience.alt}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-0.5">
                    <h3 className="font-medium text-gray-900 text-sm">
                      <Link
                        href={experience.link}
                        target="_blank"
                        className="hover:underline hover:text-blue-600 transition-colors"
                      >
                        {experience.title}
                      </Link>
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap tabular-nums">
                      {experience.period}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-gray-500 mb-1.5">
                    {experience.organization}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {experience.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Open Source Contributions */}
        <section className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <Github size={14} />
            <span>Open Source</span>
          </h2>
          <div className="space-y-4">
            {openSourceContributions.map((contribution, index) => (
              <div key={index} className="group flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Github className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-0.5">
                    <a href={contribution.url} target="_blank" rel="noopener noreferrer">
                      {contribution.name}
                    </a>
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {contribution.description}
                    {contribution.articleURL && (
                      <>
                        {" "}
                        <a
                          href={contribution.articleURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 underline"
                        >
                          here
                        </a>
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Personal Projects */}
        <section className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <FolderGit2 size={14} />
            <span>Projects</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={project.link}
                target="_blank"
                className="group flex flex-col p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all h-full"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <FolderGit2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                </div>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed flex-grow">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-auto">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-medium border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 text-[10px] font-medium border border-gray-100">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <GraduationCap size={14} />
            <span>Education</span>
          </h2>
          <div className="group flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded bg-white border border-gray-200 p-1 flex items-center justify-center">
                <Image
                  src="/images/education/mcmaster.png"
                  alt="McMaster University"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-0.5">
                <h3 className="font-medium text-gray-900 text-sm">
                  <Link
                    href="https://www.mcmaster.ca/"
                    target="_blank"
                    className="hover:underline hover:text-blue-600 transition-colors"
                  >
                    Computer Science
                  </Link>
                </h3>
                <span className="text-xs text-gray-400 whitespace-nowrap tabular-nums">
                  Sept. 2024 - Apr. 2028
                </span>
              </div>
              <div className="text-xs font-medium text-gray-500 mb-1">
                McMaster University
              </div>
              <p className="text-xs text-gray-600">
                Dean&apos;s Honour List • GPA: 3.92 / 4.0
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* McMaster CS & SE Webring */}
      <div className="flex justify-between items-center mt-6 mb-4 max-w-2xl mx-auto px-4">
        <a
          href={`${WEBRING_URL}#${MY_SITE}?nav=prev`}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          style={{ textDecoration: "none" }}
          title="Previous site"
        >
          ← prev
        </a>
        <a
          href={`${WEBRING_URL}#${MY_SITE}?nav=next`}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          style={{ textDecoration: "none" }}
          title="Next site"
        >
          next →
        </a>
      </div>
    </div>
  );
}
