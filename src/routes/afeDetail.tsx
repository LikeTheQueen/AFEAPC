import { useSupabaseData } from "../types/SupabaseContext";
import type { Route } from "../routes/+types/afeDetail";
import { useLocation, useParams } from 'react-router';
import React, { useEffect, useMemo, useState } from 'react';
import { type AFEHistorySupabaseType, type AFEType, type EstimatesSupabaseType } from "../types/interfaces";
import { addAFEHistorySupabase, fetchEstimatesFromSupabaseMatchOnAFEandPartner, fetchFromSupabaseMatchOnString } from "provider/fetch";
import { transformAFEHistorySupabase, transformEstimatesSupabase } from "src/types/transform";
import {
  Dialog,
  DialogPanel,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import {
  EllipsisVerticalIcon,
} from '@heroicons/react/20/solid'
import { Bars3Icon, ChatBubbleBottomCenterTextIcon, CommandLineIcon } from '@heroicons/react/20/solid'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function AFEDetailURL() {
  const { afes } = useSupabaseData();
  const { afeID } = useParams();

  const [afeEstimates, setEstimates] = useState<EstimatesSupabaseType[] | null>(null);
  const [singleAFE, setAFEID] = useState<AFEType | null>(null);
  const [afeHistories, setHistory] = useState<AFEHistorySupabaseType[] | []>([]);
  const [commentVal, setCommentVal] = useState('');

  let afeHistoryMaxId: number=0;
  

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentVal(event.target.value);
  }

 
  useEffect(() => {
    const singleAFE = afes?.find((afe) => afe.id === afeID);
    setAFEID(singleAFE || null);
  }, [afes, afeID]);

  useEffect(() => {
    async function fetchHistory() {
      if (singleAFE !== null) {
        const historyResponse: any[] = await fetchFromSupabaseMatchOnString("AFE_HISTORY", "id, afe_id, created_at, user_id(first_name, last_name), description, type", "afe_id", singleAFE.id);
        const historyTransformed: AFEHistorySupabaseType[] = transformAFEHistorySupabase(historyResponse);
        setHistory(historyTransformed);
        console.log(historyTransformed);
      }
    }
    fetchHistory();
  }, [singleAFE])

  useEffect(() => {
    async function fetchEstimates() {

      if (singleAFE !== null) {
        const estimatesResponse: any[] = await fetchEstimatesFromSupabaseMatchOnAFEandPartner(singleAFE.source_system_id, singleAFE.partnerID);
        const estimatesTransformed: EstimatesSupabaseType[] = transformEstimatesSupabase(estimatesResponse);
        setEstimates(estimatesTransformed);
      }
    }
    fetchEstimates();
  }, [singleAFE]);

  function groupByAccountGroup(account: EstimatesSupabaseType[] | null): Map<string, EstimatesSupabaseType[]> | null {
    if (account !== null) {
      return account.reduce((map, accountItem) => {
        const accountGroup = accountItem.operator_account_group;
        if (!map.has(accountGroup)) {
          map.set(accountGroup, []);
        }
        map.get(accountGroup)!.push(accountItem);
        return map;
      }, new Map<string, EstimatesSupabaseType[]>());
    } else {
      return null;
    }
  }
  const groupedAccounts = groupByAccountGroup(afeEstimates);
  function calcPartnerNet(gross: number | undefined, wi: number | undefined) {
    if (gross && wi) {
      return Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((gross * wi) / 100);
    } else if (gross === undefined && wi) {
      return 'Missing gross amount';
    } else if (gross && wi === undefined) {
      return 'Missing working interest';
    } else {
      return 'Missing WI and gross amount';
    }
  }
  function setAFEHistoryMaxID () {
    if(afeHistories === undefined || afeHistories === null){
      afeHistoryMaxId=0;
    } else {
      afeHistoryMaxId=afeHistories.length;
    }

  }

  function handleComment ()  {
    setAFEHistoryMaxID(); 
    console.log('hello')
    const newComment: AFEHistorySupabaseType = {id: afeHistoryMaxId, afe_id: afeID!, user: 'You', description: commentVal, type: "comment", created_at: new Date()};
    setHistory([...afeHistories, newComment]);
    addAFEHistorySupabase(afeID!, commentVal, 'comment');
    console.log(afeHistories)
    console.log(newComment)
  }

  return (
    <>
      <main>
        <div className="px-4 py-4 sm:px-6 lg:px-8 ">
          <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* AFE Actions */}
            <div className="relative content-center isolate pt-0 lg:col-start-3 lg:row-end-1 h-15">
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
                    <a
                      href="#"
                      className="rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]">
                      Accept
                    </a>
                    <a
                      href="#"
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold custom-style text-[var(--darkest-teal)] shadow-xs hover:bg-red-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800">
                      Reject
                    </a>
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

              <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] text-right mt-2">AFE Number<span className="font-normal pl-2">{singleAFE?.afe_number}</span></h2>
              <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] text-right">Operator<span className="font-normal pl-2">{singleAFE?.operator}</span></h2>
              <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] text-right">Operator Approval Date<span className="font-normal pl-2">{singleAFE?.iapp_date}</span></h2>
              <div className="mt-2 border-t border-t-2 border-[var(--darkest-teal)] border-b border-b-4 border-double border-[var(--darkest-teal)]">
                <dl className="mt-2 mb-2 pl-2 sm:rounded-xs grid grid-cols-1 text-sm/6 bg-[var(--darkest-teal)]/11 sm:grid-cols-3">
                  <div className="sm:pr-4">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">AFE Type</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] text-right pl-2 capitalize">
                      {singleAFE?.afe_type}
                    </dd>
                  </div>
                  <div className="sm:pr-4">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)] capitalize">{singleAFE?.partner_name.toLowerCase()} WI</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] text-right pl-2">
                      {singleAFE?.partner_wi.toFixed(6)}%
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
                      {singleAFE?.afe_type}
                    </dd>
                  </div>
                  <div className="sm:pr-4">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">Net Total</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] text-right pl-2">
                      ${singleAFE?.total_gross_estimate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </dd>
                  </div>
                  <div className="sm:pr-4">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">Gross Total</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] text-right pl-2">
                      {calcPartnerNet(singleAFE?.total_gross_estimate, singleAFE?.partner_wi)}
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
              {/* History feed */}
              <h2 className="font-semibold custom-style text-[var(--darkest-teal)]">AFE History</h2>
              <ul role="list" className="mt-6 space-y-6">
                {afeHistories?.map((afeHistory, afeHistoryIdx) => (
                  <li key={afeHistory.id} className="relative flex gap-x-4">
                    <div
                      className={classNames(
                        afeHistoryIdx === afeHistories.length - 1 ? 'h-6' : '-bottom-6',
                        'absolute top-0 left-0 flex w-6 justify-center',
                      )}
                    >
                      <div className="w-px bg-gray-200" />
                    </div>
                    {afeHistory.type === 'action' ? (
                      <>
                        <CommandLineIcon aria-hidden="true" className="relative size-6 flex-none text-[var(--darkest-teal)]" />
                        <div className="flex-auto px-2">
                          <div className="flex justify-between gap-x-4">
                            <div className="text-sm/6 ">
                              <span className="font-medium text-[var(--darkest-teal)] custom-style-long-text">{afeHistory.user}</span>
                            </div>
                            <p className="flex-none text-sm/6 text-gray-500 custom-style-long-text">{new Date(afeHistory.created_at).toLocaleDateString('en-us', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            })}</p>

                          </div>
                          <p className="text-sm/6 text-gray-500 custom-style-long-text">{afeHistory.description}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative flex size-6 flex-none items-center justify-center bg-white">
                          {afeHistory.type === 'comment' ? (
                            <ChatBubbleBottomCenterTextIcon aria-hidden="true" className="size-6 text-[var(--bright-pink)]" />
                          ) : (
                            <div className="size-1.5 rounded-full bg-gray-300 ring-1 ring-gray-400" />
                          )}
                        </div>
                        <div className="flex-auto rounded-md p-1.5 ring-1 ring-opacity-10 ring-[var(--bright-pink)] ">
                          <div className="flex justify-between gap-x-4">
                            <div className=" text-sm/6 text-gray-500">
                              <span className="font-medium text-[var(--darkest-teal)] custom-style-long-text">{afeHistory.user}</span>
                            </div>
                            <p className="flex-none text-sm/6 text-gray-500 custom-style-long-text">{new Date(afeHistory.created_at).toLocaleDateString('en-us', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            })}</p>

                          </div>
                          <p className="text-sm/6 text-gray-500 custom-style-long-text">{afeHistory.description}</p>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              {/* New comment form */}
              <div className="mt-6 flex gap-x-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--bright-pink)] bg-[var(--darkest-teal)] text-[1rem] font-medium text-white ">
                  C
                </span>
                <div className="relative flex-auto">
                  <div className="overflow-hidden rounded-lg pb-12 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--bright-pink)]">
                    <label htmlFor="comment" className="sr-only">
                      Add your comment
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={2}
                      placeholder="Add your comment..."
                      className="block w-full resize-none bg-transparent px-3 py-1.5 text-base text-[var(--darkest-teal)] placeholder:text-gray-400 focus:outline-none sm:text-sm/6 custom-style"
                      //defaultValue={''}
                      value={commentVal}
                      onChange={handleCommentChange}
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pr-2 pl-3 ">
                    <button
                      type="submit"
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold custom-style text-[var(--darkest-teal)] shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-[var(--bright-pink)] hover:text-white"
                      onClick={handleComment}>
                      
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}



