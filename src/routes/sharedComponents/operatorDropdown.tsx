import { useEffect, useState } from "react";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useSupabaseData } from "src/types/SupabaseContext";
import { fetchAllOperators } from "provider/fetch";
import type { OperatorOrPartnerList } from "src/types/interfaces";

type Props = {
  value: string;
  onChange?: (id: string) => void;
  limitedList: boolean;
};

export function OperatorDropdown({ value, onChange, limitedList }: Props) {
  const { loggedInUser } = useSupabaseData();
  const [filteredOperators, setFilteredOperators] = useState<OperatorOrPartnerList[] | []>([]);
  
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const id = e.target.value;
        onChange?.(id);
    };

    useEffect(() => {
      const load = async () => {
        if (!limitedList) {
          const operatorList = await fetchAllOperators();
          setFilteredOperators(operatorList ?? []);
          return;
        }
        if(!loggedInUser) return;

        const operatorList: OperatorOrPartnerList[] = (loggedInUser.operatorRoles ?? [])
            .filter(operator => operator.role === 8 || operator.role === 1)
            .map(({ apc_id, apc_name, apc_address }) => ({ apc_id, apc_name, apc_address }));
        
        setFilteredOperators(operatorList);
      };
      load();
    }, [loggedInUser, limitedList]);
    
  return (
    <>
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 ">
          <select
              id="operatorMapID"
              name="operatorMapID"
              autoComplete="off"
              value={value}
              onChange={handleChange}
              className="cursor-pointer col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
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
