import { AtSymbolIcon } from "@heroicons/react/24/outline";

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
]

export default function HowItWorks() {
    return (
    <>
    <div className="px-6 sm:px-0">
        <div className="max-w-full mx-auto">
        <div className="flex flex-col items-center text-center bg-gradient-to-b from-black/20 via-black/45 to-black/45">
            <h2 className="max-w-full text-3xl sm:text-8xl font-semibold text-center text-white custom-style p-6 ">
                Engineered for<span className="text-[var(--bright-pink)]"> Effortless </span>Non-Op Colloboration</h2>
                <h2 className="max-w-5xl text-sm sm:text-2xl font-normal text-white/80 custom-style-long-text p-6">
                    A purpose-built pipeline that connects your source systems directly to Non-Op partners — delivering real-time AFE visibility, streamlined approvals, and an unbreakable audit trail.
                </h2>
        </div>
        <div className="py-40 px-10 flex flex-col items-start text-start backdrop-blur-5xl bg-gradient-to-br from-black/45 via-black/45 to-[var(--dark-teal)] to-white to-[var(--dark-teal)] to-white ">
            <h2 className="max-w-8xl text-3xl sm:text-5xl font-semibold text-white custom-style">
                From Source System to Signed Agreement</h2>
                <h2 className="max-w-5xl text-sm sm:text-2xl font-extralight text-white/70 custom-style-long-text">
                    Four precise steps that transform a cumbersome approval process into an orchestrated, transparent workflow.
                </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-15">
            {cardVerbiage.map((item) => (
        <HowItWorksCard key={item.number}
        number={item.number}
        title={item.title}
        message={item.message}
        ></HowItWorksCard>
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
        <div className="group relative overflow-hidden rounded-xl border border-[var(--dark-teal)] p-6
        bg-[var(--dark-teal)]
        transition-colors duration-500 ease-in-out
        hover:bg-[var(--darkest-teal)] 
        before:absolute before:top-0 before:left-0 
        before:h-[4px] before:w-0 before:bg-[var(--bright-pink)] 
        before:transition-[width] before:duration-500 before:ease-in-out 
        hover:before:w-full">
            <div className="flex flex-col ">
                <div className="flex flex-row justify-between items-end text-[var(--bright-pink)]/80 text-xl font-medium transition-[font-weight] duration-300 group-hover:font-bold">
                <p>
                {title}
                </p>
                <p className="text-5xl text-[var(--bright-pink)]">
                {number}
                </p> 
                </div>
                <div className="font-light text-white/90 text-lg mt-4">
                <p>
                {message}
                </p>
                </div>

            </div>
        </div>
    )
}
