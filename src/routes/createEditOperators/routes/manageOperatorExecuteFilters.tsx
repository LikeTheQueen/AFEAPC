import { fetchOperatorExecuteFilters } from 'provider/fetch';
import { updateOperatorFilterFields } from 'provider/write';
import { useEffect, useState } from 'react';
import { OperatorDropdown } from 'src/routes/sharedComponents/operatorDropdown';
import { notifyStandard } from 'src/helpers/helpers';
import { toast, ToastContainer } from 'react-toastify';

interface AFEFilterCondition {
  LeftParenthesis?: string;
  RightParenthesis?: string;
  Join?: string;
  Column?: string;
  Operator?: string;
  Value?: string;
};

const defaultAFEFilter: AFEFilterCondition[] = [
  {
    "LeftParenthesis": "(",
    "Column": "$STATUS",
    "Operator": "=",
    "Value": "No Status"
  },
  {
    "RightParenthesis": ")",
    "Join": "OR",
    "Column" : "$NOTE",
    "Operator": "CONTAINS",
    "Value": "Force approved by system administrator."
  },
  {
    "LeftParenthesis": "(",
    "Column": "STATUS",
    "Operator": "=",
    "Value": "FAPP"
  },
  {
    "RightParenthesis": ")",
    "Join": "OR",
    "Column": "STATUS",
    "Operator": "=",
    "Value": "IAPP"
  },
  {
    "Join": "AND",
    "Column": "CUSTOM/OPERATOR_STATUS",
    "Operator": "=",
    "Value": "Operated"

  },
  {
    "Join": "AND",
    "Column": "OUR_WI",
    "Operator": "<",
    "Value": "100"

  }
    ];

const defaultWellFields: string[] = [
  "$ISPRIMARY",
  "CUSTOM/WELL_NAME",
  "$DESCRIPTION",
  "$CUSTOM/WELL_NUM"
    ];

export default function OperatorExecuteFilters() {
    const [opAPCID, setOpAPCID] = useState('');
    const [afeFilter, setAFEFilter] = useState<AFEFilterCondition[]>(defaultAFEFilter);
    const [rawJson, setRawJson] = useState(JSON.stringify([], null, 2));
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [wellColumns, setWellColumns] = useState<string[]>(defaultWellFields);
    const [rawWellJson, setRawWellJson] = useState(() => JSON.stringify([], null, 2));
    const [jsonWellError, setWellJsonError] = useState<string | null>(null);
    const [updateSaved, setUpdateSaved] = useState(false);
    const [saveChangesDisabled, setSaveChangesDisabled] = useState(true);

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setRawJson(value);
        try {
            const parsed = JSON.parse(value);
            setAFEFilter(parsed);
            setJsonError(null);
            setSaveChangesDisabled(false);
        } catch (err) {
            setJsonError("Invalid JSON");
        }
    };

    const handleWellJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setRawWellJson(value);
        try {
            const parsed = JSON.parse(value);
            setWellColumns(parsed);
            setWellJsonError(null);
            setSaveChangesDisabled(false);
        } catch (err) {
            setWellJsonError("Invalid JSON");
        }
    };

    const handleClickSave = async () => {
        try {
            const updateResult = await updateOperatorFilterFields(opAPCID, wellColumns, afeFilter);
console.log(updateResult,'THE UPDATE RESULT');
            if (!updateResult.ok) {
                throw new Error(updateResult.message as any);
            }
            setUpdateSaved(true);
            setSaveChangesDisabled(true);
            notifyStandard('That Save worked');
        } catch (error) {
            console.log(error);
            return;
        }
    };

    useEffect(() => {
        if (opAPCID === '') return;
        const getFilters = async () => {
            try {
                const operatorFilters = await fetchOperatorExecuteFilters(opAPCID);
                if (!operatorFilters.ok) {
                    throw new Error(operatorFilters.message);
                }
                if (operatorFilters.data !== undefined && operatorFilters.data?.length > 0) {
                    const record = operatorFilters.data[0];
                    setAFEFilter(record.afe_filter ?? defaultAFEFilter);
                    setWellColumns(record.well_columns ?? defaultWellFields);
                    setRawJson(JSON.stringify(record.afe_filter ?? defaultAFEFilter, null, 2));
                    setRawWellJson(JSON.stringify(record.well_columns ?? defaultWellFields, null, 2));
                    
                }
            } catch (error) {
                return;
            }
        }; getFilters();
    }, [opAPCID]);

    return (
        <>
            <div className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 p-4 mb-5">
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-5 sm:divide-x sm:divide-[var(--darkest-teal)]/40">

                    <div className="col-span-2">
                        <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">AFE Source Filters & Well Fields</h2>
                        <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">These filters are the bouncers for your AFEs. They run at the source system and decide exactly what gets in, what gets kicked out, and what never even makes it to the door.</p>
                        <br></br><p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">This configuration is stored as <span className="font-bold text-gray-900 custom-style">JSONB</span>. Changing it incorrectly can break filtering, block AFEs from loading, or cause incorrect data to flow through the system. Edit at your own risk.</p>
                    </div>
                    <div className="col-span-3 grid grid-cols-1 gap-x-8 gap-y-0 ">
                        <div className='w-1/2'>
                            <h1 className="text-base/7 font-medium text-[var(--darkest-teal)] custom-style">Select an Operator to View Filters:</h1>
                            <div>
                                <OperatorDropdown
                                    value={opAPCID}
                                    onChange={(id) => { setOpAPCID(id) }}
                                    limitedList={true}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 mt-5 sm:divide-x sm:divide-[var(--darkest-teal)]/60 border-t border-t-[var(--darkest-teal)]/60 py-5">
                            <div className="col-span-1 pr-10">
                                <label htmlFor="afeFilter" className="text-base/7 font-medium text-[var(--darkest-teal)] custom-style">AFE Filter</label>
                                <textarea
                                    id="afeFilter"
                                    value={rawJson}
                                    onChange={handleJsonChange}
                                    rows={20}
                                    className={`w-full custom-style-long-text text-base/6 p-2 border rounded-2xl ${jsonError ? "border-red-500" : "border-[var(--darkest-teal)]/30"}`}
                                />
                                {jsonError && <p className="text-red-500 text-sm mt-1">{jsonError}</p>}
                            </div>

                            <div className="col-span-1">
                                <label htmlFor="afeFilter" className="text-base/7 font-medium text-[var(--darkest-teal)] custom-style">Well Fields</label>
                                <textarea
                                    id="wellFields"
                                    value={rawWellJson}
                                    onChange={handleWellJsonChange}
                                    rows={20}
                                    className={`w-full custom-style-long-text text-base/6 p-2 border rounded-2xl ${jsonError ? "border-red-500" : "border-[var(--darkest-teal)]/30"}`}
                                />
                                {jsonError && <p className="text-red-500 text-sm mt-1">{jsonError}</p>}
                            </div>
                        </div>
                        <div className="text-right mt-4">
                  <button
                    className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                    disabled={saveChangesDisabled}
                    onClick={(e: any) => handleClickSave()}
                  >Save Changes</button>
                </div>
                    </div>

                </div>
            </div>
            <ToastContainer/>
        </>
    )
};