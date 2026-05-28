import { useEffect, useRef, type ReactNode } from "react";
import { NavLink } from "react-router";
import LiquidEther from "src/blocks/LiquidEther";
import BlurText from "src/blocks/TextAnimations/BlurText";

// ── SHARED PRIMITIVES ─────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("opacity-100", "translate-y-0");
        el.classList.remove("opacity-0", "translate-y-6");
        observer.unobserve(el);
      }
    }, { threshold: 0.08 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`opacity-0 translate-y-6 transition-all duration-700 ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />;
}

function EyebrowLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="block w-6 h-px bg-[var(--bright-pink)]" />
      <span className="custom-style text-xs sm:text-sm font-semibold tracking-[0.25em] text-[var(--bright-pink)]">{children}</span>
    </div>
  );
}

// ── DATA ─────────────────────────────────────────────────────────────────────

const features = [
  {
    id: 1,
    title: "Direct AFE Integration",
    message: "AFEs flow automatically from your source system into the platform — no manual entry, no file transfers, no lag.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--bright-pink)] fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    ),
  },
  {
    id: 2,
    title: "Partner-Scoped Visibility",
    message: "Every Non-Op Partner sees exactly the AFEs they're entitled to — and nothing they aren't. Access is enforced, not assumed.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--bright-pink)] fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    id: 3,
    title: "Streamlined Approvals",
    message: "Partners review, upload their signed Non-Op agreement, and approve — all in one place. No printing, no shipping, no waiting.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--bright-pink)] fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
        <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Automated Notifications",
    message: "The right people are notified at every step — from AFE availability through final approval — without anyone having to chase it down.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--bright-pink)] fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    id: 5,
    title: "Complete Audit Trail",
    message: "Every view, download, upload, and status change is logged with a full timestamp. Accountability is built in from day one.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--bright-pink)] fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    id: 6,
    title: "AFE System Agnostic",
    message: "Currently integrated with Quorum Execute — and built to connect to any AFE system. If you can hit it with an API, we can build the connection.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--bright-pink)] fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
  },
];

const steps = [
  { number: "01", title: "AFE Pulled from Source",     message: "Your AFE system pushes data directly into the platform via a secure API connection." },
  { number: "02", title: "Partners Notified",          message: "Non-Op Partners receive an automated email and see the AFE on their dashboard with a status of New." },
  { number: "03", title: "Review & Download",          message: "Partners review the full AFE, access attachments, and export estimates with account code translation." },
  { number: "04", title: "Sign & Approve",             message: "Partners upload their signed Non-Op agreement and mark the AFE approved — triggering instant notifications." },
];

const navLinks = [
  { label: "How It Works", to: "/howitworks" },
  { label: "About Us",     to: "/aboutus" },
  { label: "FAQ",          to: "/faq" },
  { label: "Contact Us",   to: "/contactus" },
];

// ── PAGE ─────────────────────────────────────────────────────────────────────

export default function Homepage() {
  return (
    <>

    <div className="bg-[var(--darkest-teal)] text-white overflow-x-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative w-full flex flex-col justify-center overflow-hidden bg-black/10">

        {/* Liquid ether background */}
        <div className="absolute inset-0 z-5 bg-black/10">
          <LiquidEther
            colors={['#FF4FA3', '#FF6FB7', '#FF5CAB']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={true}
            autoDemo={false}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.15}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 z-[1] bg-black/60" />

        {/* Content */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-24 max-w-5xl mx-auto w-full">

          {/* Eyebrow */}
          <div className="animate-[fadeUp_0.6s_ease_both]">
            <EyebrowLabel>AFE Partner Connections</EyebrowLabel>
          </div>

          {/* Headline */}
          <div className="animate-[fadeUp_0.7s_0.1s_ease_both] mb-6">
            <BlurText
              text="Streamline your AFE Partner Workflow"
              delay={120}
              animateBy="words"
              direction="top"
              className="custom-style font-semibold text-5xl sm:text-7xl tracking-tight text-white leading-[1.05]"
            />
          </div>

          {/* Subheadline */}
          <p className="custom-style-subheader-regular-case font-light text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed mb-10 animate-[fadeUp_0.7s_0.25s_ease_both]">
            AFE Partner Connections is the purpose-built platform that replaces printed packages, FedEx envelopes, and manual follow-ups with a single, secure, fully auditable workflow via direct integration to your AFE System.
          </p>

          {/* CTA pill */}
          <div className="animate-[fadeUp_0.7s_0.35s_ease_both] w-full sm:w-3/4 lg:w-1/2 relative rounded-full justify-self-end">
            <div className="relative">
              <div className="absolute rounded-full -inset-0.5 bg-gradient-to-r from-[var(--bright-pink)] via-[var(--dark-teal)] to-[var(--dark-teal)]" />
              <div className="relative">
                <p className="flex items-center min-h-10 text-sm sm:text-lg/7 text-white/80 bg-black rounded-full pl-6 py-3 sm:py-5 custom-style">
                  Ready to see it in action?
                </p>
              </div>
            </div>
            <div className="absolute flex items-center right-1.5 inset-y-1.5 pr-1 z-10">
              <NavLink
                to="/requestdemo"
                className="inline-flex items-center justify-center px-8 py-1 text-sm/6 font-semibold tracking-widest text-black uppercase transition-all duration-200 bg-white rounded-full sm:w-auto sm:py-3 hover:bg-[var(--bright-pink)]/80 hover:text-white cursor-pointer custom-style"
                role="button"
              >
                Let's Talk
              </NavLink>
            </div>
          </div>

          {/* Page nav links */}
          <div className="flex flex-wrap gap-6 mt-12 animate-[fadeUp_0.7s_0.45s_ease_both]">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="custom-style font-light text-xs sm:text-sm tracking-[0.2em] text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="block w-3 h-px bg-white/60 group-hover:bg-[var(--bright-pink)] group-hover:w-5 transition-all duration-300" />
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-[fadeUp_1s_0.8s_ease_both]">
          <span className="custom-style text-[0.6rem] tracking-[0.3em] text-white/30">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      <Divider />

      {/* ── FEATURES ── */}
      <section className="px-6 sm:px-10 py-16 sm:py-24 bg-[var(--darkest-teal)]">
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-12">
            <EyebrowLabel>What It Does</EyebrowLabel>
            <h2 className="custom-style font-semibold text-3xl sm:text-5xl text-white leading-tight max-w-xl">
              Everything the Process Needs. Finally in One Place.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-white/[0.04] border border-white/[0.06]">
              {features.map((f) => (
                <div key={f.id}
                  className="relative bg-[var(--darkest-teal)] px-8 py-10 group transition-colors duration-300 hover:bg-[var(--dark-teal)]
                    after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]
                    after:bg-gradient-to-r after:from-[var(--bright-pink)] after:to-[var(--bright-green)]
                    after:scale-x-0 after:origin-left after:transition-transform after:duration-500
                    hover:after:scale-x-100"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[var(--bright-pink)]/40 rounded-sm mb-5 transition-colors duration-300 group-hover:bg-[var(--bright-pink)]/50">
                    {f.icon}
                  </div>
                  <div className="custom-style font-semibold text-base tracking-wide text-white mb-3">{f.title}</div>
                  <p className="custom-style-long-text font-light text-sm leading-7 text-[var(--light-grey)]">{f.message}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ── HOW IT WORKS TEASER ── */}
      <section className="px-6 sm:px-10 py-16 sm:py-24 bg-[var(--dark-teal)]">
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-12">
            <EyebrowLabel>The Process</EyebrowLabel>
            <h2 className="custom-style font-semibold text-3xl sm:text-5xl text-white leading-tight max-w-xl">
              From Source System to Signed Agreement in Four Steps.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {steps.map((s) => (
                <div key={s.number}
                  className="group relative overflow-hidden rounded-sm border border-white/10 p-6 bg-[var(--darkest-teal)]
                    transition-all duration-500 hover:bg-[var(--darkest-teal)]/60
                    before:absolute before:top-0 before:left-0 before:h-[3px] before:w-0
                    before:bg-[var(--bright-pink)] before:transition-[width] before:duration-500 hover:before:w-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="custom-style font-semibold text-4xl text-[var(--bright-pink)]/90 leading-none">{s.number}</span>
                  </div>
                  <h3 className="custom-style font-semibold text-base text-white mb-3 leading-tight">{s.title}</h3>
                  <p className="custom-style-long-text font-light text-sm leading-7 text-[var(--light-grey)]">{s.message}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200} className="mt-8 flex justify-end">
            <NavLink
              to="/howitworks"
              className="custom-style font-semibold text-sm tracking-[0.15em] text-white/60 hover:text-white flex items-center gap-3 transition-colors duration-200 group"
            >
              See the full breakdown
              <span className="block w-6 h-px bg-white/20 group-hover:w-10 group-hover:bg-[var(--bright-pink)] transition-all duration-300" />
            </NavLink>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ── CTA ── */}
      <section className="px-6 sm:px-10 py-16 sm:py-24 text-center bg-gradient-to-b from-[var(--darkest-teal)] to-[var(--dark-teal)]">
        <Reveal className="max-w-2xl mx-auto">
          <EyebrowLabel>Get Started</EyebrowLabel>
          <h2 className="custom-style font-semibold text-3xl sm:text-5xl text-white leading-tight mb-4">
            Your Digital AFE <span className="text-[var(--bright-pink)]">Courier.</span>
          </h2>
          <p className="custom-style-subheader-regular-case font-light text-sm sm:text-lg text-white/70 mb-10 leading-relaxed">
            See what AFE Partner Connections can do for your Non-Op workflow. We'll walk you through it.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <NavLink
              to="/requestdemo"
              className="custom-style font-semibold text-sm tracking-[0.15em] text-[var(--darkest-teal)] bg-[var(--bright-pink)] px-10 py-4 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(246,16,103,0.4)]"
            >
              Request a Demo
            </NavLink>
            <NavLink
              to="/aboutus"
              className="custom-style font-semibold text-sm tracking-[0.15em] text-white border border-white/20 px-10 py-4 rounded-sm transition-all duration-200 hover:border-white/50 hover:bg-white/[0.04]"
            >
              Our Story
            </NavLink>
          </div>
        </Reveal>
      </section>
    </div>
    </>
  );
};
