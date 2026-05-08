import { useEffect, useRef, type ReactNode } from "react";
import { NavLink } from "react-router";
// ── DATA ──────────────────────────────────────────────────────────────────────

const stats = [
  {
    id: 1,
    num: "Years",
    label: "of AFE Implementation Experience",
    detail: "Years of implementation experience means we know every step of the AFE process inside and out.",
    accentClass: "before:bg-[var(--bright-pink)]",
  },
  {
    id: 2,
    num: "One Gap.",
    label: "End-to-End Digitization",
    detail: "The industry was still printing, shipping, and waiting. We eliminated the physical exchange entirely.",
    accentClass: "before:bg-[var(--dark-teal)]",
  },
  {
    id: 3,
    num: "Purpose-Built.",
    label: "Not Adapted. Not Retrofitted.",
    detail: "Designed from scratch specifically for Non-Op AFE collaboration — nothing more, nothing less.",
    accentClass: "before:bg-[#9AA0A8]",
  },
];

const storyBlocks = [
  {
    id: 1,
    label: "The Observation",
    title: "We Saw It Happening Everywhere",
    body: "Implementing AFE software across the energy industry reveals patterns quickly. And one pattern appeared with remarkable consistency: Non-Operating partners were perpetually left out of the loop. Emails got buried. Spreadsheets went stale. Phone calls replaced systems. The data existed — it just never made it to the people who needed it.",
    quote: null,
  },
  {
    id: 2,
    label: "The Frustration",
    title: "Operators Had the Data. Partners Were in the Dark.",
    body: "Every operator had a source system holding clean, accurate AFE data. But the moment a Non-Op partner needed to review, approve, or sign off on an AFE, that data had to be manually extracted, formatted, emailed, and tracked — by hand. The technology existed to fix this. No one had built the bridge.",
    quote: "The data was there. The partners were there. The process connecting them wasn't.",
  },
  {
    id: 3,
    label: "The Decision",
    title: "So We Built the Bridge.",
    body: "AFE Partner Connections was founded on a straightforward conviction: Non-Operating partners deserve the same real-time access to AFE data that operators have. Not a summary. Not an export from last Tuesday. The actual data, exactly as it lives in the source system — accessible, exportable, and actionable. We built the platform we always wished existed, and we built it to do one thing exceptionally well.",
    quote: null,
  },
];

const values = [
  {
    id: 1,
    title: "Radical Simplicity",
    desc: "Complexity is the enemy of adoption. Every feature, every screen, every interaction is stripped down to exactly what's needed and nothing that isn't.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--bright-pink)] fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    id: 2,
    title: "Unimpeachable Accuracy",
    desc: "We pull from the source. Always. Partners never see a stale export or a manually re-keyed figure — they see exactly what the operator's system holds, in real time.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--bright-pink)] fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    id: 3,
    title: "Accountability by Design",
    desc: "Every action is logged. Every approval is traceable. The audit trail isn't an afterthought — it's a core architectural commitment baked in from day one.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--bright-pink)] fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
        <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Partner-First Thinking",
    desc: "Non-Op partners aren't secondary users. The platform was designed around their experience — because a smooth partner workflow benefits every operator too.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--bright-pink)] fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 5,
    title: "Industry-Native Expertise",
    desc: "We don't approach oil and gas as an outside technology vendor. We come from AFE implementation. The nuances of this industry aren't learned here — they were the starting point.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--bright-pink)] fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    id: 6,
    title: "Focused Scope, Flawless Execution",
    desc: "We don't try to be an ERP or a land system. We solve one problem — Non-Op AFE collaboration — and we solve it better than anyone else.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--bright-pink)] fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
  },
];

const contrastRows = [
  { before: "AFEs are sent USPS, FedEx, UPS or emailed as PDF attachments",       after: "Live data pulled from source system" },
  { before: "Reaching out to Partners to get status updates",        after: "Real-time portal access, always current" },
  { before: "Physical copies lost or misplaced",     after: "Signed docs uploaded directly to the AFE in AFE Partner Connections" },
  { before: "Approvals confirmed via mail",         after: "One-click approval with instant status update" },
  { before: "No record of who saw what, when",        after: "Full immutable audit trail, every action logged" },
  { before: "Manual follow-up chase",                 after: "Automated, contextual email notifications" },
];

// ── SECTION LABEL ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="block w-7 h-px bg-[var(--dark-teal)]" />
      <span
        className="text-[var(--dark-teal)] text-[0.68rem] tracking-[0.3em] font-semibold">
        {children}
      </span>
    </div>
  );
}

// ── DIVIDER ───────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
  );
}

function EyebrowLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="block w-6 h-px bg-[var(--bright-pink)]" />
      <span className="custom-style text-xs sm:text-sm font-semibold tracking-[0.25em] text-[var(--bright-pink)]">{children}</span>
    </div>
  );
}

// ── REVEAL HOOK ───────────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-7");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ── REVEAL WRAPPER ────────────────────────────────────────────────────────────

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-7 transition-all duration-700 ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ── ABOUT PAGE ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="bg-[var(--darkest-teal)] text-white overflow-x-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative px-6 pt-16 pb-16 sm:pt-24 sm:pb-20 overflow-hidden
        bg-gradient-to-b from-[var(--dark-teal)] to-[var(--darkest-teal)]">

        {/* Watermark */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 custom-style font-semibold whitespace-nowrap pointer-events-none select-none text-white/[0.025]"
          style={{ fontSize: "clamp(6rem,18vw,16rem)", letterSpacing: "-0.04em" }}>
          Disrupt
        </div>

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <div className="animate-[fadeUp_0.8s_ease_both]">
            <EyebrowLabel>About AFE Partner Connections</EyebrowLabel>
            <h1 className="custom-style font-semibold text-4xl sm:text-6xl leading-[1.05] tracking-tight text-white mb-6">
              Built<br />
              <span className="text-[var(--bright-pink)]">From</span><br />
              The Inside <span className="text-[var(--bright-green)]">Out.</span>
            </h1>
            <p className="custom-style-subheader-regular-case font-light text-sm sm:text-lg text-white/70 leading-relaxed mb-8">
              AFE Partner Connections wasn't built in a boardroom. It was built by someone who spent years on the front lines of AFE software implementation — watching the same inefficiencies play out across the industry, over and over again. We didn't theorize a solution. We engineered one.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="#story"
                className="custom-style font-semibold text-sm tracking-[0.15em] text-[var(--darkest-teal)] bg-[var(--bright-pink)] px-8 py-3 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(246,16,103,0.4)]">
                Our Story
              </a>
              <a href="#built"
                className="custom-style font-semibold text-sm tracking-[0.15em] text-white border border-white/20 px-8 py-3 rounded-sm transition-all duration-200 hover:border-white/50 hover:bg-white/[0.04]">
                Why We're Different
              </a>
            </div>
          </div>

          {/* Right — stat stack */}
          <div className="flex flex-col gap-[2px] animate-[fadeUp_0.8s_0.15s_ease_both]">
            {stats.map((s) => (
              <div key={s.id} className="relative bg-[var(--dark-teal)] border border-white/[0.07] px-8 py-7 group transition-colors duration-300 hover:bg-[var(--dark-teal)]/80 flex gap-5 items-start overflow-hidden">
                {/* Accent bar as real div */}
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] scale-y-0 origin-bottom transition-transform duration-300 group-hover:scale-y-100 ${s.accentClass}`} />
                <div>
                  <div className="custom-style font-semibold text-3xl text-white leading-none mb-1">{s.num}</div>
                  <div className="custom-style font-semibold text-xs tracking-[0.18em] text-[var(--light-grey)] mb-2">{s.label}</div>
                  <p className="custom-style-long-text font-light text-sm leading-relaxed text-[var(--light-grey)]">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── ORIGIN STORY ── */}
      <section id="story" className="px-6 py-16 sm:py-24 bg-[var(--darkest-teal)]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <EyebrowLabel>What Drives Us</EyebrowLabel>
            <h2 className="custom-style font-semibold text-3xl sm:text-5xl text-white leading-tight">
              Principles We Don't Compromise On
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-white/[0.04] border border-white/[0.06]">
              {values.map((v) => (
                <div key={v.id}
                  className="relative bg-[var(--dark-teal)] px-8 py-10 overflow-hidden group transition-colors duration-300 hover:bg-[var(--darkest-teal)]
                    after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]
                    after:bg-gradient-to-r after:from-[var(--bright-pink)] after:to-[var(--bright-green)]
                    after:scale-x-0 after:origin-left after:transition-transform after:duration-500
                    hover:after:scale-x-100">
                  <div className="w-10 h-10 flex items-center justify-center bg-[var(--bright-pink)]/40 rounded-sm mb-5 transition-colors duration-300 group-hover:bg-[var(--bright-pink)]/50">
                    {v.icon}
                  </div>
                  <div className="custom-style font-semibold text-base tracking-wide text-white mb-3">{v.title}</div>
                  <p className="custom-style-long-text font-light text-sm leading-7 text-[var(--light-grey)]">{v.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Divider />

      

      {/* ── BUILT DIFFERENT ── */}
      <section id="built" className="px-6 py-16 sm:py-24 bg-[var(--darkest-teal)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <Reveal>
            <EyebrowLabel>The Difference</EyebrowLabel>
            <h2 className="custom-style font-semibold text-3xl sm:text-5xl text-white leading-tight mb-4">
              The Old Way.<br />The <span className="text-[var(--bright-pink)]">Right</span> Way.
            </h2>
            <p className="custom-style-subheader-regular-case font-light text-sm sm:text-lg text-white/70 leading-relaxed">
              We've seen how Non-Op AFE management gets handled without a purpose-built platform. It's a patchwork of mail runs, shared drives, and phone calls — held together by institutional memory and goodwill. AFE Partner Connections replaces that entirely.
            </p>
          </Reveal>

          <Reveal delay={100}>
            {/* Header */}
            <div className="grid grid-cols-[1fr_36px_1fr]">
              <div className="custom-style font-semibold text-xs tracking-[0.2em] text-[var(--light-grey)] px-4 py-2 bg-[var(--dark-teal)]/40 border border-white/[0.06]">Without Us</div>
              <div className="bg-[var(--dark-teal)]/40 border-t border-b border-white/[0.06]" />
              <div className="custom-style font-semibold text-xs tracking-[0.2em] text-[var(--bright-green)] px-4 py-2 bg-[var(--dark-teal)]/40 border border-white/[0.06]">With AFE Partner Connections</div>
            </div>
            {/* Rows */}
            {contrastRows.map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_36px_1fr] border-b border-white/[0.06] first:border-t first:border-white/[0.06]">
                <div className="px-4 py-4 text-sm leading-relaxed text-[var(--light-grey)] line-through decoration-[var(--bright-pink)]/30 custom-style-long-text">{row.before}</div>
                <div className="flex items-center justify-center text-[var(--bright-pink)] text-xs font-semibold custom-style border-l border-r border-white/[0.06]">vs</div>
                <div className="px-4 py-4 text-sm leading-relaxed text-white font-medium custom-style">{row.after}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ── CTA ── */}
      <section id="cta" className="px-6 py-16 sm:py-24 text-center bg-gradient-to-b from-[var(--darkest-teal)] to-[var(--dark-teal)]">
        <Reveal className="max-w-2xl mx-auto">
          <EyebrowLabel>Ready to Make the Switch?</EyebrowLabel>
          <h2 className="custom-style font-semibold text-3xl sm:text-5xl text-white leading-tight mb-4">
            Built by the Industry.<br />Built for the <span className="text-[var(--bright-pink)]">Industry.</span>
          </h2>
          <p className="custom-style-subheader-regular-case font-light text-sm sm:text-lg text-white/70 mb-10 leading-relaxed">
            AFE Partner Connections is the platform the energy industry has needed for years. See what a purpose-built solution — designed by someone who's been in the room — can do for your Non-Op workflow.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <NavLink to="/demo"
              className="custom-style font-semibold text-sm tracking-[0.15em] text-[var(--darkest-teal)] bg-[var(--bright-pink)] px-10 py-4 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(246,16,103,0.4)]">
              Request a Demo
            </NavLink>
            <NavLink to="/how-it-works"
              className="custom-style font-semibold text-sm tracking-[0.15em] text-white border border-white/20 px-10 py-4 rounded-sm transition-all duration-200 hover:border-white/50 hover:bg-white/[0.04]">
              See How It Works
            </NavLink>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
