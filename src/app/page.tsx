"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, Github, Mail, Linkedin } from "lucide-react";
import AsciiForest from "@/components/ascii-forest";
import Campfire from "@/components/campfire";
import Moon, { type Sky } from "@/components/moon";
import Stars from "@/components/stars";
import Clouds from "@/components/clouds";
import "./portfolio.css";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observers: IntersectionObserver[] = [];
    const show = () => {
      setShown(true);
      observers.forEach((o) => o.disconnect());
    };

    observers = [
      // Reveal after the section enters the viewport.
      new IntersectionObserver(([e]) => e.isIntersecting && show(), {
        threshold: 0,
        rootMargin: "0px 0px -14% 0px",
      }),
      // Fallback for the final block, which may never cross the root margin.
      new IntersectionObserver(([e]) => e.isIntersecting && show(), { threshold: 1 }),
    ];

    observers.forEach((o) => o.observe(el));
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div ref={ref} className={`reveal ${shown ? "shown" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

type Thread = { label: string; body: string };

const threads: Thread[] = [
  {
    label: "agents",
    body:
      "built web agents, code agents, voice agents, ERP agents and content agents",
  },
  {
    label: "media",
    body:
      "built an AI video dubber from scratch, worked with video processing, and improved media pipelines through GPU integration",
  },
  {
    label: "full stack",
    body:
      "shipped end-to-end products & features used by thousands",
  },
];

type Experience = {
  title: string;
  org: string;
  orgLink?: string;
  image?: string;
  plate?: string;
  year: string;
};

const experiences: Experience[] = [
  { title: "Software Engineering Intern", org: "IBM", orgLink: "https://ibm.com/", image: "/images/experiences/ibm.svg", year: "01/26 — Present" },
  { title: "Machine Learning Research Assistant", org: "McMaster University", orgLink: "https://www.mcmaster.ca/", image: "/images/education/mcmaster.svg", year: "09/25 — 12/25" },
  // Matches the background of the TOConnect artwork.
  { title: "Software Engineering Intern", org: "TOConnect", orgLink: "https://toconnect.ca/", image: "/images/experiences/TOConnect.jpg", plate: "#FFCF25", year: "05/25 — 08/25" },
  { title: "Community Manager", org: "Google Developer Groups", orgLink: "https://gdg.community.dev/", image: "/images/experiences/gdsc.svg", year: "09/24 — 09/25" },
];

type Project = { title: string; description: string; url?: string; badge?: string };

const projects: Project[] = [
  {
    title: "Agentic Manufacturing Scheduler",
    url: "https://github.com/goshanraj-g/forge",
    description: "a scheduling tool for factories that predicts and prevents late orders",
  },
  {
    title: "AI Web Monitor",
    url: "https://github.com/goshanraj-g/vigil",
    description: "tracks topics you care about and delivers summarized web updates straight to Slack",
  },
  {
    title: "AI Repository Auditor",
    url: "https://github.com/goshanraj-g/CodeTurret",
    description: "an agent that audits projects and opens fix PRs",
    badge: "🏆 Hackathon Winner",
  },
  {
    title: "CampusThread",
    url: "https://campusthread.vercel.app/",
    description: "an RAG chatbot for 250+ university students",
  },
];

type OSS = {
  name: string;
  url: string;
  description?: string;
  before?: string;
  link?: string;
  after?: string;
  meta?: string;
};

const openSource: OSS[] = [
  {
    name: "LlamaIndex",
    url: "https://github.com/run-llama/llama_index",
    description: "Tavily and Parallel integrations for agent web access",
  },
  {
    name: "Ruby",
    url: "https://railsatscale.com/2025-12-24-launch-zjit/",
    before: "Batched array pushes into one allocation in ",
    link: "ZJIT",
    after: "",
  },
  {
    name: "Shopify",
    url: "https://github.com/Shopify/type_toolkit",
    description: "Fixed a runtime inheritance conflict in Type Toolkit",
  },
];

type Book = { title: string; author: string };

const books: Book[] = [
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann" },
  { title: "Inference Engineering", author: "Philip Kiely" },
  { title: "Discourses and Selected Writings", author: "Epictetus" },
];

// Must match the section ids below.
const panels = [
  { id: "top", label: "Intro" },
  { id: "about", label: "About Me" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "open-source", label: "Open Source" },
  { id: "reading", label: "Reading" },
];

function SectionHead({ title }: { title: string }) {
  return <h2 className="section-title">{title}</h2>;
}

function SocialBar() {
  return (
    <div className="social-bar">
      <div className="panel-foot">
        <div className="socials">
          <Link href="https://github.com/goshanraj-g" target="_blank" aria-label="GitHub">
            <Github />
          </Link>
          <Link href="https://linkedin.com/in/goshanrajgovindaraj" target="_blank" aria-label="LinkedIn">
            <Linkedin />
          </Link>
          <Link href="mailto:govindag@mcmaster.ca" aria-label="Email">
            <Mail />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScrollRail() {
  const [active, setActive] = useState(panels[0].id);

  useEffect(() => {
    // The panel crossing the viewport midpoint owns the rail.
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    for (const p of panels) {
      const el = document.getElementById(p.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);

  const atStart = active === panels[0].id;
  const atEnd = active === panels[panels.length - 1].id;

  return (
    <nav className="rail" aria-label="Sections">
      {/* Keep arrows mounted so the rail does not shift between panels. */}
      <span className={`rail-hint up ${atStart ? "spent" : ""}`} aria-hidden="true">
        <ChevronUp size={15} strokeWidth={1.5} />
      </span>

      {panels.map((p) => (
        <a
          key={p.id}
          href={`#${p.id}`}
          aria-label={p.label}
          aria-current={active === p.id ? "true" : undefined}
        >
          <span className="rail-tick" />
        </a>
      ))}

      <span className={`rail-hint down ${atEnd ? "spent" : ""}`} aria-hidden="true">
        <ChevronDown size={15} strokeWidth={1.5} />
      </span>
    </nav>
  );
}

export default function PortfolioPage() {
  const [sky, setSky] = useState<Sky>("night");

  return (
    <div className="portfolio" data-theme={sky === "day" ? "day" : undefined}>
      {/* Sky paints behind the forest. */}
      {sky === "night" ? <Stars /> : <Clouds />}
      <Moon sky={sky} onToggle={() => setSky((s) => (s === "day" ? "night" : "day"))} />
      <AsciiForest sky={sky} />
      <div className="scrim" />
      <Campfire sky={sky} />
      <ScrollRail />
      <SocialBar />

      <div className="shell">
        <header className="hero" id="top">
          <Reveal>
            <h1 className="name">Goshanraj Govindaraj</h1>
          </Reveal>

          <Reveal delay={80}>
            <div className="role">
              <span>Computer Science</span>
              <Link href="https://www.mcmaster.ca/" target="_blank" className="chip">
                <Image src="/images/education/mcmaster.svg" alt="" width={15} height={15} />
                McMaster University
              </Link>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <p className="thesis">
              I build <em>agents</em>, plus the full stack they run on
            </p>
          </Reveal>
        </header>

        <section className="section" id="about">
          <Reveal>
            <SectionHead title="About Me" />
            <p className="lead lead-into">
              Software Engineer, studying Computer Science at McMaster University,
              currently at <strong>IBM</strong>. Most of my work has revolved around a few threads:
            </p>
            <div className="threads">
              {threads.map((t) => (
                <div key={t.label} className="thread">
                  <div className="thread-label">{t.label}</div>
                  <p className="thread-body">{t.body}</p>
                </div>
              ))}
            </div>
            <p className="thread-body hobbies-line">outside of tech, you’ll find me reading, at the gym, around cars, or travelling</p>
          </Reveal>
        </section>

        <section className="section" id="work">
          <Reveal>
            <SectionHead title="Work" />
            <div className="rows rows-work">
              {experiences.map((e) => {
                const inner = (
                  <>
                    <div className="row-main">
                      {e.image ? (
                        <Image
                          src={e.image}
                          alt=""
                          width={44}
                          height={44}
                          className={`row-logo${e.plate ? " row-logo-bleed" : ""}`}
                          style={e.plate ? { background: e.plate } : undefined}
                        />
                      ) : (
                        <span className="row-logo row-logo-mono" aria-hidden="true">
                          {e.org[0]}
                        </span>
                      )}
                      <span className="row-text">
                        <span className="row-name">{e.org}</span>
                        <span className="row-sub">{e.title}</span>
                      </span>
                    </div>
                    <span className="row-meta">{e.year}</span>
                  </>
                );
                return e.orgLink ? (
                  <Link key={e.org} href={e.orgLink} target="_blank" className="row">
                    {inner}
                  </Link>
                ) : (
                  <div key={e.org} className="row">
                    {inner}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </section>

        <section className="section" id="projects">
          <Reveal>
            <SectionHead title="Projects" />
            <div className="rows">
              {projects.map((p) => {
                const inner = (
                  <>
                    <div className="row-main">
                      <span className="row-name">{p.title}</span>
                      <span className="row-sub">{p.description}</span>
                    </div>
                    {p.badge && <span className="row-badge">{p.badge}</span>}
                  </>
                );
                return p.url ? (
                  <Link key={p.title} href={p.url} target="_blank" className="row">
                    {inner}
                  </Link>
                ) : (
                  <div key={p.title} className="row">
                    {inner}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </section>

        <section className="section" id="open-source">
          <Reveal>
            <SectionHead title="Open Source" />
            <div className="rows">
              {openSource.map((c) => (
                <Link key={c.name} href={c.url} target="_blank" className="row">
                  <div className="row-main">
                    <span className="row-name">{c.name}</span>
                    <span className="row-sub">
                      {c.link ? (
                        <>
                          {c.before}
                          <span className="oss-link">{c.link}</span>
                          {c.after}
                        </>
                      ) : (
                        c.description
                      )}
                    </span>
                  </div>
                  {c.meta && <span className="row-meta">{c.meta}</span>}
                </Link>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="section" id="reading">
          <Reveal>
            <SectionHead title="Reading" />
            <div className="shelf">
              {books.map((b) => (
                <div key={b.title} className="book">
                  <div className="book-title">{b.title}</div>
                  <div className="book-author">{b.author}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
