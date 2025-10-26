import { useEffect, useState } from "react";
import { useSupabaseData } from "src/types/SupabaseContext";
import { fetchAllPartners } from "provider/fetch";
import type { OperatorOrPartnerList } from "src/types/interfaces";

type Props = {
  onChange?: (id: string[]) => void;
  limitedList: boolean;
  initialSelectedIds?: string[];
  isDisabled: boolean;
  
};

export function PartnerDropdownMultiSelect({ onChange, limitedList, initialSelectedIds = [], isDisabled }: Props) {
  const { loggedInUser } = useSupabaseData();
  const [partnerAPCIDMulti, setPartnerAPCIDMulti] = useState<string[]>(initialSelectedIds);
  const [filteredPartners, setFilteredPartners] = useState<OperatorOrPartnerList[] | []>([]);

    function handleCheckboxChange(apcId: string, isChecked: boolean) {
    const updatedIds = isChecked
      ? [...partnerAPCIDMulti, apcId]  
      : partnerAPCIDMulti.filter(id => id !== apcId);  
    
    setPartnerAPCIDMulti(updatedIds);
    onChange?.(updatedIds);  
    };
    
    async function filterPartnersList() {
        if(limitedList!==true) {
            async function getPartners() {
            const partnerList: OperatorOrPartnerList[] = await fetchAllPartners();
            setFilteredPartners(partnerList);
            return;
             };
       getPartners();
        } else {
        if (!loggedInUser) {
        setFilteredPartners([]);
        return;
      }
        
        const partnerList: OperatorOrPartnerList[] = (loggedInUser.partnerRoles ?? [])
            .filter(partner => partner.role === 9)
            .map(({ apc_id, apc_name, apc_address }) => ({ apc_id, apc_name, apc_address }));
    
            setFilteredPartners(partnerList);
            return;
        }
        };
  
  
  useEffect(() => {
          if (!loggedInUser) return;
          filterPartnersList();
          if (filteredPartners.length === 1) {
              
              setPartnerAPCIDMulti(prevOpAPCID => {
            const updatedOpAPCID = [...prevOpAPCID];
            const existingIndex = updatedOpAPCID.findIndex(
                entry => entry === filteredPartners[0].apc_id
            );
            if(existingIndex > -1) {
                updatedOpAPCID.splice(existingIndex,1);
            } else {
                updatedOpAPCID.push(filteredPartners[0].apc_id);
            }
            return updatedOpAPCID;
        })
          }
      }, [loggedInUser])

  function selectAll() {
    const all = filteredPartners.map((o) => o.apc_id);
    setPartnerAPCIDMulti(all);
    onChange?.(all);
  }
  function clearAll() {
    setPartnerAPCIDMulti([]);
    onChange?.([]);
  }
  
  return (
    <>
  <div className="border rounded-md max-h-50 min-h-50 overflow-y-auto shadow-lg sm:rounded-lg ring-1 ring-[var(--darkest-teal)]/20 p-4 ">
  <h1 className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style px-3 font-semibold">partner(s):</h1>
  {filteredPartners.map((option) => (
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
                checked={partnerAPCIDMulti.includes(option.apc_id)}
                onChange={(e) => handleCheckboxChange(option.apc_id, e.target.checked)}
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
            <label htmlFor="partner" className="text-sm font-medium text-[var(--dark-teal)] custom-style">
              {option.apc_name}
            </label>
            <p id="partner-address" className="text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">
             {option.apc_address?.street} {option.apc_address?.suite} {option.apc_address?.city}, {option.apc_address?.state} {option.apc_address?.zip}
            </p>
          </div>
        </div>
    </label>
  ))}
      </div>
    </>
  );
}
