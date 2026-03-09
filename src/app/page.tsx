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

/* ── Cursor glow hook ── */
function useCursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      el.style.setProperty("--gx", `${e.clientX}px`);
      el.style.setProperty("--gy", `${e.clientY}px`);
      el.style.opacity = "1";
    };
    const leave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  return ref;
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
    description: "building the tools that teach the world",
    image: "/images/experiences/ibm.png",
  },
  {
    title: "ML Research Assistant",
    org: "McMaster University",
    orgLink: "https://www.mcmaster.ca/",
    description: "building models to predict and prevent athlete injuries",
    image: "/images/education/mcmaster.png",
  },
  {
    title: "Community Manager",
    org: "Google Developer Groups",
    orgLink: "https://gdg.community.dev/",
    description: "leading and organizing tech workshops",
    image: "/images/experiences/gdsc.png",
  },
];

const openSource = [
  {
    name: "LlamaIndex",
    url: "https://github.com/run-llama/llama_index",
    description: "integrated web tools for agentic web",
    note: "5M+ monthly downloads",
  },
  {
    name: "Ruby",
    url: "https://github.com/ruby/ruby",
    description: "optimized the new ZJIT compiler",
    articleURL: "https://railsatscale.com/2025-12-24-launch-zjit/",
  },
];

const projects = [
  {
    title: "CampusThread",
    url: "https://campusthread.vercel.app/",
    description: "AI agents crowdsourcing university knowledge for 100+ students",
  },
  {
    title: "Look Alive",
    url: "https://github.com/goshanraj-g/lookalive",
    description: "real-time eye tracking for screen fatigue prevention",
  },
  {
    title: "CodeTurret",
    url: "https://github.com/goshanraj-g/CodeTurret",
    description: "automated security architect — dual-pass AI that scans & auto-fixes vulnerabilities",
  },
  {
    title: "Terminal Chat",
    url: "https://github.com/goshanraj-g/terminal-chat",
    description: "multi-threaded chat room built in C++ on Winsock 2 sockets",
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
  const { display: nameText, done: nameDone } = useScramble("goshanraj govindaraj");
  const glowRef = useCursorGlow();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen relative">
      {/* cursor glow */}
      <div ref={glowRef} className="cursor-glow" />

      <main className="max-w-xl mx-auto px-6 pt-20 pb-16 relative z-10">
        {/* ── Name ── */}
        <RevealSection className="mb-3">
          <h1 className={`name-heading ${!nameDone ? "cursor-blink" : ""}`}>
            {mounted ? nameText : "goshanraj govindaraj"}
          </h1>
        </RevealSection>

        <RevealSection className="mb-12" delay={100}>
          <p className="text-sm text-white/25 leading-relaxed max-w-sm">
            interested in building software and AI agents.
          </p>
        </RevealSection>

        {/* ── Education ── */}
        <RevealSection className="mb-10">
          <h2 className="section-heading">education</h2>
          <div className="entry-main">
            <span className="entry-text">
              CS{" "}
              <Link href="https://www.mcmaster.ca/" target="_blank" className="org-link">
                @McMaster University
              </Link>
              <Image
                src="/images/education/mcmaster.png"
                alt="McMaster"
                width={18}
                height={18}
                className="inline-img"
              />
            </span>
          </div>
        </RevealSection>

        {/* ── Work ── */}
        <RevealSection className="mb-10">
          <h2 className="section-heading">work</h2>
          <div className="space-y-2">
            {experiences.map((exp) => (
              <div key={exp.org} className="entry-main">
                <span className="entry-text">
                  {exp.title}{" "}
                  <Link href={exp.orgLink} target="_blank" className="org-link">
                    @{exp.org}
                  </Link>
                  <Image
                    src={exp.image}
                    alt={exp.org}
                    width={18}
                    height={18}
                    className="inline-img"
                  />
                </span>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* ── Open Source ── */}
        <RevealSection className="mb-10">
          <h2 className="section-heading">open source</h2>
          <div className="space-y-3">
            {openSource.map((c) => (
              <div key={c.name} className="entry-row">
                <div className="entry-main">
                  <span className="entry-text">{c.name}</span>
                  <Link href={c.url} target="_blank" className="inline-icon">
                    <Github size={13} />
                  </Link>
                  {c.articleURL && (
                    <Link href={c.articleURL} target="_blank" className="inline-icon">
                      <ExternalLink size={12} />
                    </Link>
                  )}
                </div>
                <p className="entry-desc">
                  {c.description}
                  {c.note && <span className="text-white/12"> &middot; {c.note}</span>}
                </p>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* ── Projects ── */}
        <RevealSection className="mb-14">
          <h2 className="section-heading">projects</h2>
          <div className="space-y-1">
            {projects.map((p) => (
              <Link
                key={p.title}
                href={p.url}
                target="_blank"
                className="project-row group"
              >
                <div className="project-row-inner">
                  <span className="project-title">{p.title}</span>
                  <span className="project-dash" />
                  <span className="project-desc">{p.description}</span>
                  <span className="project-arrow">&#8599;</span>
                </div>
              </Link>
            ))}
          </div>
        </RevealSection>

        {/* ── Footer ── */}
        <RevealSection>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <MagneticIcon href="https://github.com/goshanraj-g" label="GitHub">
                <Github size={17} />
              </MagneticIcon>
              <MagneticIcon href="https://linkedin.com/in/goshanrajgovindaraj" label="LinkedIn">
                <Linkedin size={17} />
              </MagneticIcon>
              <MagneticIcon href="mailto:govindag@mcmaster.ca" label="Email">
                <Mail size={17} />
              </MagneticIcon>
            </div>
          </div>
        </RevealSection>
      </main>
    </div>
  );
}
