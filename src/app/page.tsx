"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Mail, Linkedin, ExternalLink } from "lucide-react";

/* ── Text scramble hook ── */
const scrambleChars = "!@#$%^&*01";

function useScramble(text: string, speed = 35) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let frame = 0;
    const length = text.length;
    const total = length * 3;

    const interval = setInterval(() => {
      const revealed = Math.floor((frame / total) * length);
      let result = "";
      for (let i = 0; i < length; i++) {
        if (text[i] === " ") result += " ";
        else if (i < revealed) result += text[i];
        else result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      }
      setDisplay(result);
      frame++;
      if (frame > total) {
        setDisplay(text);
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { display, done };
}



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
    image: "/images/experiences/ibm.jpg",
    year: "2025",
  },
  {
    title: "ML Research Assistant",
    org: "McMaster University",
    orgLink: "https://www.mcmaster.ca/",
    image: "/images/education/mcmaster.png",
    year: "2024",
  },
  {
    title: "Community Manager",
    org: "Google Developer Groups",
    orgLink: "https://gdg.community.dev/",
    image: "/images/experiences/gdsc.png",
    year: "2024",
  },
];

const openSource = [
  {
    name: "LlamaIndex",
    url: "https://github.com/run-llama/llama_index",
    description: "Integrated web tools for the agentic web.",
    note: "5M+ monthly downloads",
    year: "2025",
  },
  {
    name: "Ruby",
    url: "https://github.com/ruby/ruby",
    description: "Optimized the new ZJIT compiler.",
    articleURL: "https://railsatscale.com/2025-12-24-launch-zjit/",
    year: "2025",
  },
];

const projects = [
  {
    title: "CampusThread",
    url: "https://campusthread.vercel.app/",
    description: "AI agents crowdsourcing university knowledge.",
    year: "2025",
  },
  {
    title: "Look Alive",
    url: "https://github.com/goshanraj-g/lookalive",
    description: "Real-time eye tracking for screen fatigue.",
    year: "2025",
  },
  {
    title: "CodeTurret",
    url: "https://github.com/goshanraj-g/CodeTurret",
    description: "Dual-pass AI that scans & fixes vulnerabilities.",
    year: "2024",
  },
  {
    title: "Terminal Chat",
    url: "https://github.com/goshanraj-g/terminal-chat",
    description: "Multi-threaded chat on Winsock 2 sockets.",
    year: "2024",
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

/* ── Streaming quote loader ── */
function useStreamingQuote(quote: string, speed = 40) {
  const words = quote.split(" ");
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (index >= words.length) {
      const timeout = setTimeout(() => setDone(true), 600);
      return () => clearTimeout(timeout);
    }
    const delay = speed + Math.random() * 30;
    const timeout = setTimeout(() => setIndex((i) => i + 1), delay);
    return () => clearTimeout(timeout);
  }, [index, words.length, speed]);

  return { text: words.slice(0, index).join(" "), done };
}

/* ── Page ── */
export default function Page() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const { text: quoteText, done: quoteDone } = useStreamingQuote(
    "Action is the foundational key to all success."
  );

  useEffect(() => {
    if (quoteDone) {
      setFadeOut(true);
      const timeout = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [quoteDone]);

  if (loading) {
    return (
      <div className={`loading-screen ${fadeOut ? "fade-out" : ""}`}>
        <p className="loading-quote">
          {quoteText}
          {!quoteDone && <span className="stream-cursor">|</span>}
        </p>
      </div>
    );
  }

  return <Portfolio />;
}

/* ── Portfolio ── */
function Portfolio() {
  const { display: nameText, done: nameDone } = useScramble("Goshanraj Govindaraj", 10);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* Ambient glow */}
      <div className="ambient-glow" />
      {/* Film grain */}
      <div className="grain-overlay" />

      <main className="max-w-lg mx-auto px-6 py-20 relative z-10">
        {/* ── Header ── */}
        <RevealSection className="mb-3">
          <h1 className={`name-heading ${!nameDone ? "cursor-blink" : ""}`}>
            {mounted ? nameText : "Goshanraj Govindaraj"}
          </h1>
        </RevealSection>

        <RevealSection className="mb-4" delay={100}>
          <p className="bio-text">
            Interested in building <span className="highlight-word">impactful</span> software and agents
          </p>
        </RevealSection>

        {/* ── Work ── */}
        <RevealSection className="mb-12" delay={200}>
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
                    width={18}
                    height={18}
                    className="inline-img"
                    style={{ margin: 0 }}
                  />
                  <span className="item-org">{exp.org}</span>
                  <span className="item-title">{exp.title}</span>
                </div>
                <span className="item-year">{exp.year}</span>
              </Link>
            ))}
          </div>
        </RevealSection>

        {/* ── Projects ── */}
        <RevealSection className="mb-12" delay={250}>
          <h2 className="section-heading">Projects</h2>
          <div className="hover-group">
            {projects.map((p) => (
              <Link
                key={p.title}
                href={p.url}
                target="_blank"
                className="project-row"
              >
                <span className="project-title">{p.title}</span>
                <span className="project-desc">{p.description}</span>
                <span className="project-year">{p.year}</span>
              </Link>
            ))}
          </div>
        </RevealSection>

        {/* ── Open Source ── */}
        <RevealSection className="mb-14" delay={300}>
          <h2 className="section-heading">Open Source</h2>
          <div className="hover-group">
            {openSource.map((c) => (
              <div key={c.name} className="item-row">
                <div className="item-left">
                  <span className="item-org">{c.name}</span>
                  <span className="item-desc">{c.description}</span>
                  <Link href={c.url} target="_blank" className="inline-icon">
                    <Github size={13} />
                  </Link>
                  {c.articleURL && (
                    <Link href={c.articleURL} target="_blank" className="inline-icon">
                      <ExternalLink size={12} />
                    </Link>
                  )}
                </div>
                <span className="item-year">{c.year}</span>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* ── Footer ── */}
        <RevealSection delay={350}>
          <div className="section-divider mb-6" />
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
        </RevealSection>
      </main>
    </>
  );
}
