import { useEffect, useState } from "react";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useSupabaseData } from "src/types/SupabaseContext";
import { fetchAllOperators, fetchFromSupabase } from "provider/fetch";
import type { OperatorOrPartnerList } from "src/types/interfaces";

type Props = {
  onChange?: (id: string) => void;
  limitedList: boolean;
};
interface PartnerOpList {
    apc_id: string;
    apc_name: string;
};

export function OperatorDropdown({ onChange, limitedList }: Props) {
  const { loggedInUser } = useSupabaseData();
  const [opAPCID, setOpAPCID] = useState<string>('');
  const [filteredOperators, setFilteredOperators] = useState<OperatorOrPartnerList[] | []>([]);

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const id = e.target.value;
        setOpAPCID(id);
        onChange?.(id);
    };

    async function filterOpsList() {
        if(limitedList!==true) {
            async function getOperators() {
            const opList: OperatorOrPartnerList[] = await fetchAllOperators();
            setFilteredOperators(opList);
            return;
             };
       getOperators();
        } else {
        if (!loggedInUser) return [];
        
        const opList: OperatorOrPartnerList[] = (loggedInUser.operatorRoles ?? [])
            .filter(operator => operator.role === 7)
            .map(({ apc_id, apc_name }) => ({ apc_id, apc_name }));
    
            setFilteredOperators(opList);
            return;
        }
        };
  
  
  useEffect(() => {
          if (!loggedInUser) return;
          filterOpsList();
          if (filteredOperators.length === 1) {
              setOpAPCID(filteredOperators[0].apc_id)
          }
      }, [loggedInUser])
  
  return (
    <>
          <div className="w-1/2 grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 ">
          <select
              id="operatorMapID"
              name="operatorMapID"
              autoComplete="off"
              value={opAPCID}
              onChange={handleChange}
              className="cursor-pointer col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
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
          </div>
      </>
  );
}
