"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Mail, Linkedin } from "lucide-react";

const WEBRING_URL = "https://mac-csse-webring.vercel.app/";
const MY_SITE = "goshanraj.ca";

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
    badge: "\ud83c\udfc6 Hackathon Winner",
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

        {/* ── Work ── */}
        <RevealSection className="mb-7" delay={200}>
          <h2 className="section-heading">Work</h2>
          <div className="hover-group">
            {experiences.map((exp) => (
              <Link
                key={exp.org}
                href={exp.orgLink}
                target="_blank"
                className="item-row"
              >
                <div className="item-left">
                  <Image
                    src={exp.image}
                    alt={exp.org}
                    width={24}
                    height={24}
                    className="inline-img"
                    style={{ margin: 0, objectFit: "cover", borderRadius: 3 }}
                  />
                  <span className="item-org">{exp.org}</span>
                  <span className="item-title">{exp.title}</span>
                  <span className="item-year mobile-year">{exp.year}</span>
                </div>
                <span className="item-year desktop-year">{exp.year}</span>
              </Link>
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
                <div className="project-left">
                  <span className="project-title">{p.title}</span>
                  <span className="project-desc">{p.description}</span>
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
            <div className="webring">
              <a href={`${WEBRING_URL}#${MY_SITE}?nav=prev`} title="Previous site" className="webring-arrow">&larr;</a>
              <a href={WEBRING_URL} target="_blank" rel="noopener noreferrer" title="McMaster CS & SE Webring" className="webring-logo">
                <Image src="https://www.macwebring.xyz/assets/icons/icon.black.svg" alt="McMaster CS & SE Webring" width={20} height={20} unoptimized />
              </a>
              <a href={`${WEBRING_URL}#${MY_SITE}?nav=next`} title="Next site" className="webring-arrow">&rarr;</a>
            </div>
          </div>
        </RevealSection>
      </main>
    </>
  );
}
