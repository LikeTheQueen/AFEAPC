import { useEffect, useState } from "react";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useSupabaseData } from "src/types/SupabaseContext";
import { fetchAllOperators, fetchAllParentCompanies } from "provider/fetch";
import type { OperatorOrPartnerList, ParentCompany } from "src/types/interfaces";
import { editOperatorLibrary, superUserPermission } from "src/constants/variables";

type Props = {
  value: string;
  onChange?: (id: string) => void;
  limitedList: boolean;
  valueLabel?: (name: string) => void;
};

type ParentCompanyProps = {
  value: string;
  onChange?: (id: string) => void;
  onRecordChange?: (record: ParentCompany) => void; 
  limitedList?: boolean;
  valueLabel?: (name: string) => void;
}

export function OperatorDropdown({ value, onChange, limitedList, valueLabel }: Props) {
  const { loggedInUser } = useSupabaseData();
  const [filteredOperators, setFilteredOperators] = useState<OperatorOrPartnerList[] | []>([]);
  
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const id = e.target.value;
        const name = e.target.options[e.target.selectedIndex].text;
        onChange?.(id);
        valueLabel?.(name);
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
            .filter(operator => operator.role === editOperatorLibrary || operator.role === superUserPermission)
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
};

export function ParentCompanyDropdown({ value, onChange, onRecordChange, limitedList, valueLabel }: ParentCompanyProps) {
  const { loggedInUser } = useSupabaseData();
  const [filteredOperators, setFilteredOperators] = useState<ParentCompany[] | []>([]);
  
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const id = e.target.value;
        const name = e.target.options[e.target.selectedIndex].text;
        const fullRecord = filteredOperators.find(op => op.apc_id === id);
        onChange?.(id);
        valueLabel?.(name);
        if (fullRecord) onRecordChange?.(fullRecord);
    };

    useEffect(() => {
      const load = async () => {
        if(!loggedInUser) return;
        
          const operatorList = await fetchAllParentCompanies();
          setFilteredOperators(operatorList ?? []);
          return;

      };
      load();
    }, [loggedInUser, limitedList]);
    
    
  return (
    <>
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 ">
          <select
              id="partnerMapID"
              name="partnerMapID"
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
};


