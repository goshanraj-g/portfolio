import Image from "next/image";
import Link from "next/link";
import {
  Github,
  Mail,
  Linkedin,
  ExternalLink,
  MapPin,
  Star,
} from "lucide-react";

const personalInfo = {
  name: "hey, I'm Gosh",
  title: "computer Science @ McMaster University",
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
];

const projects = [
  {
    id: 1,
    title: "Look Alive",
    description: "real-time eye tracking for screen fatigue prevention",
    tags: ["OpenCV", "Mediapipe", "Python"],
    link: "https://github.com/goshanraj-g/lookalive",
    image: "/images/projects/lookalive.png",
  },
  {
    id: 2,
    title: "Medinator", 
    description: "AI health assistant for lifestyle risk assessment",
    tags: ["Next.js", "Flask", "scikit-learn"],
    link: "https://github.com/goshanraj-g/medinator",
    image: "/images/projects/medinator-demo.png",
  },
  {
    id: 3,
    title: "Multi-threaded Terminal Chat App",
    description: "chat room written in C++17 on top of Winsock 2 using socket programming and multi-threading",
    tags: ["C++", "Multi-threading", "Socket Programming"],
    link: "https://github.com/goshanraj-g/terminal-chat",
    image: "/images/projects/terminal-chat.png",
  },
  {
    id: 4,
    title: "Trackie",
    description:
      "job application tracker with AI-powered NLP model for streamlined data entry",
    tags: ["TypeScript", "Next.js", "Spring Boot", "Python", "PostgreSQL"],
    link: "https://github.com/goshanraj-g/trackie",
    image: "/images/projects/trackie-preview.png",
  },
  {
    id: 5,
    title: "Gradely",
    description: "smart, interactive dashboard that helps students track their grades, set academic goals, and plan for success",
    tags: ["Next.js", "TailwindCSS", "React", "FastAPI", "PostgreSQL"],
    link: "https://github.com/goshanraj-g/gradely",
    image: "/images/projects/calculation-preview.png",
  },
  {
    id: 6,
    title: "FastFahr",
    description: "modern, purpose-built platform for buying and selling German cars with clean design, smooth experience",
    tags: ["React.js", "CSS", "PHP", "MySQL"],
    link: "https://github.com/goshanraj-g/fast-fahr",
    image: "/images/projects/fast-fahr.png",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              <div className="relative w-40 h-48 md:w-52 md:h-64 overflow-hidden rounded-lg">
                <Image
                  src="/images/profile-picture/profilepicture.JPG"
                  alt="Profile picture"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight font-mono">
                hey i'm gosh
              </h1>
              <p className="text-xl text-gray-300 mb-4">{personalInfo.title}</p>
              <p className="text-gray-400 mb-6">{personalInfo.bio}</p>
              
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-6">
                <MapPin size={16} />
                <span>{personalInfo.location}</span>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Link
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-2 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 px-3 py-2 rounded"
                >
                  <Mail size={16} />
                  Email
                </Link>
                <Link
                  href={`https://${personalInfo.github}`}
                  target="_blank"
                  className="flex items-center gap-2 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 px-3 py-2 rounded"
                >
                  <Github size={16} />
                  GitHub
                </Link>
                <Link
                  href={`https://${personalInfo.linkedin}`}
                  target="_blank"
                  className="flex items-center gap-2 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 px-3 py-2 rounded"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* About Me */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">About Me</h2>
          <ul className="space-y-2 text-gray-300">
            <li>→ currently doing research in sports analytics & data @ McMaster University</li>
            <li>→ studying computer science at McMaster University</li>
            <li>→ i'm into fitness, music, sports and exploring new places</li>
          </ul>
        </section>

        {/* Open Source Contributions */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Projects I've Contributed to</h2>
          <div className="border border-gray-700 rounded-lg p-6 bg-gray-900">
            {openSourceContributions.map((contribution, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <Link
                    href={contribution.url}
                    target="_blank"
                    className="text-gray-200 hover:text-white font-medium"
                  >
                    → {contribution.name}
                  </Link>
                  <span className="text-gray-400 ml-2">{contribution.description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Personal Projects */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Personal Projects</h2>
          <div className="grid gap-6">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-700 rounded-lg p-6 bg-gray-900">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-medium text-white">{project.title}</h3>
                  <Link
                    href={project.link}
                    target="_blank"
                    className="text-gray-300 hover:text-white"
                  >
                    <ExternalLink size={18} />
                  </Link>
                </div>
                <p className="text-gray-300 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-800 text-gray-300 text-sm rounded border border-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Experience</h2>
          <div className="space-y-4">
            <div className="border border-gray-700 rounded-lg p-6 bg-gray-900">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="relative w-12 h-12 rounded bg-gray-800 p-2">
                    <Image
                      src="/images/education/mcmaster.png"
                      alt="McMaster University"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-white">Associate Software Engineer</h3>
                  <p className="text-gray-400 mb-2">McMaster University • 2025 - Present</p>
                  <p className="text-gray-300">building machine learning models to predict and prevent athlete injuries 📊</p>
                </div>
              </div>
            </div>
            <div className="border border-gray-700 rounded-lg p-6 bg-gray-900">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="relative w-12 h-12 rounded bg-gray-800 p-2">
                    <Image
                      src="/images/experiences/gdsc.png"
                      alt="Google Developer Groups"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-white">Community Manager</h3>
                  <p className="text-gray-400 mb-2">Google Developer Groups • 2024 - 2025</p>
                  <p className="text-gray-300">leading and organizing tech workshops 🛠</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Education</h2>
          <div className="border border-gray-700 rounded-lg p-6 bg-gray-900">
            <h3 className="text-xl font-medium text-white">Computer Science</h3>
            <p className="text-gray-400 mb-2">McMaster University • September 2024 – Present</p>
            <div className="flex gap-4 text-sm">
              <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-600">Dean's Honour List</span>
              <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-600">GPA: 3.9 / 4.0</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
