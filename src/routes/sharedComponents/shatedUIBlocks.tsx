import { formatDate, formatDateShort } from "src/helpers/styleHelpers";

type AFEHistoryRowProps = {
    user: string;
    created_at: Date;
    description: string;
};

export function AFEHistoryBlock({ user, created_at, description}: AFEHistoryRowProps) {
    return (
        <>
        <div className="flex justify-between gap-x-4">
            <div className="text-xs/6 2xl:text-sm/6">
                <span className="font-medium text-[var(--darkest-teal)] custom-style-long-text">{user}</span>
            </div>
            <p className="sr-only 2xl:not-sr-only flex-none text-xs/6 2xl:text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text ">{formatDate(created_at)}</p>
            <p className="2xl:hidden flex-none text-xs/6 2xl:text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text ">{formatDateShort(created_at)}</p>
            </div>
            <p className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style-long-text italic">{description}</p>
        </>
    )
}