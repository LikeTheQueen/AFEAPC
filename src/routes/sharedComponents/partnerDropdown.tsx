import { useEffect, useState } from "react";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useSupabaseData } from "src/types/SupabaseContext";
import { fetchAllPartners } from "provider/fetch";
import type { OperatorOrPartnerList } from "src/types/interfaces";

type Props = {
    value: string;
    onChange?: (id: string) => void;
    limitedList: boolean;
};

export function PartnerDropdown({ value, onChange, limitedList }: Props) {
  const { loggedInUser } = useSupabaseData();
  const [filteredPartners, setFilteredPartners] = useState<OperatorOrPartnerList[] | []>([]);

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const id = e.target.value;
        onChange?.(id);
    };
    useEffect(() => {
    const load = async () => {
      if (!limitedList) {
        const partnerList = await fetchAllPartners();
        setFilteredPartners(partnerList ?? []);
        return;
      }

      if (!loggedInUser) return;

      const partnerList: OperatorOrPartnerList[] = (loggedInUser.partnerRoles ?? [])
        .filter((partner) => partner.role === 9)
        .map(({ apc_id, apc_name, apc_address }) => ({ apc_id, apc_name, apc_address }));

      setFilteredPartners(partnerList);
    };

    load();
  }, [loggedInUser, limitedList]);
   
  return (
    <>
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0">
          <select
              id="partnerMapID"
              name="partnerMapID"
              autoComplete="off"
              value={value}
              onChange={handleChange}
              className="cursor-pointer col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
              <option></option>
              {filteredPartners.map((option) => (
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
