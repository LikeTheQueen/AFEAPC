import { OperatorDropdown } from "src/routes/sharedComponents/operatorDropdown";
import { DaysAgoDropdown, PartnerStatusDropdown } from "./styleHelpers";
import { PartnerDropdown } from "src/routes/sharedComponents/partnerDropdown";

type AFEFiltersProps = {
    afeLength: number,
    afeNumberSearch: string;
    onAFENumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    operatorSearch: string;
    onOperatorChange: (id: string) => void;
    partnerSearch: string;
    onPartnerChange: (id: string) => void;
    afeStatusSearch: string;
    onAFEStatusSearchChange: (status: string) => void;
    daysAgo: number;
    onDaysAgoChange: (days: number) => void;
    mode: 'Operated' | 'Non-Operated';
}

export function AFEFilters({ 
  afeLength,
  afeNumberSearch,
  onAFENumberChange,
  operatorSearch,
  onOperatorChange,
  partnerSearch,
  onPartnerChange,
  afeStatusSearch,
  onAFEStatusSearchChange,
  daysAgo,
  onDaysAgoChange,
  mode,
 }: AFEFiltersProps) {
    return (
        <>
        <div className="mt-4 p-3 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70" data-testid={`${mode}AFElistFilter`}
            hidden={(afeLength > 0 ) ? false : true} >
            <h2 className="text-sm/6 2xl:text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Filter AFEs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6">
                <div>
                    <label htmlFor="afeNumberNonOp" className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style">Search on AFE Number</label>
                    <input
                        id="afeNumberNonOp"
                        name="afeNumberNonOp"
                        type="text"
                        placeholder="DC26001"
                        autoComplete="off"
                        value={afeNumberSearch}
                        onChange={onAFENumberChange}
                        autoFocus={true}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--dark-teal)] placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                    />
                </div>
                    <div hidden={mode === 'Operated'}>
                        <h2 className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style">Filter on Operator Name</h2>
                        <OperatorDropdown
                            value={operatorSearch}
                            onChange={onOperatorChange}
                            limitedList={false}>
                        </OperatorDropdown>
                    </div>
                    <div hidden={mode === 'Non-Operated'}>
                        <h2 className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style">Filter on Partner Name</h2>
                        <PartnerDropdown
                            value={partnerSearch}
                            onChange={onPartnerChange}
                            limitedList={false}>
                        </PartnerDropdown>
                    </div>
                <div >
                    <h2 className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style">{mode === 'Non-Operated' ? 'Filter on Your AFE Status' : 'Filter on Partner Status'}</h2>
                    <PartnerStatusDropdown
                        value={afeStatusSearch}
                        onChange={onAFEStatusSearchChange}>
                    </PartnerStatusDropdown>
                </div>
                <div >
                    <h2 className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style">{mode === 'Non-Operated' ? 'Filter on Op Approval Date' : 'Filter on Partner Change'}</h2>
                    <DaysAgoDropdown
                        value={daysAgo}
                        onChange={onDaysAgoChange}>
                    </DaysAgoDropdown>
                </div>
            </div>
        </div>
        </>
    );
}
