import { useEffect, useState } from "react";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useSupabaseData } from "src/types/SupabaseContext";
import { fetchAllOperators, fetchOperatorsOrPartnersToEdit } from "provider/fetch";
import type { OperatorOrPartnerList, OperatorPartnerRecord } from "src/types/interfaces";
import { transformOperatorPartnerRecord } from "src/types/transform";

type Props = {
  onChange?: (id: string) => void;
  limitedList: boolean;
};

export function OperatorDropdown({ onChange, limitedList }: Props) {
  const { loggedInUser, session } = useSupabaseData();
  const token = session?.access_token ?? "";
  const [opAPCID, setOpAPCID] = useState<string>('');
  const [filteredOperators, setFilteredOperators] = useState<OperatorOrPartnerList[] | []>([]);
  const [operatorsList, setOperatorsList] = useState<OperatorPartnerRecord[] | []>([]);
  
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
            .filter(operator => operator.role === 8 || operator.role === 1)
            .map(({ apc_id, apc_name, apc_address }) => ({ apc_id, apc_name, apc_address }));
    
            setFilteredOperators(opList);
            return;
        }
        };
  
  
    useEffect(() => {
          if (!loggedInUser) return;
          filterOpsList();
          if (filteredOperators.length === 1) {
              setOpAPCID(filteredOperators[0].apc_id);
              onChange?.(filteredOperators[0].apc_id);
          }
      }, [loggedInUser])

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
  
  return (
    <>
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 ">
          <select
              id="operatorMapID"
              name="operatorMapID"
              autoComplete="off"
              value={opAPCID}
              onChange={handleChange}
              className="cursor-pointer col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
              <option></option>
              {operatorsList.map((option) => (
                  <option key={option.apc_id} value={option.apc_id}>
                      {option.name}
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
