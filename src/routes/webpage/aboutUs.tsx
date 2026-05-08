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
    <div className="bg-black/40 text-[#F8F9FA] overflow-x-hidden">

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />


      {/* ── HERO ── */}
      <section className="relative flex items-start justify-center px-6 pt-0 pb-10 sm:pb-16 sm:mb-10 overflow-hidden z-10">

        {/* Background watermark */}
        <div
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 text-white/[0.025] font-semibold whitespace-nowrap pointer-events-none select-none custom-style"
          style={{ fontSize: "clamp(8rem,20vw,18rem)", letterSpacing: "-0.04em" }}
        >
          Disrupt
        </div>

        <div className="sm:mt-10 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-24 items-center max-w-5xl w-full">

          {/* Left */}
          <div>
            <h1
              className="font-medium leading-none tracking-tight mb-6 animate-[fadeUp_0.8s_0.1s_ease_both] custom-style"
              style={{ fontSize: "clamp(2.8rem,5.5vw,4.8rem)" }}
            >
              Built<br />
              <span className="text-[var(--bright-pink)]">From</span><br />
              The Inside <span className="text-[var(--dark-teal)]">Out.</span>
            </h1>

            <p className="text-md font-extralight text-white/90 custom-style-subheader-regular-case leading-[1.85] mb-8 animate-[fadeUp_0.8s_0.2s_ease_both]">
              AFE Partner Connections wasn't built in a boardroom. It was built by someone who spent years on the front lines of AFE software implementation — watching the same inefficiencies play out across the industry, over and over again. We didn't theorize a solution. We engineered one.
            </p>

            <div className="flex gap-4 flex-wrap animate-[fadeUp_0.8s_0.3s_ease_both]">
              <a
                href="#story"
                className="inline-block text-[0.82rem] font-bold tracking-[0.15em] text-[var(--darkest-teal)] bg-[var(--bright-pink)] px-8 py-3 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(246,16,103,0.4)] custom-style">
                Our Story
              </a>
              <a
                href="#built"
                className="inline-block text-[0.82rem] font-bold tracking-[0.15em] text-[#F8F9FA] border border-white/20 px-8 py-3 rounded-sm transition-all duration-200 hover:border-white/50 hover:bg-white/[0.04] custom-style">
                Why We're Different
              </a>
            </div>
          </div>

          {/* Right — stat stack */}
          <div className="flex flex-col gap-[1.5px] animate-[fadeUp_0.8s_0.2s_ease_both]">
            {stats.map((s) => (
              <div
                key={s.id}
                className={`relative bg-[var(--dark-teal)] border border-white/[0.07] px-9 py-8 overflow-hidden group transition-colors duration-300 hover:bg-[var(--dark-teal)]/90
                  before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:scale-y-0 before:origin-bottom before:transition-transform before:duration-400 ${s.accentClass}`}
              >
                <div
                  className="text-[2.4rem] text-white leading-none mb-1 custom-style"
                >
                  {s.num}
                </div>
                <div
                  className="text-xs/6 tracking-[0.18em] text-white/80 font-semibold mb-2 custom-style"
                  
                >
                  {s.label}
                </div>
                <p className="text-sm/6 leading-relaxed text-white/90 font-medium custom-style-subheader">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── VALUES ── */}
      <section id="values" className="relative z-10 px-6 pt-10 pb-10 sm:pt-16 sm:mb-10 ">
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-1">
            
            <h2
              className="font-medium leading-[1.1] tracking-tight custom-style"
              style={{ fontSize: "clamp(2rem,3.5vw,2.8rem)" }}
            >
              Principles We Don't Compromise On
            </h2>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10.5px] sm:gap-[1.5px] sm:border sm:border-white/[0.05] mt-10 sm:mt-20">
              {values.map((v) => (
                <div
                  key={v.id}
                  className="relative bg-[var(--darkest-teal)] px-10 py-12 overflow-hidden group transition-colors duration-300 hover:bg-[var(--dark-teal)]
                    after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px]
                    after:bg-gradient-to-r after:from-[var(--bright-pink)] after:to-[var(--dark-teal)]
                    after:scale-x-0 after:origin-left after:transition-transform after:duration-500
                    hover:after:scale-x-100"
                >
                  <div className="w-11 h-11 flex items-center justify-center bg-[var(--bright-pink)]/30 rounded-sm mb-6 transition-colors duration-300 group-hover:bg-[var(--bright-pink)]/40">
                    {v.icon}
                  </div>
                  <div
                    className="font-semibold text-base tracking-wide mb-3 custom-style"
                  >
                    {v.title}
                  </div>
                  <p className="text-[0.88rem] leading-[1.75] text-white/80 custom-style-subheader">{v.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ── BUILT DIFFERENT ── */}
      <section
        id="built"
        className="relative z-10 px-6 py-10 sm:py-20"
        style={{ background: "linear-gradient(180deg, transparent, rgba(14,71,73,0.15) 50%, transparent)" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-1 lg:gap-24 items-center">

          <Reveal>
            
            <h2
              className="font-medium leading-[1.1] tracking-tight mb-4 custom-style"
              style={{ fontSize: "clamp(2rem,3.5vw,2.8rem)" }}
            >
              The Old Way.<br />
              The <span className="text-[var(--bright-pink)]">Right</span> Way.
            </h2>
            <p className="text-md font-extralight text-white/90 custom-style-subheader-regular-case leading-[1.85] mb-8 mt-4">
              We've seen how Non-Op AFE management gets handled without a purpose-built platform. It's a patchwork of inboxes, shared drives, and phone calls — held together by institutional memory and goodwill. AFE Partner Connections replaces that entirely.
            </p>
          </Reveal>

          <Reveal delay={100}>
            {/* Header row */}
            <div className="grid grid-cols-[1fr_40px_1fr]">
              <div
                className="px-5 py-2 text-[0.62rem] tracking-[0.2em] text-white/80 font-semibold bg-[var(--dark-teal)]/30 border border-white/[0.05] custom-style"
              >
                Without Us
              </div>
              <div className="bg-[var(--dark-teal)]/30 border-t border-b border-white/[0.05]" />
              <div
                className="px-5 py-2 text-[0.62rem] tracking-[0.2em] text-white font-semibold bg-[var(--dark-teal)]/30 border border-white/[0.05] custom-style"
                
              >
                With AFE Partner Connections
              </div>
            </div>

            {/* Contrast rows */}
            {contrastRows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_40px_1fr] border-b border-white/[0.06] first:border-t first:border-white/[0.06]"
              >
                <div className="px-5 py-5 text-sm/6 leading-relaxed text-white/75 custom-style">
                  {row.before}
                </div>
                <div
                  className="flex items-center justify-center text-[var(--bright-pink)] text-sm font-medium tracking-[0.15em] border-l border-r border-white/[0.06] custom-style">
                  vs
                </div>
                <div
                  className="px-5 py-5 text-sm/6 leading-relaxed font-medium tracking-wide text-white custom-style">
                  {row.after}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ── CTA ── */}
      <section id="cta" className="relative z-10 px-6 py-10 text-center overflow-hidden bg-[var(--dark-teal)] mt-6">
        <div className="absolute bottom-[-250px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(14,71,73,0.3),transparent_65%)] pointer-events-none" />

        <Reveal className="relative z-10 max-w-3xl mx-auto ">
          <div
            className="inline-block text-white text-sm/6 tracking-[0.3em] font-semibold border border-white/35 px-5 py-2 rounded-sm mb-8 custom-style">
            Ready to Make the Switch?
          </div>

          <h2
            className="font-medium leading-[1.05] tracking-tight mb-5 custom-style"
            style={{ fontSize: "clamp(2.5rem,5vw,4rem)" }}
          >
            Built by the Industry.<br />
            Built for the <span className="text-[var(--bright-pink)]">Industry.</span>
          </h2>

          <p className="text-md font-extralight text-white/90 custom-style-subheader-regular-case leading-[1.85] mb-8">
            AFE Partner Connections is the platform the energy industry has needed for years. See what a purpose-built solution — designed by someone who's been in the room — can do for your Non-Op workflow.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <NavLink
              to="/demo"
              className="inline-block text-[0.82rem] font-bold tracking-[0.15em] text-[var(--darkest-teal)] bg-[var(--bright-pink)] px-10 py-4 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(246,16,103,0.4)]"
              style={{ fontVariant: "small-caps" }}
            >
              Request a Demo
            </NavLink>
            <NavLink
              to="/how-it-works"
              className="inline-block text-[0.82rem] font-bold tracking-[0.15em] text-[#F8F9FA] border border-white/20 px-10 py-4 rounded-sm transition-all duration-200 hover:border-white/50 hover:bg-white/[0.04]">
              See How It Works
            </NavLink>
          </div>
        </Reveal>
      </section>

      {/* Keyframe injection */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
