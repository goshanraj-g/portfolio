import Image from "next/image";
import Link from "next/link";
import { Github, Mail, Linkedin, MapPin, FolderGit2 } from "lucide-react";

const personalInfo = {
  name: "hey, I&apos;m Gosh!",
  title: "computer science @ McMaster University",
  bio: "interested in software development and machine learning",
  email: "govindag@mcmaster.ca",
  github: "github.com/goshanraj-g",
  linkedin: "linkedin.com/in/goshanrajgovindaraj",
  location: "Toronto, ON",
};

const openSourceContributions = [
  {
    name: "LlamaIndex",
    description: "~5 million downloads/month",
    url: "https://github.com/run-llama/llama_index",
    stats: "5M+ monthly downloads",
  },
  {
    name: "Ruby",
    description: "Powers Shopify, GitHub, Airbnb, and more",
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
    description: "skills network 🧠",
    image: "/images/experiences/ibm.png",
    alt: "IBM",
    link: "https://ibm.com/",
  },
  {
    id: 2,
    title: "Machine Learning Research Assistant",
    organization: "McMaster University",
    period: "Aug. 2025 - Present",
    description:
      "building machine learning models to predict and prevent athlete injuries 📊",
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
    title: "Trackie",
    description:
      "job application tracker with AI-powered NLP model for streamlined data entry",
    tags: ["TypeScript", "Next.js", "Spring Boot", "Python", "PostgreSQL"],
    link: "https://github.com/goshanraj-g/trackie",
    image: "/images/projects/trackie-preview.png",
  },
  {
    id: 6,
    title: "Gradely",
    description:
      "smart, interactive dashboard that helps students track their grades, set academic goals, and plan for success",
    tags: ["Next.js", "TailwindCSS", "React", "FastAPI", "PostgreSQL"],
    link: "https://github.com/goshanraj-g/gradely",
    image: "/images/projects/calculation-preview.png",
  },
  {
    id: 7,
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
    <div className="min-h-screen text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              <div className="relative w-40 h-48 md:w-52 md:h-64 overflow-hidden rounded-2xl shadow-lg ring-1 ring-gray-900/5">
                <Image
                  src="/images/profile-picture/profilepicture.JPG"
                  alt="Profile picture"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">
                hey, i&apos;m gosh!
              </h1>
              <p className="text-xl text-gray-600 mb-3">{personalInfo.title}</p>
              <p className="text-gray-500 mb-6 leading-relaxed">
                {personalInfo.bio}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-6 text-sm">
                <MapPin size={14} className="text-gray-400" />
                <span>{personalInfo.location}</span>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Link
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow"
                >
                  <Mail size={16} />
                  <span className="text-sm font-medium">Email</span>
                </Link>
                <Link
                  href={`https://${personalInfo.github}`}
                  target="_blank"
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow"
                >
                  <Github size={16} />
                  <span className="text-sm font-medium">GitHub</span>
                </Link>
                <Link
                  href={`https://${personalInfo.linkedin}`}
                  target="_blank"
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow"
                >
                  <Linkedin size={16} />
                  <span className="text-sm font-medium">LinkedIn</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* About Me */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-5 text-gray-900">
            About Me
          </h2>
          <ul className="space-y-3 text-gray-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">→</span>
              <span>
                currently doing research in sports analytics & data @ McMaster
                University
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">→</span>
              <span>studying computer science at McMaster University</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">→</span>
              <span>
                i&apos;m into fitness, music, sports and exploring new places
              </span>
            </li>
          </ul>
        </section>

        {/* Experience */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-5 text-gray-900">
            Experience
          </h2>
          <div className="space-y-6">
            {experiences.map((experience) => (
              <div key={experience.id} className="group flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 p-1.5 flex items-center justify-center group-hover:shadow transition-shadow">
                    <Image
                      src={experience.image}
                      alt={experience.alt}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg mb-2">
                    <Link
                      href={experience.link}
                      target="_blank"
                      className="text-gray-900 font-medium underline decoration-gray-300 decoration-2 underline-offset-4 hover:decoration-blue-500 hover:text-blue-600 transition-all"
                    >
                      {experience.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-2 leading-relaxed">
                    {experience.description}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {experience.organization} • {experience.period}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Open Source Contributions */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-5 text-gray-900">
            Projects I&apos;ve Contributed to
          </h2>
          <div className="space-y-5">
            {openSourceContributions.map((contribution, index) => (
              <div key={index} className="group flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Github className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg mb-2">
                    <Link
                      href={contribution.url}
                      target="_blank"
                      className="text-gray-900 font-medium underline decoration-gray-300 decoration-2 underline-offset-4 hover:decoration-blue-500 hover:text-blue-600 transition-all"
                    >
                      {contribution.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {contribution.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Personal Projects */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-5 text-gray-900">
            Personal Projects
          </h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="group flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <FolderGit2 className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg mb-2">
                    <Link
                      href={project.link}
                      target="_blank"
                      className="text-gray-900 font-medium underline decoration-gray-300 decoration-2 underline-offset-4 hover:decoration-blue-500 hover:text-blue-600 transition-all"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    {project.description}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {project.tags.join(" • ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-5 text-gray-900">
            Education
          </h2>
          <div className="group flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 p-1.5 flex items-center justify-center group-hover:shadow transition-shadow">
                <Image
                  src="/images/education/mcmaster.png"
                  alt="McMaster University"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg mb-2">
                <Link
                  href="https://www.mcmaster.ca/"
                  target="_blank"
                  className="text-gray-900 font-medium underline decoration-gray-300 decoration-2 underline-offset-4 hover:decoration-blue-500 hover:text-blue-600 transition-all"
                >
                  Computer Science
                </Link>
              </h3>
              <p className="text-gray-600 mb-2 leading-relaxed">
                McMaster University • Sept. 2024 - Apr. 2028
              </p>
              <p className="text-gray-500 text-sm">
                Dean&apos;s Honour List • GPA: 3.92 / 4.0
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
