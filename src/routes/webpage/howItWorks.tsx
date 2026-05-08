
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
    title: "Secure Agreement Upload",
    message: "Partners submit signed Non-Op agreements through an encrypted, access-controlled upload flow with immediate acknowledgment."
  },
  {
    id: 5,
    title: "Intelligent Email Notifications",
    message: "Automated, contextual alerts keep every stakeholder informed — from initial AFE availability through final approval confirmation."
  },
  {
    id: 6,
    title: "Immutable Audit History",
    message: "A complete, chronological log of every platform event — who did what, and when — providing ironclad accountability and compliance support."
  }
];

export default function HowItWorks() {
    return (
    <>
    <div className='bg-black/20'>
        <div className="max-w-full mx-auto ">
        <div className="flex flex-col items-center text-center bg-gradient-to-b from-black/20 via-black/45 to-black/45 pb-6 sm:pb-8">
            <h2 className="mx-auto max-w-8xl text-3xl sm:text-8xl font-semibold text-white custom-style p-2 sm:p-6 pb-0">
                Engineered for<span className="text-[var(--bright-pink)]"> Effortless </span>Non-Op Collaboration</h2>
                <h2 className="max-w-5xl text-sm sm:text-2xl font-normal text-white/80 custom-style-long-text p-2 sm:p-6 pb-0">
                    A purpose-built pipeline that connects your source systems directly to Non-Op partners — delivering real-time AFE visibility, streamlined approvals, and an unbreakable audit trail.
                </h2>
        </div>
        <div className="bg-gradient-to-l from-black/45 via-black/45 to-[var(--bright-green)] sm:h-3 w-full animate-divider-reveal" />
        <div className="border-t border-t-white/50 sm:border-none flex flex-col items-start text-start backdrop-blur-5xl bg-gradient-to-br from-black/45 via-black/45 to-white pt-4 sm:pt-2">
            <h2 className="sm:max-w-1/2 text-3xl sm:text-5xl font-semibold text-white custom-style p-2 sm:p-6 pb-0 text-center sm:text-start">
                From Source System to Signed Agreement</h2>
                <h2 className="max-w-half text-md sm:text-2xl font-extralight text-white/80 custom-style-subheader p-2 text-center sm:text-start">
                    Four precise steps that transform a cumbersome approval process into an orchestrated, transparent workflow.
                </h2>
        
        <div className="max-w-5/6 mx-auto grid grid-cols-1 sm:grid-cols-4 gap-2 sm:mt-6 p-2 pb-4 sm:p-6 sm:pb-6">
            {cardVerbiage.map((item) => (
        <HowItWorksCard key={item.number}
        number={item.number}
        title={item.title}
        message={item.message}
        ></HowItWorksCard>
        ))}
        </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-7 items-start bg-[var(--dark-teal)] pb-6 sm:pb-8">
            <div className="text-start sm:col-span-4">
        <h2 className="mx-auto max-w-8xl text-2xl sm:text-4xl font-semibold text-white custom-style p-2 sm:p-2 pb-0">
                Everything Your Partners Need.</h2>
                <h2 className="mx-auto max-w-8xl text-2xl sm:text-4xl font-semibold text-white custom-style p-0 pl-2">
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
        </div>
    </div>
    </>
)
};

type CardProps = {
number: string, 
title:string,
message:string
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
                <div className="flex flex-row justify-between items-end text-[var(--bright-pink)]/80 text-lg sm:text-2xl font-medium transition-[font-weight] duration-300 group-hover:font-bold">
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
        <div
                
                className="group flex items-start gap-6 py-2 sm:py-8 transition-all duration-300 hover:px-3 rounded-lg hover:bg-[var(--darkest-teal)]"
              >
                {/* Bullet — pink by default, lime on hover */}
                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-[#F61067] mt-[5px] shadow-[0_0_12px_rgba(246,16,103,0.5)] transition-all duration-300 group-hover:bg-[#95C623] group-hover:shadow-[0_0_12px_rgba(149,198,35,0.5)]" />

                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide mb-1 custom-style">
                    {title}
                  </h3>
                  <p className="text-[#9AA0A8] text-sm leading-7">
                    {message}
                  </p>
                </div>
                </div>
    )
}
