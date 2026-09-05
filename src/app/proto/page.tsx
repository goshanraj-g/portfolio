"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, Github, Mail, Linkedin } from "lucide-react";
import AsciiForest from "@/components/ascii-forest";
import Campfire from "@/components/campfire";
import Moon, { type Sky } from "@/components/moon";
import Stars from "@/components/stars";
import "./proto.css";

/* ── Reveal on scroll ── */
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
      // fire once the section is into frame, not as its top edge grazes
      new IntersectionObserver(([e]) => e.isIntersecting && show(), {
        threshold: 0,
        rootMargin: "0px 0px -14% 0px",
      }),
      // The last block on the page can never clear that bottom margin — on a
      // phone the footer would sit at opacity 0 — so anything that ends up
      // wholly on screen reveals as well.
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

/* ── Data ── */

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

const experiences = [
  { title: "Software Engineering Intern", org: "IBM", orgLink: "https://ibm.com/", image: "/images/experiences/ibm.svg", year: "01/26 — Present" },
  { title: "ML Research Assistant", org: "McMaster University", orgLink: "https://www.mcmaster.ca/", image: "/images/education/mcmaster.svg", year: "09/25 — 12/25" },
  { title: "Community Manager", org: "Google Developer Groups", orgLink: "https://gdg.community.dev/", image: "/images/experiences/gdsc.svg", year: "09/24 — 09/25" },
];

type Project = { title: string; description: string; url?: string; badge?: string };

const projects: Project[] = [
  {
    title: "Agentic Manufacturing Scheduler",
    description: "LLM agent + OR-Tools solver — 65% fewer late orders",
    // TODO(gosh): add repo link
  },
  {
    title: "AI Web Monitor",
    description: "Go scheduler/worker queue, Claude-filtered into Slack",
    // TODO(gosh): add repo link
  },
  {
    title: "AI Repository Auditor",
    url: "https://github.com/goshanraj-g/CodeTurret",
    description: "Audits repos with Gemini and opens fix PRs",
    badge: "1st of 72 @ Google Hackathon",
  },
  {
    title: "CampusThread",
    url: "https://campusthread.vercel.app/",
    description: "Agent-driven university Q&A for 250+ users",
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
    meta: "~5M downloads/mo",
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

/* Panel order, and the ids the rail scrolls to. Kept next to the sections that
   carry these ids — the two lists have to stay in step. */
const panels = [
  { id: "top", label: "Intro" },
  { id: "summary", label: "Summary" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "open-source", label: "Open Source" },
  { id: "reading", label: "Reading" },
];

function SectionHead({ title }: { title: string }) {
  return <h2 className="section-title">{title}</h2>;
}

/* Every panel closes on the same bar, at the same offset, so scrolling reads as
   the panel above sliding past a fixed rail rather than as six footers. */
function PanelFoot() {
  return (
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
  );
}

/* Six ticks down the right edge, one per panel, the current one drawn long and
   lit: the ticks below the active one are the page telling you how much is
   left, and they say where you are while they do it. Clicking one jumps to
   that panel. A chevron above and below drifts on a slow loop — the ticks are
   a readout, and these are the part that actually asks you to scroll. */
function ScrollRail() {
  const [active, setActive] = useState(panels[0].id);

  useEffect(() => {
    // A band one pixel tall across the middle of the screen: whichever panel is
    // crossing it owns the rail. Cheaper and steadier than ratio thresholds,
    // and it never leaves two panels lit at once.
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

  // A hint only points where there is somewhere to go: down alone on the first
  // panel, up alone on the last, both on everything between.
  const atStart = active === panels[0].id;
  const atEnd = active === panels[panels.length - 1].id;

  return (
    <nav className="rail" aria-label="Sections">
      {/* Both arrows stay mounted and fade rather than unmounting — the rail is
          centred on the viewport, so a hint appearing or vanishing outright
          would shunt the ticks up and down the screen as you scroll. */}
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

export default function ProtoPage() {
  // Night by default on every visit; the moon is the only way out of it.
  const [sky, setSky] = useState<Sky>("night");

  return (
    <div className="proto" data-theme={sky === "day" ? "day" : undefined}>
      {/* before the forest, so the trees paint over them */}
      {sky === "night" && <Stars />}
      <Moon sky={sky} onToggle={() => setSky((s) => (s === "day" ? "night" : "day"))} />
      <AsciiForest sky={sky} />
      <div className="scrim" />
      <Campfire sky={sky} />
      <ScrollRail />

      <div className="shell">
        {/* ── Hero ── */}
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

          <PanelFoot />
        </header>

        {/* ── 01 Summary ── */}
        <section className="section" id="summary">
          <Reveal>
            <p className="lead lead-into">
              Software Engineer studying Computer Science at McMaster University,
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
          </Reveal>

          <PanelFoot />
        </section>

        {/* ── 02 Work ── */}
        <section className="section" id="work">
          <Reveal>
            <SectionHead title="Work" />
            <div className="rows">
              {experiences.map((e) => (
                <Link key={e.org} href={e.orgLink} target="_blank" className="row">
                  <div className="row-main">
                    <Image src={e.image} alt="" width={22} height={22} className="row-logo" />
                    <span className="row-name">{e.org}</span>
                    <span className="row-sub">{e.title}</span>
                  </div>
                  <span className="row-meta">{e.year}</span>
                </Link>
              ))}
            </div>
          </Reveal>

          <PanelFoot />
        </section>

        {/* ── 03 Projects ── */}
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

          <PanelFoot />
        </section>

        {/* ── 04 Open Source ── */}
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

          <PanelFoot />
        </section>

        {/* ── 05 Reading ── */}
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

          <PanelFoot />
        </section>
      </div>
    </div>
  );
}
