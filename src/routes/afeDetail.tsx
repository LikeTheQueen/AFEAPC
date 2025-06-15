import { useSupabaseData } from "../types/SupabaseContext";
import { setAFEHistoryMaxID, groupByAccountGroup, calcPartnerNet, toggleStatusButtonDisable } from "src/helpers/helpers";
import { isLoggedInUserOperator } from "src/helpers/styleHelpers";
import { setStatusTextColor, setStatusBackgroundColor, setStatusRingColor } from "./afeDashboard/routes/helpers/styleHelpers";
import { useParams } from 'react-router';
import React, { useEffect, useState } from 'react';
import { type AFEHistorySupabaseType, type AFEType, type EstimatesSupabaseType } from "../types/interfaces";
import { addAFEHistorySupabase, fetchEstimatesFromSupabaseMatchOnAFEandPartner, fetchFromSupabaseMatchOnString } from "provider/fetch";
import { transformAFEHistorySupabase, transformAFEs, transformEstimatesSupabase } from "src/types/transform";
import AFEHistory from "./afeHistory";
//import Route from "../routes/+types/af"
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import {
  EllipsisVerticalIcon,
} from '@heroicons/react/20/solid'
import { Bars3Icon, ChatBubbleBottomCenterTextIcon, CommandLineIcon } from '@heroicons/react/20/solid'
import { handlePartnerStatusChange } from "./afeDashboard/routes/helpers/helpers";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function AFEDetailURL() {
  const { afeID } = useParams<{ afeID: string }>();
  const { loggedInUser } = useSupabaseData();
  const [afeRecord, setAFERecord] = useState<AFEType | null>(null);
  const [afeEstimates, setEstimates] = useState<EstimatesSupabaseType[] | null>(null);
  const [afeHistories, setHistory] = useState<AFEHistorySupabaseType[] | []>([]);
  const [commentVal, setCommentVal] = useState('');
  const [afePartnerStatus, setAFEPartnerStatus] = useState('');
  const [statusButtonDisabled, setButtonDisabled] = useState(true);
  const [statusColor, setStatusColor] = useState('blue-900');
  const [statusBackgroundColor, setStatusBgColor] = useState('blue-900');
  const [statusRingColor, setStatusRgColor] = useState('blue-900');

  const afeHistoryMaxId: number = setAFEHistoryMaxID(afeHistories);
  const { refreshData } = useSupabaseData();

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentVal(event.target.value);
  }

  useEffect(() => {
    if (!afeID) return;
    async function getAFERecord() {
      const afeRaw = await fetchFromSupabaseMatchOnString('AFE_PROCESSED','*, apc_operator_id(name, id)','id',afeID!);
      const transformedAFE = transformAFEs(afeRaw);
      const singleAFERecord = transformedAFE[0];
      setAFERecord(singleAFERecord);
      console.log('I ran the effect agian', afeID)
    } getAFERecord();
  }, [afeID])
  

useEffect(() => {
    if (!afeRecord) return;

    async function fetchAllRelatedData() {
      // Fetch history
      const historyResponse: any[] = await fetchFromSupabaseMatchOnString(
        "AFE_HISTORY",
        "id, afe_id, created_at, user_id(first_name, last_name), description, type",
        "afe_id",
        afeRecord?.id!
      );
      const historyTransformed = transformAFEHistorySupabase(historyResponse);
      setHistory(historyTransformed);

      // Fetch estimates
      const estimatesResponse: any[] = await fetchEstimatesFromSupabaseMatchOnAFEandPartner(
        afeRecord?.source_system_id!,
        afeRecord?.partnerID!
      );
      const estimatesTransformed = transformEstimatesSupabase(estimatesResponse);
      setEstimates(estimatesTransformed);

      // Set status and UI-related states
      const newStatus = afeRecord?.partner_status;
      setAFEPartnerStatus(newStatus!);
      setStatusColor(setStatusTextColor(newStatus));
      setStatusBgColor(setStatusBackgroundColor(newStatus));
      setStatusRgColor(setStatusRingColor(newStatus));
      setButtonDisabled(toggleStatusButtonDisable(afeRecord));

      console.log('Fetched history, estimates, and UI states for', afeRecord?.id!);
    }

    fetchAllRelatedData();
  }, [afeRecord]);

  const groupedAccounts = groupByAccountGroup(afeEstimates);
 
  function handleStatusComment(status: string) {
    setAFEHistoryMaxID(afeHistories);
    const newComment: AFEHistorySupabaseType = { id: afeHistoryMaxId, afe_id: afeID!, user: 'You', description: `AFE has been marked as ${status}`, type: "action", created_at: new Date() };
    setHistory([...afeHistories, newComment]);
  }
  const ishidden = isLoggedInUserOperator(afeRecord?.apc_operator_id, loggedInUser?.operators[0]);
  console.log(ishidden);
  console.log(afeRecord);
  console.log('afe id ', afeRecord?.apc_operator_id,' USE ID ', loggedInUser?.operators[0])
  return (
    <>
      <main>
        <div className="px-4 py-4 sm:px-6 lg:px-8 ">
          <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* AFE Actions */}
            <div hidden = {isLoggedInUserOperator(afeRecord?.apc_operator_id, loggedInUser?.operators[0])} className="relative content-center isolate pt-0 lg:col-start-3 lg:row-end-1 h-15">
              <div aria-hidden="true" className="absolute rounded-lg blur-xs inset-0 -z-10 overflow-hidden">
                <div className="absolute rounded-md top-full left-1 -mt-16 transform-gpu opacity-50 blur-2xl xl:left-1/2 xl:-ml-80">
                  <div
                    style={{
                      clipPath:
                        'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
                    }}
                    className="aspect-1154/678 w-[52.125rem] bg-linear-to-br from-[var(--dark-teal)] to-[var(--dark-teal)]"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-px " />
              </div>

              <div className="mx-auto max-w-7xl px-1 py-1 sm:px-1 lg:px-2 ">
                <div className="mx-auto flex justify-end sm:justify-end max-w-2xl gap-x-1 lg:mx-0 lg:max-w-none">
                  <div className="flex items-center gap-x-4 sm:gap-x-6">
                    <button
                      className="rounded-md bg-[var(--dark-teal)] disabled:bg-gray-300 disabled:text-gray-500 px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]"
                      onClick={(e: any) => {
                        handlePartnerStatusChange(afeRecord?.id!, afeRecord?.partner_status!, 'Approved', 'The partner marked the AFE as approved', 'action'),
                        setButtonDisabled(true),
                        handleStatusComment('Approved'),
                        setAFEPartnerStatus('Approved'),
                        setStatusColor(setStatusTextColor('Approved')),
                        setStatusBgColor(setStatusBackgroundColor('Approved')),
                        setStatusRgColor(setStatusRingColor('Approved')),
                        refreshData();
                      }}
                      disabled={statusButtonDisabled}>
                      Approve
                    </button>
                    <button
                      className="rounded-md bg-white disabled:bg-gray-300 disabled:text-gray-500 px-3 py-2 text-sm font-semibold custom-style text-[var(--darkest-teal)] shadow-xs hover:bg-red-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
                      onClick={(e: any) => {
                        handlePartnerStatusChange(afeRecord?.id!, afeRecord?.partner_status!, 'Rejected', 'The partner marked the AFE as rejected', 'action'),
                        setButtonDisabled(true),
                        handleStatusComment('Rejected'),
                        setAFEPartnerStatus('Rejected'),
                        setStatusColor(setStatusTextColor('Rejected')),
                        setStatusBgColor(setStatusBackgroundColor('Rejected')),
                        setStatusRgColor(setStatusRingColor('Rejected')),
                        refreshData();
                      }}
                      disabled={statusButtonDisabled}>
                      Reject
                    </button>
                    <Menu as="div" className="relative sm:hidden">
                      <MenuButton className="-m-3 block p-3">
                        <span className="sr-only">More</span>
                        <EllipsisVerticalIcon aria-hidden="true" className="size-5 text-gray-500" />
                      </MenuButton>
                      <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-[var(--dark-teal)]/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                      >
                        <MenuItem>
                          <button
                            type="button"
                            className="block w-full px-3 py-1 text-left text-sm/6 text-[var(--dark-teal)] data-focus:bg-gray-50 data-focus:outline-hidden"
                          >
                            Share AFE
                          </button>
                        </MenuItem>

                      </MenuItems>
                    </Menu>
                  </div>
                </div>
              </div>

            </div>
            {/* AFE Estimates */}
            <div className="-mx-4 px-4 py-8 shadow-lg ring-3 ring-[var(--darkest-teal)]/9 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-8 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-8 xl:pt-0 xl:pb-8">
              <div className="m-0 flex justify-between">
                <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] sm:text-right mt-2">{afeRecord?.partner_name} Status<span className={`font-semibold ml-2 pl-2 rounded-md bg-${statusBackgroundColor} px-2 text-${statusColor} ring-1 ring-${statusRingColor} ring-inset`}>{afePartnerStatus}</span></h2>
                <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] sm:text-right mt-2">AFE Number<span className={`font-normal pl-2`}>{afeRecord?.afe_number}</span></h2>
              </div>
              <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] text-right">Version<span className="font-normal pl-2">{afeRecord?.version_string}</span></h2>
              <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] sm:text-right">Operator<span className="font-normal pl-2">{afeRecord?.operator}</span></h2>
              <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] sm:text-right">Operator Approval Date<span className="font-normal pl-2">{afeRecord?.iapp_date}</span></h2>
              <div className="mt-2 border-t border-t-2 border-[var(--darkest-teal)] border-b border-b-4 border-double border-[var(--darkest-teal)]">
                <dl className="mt-2 mb-2 pl-2 sm:rounded-xs grid grid-cols-1 text-sm/6 bg-[var(--darkest-teal)]/11 sm:grid-cols-3">
                  <div className="sm:pr-4">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">AFE Type</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] text-right pl-2 capitalize">
                      {afeRecord?.afe_type}
                    </dd>
                  </div>
                  <div className="sm:pr-4">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)] capitalize truncate">{afeRecord?.partner_name.toLowerCase()} WI</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] text-right pl-2">
                      {afeRecord?.partner_wi.toFixed(6)}%
                    </dd>
                  </div>
                  <div className="sm:pr-4">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]"></dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] text-right pl-2">
                      {' '}
                    </dd>
                  </div>
                  <div className="sm:pr-4">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">Well Name</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] text-right pl-2 capitalize">
                      {afeRecord?.afe_type}
                    </dd>
                  </div>
                  <div className="sm:pr-4">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">Gross Total</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] text-right pl-2">
                      ${afeRecord?.total_gross_estimate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </dd>
                  </div>
                  <div className="sm:pr-4">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">Net Total</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] text-right pl-2">
                      {calcPartnerNet(afeRecord?.total_gross_estimate, afeRecord?.partner_wi)}
                    </dd>
                  </div>


                </dl>
              </div>
              <table className="mt-6 w-full text-left text-sm/6 whitespace-nowrap table-auto">

                {groupedAccounts && Array.from(groupedAccounts).map(([accountGroup, accounts]) => (
                  <tbody key={accountGroup}>

                    <tr className="border-t border-b border-[var(--darkest-teal)] text-[var(--darkest-teal)] font-semibold custom-style h-10">
                      <td className="hidden sm:w-1/5 sm:table-cell pl-2">{accountGroup}</td>
                      <td className="hidden px-0 py-0 text-right sm:w-1/5 sm:table-cell">Operator Account#</td>
                      <td className="px-0 py-0 text-right sm:w-1/5 sm:table-cell">Account#</td>
                      <td className="hidden px-0 py-0 text-right sm:w-1/5 sm:table-cell">Gross Amount</td>
                      <td className="px-0 py-0 pr-2 text-right sm:w-1/5 sm:table-cell">Net Amount</td>
                    </tr>
                    {accounts.map((item) => (
                      <tr key={item.id} className="border-b border-gray-300 text-gray-700 custom-style-long-text tabular-nums ">
                        <td className="hidden px-0 py-3 text-left w-1/5 sm:table-cell">
                          {item.operator_account_description}
                        </td>
                        <td className="hidden px-0 py-3 text-right w-1/5 sm:table-cell">
                          {item.operator_account_number}
                        </td>
                        <td className="px-0 py-3 text-right w-1/5 sm:table-cell">
                          {item.partner_account_number}
                        </td>
                        <td className="hidden px-0 py-3 text-right w-1/5 sm:table-cell">
                          ${item.amount_gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-0 py-3 pr-2 text-right w-1/5 sm:table-cell">
                          ${item.partner_net_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
<div className="lg:col-start-3">
<AFEHistory historyAFEs={afeHistories} />
            
              
            </div>

          </div>
        </div>
      </main>
    </>
  )
}



