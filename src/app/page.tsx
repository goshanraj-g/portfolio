"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Mail, Linkedin } from "lucide-react";

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



/* ── Intersection observer for scroll reveal ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal-section ${visible ? "revealed" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Data ── */
const experiences = [
  {
    title: "Software Engineering Intern",
    org: "IBM",
    orgLink: "https://ibm.com/",
    image: "/images/experiences/ibm.svg",
    year: "01/26 - Present",
  },
  {
    title: "ML Research Assistant",
    org: "McMaster University",
    orgLink: "https://www.mcmaster.ca/",
    image: "/images/education/mcmaster.svg",
    year: "09/25 - 12/25",
  },
  {
    title: "Community Manager",
    org: "Google Developer Groups",
    orgLink: "https://gdg.community.dev/",
    image: "/images/experiences/gdsc.svg",
    year: "09/24-09/25",
  },
];

const openSource = [
  {
    name: "LlamaIndex",
    url: "https://github.com/run-llama/llama_index",
    description: "Integrated web tools for the agentic web",
    note: "5M+ monthly downloads",
  },
  {
    name: "Ruby",
    url: "https://github.com/ruby/ruby",
    description: "Optimized the new ZJIT compiler",
    descParts: { before: "Optimized the new ", highlight: "ZJIT", after: " compiler" },
    articleURL: "https://railsatscale.com/2025-12-24-launch-zjit/",
  },
];

const projects = [
  {
    title: "CampusThread",
    url: "https://campusthread.vercel.app/",
    description: "Agent-driven university Q&A for 250+ users",
  },
  {
    title: "LookAlive",
    url: "https://github.com/goshanraj-g/lookalive",
    description: "Real-time eye tracking for screen fatigue",
  },
  {
    title: "Terminal Chat",
    url: "https://github.com/goshanraj-g/terminal-chat",
    description: "Multithreaded TCP chat server from scratch",
  },
  {
    title: "CodeTurret",
    url: "https://github.com/goshanraj-g/CodeTurret",
    description: "Agents that scan & fix your code vulnerabilities",
    badge: "🏆 Hackathon Winner",
  },
];

/* ── Magnetic icon ── */
function MagneticIcon({
  children,
  href,
  label,
}: {
  children: React.ReactNode;
  href: string;
  label: string;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setOffset({ x: (e.clientX - cx) * 0.35, y: (e.clientY - cy) * 0.35 });
    },
    []
  );

  return (
    <Link
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      aria-label={label}
      className="social-icon"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: offset.x === 0 ? "transform 0.5s cubic-bezier(.22,1,.36,1)" : "none",
      }}
    >
      {children}
    </Link>
  );
}

/* ── Page ── */
export default function Page() {
  return <Portfolio />;
}

/* ── Portfolio ── */
function Portfolio() {
  return (
    <>
      {/* Ambient glow */}
      <div className="ambient-glow" />
      {/* Film grain */}
      <div className="grain-overlay" />
      {/* Grid lines */}
      <div className="grid-lines" />
      {/* Vignette */}
      <div className="vignette" />

      <main className="max-w-lg mx-auto px-6 py-20 relative z-10">
        {/* ── Header ── */}
        <RevealSection className="mb-3">
          <h1 className="name-heading">Goshanraj Govindaraj</h1>
        </RevealSection>

        <RevealSection className="mb-2">
          <p className="bio-text">
            <span className="glow-word" style={{ fontWeight: 600 }}>Computer Science</span>
            <span className="mcmaster-badge">
              <img
                src="/images/education/mcmaster.svg"
                alt="McMaster University"
                width={18}
                height={18}
                className="mcmaster-badge-icon"
              />
              McMaster University
            </span>
          </p>
        </RevealSection>

        <RevealSection className="mb-4" delay={100}>
          <p className="bio-text">
            Interested in building <span className="highlight-word">impactful</span> <span className="glow-word">software</span> and <span className="glow-word">agents</span>
          </p>
        </RevealSection>
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
        </RevealSection>

        {/* ── Projects ── */}
        <RevealSection className="mb-7" delay={250}>
          <h2 className="section-heading">Projects</h2>
          <div className="hover-group">
            {projects.map((p) => (
              <Link
                key={p.title}
                href={p.url}
                target="_blank"
                className="project-row"
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
                {p.badge && (
                  <span className="project-badge">{p.badge}</span>
                )}
              </Link>
            ))}
          </div>
        </RevealSection>

        {/* ── Open Source ── */}
        <RevealSection className="mb-5" delay={300}>
          <h2 className="section-heading">Open Source</h2>
          <div className="hover-group">
            {openSource.map((c) => (
              <div key={c.name} className="item-row oss-row">
                <div className="item-left">
                  <span className="item-org">{c.name}</span>
                  <span className="item-desc oss-desc">
                    {c.descParts ? (
                      <>
                        {c.descParts.before}
                        <Link href={c.articleURL} target="_blank" rel="noopener noreferrer" className="glow-link">{c.descParts.highlight}</Link>
                        {c.descParts.after}
                      </>
                    ) : (
                      c.description
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* ── Footer ── */}
        <RevealSection delay={350}>
          <div className="section-divider mb-6" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <MagneticIcon href="https://github.com/goshanraj-g" label="GitHub">
                <Github size={16} />
              </MagneticIcon>
              <MagneticIcon href="https://linkedin.com/in/goshanrajgovindaraj" label="LinkedIn">
                <Linkedin size={16} />
              </MagneticIcon>
              <MagneticIcon href="mailto:govindag@mcmaster.ca" label="Email">
                <Mail size={16} />
              </MagneticIcon>
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
