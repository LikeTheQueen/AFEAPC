import { useEffect, useRef, type ReactNode } from "react";
import { NavLink } from "react-router";

const cardVerbiage = [
    {
        number: '01', title: 'Automated AFE Ingestion', message: 'AFEs are pulled automatically and in real time directly from your source system — no manual entry, no lag, no discrepancies. Your data arrives precisely as it was authored.'
    },
    {
        number: '02', title: 'Partner AFE Portal Access', message: 'Non-Op partners gain secure, role-based access to a curated portal where they can review full AFE details, explore line-item breakdowns, and download associated attachments.'
    },
    {
        number: '03', title: 'Consent Upload & Approval', message: 'Partners upload their signed Non-Op agreement directly to the platform and mark the AFE as approved — triggering an instant status update visible to all authorized stakeholders.'
    },
    {
        number: '04', title: 'Notifications & Audit Trail', message: 'Every action triggers intelligent email notifications to the right people at the right time. A comprehensive, tamper-evident audit history logs every view, upload, and status change.'
    }
];

const features = [
  {
    id: 1,
    title: "Live AFE Visibility",
    message: "Partners view up-to-the-minute AFE data drawn directly from the source — authoritative, accurate, and always current."
  },
  {
    id: 2,
    title: "One-Click Export",
    message: "Export full AFE packages in a single action — formatted, organized, and ready for internal review or archival."
  },
  {
    id: 3,
    title: "Attachment Access",
    message: "Supporting documents, exhibits, and supplemental files are surfaced directly alongside the AFE — no hunting, no separate requests."
  },
  {
    id: 4,
    title: "Secure & Required Non-Op Agreement Upload",
    message: "Partners submit signed Non-Op agreements through an encrypted, access-controlled upload flow with immediate acknowledgment before they can approve or reject the AFE."
  },
  {
    id: 5,
    title: "Intelligent Email Notifications",
    message: "Automated, contextual alerts keep every stakeholder informed — from initial AFE availability through final approval or rejection confirmation."
  },
  {
    id: 6,
    title: "Immutable Audit History",
    message: "A complete, chronological log of every platform event — who did what, and when — providing ironclad accountability and compliance support."
  }
];

const auditEvents = [
  {
    id: 1,
    daysAgo: 0,
    time: "10:42 AM",
    title: "Non-Op Agreement Uploaded",
    message: "Signed agreement submitted by J. Martinez, Ridgeline Energy Partners. AFE-2024-1147 marked Approved."
  },
  {
    id: 2,
    daysAgo: 0,
    time: "9:15 AM",
    title: "AFE Viewed",
    message: "Rachel Green at CW Oil Company viewed AFE #DC56090 S2."
  },
  {
    id: 3,
    daysAgo: 0,
    time: "8:01 AM",
    title: "AFE Downloaded",
    message: "AFE-2024-1152 downloaded by Ross Gellar at WC Energy Partners."
  },
  {
    id: 4,
    daysAgo: 1,
    time: "3:30 PM",
    title: "AFE Exported",
    message: "Full AFE-2024-1147 package exported by C. Okonkwo, Apex Capital Group."
  },
  {
    id: 5,
    daysAgo: 6,
    time: "11:08 AM",
    title: "AFE Rejected",
    message: "AFE-2024-1147 rejected by T. Nguyen, Summit Resources LLC."
  }
];

function formatEventDate(daysAgo: number, time: string): string {
  if (daysAgo === 0) return `Today, ${time}`;
  if (daysAgo === 1) return `Yesterday, ${time}`;
  return `${daysAgo} days ago, ${time}`;
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


export default function HowItWorks() {
    return (
    <>
    <div className='bg-black/20'>
        <div className="max-w-full mx-auto">
        
        <div className="flex flex-col items-center text-center backdrop-blur-5xl bg-gradient-to-b from-black/20 via-black/45 to-black/45 pb-6 sm:pb-8">
            
            <h2 className="mx-auto max-w-8xl text-2xl sm:text-7xl font-light text-white custom-style p-2 sm:p-6 pb-0">
                A Global AFE Platform Engineered for<span className="text-white custom-style-subheader font-bold"> Effortless </span>Non-Op Collaboration</h2>
                <h2 className="max-w-5xl text-md sm:text-2xl font-extralight text-white/90 custom-style-subheader-regular-case p-2 sm:p-6 pb-0 mt-2 sm:mt-0">
                    a purpose-built pipeline that connects your AFE systems directly to Non-Op partners — delivering real-time AFE visibility, streamlined approvals, and an unbreakable audit trail.
                </h2>
        </div>
        <div className="bg-gradient-to-l from-black/45 via-black/45 to-[var(--dark-teal)] sm:h-3 w-full animate-divider-reveal" />
        <div className="border-t border-t-white/50 sm:border-none flex flex-col items-start text-start backdrop-blur-5xl bg-gradient-to-br from-black/45 via-black/45 to-white pt-4 sm:pt-2">
            <h2 className="sm:max-w-1/2 text-2xl sm:text-5xl font-semibold text-white custom-style p-2 sm:p-6 pb-0 text-center sm:text-start">
                From Source System to Signed Agreement</h2>
                <h2 className="max-w-half text-md sm:text-2xl font-extralight text-white/80 custom-style-subheader-regular-case p-2 mt-2 sm:mt-0 text-center sm:text-start">
                    four precise steps that transform a cumbersome AFE process into an orchestrated, transparent workflow.
                </h2>
         <Reveal
         delay={200}>
        <div className="max-w-5/6 mx-auto grid grid-cols-1 sm:grid-cols-4 gap-4 sm:mt-6 p-2 pb-4 sm:p-6 sm:pb-6">
           
            {cardVerbiage.map((item) => (
        <HowItWorksCard key={item.number}
        number={item.number}
        title={item.title}
        message={item.message}
        ></HowItWorksCard>
        ))}
        
        </div></Reveal>
        </div>
        <Reveal
        delay={200}>
        <div className="grid grid-cols-1 sm:grid-cols-7 items-start bg-[var(--dark-teal)] pb-6 sm:pb-8">
            <div className="text-start sm:col-span-4">
        <h2 className="mx-auto max-w-8xl text-2xl sm:text-4xl font-semibold text-white custom-style p-2 sm:pl-4 pb-0">
                Everything Your Partners Need.</h2>
                <h2 className="mx-auto max-w-8xl text-2xl sm:text-4xl font-semibold text-white custom-style p-0 pl-6">
                <span className="text-[var(--bright-pink)]">Nothing </span>They Don't.</h2>
                <h2 className="max-w-9xl text-sm sm:text-lg/9 font-light text-white custom-style-subheader p-4 sm:p-0 sm:pl-10 sm:pt-4 pb-0 text-center sm:text-start mt-2 sm:mt-0">
                    A precisely scoped feature set designed to eliminate friction at every touchpoint of the Non-Op approval lifecycle.
                </h2>
            </div>
            
            <div className="sm:col-span-5 sm:col-start-2 max-w-5/6 mx-auto grid grid-cols-1 sm:grid-cols-3 sm:gap-6 mx-auto justify-center mt-10 sm:mt-0">
                {features.map((item) => (
                    <WhyItWorksCard key={item.id}
                    number={"1"}
                    title={item.title}
                    message={item.message}
                    ></WhyItWorksCard>
                ))}
            </div>
        </div>
        </Reveal>
        <Reveal
        delay={200}>
        <div className="grid grid-cols-1 sm:grid-cols-6 bg-black/20 pb-6 sm:pb-8 sm:pt-10">
            <div className="sm:col-span-2 flex flex-col relative">
                <h2 className="max-w-8xl text-3xl sm:text-5xl font-semibold text-white custom-style p-2 sm:pl-6 pb-0 ">
                Every Action
                </h2>
                <h2 className="max-w-8xl text-3xl sm:text-5xl font-semibold text-white custom-style pl-2 sm:pl-6 pb-0">
                Documented.
                </h2>
                <h2 className="max-w-8xl text-3xl sm:text-5xl font-semibold text-white custom-style pl-2 sm:pl-6 pb-0">
                Every Time.
                </h2>
                <p className="w-full text-sm sm:text-lg/9 font-light text-white custom-style-subheader p-4 sm:p-0 sm:pl-10 sm:pt-4 pb-0 text-center sm:text-start mt-2 sm:mt-0">
                    The platform maintains a comprehensive, chronological audit history of every event — providing the accountability your organization requires and the transparency your partners deserve.
                </p>
                <div className="mt-6 sm:mt-0 relative w-9/10 sm:w-3/4 sm:-bottom-30 sm:-right-60 rounded-full z-6 self-center sm:self-end">
                  <div className="relative">
                    <div className="absolute rounded-full -inset-0.5 bg-gradient-to-r from-[var(--bright-pink)] via-[var(--dark-teal)] to-[var(--dark-teal)]"></div>
                    <div className="relative">
                      <p className="flex items-center min-h-10 w-full p-0 text-sm/6 sm:text-lg/7 text-white/80 bg-black rounded-full pl-6 py-4 sm:py-5 custom-style">
                        Want to know more?
                      </p>
                    </div>
                  </div>
                  <div className="absolute flex items-center right-1.5 inset-y-1.5 pr-2 sm:pr-1 z-6 ">
                    <NavLink
                      to='/contactus'
                      className="inline-flex items-center justify-center w-full px-12 py-1 text-sm/6 font-semibold tracking-widest text-black uppercase transition-all duration-200 bg-white rounded-full sm:w-auto sm:py-3 hover:bg-[var(--bright-pink)]/80 hover:text-white cursor-pointer"
                      role="button">
                      Let's Talk
                    </NavLink>
                  </div>
                </div>

            </div>
            <div className="sm:col-span-2 sm:col-start-4">
                <div className="max-w-5/6 mx-auto grid grid-cols-1 sm:gap-0 mx-auto justify-center mt-10 mb-10 sm:mt-0">
                {auditEvents.map((item) => (
                    <AuditTrailCards key={item.id}
                    id={item.id}
                    daysAgo={item.daysAgo}
                    time={item.time}
                    title={item.title}
                    message={item.message}
                    ></AuditTrailCards>
                ))}
                </div>

            </div>
        </div>
        </Reveal>
        <Reveal
        delay={200}>
        <div className="pt-0 sm:pt-20 max-w-8xl mx-auto text-center backdrop-blur-10xl bg-gradient-to-b from-black/20 via-[var(--darkest-teal)] to-[var(--dark-teal)] p-4 pb-6 sm:pb-8">
           <h2 className="text-3xl sm:text-5xl font-semibold text-white custom-style ">
                Ready to <span className="text-[var(--bright-pink)]">Elevate</span> Your AFE Process?
            </h2>
            <p className="text-sm sm:text-lg/9 font-light text-white custom-style-subheader p-4 pb-0 text-center mt-2 sm:mt-0">
            Join operators who have replaced fragmented email chains and manual follow-ups with a streamlined, fully auditable Non-Op collaboration platform.
            </p>
            <div className="mt-10 ">
              <div className="relative inline-flex items-center justify-center w-64 group">
                <div className="absolute -inset-px transition-all duration-200 rounded-lg bg-gradient-to-r from-white via-[var(--darkest-teal)] to-[var(--bright-pink)] group-hover:shadow-md group-hover:shadow-[#F61067]"></div>
                <NavLink
                  to='/contactus'
                  className="relative inline-flex items-center justify-center w-full py-3 px-6 custom-style font-normal text-white bg-black rounded-lg"
                  role="button">
                  Request A Demo
                </NavLink>
              </div>
            </div>
        </div>
        </Reveal>
        </div>
        {/* Keyframe injection */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
    </>
)
};

type CardProps = {
number: string; 
title:string;
message:string;
}

type AuditProps = {
    id: number;
    daysAgo: number;
    time: string;
    title: string;
    message: string;

}
function HowItWorksCard({number, title, message}: CardProps) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-[var(--dark-teal)] p-4 sm:p-6
        bg-[var(--darkest-teal)]/80 sm:bg-[var(--dark-teal)]
        transition-colors duration-500 ease-in-out
        hover:bg-[var(--darkest-teal)] 
        before:absolute before:top-0 before:left-0 
        before:h-[4px] before:w-0 before:bg-[var(--bright-pink)] 
        before:transition-[width] before:duration-500 before:ease-in-out 
        hover:before:w-full">
            <div className="flex flex-col space-x-2">
                <div className="flex flex-row justify-between items-end text-[var(--bright-pink)]/80 text-lg sm:text-2xl font-bold transition-[font-weight] duration-300 group-hover:font-bold">
                <p>
                {title}
                </p>
                <p className="text-3xl sm:text-5xl text-[var(--bright-pink)]">
                {number}
                </p> 
                </div>
                <div className="mt-4">
                <p className="font-extralight text-white font-light text-md sm:text-xl mt-4">
                {message}
                </p>
                </div>

            </div>
        </div>
    )
}

function WhyItWorksCard({number, title, message}: CardProps) {
    return (
        <div className={`group flex items-start gap-6 py-2 sm:py-8 transition-all duration-300 hover:px-3 rounded-lg hover:bg-[var(--darkest-teal)]`}>
                {/* Bullet — pink by default, lime on hover */}
                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-[#F61067] mt-[5px] shadow-[0_0_12px_rgba(246,16,103,0.5)] transition-all duration-300 group-hover:bg-[#95C623] group-hover:shadow-[0_0_12px_rgba(149,198,35,0.5)]" />

                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide mb-1 custom-style">
                    {title}
                  </h3>
                  <p className="text-[#9AA0A8] text-sm leading-7 custom-style-long-text">
                    {message}
                  </p>
                </div>
        </div>
    )
}

function AuditTrailCards({id, daysAgo, time, title, message}: AuditProps) {
    return (
        <div className={`group flex items-start gap-6 py-0 sm:py-1 transition-all duration-300 hover:px-3 hover:bg-[var(--darkest-teal)] border-l border-l-white/50 hover:rounded-lg hover:py-2`}>
                {/* Bullet — pink by default, lime on hover */}
                <div className="flex-shrink-0 w-4.5 h-3.5 rounded-full ring-1 ring-[var(--bright-pink)] bg-[var(--darkest-teal)] -ml-2 -mt-1 shadow-[0_0_12px_rgba(246,16,103,0.5)] transition-all duration-300 group-hover:bg-[#95C623] group-hover:ring-[#95C623] group-hover:shadow-[0_0_12px_rgba(149,198,35,0.5)]" />

                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide mb-1 custom-style">
                    {formatEventDate(daysAgo, time)}
                  </h3>
                  <h3 className="text-white font-bold text-sm tracking-wide mb-1 custom-style">
                    {title}
                  </h3>
                  <p className="text-[#9AA0A8] text-sm leading-7 custom-style-long-text">
                    {message}
                  </p>
                </div>
        </div>

    )
}
