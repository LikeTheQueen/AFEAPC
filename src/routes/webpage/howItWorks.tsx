import { useEffect, useRef, type ReactNode } from "react";
import { NavLink } from "react-router";

const cardVerbiage = [
  { number: "01", title: "Automated AFE Ingestion",    message: "AFEs are pulled automatically and in real time directly from your source system — no manual entry, no lag, no discrepancies. Your data arrives precisely as it was authored." },
  { number: "02", title: "Global AFE Portal",  message: "Non-Op partners gain secure, role-based access to a curated portal where they can review full AFE details, explore line-item breakdowns, and download associated attachments." },
  { number: "03", title: "Signed AFE Upload Required",  message: "Partners upload their signed Non-Op agreement directly to the platform and mark the AFE as approved — triggering an instant status update visible to all authorized stakeholders." },
  { number: "04", title: "Audit Trail & Notifications",message: "Every action triggers intelligent email notifications to the right people at the right time. A comprehensive, tamper-evident audit history logs every view, upload, and status change." },
];

const features = [
  { id: 0, title: "Role-Based AFE Access",                     message: "Non-Op partners have full visibility into every AFE sent to them, and zero visibility into those that aren't. Access is enforced, not assumed." },
  { id: 1, title: "Live AFE Visibility",                       message: "Partners view up-to-the-minute AFE data drawn directly from the source — authoritative, accurate, and always current." },
  { id: 2, title: "One-Click Export",                          message: "Export full AFE packages in a single action — formatted, organized, and ready for internal review or archival." },
  { id: 3, title: "Attachment Access",                         message: "Supporting documents, exhibits, and supplemental files are surfaced directly alongside the AFE — no hunting, no separate requests." },
  { id: 4, title: "Secure Non-Op Agreement Upload",            message: "Partners submit signed Non-Op agreements through an encrypted, access-controlled upload flow with immediate acknowledgment before they can approve or reject the AFE." },
  { id: 5, title: "Intelligent Email Notifications",           message: "Automated, contextual alerts keep every stakeholder informed — from initial AFE availability through final approval or rejection confirmation." },
  { id: 6, title: "Immutable Audit History",                   message: "A complete, chronological log of every platform event — who did what, and when — providing ironclad accountability and compliance support." },
];

const auditEvents = [
  { id: 1, daysAgo: 0, time: "10:42 AM", title: "Non-Op Agreement Uploaded",      message: "Signed agreement submitted by J. Martinez, Ridgeline Energy Partners. AFE-2024-1147 marked Approved." },
  { id: 2, daysAgo: 0, time: "9:15 AM",  title: "AFE Viewed",                     message: "Rachel Green at CW Oil Company viewed AFE #DC56090 S2." },
  { id: 3, daysAgo: 0, time: "8:01 AM",  title: "AFE Downloaded",                 message: "AFE-2024-1152 downloaded by Ross Gellar at WC Energy Partners." },
  { id: 4, daysAgo: 1, time: "3:30 PM",  title: "AFE Exported",                   message: "Full AFE-2024-1147 package exported by C. Okonkwo, Apex Capital Group." },
  { id: 5, daysAgo: 6, time: "11:08 AM", title: "AFE Rejected",                   message: "AFE-2024-1147 rejected by T. Nguyen, Summit Resources LLC." },
];

function formatEventDate(daysAgo: number, time: string): string {
  if (daysAgo === 0) return `Today, ${time}`;
  if (daysAgo === 1) return `Yesterday, ${time}`;
  return `${daysAgo} days ago, ${time}`;
}

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

// ── CARD COMPONENTS ───────────────────────────────────────────────────────────

type CardProps = { number: string; title: string; message: string };

function HowItWorksCard({ number, title, message }: CardProps) {
  return (
    <div className="group relative overflow-hidden rounded-sm border border-white/10 p-6
      bg-[var(--dark-teal)]
      transition-all duration-500
      hover:bg-[var(--darkest-teal)]
      before:absolute before:top-0 before:left-0
      before:h-[3px] before:w-0 before:bg-[var(--bright-pink)]
      before:transition-[width] before:duration-500
      hover:before:w-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="custom-style font-semibold text-xl text-white leading-tight max-w-[75%]">{title}</h3>
        <span className="custom-style font-semibold text-3xl text-[var(--bright-pink)] leading-none">{number}</span>
      </div>
      <p className="custom-style-long-text font-light text-sm leading-7 text-[var(--light-grey)]">{message}</p>
    </div>
  );
}

function FeatureCard({ title, message }: { title: string; message: string }) {
  return (
    <div className="group flex items-start gap-4 py-2 border-b border-white/[0.06] last:border-0 transition-all duration-300 hover:pl-2 rounded-sm">
      <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2
        bg-[var(--bright-pink)] shadow-[0_0_10px_rgba(246,16,103,0.5)]
        transition-all duration-300
        group-hover:bg-[var(--bright-green)] group-hover:shadow-[0_0_10px_rgba(149,198,35,0.5)]" />
      <div>
        <h3 className="custom-style font-semibold text-sm tracking-wide text-white mb-1">{title}</h3>
        <p className="custom-style-long-text font-light text-sm leading-7 text-[var(--light-grey)]">{message}</p>
      </div>
    </div>
  );
}

type AuditProps = { id: number; daysAgo: number; time: string; title: string; message: string };

function AuditTrailCard({ daysAgo, time, title, message }: AuditProps) {
  return (
    <div className="group flex items-start gap-5 py-3 border-l-2 border-white/20 pl-4
      transition-all duration-300
      hover:border-[var(--bright-green)] hover:bg-[var(--darkest-teal)] hover:rounded-r-sm hover:pr-3">
      <div className="flex-shrink-0 w-3 h-3 rounded-full -ml-[1.45rem] mt-1
        ring-2 ring-[var(--bright-pink)] bg-[var(--dark-teal)]
        shadow-[0_0_10px_rgba(246,16,103,0.4)]
        transition-all duration-300
        group-hover:bg-[var(--bright-green)] group-hover:ring-[var(--bright-green)] group-hover:shadow-[0_0_10px_rgba(149,198,35,0.4)]" />
      <div>
        <p className="custom-style font-semibold text-xs tracking-[0.15em] text-[var(--light-grey)] mb-0.5">{formatEventDate(daysAgo, time)}</p>
        <h3 className="custom-style font-semibold text-sm text-white mb-1">{title}</h3>
        <p className="custom-style-long-text font-light text-sm leading-6 text-[var(--light-grey)]">{message}</p>
      </div>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function HowItWorks() {
  return (
    <div className="bg-[var(--darkest-teal)] text-white overflow-x-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center text-center px-6 pt-16 pb-16 sm:pt-24 sm:pb-20 overflow-hidden
        bg-gradient-to-b from-[var(--dark-teal)] to-[var(--darkest-teal)]">

        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[radial-gradient(ellipse,rgba(246,16,103,0.08),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto animate-[fadeUp_0.8s_ease_both]">
          <EyebrowLabel>Platform Overview</EyebrowLabel>
          <h1 className="custom-style font-semibold text-4xl sm:text-6xl leading-[1.05] tracking-tight text-white mb-6">
            A Global AFE Platform Engineered for{" "}
            <span className="text-[var(--bright-pink)]">Effortless</span>{" "}
            Non-Op Collaboration
          </h1>
          <p className="custom-style-subheader-regular-case font-light text-sm sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            A purpose-built pipeline that connects your AFE systems directly to Non-Op partners — delivering real-time visibility, streamlined approvals, and an unbreakable audit trail.
          </p>
        </div>
      </section>

      <Divider />

      {/* ── STEPS ── */}
      <section className="px-6 py-16 sm:py-24 bg-[var(--darkest-teal)]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <EyebrowLabel>How It Works</EyebrowLabel>
            <h2 className="custom-style font-semibold text-3xl sm:text-5xl text-white mb-3">From Source System to Signed Agreement</h2>
            <p className="custom-style-subheader-regular-case font-light text-sm sm:text-lg text-white/70 mb-12 max-w-xl">
              Four precise steps that transform a cumbersome AFE process into an orchestrated, transparent workflow.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {cardVerbiage.map((item) => (
                <HowItWorksCard key={item.number} {...item} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ── FEATURES ── */}
      <section className="px-6 py-16 sm:py-24 bg-[var(--dark-teal)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          <Reveal className="lg:sticky lg:top-24">
            <EyebrowLabel>Capabilities</EyebrowLabel>
            <h2 className="custom-style font-semibold text-3xl sm:text-5xl text-white mb-4 leading-tight">
              Everything Your Partners Need.{" "}
              <span className="text-[var(--bright-pink)]">Nothing</span> They Don't.
            </h2>
            <p className="custom-style-subheader-regular-case font-light text-sm sm:text-lg text-white/70 leading-relaxed">
              A precisely scoped feature set designed to eliminate friction at every touchpoint of the Non-Op approval lifecycle.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-col">
              {features.map((item) => (
                <FeatureCard key={item.id} title={item.title} message={item.message} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ── AUDIT TRAIL ── */}
      <section className="px-6 py-16 sm:py-24 bg-[var(--darkest-teal)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-6 lg:gap-16 items-stretch">

          {/* Left */}
          <div className="lg:col-span-3 flex flex-col relative mb-12 lg:mb-0">
            <Reveal>
              <EyebrowLabel>Audit Trail</EyebrowLabel>
              <h2 className="custom-style font-semibold text-3xl sm:text-5xl text-white leading-tight mb-4">
                Every Action.<br />Documented.<br />Every Time.
              </h2>
              <p className="custom-style-subheader-regular-case font-light text-sm sm:text-lg text-white/70 leading-relaxed">
                The platform maintains a comprehensive, chronological audit history of every event — providing the accountability your organization requires and the transparency your partners deserve.
              </p>
            </Reveal>

            {/* CTA pill — anchored to bottom on desktop */}
            <div className="mt-10 lg:mt-auto lg:absolute lg:bottom-10 lg:-right-10 sm:w-2/3">
              <div className="relative rounded-full">
                <div className="absolute rounded-full -inset-0.5 bg-gradient-to-r from-[var(--bright-pink)] via-[var(--dark-teal)] to-[var(--dark-teal)]" />
                <div className="relative flex items-center bg-black rounded-full pl-6 pr-1 py-1.5">
                  <p className="custom-style font-light text-sm sm:text-base/7 text-white/80 flex-1 py-2">Want to know more?</p>
                  <NavLink
                    to="/contactus"
                    className="custom-style font-semibold text-xs tracking-widest text-black bg-white rounded-full px-6 py-3 transition-all duration-200 hover:bg-[var(--bright-pink)] hover:text-white whitespace-nowrap"
                    role="button">
                    Let's Talk
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <Reveal delay={100} className="lg:col-span-3 lg:col-start-4">
            <div className="flex flex-col gap-1">
              {auditEvents.map((item) => (
                <AuditTrailCard key={item.id} {...item} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ── CTA ── */}
      <section className="px-6 py-16 sm:py-24 text-center bg-gradient-to-b from-[var(--darkest-teal)] to-[var(--dark-teal)]">
        <Reveal className="max-w-2xl mx-auto">
          <EyebrowLabel>Get Started</EyebrowLabel>
          <h2 className="custom-style font-semibold text-3xl sm:text-5xl text-white mb-4 leading-tight">
            Ready to <span className="text-[var(--bright-pink)]">Elevate</span> Your AFE Process?
          </h2>
          <p className="custom-style-subheader-regular-case font-light text-sm sm:text-lg text-white/70 mb-10 leading-relaxed">
            Join operators who have replaced fragmented manual follow-ups with a streamlined, fully auditable Non-Op collaboration platform.
          </p>
          <div className="relative inline-flex items-center justify-center w-56 group">
            <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-white via-[var(--dark-teal)] to-[var(--bright-pink)] transition-all duration-200 group-hover:shadow-lg group-hover:shadow-[var(--bright-pink)]/30" />
            <NavLink
              to="/contactus"
              className="relative inline-flex items-center justify-center w-full py-3 px-6 custom-style font-semibold text-sm text-white bg-black rounded-lg"
              role="button">
              Request A Demo
            </NavLink>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
