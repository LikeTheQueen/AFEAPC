import { useSupabaseData } from "src/types/SupabaseContext";
import { fetchAFEDetails } from "provider/fetch";
import { setAFEHistoryMaxID, groupByAccountGroup, calcPartnerNet, toggleStatusButtonDisable } from "src/helpers/helpers";
import { doesLoggedInUserHaveCorrectRole } from "src/helpers/styleHelpers";
import { setStatusTextColor, setStatusBackgroundColor, setStatusRingColor } from "./helpers/styleHelpers";
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { type AFEHistorySupabaseType, type AFEType, type EstimatesSupabaseType } from "../../../types/interfaces";
import { fetchAFEEstimates, fetchAFEHistory } from "provider/fetch";
import { transformAFEHistorySupabase, transformSingleAFE, transformEstimatesSupabase } from "src/types/transform";
import AFEHistory from "./afeHistory";
import { handleOperatorArchiveStatusChange, handlePartnerArchiveStatusChange, handlePartnerStatusChange } from "./helpers/helpers";
import LoadingPage from "src/routes/loadingPage";

export default function AFEDetailURL() {
  const { afeID } = useParams<{ afeID: string }>();
  const { loggedInUser, session } = useSupabaseData();
  const token = session?.access_token ?? "";

  const [afeHistoryloading, setAFEHistoryLoading] = useState(false);
  const [afeLoading, setAFELoading] = useState(false);
  const [afeEstimatesLoading, setAFEEstimatesLoading] = useState(false);

  const [afeRecord, setAFERecord] = useState<AFEType | null>(null);
  const [afeEstimates, setEstimates] = useState<EstimatesSupabaseType[] | null>(null);
  const [afeHistories, setHistory] = useState<AFEHistorySupabaseType[] | []>([]);
  const [afePartnerStatus, setAFEPartnerStatus] = useState('');
  const [statusButtonDisabled, setButtonDisabled] = useState(true);
  const [statusColor, setStatusColor] = useState('blue-900');
  const [statusBackgroundColor, setStatusBgColor] = useState('blue-900');
  const [statusRingColor, setStatusRgColor] = useState('blue-900');
  const [doesUserHaveAcceptRejectRole, setUserAcceptRejectRole] = useState(false);
  const [doesUserHavePartnerViewAFERole, setUserPartnerViewAFERole] = useState(false);
  const [doesUserHaveOperatorViewAFERole, setUserOperatorViewAFERole] = useState(false);
  const afeHistoryMaxId: number = setAFEHistoryMaxID(afeHistories);
  const { refreshData } = useSupabaseData();

 

  useEffect(() => {
    let isMounted = true;
    async function getAFERecord() {
      if (!afeID || token ==='') return;
      setAFELoading(true);
      try{
        const afeDetails = await fetchAFEDetails(afeID, token);

        if(!afeDetails.ok) {
          throw new Error((afeDetails as any).message ?? "Cannot find AFE Details");
        }

        if (isMounted) {
          const afeDetailsFormatted = transformSingleAFE(afeDetails.data);
          
          setAFERecord(afeDetailsFormatted)
        }
      } finally {
                if (isMounted) {
                    setAFELoading(false);
                }
    } 
    }; 
  getAFERecord();
  return () => {
            isMounted = false;
        };
  }, [afeID, loggedInUser])

useEffect(() => {
    let isMounted = true;

    async function fetchAllRelatedData() {
      if(!afeRecord?.id || token==='' ) return;
      // Fetch history
      setAFEHistoryLoading(true)
      try{
        const historyResponse = await fetchAFEHistory(afeRecord?.id!, token);

        if(!historyResponse.ok) {
          throw new Error((historyResponse as any).message ?? "Cannot find AFE Details");
        }

        if(isMounted) {
          const historyTransformed = transformAFEHistorySupabase(historyResponse.data);
        setHistory(historyTransformed);
        }

      } 
      
      finally {
                if (isMounted) {
                    setAFEHistoryLoading(false);
                }
      };

      if(!afeRecord.source_system_id || !afeRecord.partnerID) return;
       // Fetch estimates
       setAFEEstimatesLoading(true)
       try {
        const estimatesResponse = await fetchAFEEstimates(afeRecord?.source_system_id!,afeRecord?.partnerID!,token);

        if(!estimatesResponse.ok) {
          throw new Error((estimatesResponse as any).message ?? "Cannot find AFE Estimates");
        }
        if(isMounted) {
          const estimatesTransformed = transformEstimatesSupabase(estimatesResponse.data);
          setEstimates(estimatesTransformed);
        }
       }
       finally {
                if (isMounted) {
                    setAFEEstimatesLoading(false);
                }
      };
      
      // Set status and UI-related states
      if(!afeRecord.partner_status) return;
      const newStatus = afeRecord?.partner_status;
      setAFEPartnerStatus(newStatus);
      setStatusColor(setStatusTextColor(newStatus));
      setStatusBgColor(setStatusBackgroundColor(newStatus));
      setStatusRgColor(setStatusRingColor(newStatus));
      setButtonDisabled(toggleStatusButtonDisable(afeRecord)); 
    }

    fetchAllRelatedData();
  }, [afeRecord]);

  useEffect(() => {
    if(!loggedInUser || !afeRecord) return;
    const userAcceptRejectRole = doesLoggedInUserHaveCorrectRole(loggedInUser?.partnerRoles!, 6, afeRecord?.partnerID!)
    const userPartnerViewRole = doesLoggedInUserHaveCorrectRole(loggedInUser?.partnerRoles!, 3, afeRecord?.partnerID!)
    const userOperatorViewRole = doesLoggedInUserHaveCorrectRole(loggedInUser?.operatorRoles!, 2, afeRecord?.apc_operator_id!)
    setUserAcceptRejectRole(userAcceptRejectRole);
    setUserPartnerViewAFERole(userPartnerViewRole);
    setUserOperatorViewAFERole(userOperatorViewRole);
  },[loggedInUser, afeRecord?.id])
  const groupedAccounts = groupByAccountGroup(afeEstimates);
 
  function handleStatusComment(status: string) {
    setAFEHistoryMaxID(afeHistories);
    const newComment: AFEHistorySupabaseType = { id: afeHistoryMaxId, afe_id: afeID!, user: 'You', description: `AFE has been marked as ${status}`, type: "action", created_at: new Date() };
    setHistory([...afeHistories, newComment]);
  };
  
  return (
    <>
      <main>
        <div className="pt-16 px-4 sm:px-16 ">
          <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 xl:mx-0 xl:max-w-none xl:grid-cols-3"> 
            <div className="xl:col-start-3 xl:row-end-1 h-15 shadow-lg ring-3 ring-[var(--darkest-teal)]/9 sm:mx-0 sm:rounded-lg px-3 py-3">
              <div className="max-w-7xl">
                <div className="flex justify-between max-w-2xl gap-x-1 xl:mx-0 xl:max-w-none">
                  <div className="flex gap-x-4 sm:gap-x-6">
                    <button
                      hidden={doesUserHaveAcceptRejectRole ? false : true}
                      className="rounded-md bg-[var(--dark-teal)] disabled:bg-gray-200 disabled:text-gray-400 px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]"
                      onClick={(e: any) => {
                        handlePartnerStatusChange(afeRecord?.id!, afeRecord?.partner_status!, 'Approved', 'The partner marked the AFE as approved', 'action', token),
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
                      hidden={doesUserHaveAcceptRejectRole ? false : true}
                      className="rounded-md bg-white disabled:bg-gray-200 disabled:text-gray-400 disabled:outline-none px-3 py-2 text-sm font-semibold custom-style text-[var(--darkest-teal)] shadow-xs transition-colors ease-in-out duration-300 hover:bg-red-800 hover:text-white outline-2 -outline-offset-2 outline-[var(--dark-teal)] hover:outline-red-800"
                      onClick={(e: any) => {
                        handlePartnerStatusChange(afeRecord?.id!, afeRecord?.partner_status!, 'Rejected', 'The partner marked the AFE as rejected', 'action', token),
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
                    
                    
                  </div>
                  <div className="flex items-center gap-x-4 sm:gap-x-6">
                    <button
                      hidden={doesUserHavePartnerViewAFERole ? false : true}
                      className="rounded-md bg-[var(--dark-teal)] disabled:bg-gray-200 disabled:text-gray-400 px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]"
                      onClick={(e: any) => {
                        
                        handlePartnerArchiveStatusChange(afeRecord?.id!, !afeRecord?.partner_archived, `${!afeRecord?.partner_archived === false ? 'The Partner Un-Archived the AFE' : 'The Partner Archived the AFE'}`, 'action', token),
                        setAFERecord(prev => (prev ? { ...prev, partner_archived: !prev.partner_archived } : null));
                      }}
                      >
                      {afeRecord?.partner_archived === true ? 'Un-Archive' : 'Archive'}
                    </button>
                    
                    <button
                      hidden={doesUserHaveOperatorViewAFERole ? false : true}
                      className="rounded-md bg-[var(--dark-teal)] disabled:bg-gray-200 disabled:text-gray-400 px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]"
                      onClick={(e: any) => {
                        handleOperatorArchiveStatusChange(afeRecord?.id!, !afeRecord?.archived, `${!afeRecord?.archived === false ? 'The Operator Un-Archived the AFE' : 'The Operator Archived the AFE'}`, 'action', token),
                        setAFERecord(prev => (prev ? { ...prev, archived: !prev.archived } : null));
                        refreshData();
                      }}
                      >
                      {afeRecord?.archived === true ? 'Un-Archive' : 'Archive'}
                    </button>
                    

                  </div>
                </div>
              </div>
            </div>
           
            <div className="-mx-4 px-4 py-8 shadow-lg ring-3 ring-[var(--darkest-teal)]/9 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-8 xl:col-span-2 xl:row-span-2 xl:row-end-2 xl:px-8 xl:pt-0 xl:pb-8">
               {afeLoading ? (<div><LoadingPage></LoadingPage></div>) : (
                <>
               {/* AFE Header 1 */}
              <div className="m-0 sm:flex justify-between">
                <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] sm:text-left mt-2">{afeRecord?.partner_name} Status<span className={`font-semibold ml-2 pl-2 rounded-md bg-${statusBackgroundColor} px-2 text-${statusColor} ring-1 ring-${statusRingColor} ring-inset`}>{afePartnerStatus}</span></h2>
                <div>
                <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] sm:text-left mt-2">Operator<span className="font-normal pl-2">{afeRecord?.operator}</span></h2>
                <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] sm:text-left">Operator Approval Date<span className="font-normal pl-2">{afeRecord?.iapp_date}</span></h2>
                </div>
              </div>
              {/* AFE Header 2 */}
              <div className="mt-2 border-t border-t-2 border-[var(--darkest-teal)] border-b border-b-4 border-double border-[var(--darkest-teal)]">
                <dl className="mt-2 mb-2 pl-2 sm:rounded-xs grid grid-cols-2 text-sm/6 bg-[var(--darkest-teal)]/10 sm:grid-cols-4">
                  <div className="sm:pr-4 text-left">
                    <dt className="inline text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] ">AFE Number</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] pl-2 capitalize">
                      {afeRecord?.afe_number}
                    </dd>
                  </div>
                  <div className="sm:pr-4 text-left border ">
                    <dt className="inline text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] ">Version</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] pl-2 capitalize">
                      {afeRecord?.version_string}
                    </dd>
                  </div>
                  <div className="sm:pr-4 text-left">
                    <dt className="inline text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] ">AFE Type</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] pl-2 capitalize">
                      {afeRecord?.afe_type}
                    </dd>
                  </div>
                  <div className="sm:pr-4 text-left">
                    <dt className="inline text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] ">Well Name</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] pl-2 capitalize">
                      {afeRecord?.afe_type}
                    </dd>
                  </div>
                  
                  <div className="sm:pr-4 text-left">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">Gross Total</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] pl-2">
                      ${ afeRecord?.supp_gross_estimate! > 0 ?
                      afeRecord?.supp_gross_estimate!.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) :
                      afeRecord?.total_gross_estimate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      }
                    </dd>
                  </div>
                  <div className="sm:pr-4 text-left">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">Net Total</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] pl-2">
                      { afeRecord?.supp_gross_estimate! > 0 ?
                      calcPartnerNet(afeRecord?.supp_gross_estimate!, afeRecord?.partner_wi) :
                      calcPartnerNet(afeRecord?.total_gross_estimate, afeRecord?.partner_wi)
                      }
                    </dd>
                  </div>
                  <div className="sm:pr-4 col-span-2 text-left">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)] capitalize truncate">{afeRecord?.partner_name.toLowerCase()} WI</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] text-right pl-2">
                      {afeRecord?.partner_wi.toFixed(6)}%
                    </dd>
                  </div>
                </dl>
              </div>
              </>
               )}
               {afeEstimatesLoading ? (<div><LoadingPage></LoadingPage></div>) : (
                <>
                
               {/* AFE Estimates */}
               <div className="w-full">
              <table className="mt-6 text-left text-sm/6 2xl:whitespace-nowrap table-fixed">

                {groupedAccounts && Array.from(groupedAccounts).map(([accountGroup, accounts]) => (
                  <tbody key={accountGroup}>

                    <tr className="border-t border-b border-[var(--darkest-teal)] text-[var(--darkest-teal)] font-semibold custom-style h-10">
                      <td className="hidden w-1/5 table-cell pl-2">{accountGroup}</td>
                      <td className="hidden px-0 py-0 text-right w-1/5 table-cell">Operator Account#</td>
                      <td className="px-0 py-0 text-right w-1/5 table-cell">Account#</td>
                      <td className="hidden px-0 py-0 text-right w-1/5 table-cell">Gross Amount</td>
                      <td className="px-0 py-0 pr-2 text-right w-1/5 table-cell">Net Amount</td>
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
              </>
               )}
            </div>
            <div className="xl:col-start-3">
            <AFEHistory historyAFEs={afeHistories} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}



