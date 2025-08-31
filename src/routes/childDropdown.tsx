import { useState } from "react";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useSupabaseData } from "src/types/SupabaseContext";

type Props = {
  onChange?: (id: string) => void;
  defaultOperator?: string;
};
interface PartnerOpList {
    apc_id: string;
    apc_name: string;
};

export function ChildDropdown({ onChange, defaultOperator }: Props) {
  const { loggedInUser } = useSupabaseData();
  const [opAPCID, setOpAPCID] = useState<string>('');

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const id = e.target.value;
        setOpAPCID(id);
        onChange?.(id);
    };

    function filterOpsList() {
        if (!loggedInUser) return [];
        return (loggedInUser.operatorRoles ?? [])
            .filter(operator => operator.role === 7)
            .map(({ apc_id, apc_name }) => ({ apc_id, apc_name }));
    };
    
  const filteredOperators: PartnerOpList[] = filterOpsList();
  
  return (
    <>
          <select
              id="operatorMapID"
              name="operatorMapID"
              autoComplete="off"
              value={opAPCID}
              onChange={handleChange}
              className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
              <option></option>
              {filteredOperators.map((option) => (
                  <option key={option.apc_id} value={option.apc_id}>
                      {option.apc_name}
                  </option>
              ))}
          </select>
          <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
      </>
  );
}
