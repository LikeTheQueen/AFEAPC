import NoSelectionOrEmptyArrayMessage from "src/routes/sharedComponents/noSelectionOrEmptyArrayMessage";

type Props = {
    afeLength: number;
    afeFetchError: boolean;
    mode: 'Operated' | 'Non-Operated';
};

type MessageProps = {
    mode: 'Operated' | 'Non-Operated';
}

export function AFEHeader({ afeLength, afeFetchError, mode }: Props) {
    return (
        <>
        <div className="mt-4 sm:mt-0 mb-4 p-3 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70" data-testid={`${mode}AFElistHeader`}>
              <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">{mode} AFEs</h2>
                <p className="mt-1 text-center text-sm/6 sm:text-base/7 text-[var(--darkest-teal)] custom-style">AFEs older than 45 days can be found on the Historical AFE tab, unless the partner status is New.  AFEs can be archived from the AFE.</p>
              <div hidden ={!afeFetchError ? true : afeLength > 0  ? true : false} data-testid={`No${mode}AFElist`}>
              <NoSelectionOrEmptyArrayMessage 
              message={afeFetchError ? 'Unable to retrieve AFEs for the user.  Contact AFE Partner Support' : `There are no ${mode} AFEs to View`}
              >
              </NoSelectionOrEmptyArrayMessage>
            </div>
              </div>
        </>

    );

};

export function NoFilteredAFEsToView({ mode }: MessageProps) {
    return (
        <div className="overflow-hidden mt-6 flex justify-center items-center" data-testid={`${mode}NoFilteredAFEs`}>
            <div className="relative w-full sm:w-9/10 h-20">
                <div aria-hidden="true" className="absolute inset-0 flex justify-center items-center">
                    <div className="sm:w-full border-t border-[var(--darkest-teal)] border-1" />
                </div>
                <div className="relative flex justify-center items-center h-20">
                    <span className="bg-white text-sm/6 sm:px-3 sm:text-base/7 font-semibold custom-style text-[var(--darkest-teal)]">{`There are no ${mode} AFEs to view`}</span>
                </div>
            </div>
        </div>
    )

};