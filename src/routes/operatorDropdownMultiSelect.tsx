import { useEffect, useState } from "react";
import { useSupabaseData } from "src/types/SupabaseContext";
import { fetchAllOperators } from "provider/fetch";
import type { OperatorOrPartnerList } from "src/types/interfaces";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

type Props = {
  onChange?: (id: string[]) => void;
  limitedList: boolean;
  initialSelectedIds?: string[];
};
const people = [
  { id: 1, name: 'Wade Cooper', username: '@wadecooper' },
  { id: 2, name: 'Arlene Mccoy', username: '@arlenemccoy' },
  { id: 3, name: 'Devon Webb', username: '@devonwebb' },
  { id: 4, name: 'Tom Cook', username: '@tomcook' },
  { id: 5, name: 'Tanya Fox', username: '@tanyafox' },
  { id: 6, name: 'Hellen Schmidt', username: '@hellenschmidt' },
  { id: 7, name: 'Caroline Schultz', username: '@carolineschultz' },
  { id: 8, name: 'Mason Heaney', username: '@masonheaney' },
  { id: 9, name: 'Claudie Smitham', username: '@claudiesmitham' },
  { id: 10, name: 'Emil Schaefer', username: '@emilschaefer' },
]

export function OperatorDropdownMultiSelect({ onChange, limitedList, initialSelectedIds = [] }: Props) {
  const { loggedInUser } = useSupabaseData();
  const [opAPCIDMulti, setOpAPCIDMulti] = useState<string[]>(initialSelectedIds);
  const [filteredOperators, setFilteredOperators] = useState<OperatorOrPartnerList[] | []>([]);
  const [selected, setSelected] = useState(people[3])

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const values = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setOpAPCIDMulti(values);
    onChange?.(values);
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
        if (!loggedInUser) {
        setFilteredOperators([]);
        return;
      }
        
        const opList: OperatorOrPartnerList[] = (loggedInUser.operatorRoles ?? [])
            .filter(operator => operator.role === 8)
            .map(({ apc_id, apc_name, apc_address }) => ({ apc_id, apc_name, apc_address }));
    
            setFilteredOperators(opList);
            return;
        }
        };
  
  
  useEffect(() => {
          if (!loggedInUser) return;
          filterOpsList();
          if (filteredOperators.length === 1) {
              
              setOpAPCIDMulti(prevOpAPCID => {
            const updatedOpAPCID = [...prevOpAPCID];
            const existingIndex = updatedOpAPCID.findIndex(
                entry => entry === filteredOperators[0].apc_id
            );
            if(existingIndex > -1) {
                updatedOpAPCID.splice(existingIndex,1);
            } else {
                updatedOpAPCID.push(filteredOperators[0].apc_id);
            }
            return updatedOpAPCID;
        })
          }
      }, [loggedInUser])

      function selectAll() {
    const all = filteredOperators.map((o) => o.apc_id);
    setOpAPCIDMulti(all);
    onChange?.(all);
  }
  function clearAll() {
    setOpAPCIDMulti([]);
    onChange?.([]);
  }
  
  return (
    <>
     <Listbox value={opAPCIDMulti}
              onChange={(e) => handleChange} multiple by={'apc_id'}>
      <Label className="block text-sm/6 font-medium text-gray-900">Assigned to</Label>
      <div className="relative mt-2">
        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6">
          <span className="col-start-1 row-start-1 flex w-full gap-2 pr-6">
            <span className="truncate">{selected.name}</span>
            <span className="truncate text-gray-500">{selected.username}</span>
          </span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
        >
          {filteredOperators.map((option) => (
            <ListboxOption
              key={option.apc_id} value={option.apc_id}
              className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
            >
              <div className="flex">
                <span className="truncate font-normal group-data-selected:font-semibold">{option.apc_name}</span>
                <span className="ml-2 truncate text-gray-500 group-data-focus:text-indigo-200">{option.apc_address?.street}</span>
              </div>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
          <div className="">
          <select
              id="operatorMapID"
              name="operatorMapID"
              autoComplete="off"
              multiple={true}
              size={10}
              value={opAPCIDMulti}
              onChange={handleChange}
              className="cursor-pointer w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3
    text-base text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)]
    focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6
    [&>option]:text-[var(--darkest-teal)]
    [&>option:checked]:!bg-[var(--bright-pink)] [&>option:checked]:!text-white
    [&:focus>option:checked]:!bg-[var(--bright-pink)] [&:focus>option:checked]:!text-white">
              {filteredOperators.map((option) => (
                  <option key={option.apc_id} value={option.apc_id}>
                    <div className="flex"> {option.apc_name} <br></br>{option.apc_address?.street}</div>
                  </option>
              ))}
          </select>
          </div>
      </>
  );
}
