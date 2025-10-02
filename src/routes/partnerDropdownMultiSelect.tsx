import { useEffect, useState } from "react";
import { useSupabaseData } from "src/types/SupabaseContext";
import { fetchAllOperators } from "provider/fetch";
import type { OperatorOrPartnerList } from "src/types/interfaces";

type Props = {
  onChange?: (id: string[]) => void;
  limitedList: boolean;
  initialSelectedIds?: string[];
};

export function PartnerDropdownMultiSelect({ onChange, limitedList, initialSelectedIds = [] }: Props) {
  const { loggedInUser } = useSupabaseData();
  const [partnerAPCIDMulti, setPartnerAPCIDMulti] = useState<string[]>(initialSelectedIds);
  const [filteredPartners, setFilteredPartners] = useState<OperatorOrPartnerList[] | []>([]);

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const values = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setPartnerAPCIDMulti(values);
    onChange?.(values);
    };

    async function filterOpsList() {
        if(limitedList!==true) {
            async function getOperators() {
            const opList: OperatorOrPartnerList[] = await fetchAllOperators();
            setFilteredPartners(opList);
            return;
             };
       getOperators();
        } else {
        if (!loggedInUser) {
        setFilteredPartners([]);
        return;
      }
        
        const opList: OperatorOrPartnerList[] = (loggedInUser.partnerRoles ?? [])
            .filter(operator => operator.role === 9)
            .map(({ apc_id, apc_name }) => ({ apc_id, apc_name }));
    
            setFilteredPartners(opList);
            return;
        }
        };
  
  
  useEffect(() => {
          if (!loggedInUser) return;
          filterOpsList();
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
          <div className="">
          <select
              id="operatorMapID"
              name="operatorMapID"
              autoComplete="off"
              multiple={true}
              size={10}
              value={partnerAPCIDMulti}
              onChange={handleChange}
              className="cursor-pointer w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3
    text-base text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)]
    focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6
    [&>option]:text-[var(--darkest-teal)]
    [&>option:checked]:!bg-[var(--bright-pink)] [&>option:checked]:!text-white
    [&:focus>option:checked]:!bg-[var(--bright-pink)] [&:focus>option:checked]:!text-white">
              {filteredPartners.map((option) => (
                  <option key={option.apc_id} value={option.apc_id}>
                      {option.apc_name}
                  </option>
              ))}
          </select>
          </div>
      </>
  );
}
