"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Github,
  Mail,
  Linkedin,
  ExternalLink,
  ArrowUpRight,
  Briefcase,
  Calendar,
  FileText,
  BookOpen,
  Code,
  Monitor,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const personalInfo = {
  name: "Goshanraj Govindaraj",
  title: "Computer Science Student @ McMaster University",
  bio: "focused on building meaningful products with impact",
  email: "govindag@mcmaster.ca",
  github: "github.com/goshanraj-g",
  linkedin: "linkedin.com/in/goshanrajgovindaraj",
  location: "Toronto, ON",
};

const projects = [
  {
    id: 1,
    title: "Trackie",
    description:
      "Ditch the job hunt clutter! Trackie is a smarter way to manage applications, stay organized, and land your next role, all from one clean, interactive dashboard. It features a custom AI-powered NLP model to streamline data entry and a sleek, intuitive UI so you can finally say goodbye to spreadsheets!",
    tags: [
      "Typescript",
      "Next.js",
      "TailwindCSS",
      "React",
      "Java",
      "Spring Boot",
      "AWS",
      "Python",
      "spaCy",
      "FastAPI",
      "PostgreSQL",
    ],
    link: "https://github.com/goshanraj-g/trackie",
    image: "/images/projects/trackie-preview.png",
    featured: true,
  },
  {
    id: 3,
    title: "Gradely",
    description:
      "Skip the spreadsheets, Gradely is a smart, interactive dashboard that helps students track their grades, set academic goals, and plan for success, all in one place",
    tags: ["Next.js", "TailwindCSS", "React", "FastAPI", "PostgreSQL"],
    link: "https://github.com/goshanraj-g/gradely",
    image: "/images/projects/calculation-preview.png",
    featured: false,
  },
  {
    id: 2,
    title: "Multi-threaded Terminal Chat App",
    description:
      "A chat room written in C++17 on top of Winsock 2 using socket programming and multi-threading",
    tags: ["C++", "Multi-threading", "Socket Programming"],
    link: "https://github.com/goshanraj-g/terminal-chat",
    image: "/images/projects/terminal-chat.png",
    featured: false,
  },
  {
    id: 4,
    title: "FastFahr",
    description:
      "A modern, purpose-built platform for buying and selling German cars with clean design, smooth experience",
    tags: ["React.js", "CSS", "PHP", "MySQL"],
    link: "https://github.com/goshanraj-g/fast-fahr",
    image: "/images/projects/fast-fahr.png",
    featured: false,
  },
];

const experiences = [
  {
    id: 1,
    company: "Google Developer Groups",
    role: "Community and Code Ambassador",
    period: "2024 - Present",
    description:
      "Organized and led high-impact tech events and workshops, driving 30% growth in community engagement and reaching 100+ attendees per session",
    image: "/images/experiences/gdsc.png",
  },
];

export default function Page() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <>
      <div className="min-h-screen bg-black text-gray-200 pb-20">
        <div className="fixed inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black -z-10 pointer-events-none"></div>
        <div className="fixed w-96 h-96 rounded-full bg-purple-700/15 blur-3xl top-0 -right-48 -z-10 pointer-events-none"></div>
        <div className="fixed w-96 h-96 rounded-full bg-purple-800/10 blur-3xl -bottom-20 -left-48 -z-10 pointer-events-none"></div>

        <header className="container mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
                <div className="relative w-40 h-48 md:w-48 md:h-64 overflow-hidden rounded-xl shadow-xl">
                  <Image
                    src="/images/profile-picture/profilepicture.png"
                    alt="Profile picture"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/3 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {personalInfo.name}
              </h1>
              <p className="text-xl text-purple-300 mb-4 font-medium">
                {personalInfo.title}
              </p>
              <p className="max-w-xl text-gray-300 leading-relaxed mb-6">
                {personalInfo.bio}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                <Link
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-gray-200 hover:text-white transition-all"
                >
                  <Mail size={16} className="text-purple-400" />
                  <span>{personalInfo.email}</span>
                </Link>
                <Link
                  href={`https://${personalInfo.github}`}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-gray-200 hover:text-white transition-all"
                >
                  <Github size={16} className="text-purple-400" />
                  GitHub
                </Link>
                <Link
                  href={`https://${personalInfo.linkedin}`}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-gray-200 hover:text-white transition-all"
                >
                  <Linkedin size={16} className="text-purple-400" />
                  LinkedIn
                </Link>
                <Link
                  href={`/resume.pdf`}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-gray-200 hover:text-white transition-all"
                >
                  <FileText size={16} className="text-purple-400" />
                  Resume
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6">
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-8">
              <Monitor className="text-purple-400 w-6 h-6" />
              <h2 className="text-3xl font-bold text-white">
                Featured Project
              </h2>
            </div>
            <div className="space-y-16">
              {projects
                .filter((project) => project.featured)
                .map((project) => (
                  <div
                    key={project.id}
                    className="grid md:grid-cols-2 gap-8 items-start"
                  >
                    <Link href={project.link} className="group block">
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="relative w-[318px] h-[312px] sm:w-[380px] sm:h-[372px] md:w-[440px] md:h-[432px] lg:w-[480px] lg:h-[472px] xl:w-[500px] xl:h-[475px] group transform transition-transform duration-500 ease-out hover:scale-[1.015]">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg blur opacity-30 group-hover:opacity-70 transition-opacity duration-500 ease-in-out" />
                            <div className="relative w-full h-full">
                              <Image
                                src="/images/projects/trackie-preview.png"
                                alt="Trackie preview"
                                fill
                                priority
                                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 635px"
                                className="object-cover rounded"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="flex flex-col justify-center max-w-3xl">
                      <h3 className="text-4xl font-bold text-white mb-4 tracking-tight">
                        {project.title}
                      </h3>

                      <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Link
                        href={project.link}
                        className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium transition group"
                      >
                        View Project
                        <ArrowUpRight
                          size={16}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          <section className="mb-24">
            <div className="flex items-center gap-3 mb-8">
              <Code className="text-purple-400 w-6 h-6" />
              <h2 className="text-3xl font-bold text-white">Other Projects</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects
                .filter((project) => !project.featured)
                .map((project) => (
                  <Card
                    key={project.id}
                    className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 hover:border-gray-700 transition-colors group overflow-hidden"
                  >
                    <div className="relative w-full h-100">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl text-white group-hover:text-purple-200 transition-colors">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-4">
                        {project.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="bg-gray-800 text-gray-300 border-gray-700 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href={project.link}
                        className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 group/link"
                      >
                        <ExternalLink
                          size={14}
                          className="mr-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                        />
                        View Project
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </section>

          <section className="mb-24">
            <div className="flex items-center gap-3 mb-12">
              <Briefcase className="text-purple-400 w-6 h-6" />
              <h2 className="text-3xl font-bold text-white">Experience</h2>
            </div>

            <div className="relative">
              <div className="absolute left-0 md:left-40 top-0 bottom-0 w-px bg-gray-700/70"></div>

              <div className="space-y-16">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative flex flex-col md:flex-row gap-6 pl-8 md:pl-0"
                  >
                    <div className="flex flex-row md:flex-col items-center md:w-40 space-y-3">
                      <div className="absolute left-0 md:left-40 transform -translate-x-1/2 mt-1">
                        <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                      </div>

                      <div className="flex items-center text-sm text-purple-200 font-medium">
                        <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                        <span>{exp.period}</span>
                      </div>

                      {exp.image && (
                        <div className="hidden md:block">
                          <div className="relative w-16 h-16">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-md blur opacity-30"></div>
                            <div className="relative w-full h-full rounded-md overflow-hidden border border-gray-700 bg-gray-800/70 p-1">
                              <Image
                                src={exp.image}
                                alt={exp.company}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 group">
                      <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-purple-200 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-purple-300 mb-4 font-medium">
                        {exp.company}
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-32">
            <div className="flex items-center gap-3 mb-12">
              <BookOpen className="text-purple-400 w-6 h-6" />
              <h2 className="text-4xl font-bold text-white tracking-tight">
                Education
              </h2>
            </div>

            <div className="space-y-12">
              <div className="relative group transition-all">
                {/* Subtle glow effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>

                <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 border border-gray-800 group-hover:border-gray-700 shadow-md group-hover:shadow-purple-900/20 transition-all duration-300">
                  <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                      <div className="flex flex-col space-y-6">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12">
                            <Image
                              src="/images/education/mcmaster.png"
                              alt="McMaster University"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <h4 className="text-purple-300 text-lg font-medium">
                            McMaster University
                          </h4>
                        </div>

                        <div className="text-sm text-purple-300 font-medium flex items-center justify-start">
                          <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                          <span>September 2024 – Present</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-3">
                      <h3 className="text-2xl font-semibold text-white mb-6">
                        Computer Science
                      </h3>

                      <div className="mb-6">
                        <div className="flex items-center mb-3">
                          <div className="w-1 h-5 bg-purple-500 rounded-full mr-3"></div>
                          <h5 className="text-white font-medium">
                            Relevant Coursework
                          </h5>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4">
                          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50 hover:border-purple-500/30 transition-all">
                            <span className="text-purple-300 font-medium block mb-1">
                              Introduction to Web Development
                            </span>
                            <span className="text-sm text-gray-300">
                              HTML, CSS, JS, PHP, SQL
                            </span>
                          </div>

                          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50 hover:border-purple-500/30 transition-all">
                            <span className="text-purple-300 font-medium block mb-1">
                              Introduction to Development Basics
                            </span>
                            <span className="text-sm text-gray-300">
                              C, Linux
                            </span>
                          </div>

                          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50 hover:border-purple-500/30 transition-all">
                            <span className="text-purple-300 font-medium block mb-1">
                              Introduction to Computational Thinking
                            </span>
                            <span className="text-sm text-gray-300">
                              Haskell
                            </span>
                          </div>

                          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50 hover:border-purple-500/30 transition-all">
                            <span className="text-purple-300 font-medium block mb-1">
                              Introduction to Programming
                            </span>
                            <span className="text-sm text-gray-300">
                              Python
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center bg-purple-900/10 rounded-lg px-4 py-2 border border-purple-500/20">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                          <span className="text-white text-sm font-medium">
                            Dean&apos;s Honour List
                          </span>
                        </div>

                        <div className="flex items-center bg-purple-900/10 rounded-lg px-4 py-2 border border-purple-500/20">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                          <span className="text-white text-sm font-medium">
                            GPA:{" "}
                            <span className="text-purple-300">3.9 / 4.0</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="container mx-auto px-6 mt-16 text-center">
            <Separator className="bg-gray-800 mb-8" />
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="text-blue-400 w-4 h-4 mr-2" />
              <p className="text-gray-300 text-sm">
                © {new Date().getFullYear()} {"Goshanraj Govindaraj"}
              </p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
