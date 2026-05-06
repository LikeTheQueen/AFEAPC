import { useEffect, useState } from "react";
import { useSupabaseData } from "src/types/SupabaseContext";
import type { RoleEntryRead } from "src/types/interfaces";
import { editNonOpLibrary, superUserPermission } from "src/constants/variables";

type Props = {
  onChange?: (id: string[]) => void;
  initialSelectedIds?: string[];
  isDisabled: boolean;
  
};

export function PartnerDropdownMultiSelect({ onChange, initialSelectedIds = [], isDisabled }: Props) {
  const { loggedInUser } = useSupabaseData();
  const [partnerAPCIDMulti, setPartnerAPCIDMulti] = useState<string[]>(initialSelectedIds);
  const [filteredPartners, setFilteredPartners] = useState<RoleEntryRead[] | []>([]);

    function handleCheckboxChange(apcId: string, isChecked: boolean) {
    const updatedIds = isChecked
      ? [...partnerAPCIDMulti, apcId]  
      : partnerAPCIDMulti.filter(id => id !== apcId);  
    
    setPartnerAPCIDMulti(updatedIds);
    onChange?.(updatedIds);  
    };
    
    useEffect(() => {
    if(!loggedInUser) return;

    const nonOpOperatorList = (loggedInUser.partnerRoles ?? [])
    .filter(nonOpOperator => (nonOpOperator.role === superUserPermission || nonOpOperator.role === editNonOpLibrary) && nonOpOperator.apc_name_active);
    setFilteredPartners(nonOpOperatorList.sort((a, b) => a.apc_name.localeCompare(b.apc_name)));

  },[loggedInUser]);

  return (
    <> 
  <div className="rounded-lg max-h-50 min-h-50 overflow-y-auto shadow-xl outline-1 -outline-offset-1 outline-[var(--dark-teal)] p-2">
  <h1 className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style px-3 font-semibold">Non-Op(s):</h1>
  <p hidden={filteredPartners.length > 0} className="text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">You do not have permissions to edit libraries for any Non-Op Addresses</p>
  {filteredPartners.map((option) => (
    <label 
      key={option.apc_id}
      className="flex items-start gap-2 p-2 hover:bg-[var(--darkest-teal)]/20">
        <div className="flex gap-3">
          <div className="flex h-6 shrink-0 items-center">
            <div className="group grid size-4 grid-cols-1">
              <input
                type="checkbox"
                disabled={isDisabled}
                value={option.apc_id}
                checked={partnerAPCIDMulti.includes(option.apc_id)}
                onChange={(e) => handleCheckboxChange(option.apc_id, e.target.checked)}
                className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] indeterminate:border-[var(--bright-pink)] indeterminate:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:border-[var(--darkest-teal)]/40 disabled:bg-[var(--darkest-teal)]/20 disabled:checked:bg-[var(--darkest-teal)]/40 cursor-pointer"
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
            <label htmlFor="partner" className="text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
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
