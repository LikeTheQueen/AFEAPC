import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function setStatusTextColor(partner_status: string | null | undefined) {
    if (partner_status === null || partner_status === undefined || partner_status === 'empty') {
        return 'white';
    } else if (partner_status === 'New') {
        return '[var(--darkest-teal)]';
    } else if (partner_status === 'Viewed') {
        return '[var(--dark-teal)]';
    } else if (partner_status === 'Approved') {
        return 'white';
    } else if (partner_status === 'Rejected') {
        return 'white';
    } else {
        return 'white';
    }

};

export function setStatusBackgroundColor(partner_status: string | null | undefined) {
    if (partner_status === null || partner_status === undefined || partner_status === 'empty') {
        return 'white';
    } else if (partner_status === 'New') {
        return 'white';
    } else if (partner_status === 'Viewed') {
        return '[var(--dark-teal)]/30';
    } else if (partner_status === 'Approved') {
        return '[var(--bright-pink)]';
    } else if (partner_status === 'Rejected') {
        return 'red-900';
    } else {
        return 'white';
    }
};

export function setStatusRingColor(partner_status: string | null | undefined) {
    if (partner_status === null || partner_status === undefined || partner_status === 'empty') {
        return 'white';
    } else if (partner_status === 'New') {
        return '[var(--darkest-teal)]';
    } else if (partner_status === 'Viewed') {
        return '[var(--darkest-teal)]/60';
    } else if (partner_status === 'Approved') {
        return '[var(--bright-pink)]/20';
    } else if (partner_status === 'Rejected') {
        return 'red-900';
    } else {
        return 'white';
    }

};

export function noAFEsToView(message: string) {
    return (
        <div className="overflow-hidden mt-6 flex justify-center items-center" data-testid="NoNonOperatedAFElistMessage">
    <div className="relative w-full sm:w-9/10 h-20">
      <div aria-hidden="true" className="absolute inset-0 flex justify-center items-center">
        <div className="sm:w-full border-t border-[var(--darkest-teal)] border-1" />
      </div>
      <div className="relative flex justify-center items-center h-20">
        <span className="bg-white text-sm/6 sm:px-3 sm:text-base/7 font-semibold custom-style text-[var(--darkest-teal)]">{message}</span>
      </div>
    </div>
        
        </div>
    )
};
type Props = {
    onChange: (status: string) => void;
}

type DaysProps = {
    onChange: (daysAgo: number) => void;
}
export function PartnerStatusDropdown ({onChange}: Props) {
    const [partnerStatus, setPartnerStatus] = useState<string>('');

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const status = e.target.value;
        setPartnerStatus(status);
        onChange?.(status);
    };

    return (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0">
          <select
              id="partnerStatus"
              name="partnerStatus"
              autoComplete="off"
              value={partnerStatus}
              onChange={handleChange}
              className="cursor-pointer col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
              <option></option>
              <option>New</option>
              <option>Viewed</option>
              <option>Rejected</option>
              <option>Approved</option>
          </select>
          <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
          </div>
    )
};

export function OperatorApprovalDropdown ({onChange}: DaysProps) {
    const [operatorApproveDaysAgo, setOperatorApproveDaysAgo] = useState<number>(0);

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const days = parseInt(e.target.value, 10);
        setOperatorApproveDaysAgo(days);
        onChange?.(days);
    };

    return (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0">
          <select
              id="operatorIAPPdaysAgo"
              name="operatorIAPPdaysAgo"
              autoComplete="off"
              value={operatorApproveDaysAgo}
              onChange={handleChange}
              className="cursor-pointer col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
              <option value='100'></option>
              <option value='7'>1 week ago</option>
              <option value='14'>2 weeks ago</option>
              <option value='30'>30 days ago</option>
              <option value='45'>45 days ago</option>
          </select>
          <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
          </div>
    )
}
//Remove AFE test is removed
/*
export function setIsHidden<AFEType>(afes: AFEType[] | undefined): boolean {
    if (afes !== undefined && afes.length > 0) {
        return false;
    } else {
        return true;
    }
}
;
*/
