import { useEffect, useState } from "react";
import { useSupabaseData } from "src/types/SupabaseContext";
import { fetchAllOperators, fetchOperatorsOrPartnersToEdit } from "provider/fetch";
import type { OperatorOrPartnerList, OperatorPartnerRecord } from "src/types/interfaces";
import { transformOperatorPartnerRecord } from "src/types/transform";

type Props = {
  onChange?: (id: string[]) => void;
  limitedList: boolean;
  initialSelectedIds?: string[];
  isDisabled: boolean;
};

export function OperatorDropdownMultiSelect({ onChange, limitedList, initialSelectedIds = [], isDisabled }: Props) {
  const { loggedInUser, session } = useSupabaseData();
  const token = session?.access_token ?? "";
  const [opAPCIDMulti, setOpAPCIDMulti] = useState<string[]>(initialSelectedIds);
  const [filteredOperators, setFilteredOperators] = useState<OperatorOrPartnerList[] | []>([]);
  const [operatorsList, setOperatorsList] = useState<OperatorPartnerRecord[] | []>([]);
  
  function handleCheckboxChange(apcId: string, isChecked: boolean) {
    const updatedIds = isChecked
      ? [...opAPCIDMulti, apcId]  
      : opAPCIDMulti.filter(id => id !== apcId);  
    
    setOpAPCIDMulti(updatedIds);
    onChange?.(updatedIds);  
    };

  useEffect(() => {
          if (!loggedInUser || token==='') return;
          let isMounted = true;
          async function populateOperatorList() {
            if(!loggedInUser?.user_id) return;

            try{
              const opListResult = await fetchOperatorsOrPartnersToEdit(loggedInUser?.user_id!, 'OPERATOR_USER_PERMISSIONS', 'OPERATOR_ADDRESS', [1,8,9], token);

              if(opListResult.ok) {
                const opListTransformed = transformOperatorPartnerRecord(opListResult.data);

                if(isMounted) {
                  setOperatorsList(opListTransformed);
                }
              }

            } catch(e) {
          console.error('Unable to get Operators or Permissions',e);
           } finally {
                return;
            }
          }
          populateOperatorList();
      }, [loggedInUser])

    function selectAll() {
    const all = operatorsList.map((o) => o.apc_id!);
    setOpAPCIDMulti(all);
    onChange?.(all);
  }
  function clearAll() {
    setOpAPCIDMulti([]);
    onChange?.([]);
  }
  
  return (
    <>
  <div className="border rounded-lg max-h-50 min-h-50 overflow-y-auto shadow-xl ring-1 ring-[var(--darkest-teal)]/50 p-2 ">
  <h1 className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style px-3 font-semibold">Operator(s):</h1>
  
  {operatorsList.map((option) => (
    <label 
      key={option.apc_id}
      className="flex items-start gap-2 p-2 hover:bg-[var(--darkest-teal)]/20 cursor-pointer">
        <div className="flex gap-3">
          <div className="flex h-6 shrink-0 items-center">
            <div className="group grid size-4 grid-cols-1">
              <input
                type="checkbox"
                disabled={isDisabled}
                value={option.apc_id}
                checked={opAPCIDMulti.includes(option.apc_id!)}
                onChange={(e) => handleCheckboxChange(option.apc_id!, e.target.checked)}
                className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] indeterminate:border-[var(--bright-pink)] indeterminate:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100"
              />
              <svg
                fill="none"
                viewBox="0 0 14 14"
                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
              >
                <path
                  d="M3 8L6 11L11 3.5"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-0 group-has-checked:opacity-100"
                />
                <path
                  d="M3 7H11"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-0 group-has-indeterminate:opacity-100"
                />
              </svg>
            </div>
          </div>
          <div className="text-sm/6">
            <label htmlFor="operator" className="text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
              {option.name}
            </label>
            <p id="operator-address" className="text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">
             {option.street} {option.suite} {option.city}, {option.state} {option.zip}
            </p>
          </div>
        </div>
    </label>
  ))}
  </div>
  
    </>
  );
}
