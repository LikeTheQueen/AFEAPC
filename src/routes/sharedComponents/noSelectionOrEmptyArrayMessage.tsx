type MessageProps = {
    message: React.ReactNode; 
};

export default function NoSelectionOrEmptyArrayMessage({ message }: MessageProps) {
    return (
        <>
            <div className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 max-h-60 flex items-center justify-center">
                <h2 className="font-normal text-[var(--darkest-teal)] custom-style-long-text p-2 text-sm/6 xl:text-base/7">{message}</h2>
            </div>
        </>
    )
};