import { useState, useEffect, useRef, type ReactNode } from "react";
import { NavLink } from "react-router";

// ── DATA ─────────────────────────────────────────────────────────────────────

const faqCategories = [
  {
    id: "access",
    label: "Access & Security",
    eyebrow: "Your Data, Protected",
    questions: [
      {
        id: "a1",
        q: "Who can see which AFEs?",
        a: "Access in AFE Partner Connections is controlled at two levels. When an AFE is pulled from the operator's source system, it is automatically made available to the corresponding Non-Op Partners. Within their own organization, Non-Op Partners manage their own internal role-based access, controlling which of their users can view the AFEs sent to them. On the operator side, administrators can configure user access to show operated AFEs, Non-Op AFEs, or both.",
      },
      {
        id: "a2",
        q: "Can a Non-Op partner see AFEs belonging to another partner?",
        a: "Each Partner only sees AFEs that have been sent to them from the Operator, enforced at the platform level.",
      },
      {
        id: "a3",
        q: "How is access controlled?",
        a: "Access is role-based at the company level. Each organization — whether an operator or a Non-Op Partner — assigns permissions to their own users. Operators can grant users access to operated AFEs, Non-Op AFEs, or both. Non-Op Partners control which of their users can see the AFEs that have been sent to their organization.",
      },
      {
        id: "a4",
        q: "What happens when a partner's access is revoked?",
        a: "When a partner's access is revoked, their users are disabled and can no longer log in or view any AFEs. Historical data is retained in full — all prior views, downloads, approvals, and activity remain in the audit trail for compliance and record-keeping purposes.",
      },
    ],
  },
  {
    id: "process",
    label: "The AFE Process",
    eyebrow: "From Your AFE System to AFE Partner Connections",
    questions: [
      {
        id: "p1",
        q: "How does an AFE get into the platform?",
        a: "AFEs are pulled directly from the operator's source system via an API connection secured with encrypted keys. Once the connection is established, AFEs flow into the platform automatically — no manual entry or file transfers required.",
      },
      {
        id: "p2",
        q: "How do partners know when a new AFE is available?",
        a: "When a new AFE is imported, Non-Op Partners receive an automated email notification and the AFE appears on their dashboard with a status of New. As partners interact with the AFE, the status updates to reflect where it is in the process — Viewed, Approved, or Rejected.",
      },
      {
        id: "p3",
        q: "Can a partner download or export an AFE?",
        a: "Yes. Partners can download all attachments and form letters associated with an AFE directly from the platform. AFE estimates can be exported with a translation of account codes from the operator's chart of accounts to the partner's — eliminating the need for manual mapping. Partners can also export AFE details in bulk directly from the dashboard.",
      },
      {
        id: "p4",
        q: "What file formats are supported for the Non-Op agreement upload?",
        a: "Signed Non-Op agreements must be uploaded as a PDF.",
      },
    ],
  },
  {
    id: "approvals",
    label: "Approvals & Agreements",
    eyebrow: "Signatures & Decisions",
    questions: [
      {
        id: "ap1",
        q: "Does a partner have to upload a signed agreement before they can approve?",
        a: "Yes. A signed Non-Op agreement must be uploaded as a PDF before the approval/rejection action becomes available. The platform enforces this requirement — partners cannot approve or reject an AFE without first submitting the signed document.",
      },
      {
        id: "ap2",
        q: "What happens after an AFE is approved?",
        a: "When an AFE is approved, the status updates immediately and an email notification is sent to the operator. The approval is also recorded in the audit trail with a full timestamp and the details of the user who performed the action.",
      },
      {
        id: "ap3",
        q: "Can an approval be reversed?",
        a: "No. Once an AFE has been approved, the decision is final and cannot be reversed in the platform. If a correction is needed, contact your operator directly to work through the appropriate process outside the platform.",
      },
      {
        id: "ap4",
        q: "What if a partner rejects an AFE?",
        a: "When an AFE is rejected, the status updates immediately and an email notification is sent to the operator. The rejection is also recorded in the audit trail with a full timestamp and the details of the user who performed the action.",
      },
    ],
  },
  {
    id: "audit",
    label: "Audit & Compliance",
    eyebrow: "Every Action on Record",
    questions: [
      {
        id: "au1",
        q: "What gets logged in the audit trail?",
        a: "Every AFE view, document download, and status change is captured in the audit trail with a full timestamp and the details of the user who performed the action.",
      },
      {
        id: "au2",
        q: "How long is audit history retained?",
        a: "Audit history is retained indefinitely. Every action recorded in the platform remains accessible for as long as your organization is active.",
      },
      {
        id: "au3",
        q: "Can audit history be exported?",
        a: "Not at this time. Audit history is available to view directly within the platform but cannot be exported.",
      },
    ],
  },
  {
    id: "general",
    label: "Getting Started",
    eyebrow: "Setup & Onboarding",
    questions: [
      {
        id: "g1",
        q: "Do Non-Op partners need to create an account?",
        a: "Yes, Non-Op Partners will need to create an account if they don't already have one. If their organization is already set up in the platform, access is seamless once the operator has completed their onboarding and configured the appropriate permissions.",
      },
      {
        id: "g2",
        q: "What source systems does the platform integrate with?",
        a: "Currently AFE Partner Connections integrates with Quorum Execute. Additional source systems are on the roadmap — the platform is designed to be AFE system agnostic, and we are happy to work with you to build an integration for your system.",
      },
      {
        id: "g3",
        q: "Is there a mobile version?",
        a: "The platform is mobile-friendly and accessible from any device, but it is designed primarily for laptop and desktop use given the nature of AFE review and approval work.",
      },
      {
        id: "g4",
        q: "How do I get my organization set up?",
        a: "Reach out to us through the Contact Us page to get started. The onboarding process begins with verifying that your AFE system is accessible via API — if you can hit it with a tool like Postman, we can build the connection. Once that is established, we configure the integration and the operator sets up their users and permissions. The process is straightforward and our team supports you through every step.",
      },
    ],
  },
];

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

// ── ACCORDION ITEM ────────────────────────────────────────────────────────────

function AccordionItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`border-b border-white/[0.06] transition-colors duration-200 ${isOpen ? "bg-[var(--dark-teal)]/30" : "hover:bg-white/[0.02]"}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-6 px-6 py-5 text-left group"
      >
        <span className={`custom-style font-semibold text-sm sm:text-base leading-snug transition-colors duration-200 ${isOpen ? "text-white" : "text-white/80 group-hover:text-white"}`}>
          {q}
        </span>
        {/* Plus / minus icon */}
        <span className="flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded-sm border border-white/10 transition-all duration-300 group-hover:border-[var(--bright-pink)]/40">
          <svg viewBox="0 0 16 16" className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}>
            <line x1="8" y1="2" x2="8" y2="14" stroke={isOpen ? "var(--bright-pink)" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="2" y1="8" x2="14" y2="8" stroke={isOpen ? "var(--bright-pink)" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {/* Animated body */}
      <div
        ref={bodyRef}
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{ maxHeight: isOpen ? bodyRef.current?.scrollHeight ?? 500 : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div className="px-6 pb-6 border-l-2 border-[var(--bright-pink)]/30 ml-6">
          <p className="custom-style-subheader-regular-case font-light text-sm leading-7 text-[var(--light-grey)]">{a}</p>
        </div>
      </div>
    </div>
  );
}

// ── FAQ CATEGORY BLOCK ────────────────────────────────────────────────────────

function FaqCategory({ category, openId, onToggle }: {
  category: typeof faqCategories[0];
  openId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <Reveal className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-12 items-start">

        {/* Category label — sticky on desktop */}
        <div className="lg:sticky lg:top-24 pt-1">
          <EyebrowLabel>{category.eyebrow}</EyebrowLabel>
          <h2 className="custom-style font-semibold text-xl sm:text-2xl text-white leading-tight">{category.label}</h2>
        </div>

        {/* Questions */}
        <div className="border border-white/[0.06] rounded-sm overflow-hidden">
          {category.questions.map((item) => (
            <AccordionItem
              key={item.id}
              q={item.q}
              a={item.a}
              isOpen={openId === item.id}
              onToggle={() => onToggle(item.id)}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  function handleToggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

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

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full
          bg-[radial-gradient(ellipse,rgba(246,16,103,0.07),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center animate-[fadeUp_0.8s_ease_both]">
          <EyebrowLabel>FAQ</EyebrowLabel>
          <h1 className="custom-style font-semibold text-4xl sm:text-6xl leading-[1.05] tracking-tight text-white mb-6">
            Questions, <span className="text-[var(--bright-pink)]">Answered.</span>
          </h1>
          <p className="custom-style-subheader-regular-case font-light text-sm sm:text-lg text-white/70 leading-relaxed max-w-xl mx-auto">
            Everything operators and Non-Op partners need to know about how AFE Partner Connections works — from access controls to audit history.
          </p>
        </div>
      </section>

      <Divider />

      {/* ── QUICK NAV ── */}
      <section className="px-6 py-8 bg-[var(--darkest-teal)] border-b border-white/[0.06]">
        <div className="max-w-5xl sm:max-w-6xl mx-auto flex flex-wrap gap-3">
          {faqCategories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="custom-style font-normal text-xs sm:text-sm tracking-[0.18em] text-white border border-white/60 px-4 py-2 rounded-sm
                transition-all duration-200 hover:text-white hover:border-[var(--bright-pink)]/40 hover:bg-[var(--bright-pink)]/5"
            >
              {cat.label}
            </a>
          ))}
        </div>
      </section>

      {/* ── FAQ SECTIONS ── */}
      <section className="px-6 pt-16 sm:pt-24 bg-[var(--darkest-teal)]">
        <div className="max-w-5xl mx-auto">
          {faqCategories.map((cat) => (
            <div key={cat.id} id={cat.id}>
              <FaqCategory
                category={cat}
                openId={openId}
                onToggle={handleToggle}
              />
              <Divider />
              <div className="mb-12" />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-0 pb-10 sm:py-0 sm:pb-20 text-center bg-gradient-to-b from-[var(--darkest-teal)] to-[var(--dark-teal)]">
        <Reveal className="max-w-2xl mx-auto">
          <EyebrowLabel>Still Have Questions?</EyebrowLabel>
          <h2 className="custom-style font-semibold text-3xl sm:text-5xl text-white leading-tight mb-4">
            Let's Talk Through It.
          </h2>
          <p className="custom-style-subheader-regular-case font-light text-sm sm:text-lg text-white/70 mb-10 leading-relaxed">
            Can't find what you're looking for? We're happy to walk you through the platform and answer any questions specific to your organization's workflow.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <NavLink to="/contactus"
              className="custom-style font-semibold text-sm tracking-[0.15em] text-[var(--darkest-teal)] bg-[var(--bright-pink)] px-10 py-4 rounded-sm
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(246,16,103,0.4)]">
              Contact Us
            </NavLink>
            <NavLink to="/requestdemo"
              className="custom-style font-semibold text-sm tracking-[0.15em] text-white border border-white/20 px-10 py-4 rounded-sm
                transition-all duration-200 hover:border-white/50 hover:bg-white/[0.04]">
              Request a Demo
            </NavLink>
          </div>
        </Reveal>
      </section>
    </div>
    
  );
}
