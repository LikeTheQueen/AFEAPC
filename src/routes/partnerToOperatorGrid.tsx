import { fetchPartnersLinkedOrUnlinkedToOperator } from 'provider/fetch';
import { useEffect, useMemo, useState } from 'react';
import type { OperatorPartnerAddressWithOpNameType, PartnerRecordToUpdate } from 'src/types/interfaces';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import LoadingPage from './loadingPage';
import { updatePartnerWithOpID } from 'provider/write';


export default function PartnerToOperatorGrid ({singleOpID = true, currentOpID = null}:{singleOpID: boolean, currentOpID: string | null}) {
    const [partnerListToLink, setPartnerListToLink] = useState<PartnerRecordToUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [partnerListToOperator, setPartnerListToOperator] = useState<OperatorPartnerAddressWithOpNameType[]>([]);
    const [opId, setOpID] = useState(currentOpID);
    const [singleOp, setSingleOp] = useState(singleOpID);

    useEffect(() => {
        let isMounted = true;
        async function loadPartnersToOperatorsList() {
            setLoading(true);
            try {
                const data = await fetchPartnersLinkedOrUnlinkedToOperator();
                if (isMounted) {
                    console.log(data, 'THE RETURN')
                    const filterNull = data.filter(record => record.apc_op_id === "");
                    console.log(filterNull, 'THE FILTER')
                    setPartnerListToOperator(filterNull ?? []);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }
        loadPartnersToOperatorsList();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        setOpID(currentOpID);
    }, [currentOpID])

    const gridData = useMemo(() => {
        return [...partnerListToOperator].sort((a, b) => {
    const nameA = a.apc_op_name;
    const nameB = b.apc_op_name;

    if (nameA == null && nameB == null) return 0;      
    if (nameA == null) return -1;                      
    if (nameB == null) return 1;                       
    return nameA.localeCompare(nameB);                 
  });
    }, [partnerListToOperator]);

    const handleCheckboxChange = (
        id: string,
        apc_op_id: string | null
    ) => {
        setPartnerListToLink(prevPartnerListToLink => {
            const updatedPartnerListToLink = [...prevPartnerListToLink];
            const existingIndex = updatedPartnerListToLink.findIndex(
                entry => entry.id === id && entry.apc_op_id === apc_op_id

            );
            if (existingIndex > -1) {
                updatedPartnerListToLink.splice(existingIndex,1);
            } else {
                updatedPartnerListToLink.push({
                    id: id,
                    apc_op_id: apc_op_id

                })
            }
            return updatedPartnerListToLink;
        })
    };

    async function updatePartnerWithOpIDChange() {
        await updatePartnerWithOpID(partnerListToLink)
    };
console.log(partnerListToLink, 'THE LIST OF PARTNERS TO LINK')
console.log(opId, 'THE OP ID IN THE GRID')
if (loading) return <LoadingPage/>
    return (
        <>
    <div className="px-4 py-6 sm:p-8">
      <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
        {gridData.map((partner) => (
          <li key={partner.apc_id} className="col-span-1 flex rounded-md shadow-xs dark:shadow-none">
            <div
              className={`${partner.apc_op_name ? "bg-[var(--bright-pink)]" : "bg-gray-200"} flex w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white`}>
              <div className="group grid size-6 grid-cols-1">          
                <input
                  type="checkbox"
                  defaultChecked={partner.apc_op_name ? true : false}
                  disabled={opId === null ? true : false}
                  onChange={(e) => handleCheckboxChange(partner.apc_id!,partner.apc_op_name ? null : opId)}
                  aria-describedby="comments-description"
                  className={`col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--darkest-teal)] checked:border-[var(--bright-pink)] ${partner.apc_op_name ? "checked:bg-[var(--bright-pink)] bg-[var(--bright-pink)]" : "checked:bg-gray-200"} 
                  group-has-disabled:checked:bg-gray-300 group-has-disabled:checked:border-gray-500 ...`}/>
                            <svg
                              fill="none"
                              viewBox="0 0 14 14"
                              className={`pointer-events-none col-start-1 row-start-1 size-5.5 self-center justify-self-center ${partner.apc_op_name ? "stroke-white" : "stroke-black"} group-has-disabled:stroke-gray-950/25`}>
                              <path
                                d="M3 8L6 11L11 3.5"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-has-checked:opacity-100"/>
                              <path
                                d="M3 7H11"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-has-indeterminate:opacity-100"/>
                            </svg>
                          </div>
            </div>
            <div className="flex flex-1 items-center justify-between rounded-r-md border-t border-r border-b border-gray-200 bg-white ">
              <div className="flex-1  px-4 py-2 text-xs/6 2xl:text-sm/6">
                <p className="font-bold text-[var(--dark-teal)] custom-style">Associated Operator: <span className="font-medium not-italic custom-style-long-text">{partner.apc_op_name ? partner.apc_op_name :'Unclaimed'}</span></p>
                <p className="font-bold text-[var(--dark-teal)] custom-style">Alias: <span className="font-medium not-italic custom-style-long-text">{partner.name}</span></p>
                <p className="text-[var(--dark-teal)] custom-style-long-text font-normal mt-1 w-full ">{partner.street} {partner.suite} {partner.city}, {partner.state} {partner.zip}</p>  
              </div>
              <div className="shrink-0 pr-2">
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 dark:hover:text-white dark:focus:outline-white">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
<div className="flex items-center justify-end gap-x-6 border-t border-gray-900/20 px-4 py-4 sm:px-8">
                  <button 
                  disabled={opId===null || partnerListToLink.length<1}
                  onClick={async(e: any) => { 
                e.preventDefault();
                updatePartnerWithOpIDChange();
                }}
                  className="rounded-md bg-[var(--darkest-teal)] disabled:bg-gray-300 px-3 py-2 text-sm font-semibold text-white custom-style shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]">
                    Save 
                  </button>
    </div>
    </>
  )
}