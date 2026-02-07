import { useSupabaseData } from "src/types/SupabaseContext";
import { fetchAFEDetails, fetchAFEDocs, fetchRelatedDocuments,fetchAFEAttachments, fetchAFEEstimates, fetchAFEHistory, fetchAFEWells, fetchAFESignedNonOp } from "provider/fetch";
import { setAFEHistoryMaxID, groupByAccountGroup, calcPartnerNet, toggleStatusButtonDisable } from "src/helpers/helpers";
import { doesLoggedInUserHaveCorrectRole } from "src/helpers/styleHelpers";
import { setStatusTextColor, setStatusBackgroundColor, setStatusRingColor } from "./helpers/styleHelpers";
import { useParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { type AFEDocuments, type AFEHistorySupabaseType, type AFEType, type AFEWells, type EstimatesSupabaseType } from "../../../types/interfaces";
import { transformAFEHistorySupabase, transformSingleAFE, transformEstimatesSupabase, transformAFEDocumentList, transformAFEWells } from "src/types/transform";
import AFEHistory from "./afeHistory";
import { handleOperatorArchiveStatusChange, handlePartnerArchiveStatusChange, usePartnerStatusChange } from "./helpers/helpers";
import LoadingPage from "src/routes/loadingPage";
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon} from '@heroicons/react/24/outline';
import DocumentBrowser from './documentViewer';
import * as XLSX from 'xlsx';
import UniversalPagination from "src/routes/sharedComponents/pagnation";
import { ToastContainer } from "react-toastify";
import { insertAFEHistory } from "provider/write";
import { handleTabChanged } from "src/routes/sharedComponents/tabChange";
import NoSelectionOrEmptyArrayMessage from "src/routes/sharedComponents/noSelectionOrEmptyArrayMessage";
import FileUpload from "src/routes/sharedComponents/fileUpload";

const tabs = [
  {id:1, name:"AFE Documents", current: true},
  {id:2, name:"AFE Comments", current: false},
  {id:3, name:"AFE History", current: false}
];

export default function AFEDetailURL() {
  const { afeID } = useParams<{ afeID: string }>();
  const { loggedInUser, session } = useSupabaseData();
  const token = session?.access_token ?? "";
  const [tabList, setTabList] = useState(tabs);
  const [currentTab, setCurrentTab] = useState(1);
  const [open, setOpen] = useState(false);
  const { handlePartnerStatusChange } = usePartnerStatusChange();

  const [afeHistoryloading, setAFEHistoryLoading] = useState(false);
  const [afeLoading, setAFELoading] = useState(false);
  const [afeEstimatesLoading, setAFEEstimatesLoading] = useState(false);
  const [afeDocumentLoading, setAFEDocumentLoading] = useState(false);

  const [afeRecord, setAFERecord] = useState<AFEType | null>(null);
  const [afeEstimates, setEstimates] = useState<EstimatesSupabaseType[] | []>([]);
  const [afeHistories, setHistory] = useState<AFEHistorySupabaseType[] | []>([]);
  const [afeHistoriesComments, setAFEHistoryComments] = useState<AFEHistorySupabaseType[] | []>([]);
  const [afeHistoriesActions, setAFEHistoryActions] = useState<AFEHistorySupabaseType[] | []>([]);
  const [afeDocs, setDocs] = useState<AFEDocuments[] | []>([]);
  const [afeWells, setWells] = useState<AFEWells[] | []>([]);
  const [docToView, setDocToView] = useState<string>('');
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

  
  const [rowsToShow, setRowsToShow] = useState<EstimatesSupabaseType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  
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
  }, [afeID, token])

  useEffect(() => {
    let isMounted = true;

    async function fetchAllRelatedData() {
      if(!afeID || token==='' ) return;
      // Fetch history
      setAFEHistoryLoading(true);
      try{
        const historyResponse = await fetchAFEHistory(afeID, token);

        if(!historyResponse.ok) {
          throw new Error((historyResponse as any).message ?? "Cannot find AFE Details");
        }

        if(isMounted) {
          const historyTransformed = transformAFEHistorySupabase(historyResponse.data);
          setHistory(historyTransformed.sort((a: AFEHistorySupabaseType, b: AFEHistorySupabaseType) => a.id - b.id));
        }

      } 
      finally {
                if (isMounted) {
                    setAFEHistoryLoading(false);
                   
                }
      };

      if(!afeID || token==='' || !afeRecord || !afeRecord.apc_op_id || !afeRecord.apc_partner_id) return;
      //fetch document list
      setAFEDocumentLoading(true);
      try{
        const documentResponse = await fetchAFEDocs(afeID, afeRecord.apc_op_id, afeRecord.apc_partner_id, token);
        const attachmentResponse = await fetchAFEAttachments(afeID, afeRecord.apc_op_id, token);
        const signedAFENonOpResponse = await fetchAFESignedNonOp(afeID, afeRecord.apc_op_id, afeRecord.apc_partner_id, token);
        
        if(!documentResponse.ok || !attachmentResponse.ok || !signedAFENonOpResponse.ok) {
          return;
        }
        if(isMounted) {
          
          const documentTransformed: AFEDocuments[] = transformAFEDocumentList(documentResponse.data);
          const attachmentTransformed: AFEDocuments[] = transformAFEDocumentList(attachmentResponse.data);
          const signedAFENonOpTransformed: AFEDocuments[] = transformAFEDocumentList(signedAFENonOpResponse.data);
          setDocs(documentTransformed.concat(attachmentTransformed, signedAFENonOpTransformed));
        }
      }
      finally {
                if (isMounted) {
                    setAFEDocumentLoading(false);
                }
      };
      
      if(!afeRecord || !afeRecord.source_system_id || !afeRecord.apc_partner_id) return;
       // Fetch estimates
       setAFEEstimatesLoading(true);
       try {
        const estimatesResponse = await fetchAFEEstimates(afeRecord.source_system_id, afeRecord.apc_partner_id, afeRecord.apc_op_id, token);

        if(!estimatesResponse.ok) {
          throw new Error((estimatesResponse as any).message ?? "Cannot find AFE Estimates");
        }
        if(isMounted) {
          const estimatesTransformed = transformEstimatesSupabase(estimatesResponse.data);
          setEstimates(estimatesTransformed.sort((a, b) => a.operator_account_group.localeCompare(b.operator_account_group)));
        }
       }
       finally {
                if (isMounted) {
                    setAFEEstimatesLoading(false);
                }
      };

      if(!afeRecord || !afeRecord.apc_op_id || !afeRecord.source_system_id) return;
      //Fetch Wells
      try {
        const wellResponse = await fetchAFEWells(afeRecord.source_system_id, afeRecord.apc_op_id, token);

        if(!wellResponse.ok) {
          throw new Error((wellResponse as any).message ?? "Cannot find Wells");
        }

        if(isMounted) {
          console.log(wellResponse.data,'the well rsponse')
          const wellTransformed = transformAFEWells(wellResponse.data);
          setWells(wellTransformed);
        }

      }
      finally {};
      
      // Set status and UI-related states
      if(!afeRecord || !afeRecord.partner_status) return;
      const newStatus = afeRecord.partner_status;
      setAFEPartnerStatus(newStatus);
      setStatusColor(setStatusTextColor(newStatus));
      setStatusBgColor(setStatusBackgroundColor(newStatus));
      setStatusRgColor(setStatusRingColor(newStatus));
      setButtonDisabled(toggleStatusButtonDisable(afeRecord)); 
    }

    fetchAllRelatedData();
    return () => {
            isMounted = false; 
        };
  }, [afeRecord]);

  useEffect(() => {
    if(!loggedInUser || !afeRecord) return;
    const userAcceptRejectRole = doesLoggedInUserHaveCorrectRole(loggedInUser?.partnerRoles!, 6, afeRecord.apc_partner_id)
    const userPartnerViewRole = doesLoggedInUserHaveCorrectRole(loggedInUser?.partnerRoles!, 3, afeRecord.apc_partner_id)
    const userOperatorViewRole = doesLoggedInUserHaveCorrectRole(loggedInUser?.operatorRoles!, 2, afeRecord.apc_op_id)
    
    setUserAcceptRejectRole(userAcceptRejectRole);
    setUserPartnerViewAFERole(userPartnerViewRole);
    setUserOperatorViewAFERole(userOperatorViewRole);
  },[loggedInUser, afeRecord]);

  const handlePageChange = (paginatedData: EstimatesSupabaseType[], page: number) => {
    setRowsToShow(paginatedData);
    setCurrentPage(page);
  };
  
  const groupedAccounts = groupByAccountGroup(rowsToShow);
  
  function handleStatusComment(status: string) {
    setAFEHistoryMaxID(afeHistories);
    const newComment: AFEHistorySupabaseType = { id: afeHistoryMaxId, afe_id: afeID!, user: 'You', description: `AFE has been marked as ${status}`, type: "action", created_at: new Date() };
    setHistory([...afeHistories, newComment]);
  };

  async function handleViewDocument(url:string) {
    try{
    const file = await fetchRelatedDocuments(url,token);

    if(file.ok) {
      setDocToView(file.data[0].uri)
    }

    } finally {
      if(docToView !=='') {
        setOpen(true);
      }
    }

  };

  async function handleDownloadDocument(url:string, fileName: string, mimetype:string) {
  
    try{
    const file = await fetchRelatedDocuments(url,token);
    const filename = fileName+'.'+mimetype;
    if(file.ok) {
      const downloadURL = file.data[0].uri;
      const a = document.createElement("a");
      a.href = filename ? `${downloadURL}&download=${encodeURIComponent(filename)}` : downloadURL;
      a.setAttribute("download", filename ?? "");
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
  console.error("No signed URL returned from Supabase.");
}
     
    } finally {
    return;
    }

  };

  const handleExport = async () => {
      
      const estimatesExport = () => {
        if(afeEstimates===null) return [];
        return afeEstimates.map(item => ({
          operator_Account_Description: item.operator_account_description,
          operator_Account_Group: item.operator_account_group,
          operator_Account_Number: item.operator_account_number,
          account_Description: item.partner_account_description,
          account_Group: item.partner_account_group,
          account_Number: item.partner_account_number,
          gross_amount: item.amount_gross,
          net_amount: item.partner_net_amount
        }))
      };
        const ws = XLSX.utils.json_to_sheet(estimatesExport());
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Export");
        XLSX.writeFile(wb, "export.xlsx");
      
  };

  useMemo(() => {
     setAFEHistoryComments(afeHistories.filter(history => history.type === 'comment'));
     setAFEHistoryActions(afeHistories.filter(history => history.type !== 'comment'));

  },[afeHistories]);

  
  return (
    <>
      <main >
        <div className="h-full text-center mx-20 mt-20" hidden={(afeRecord === null && afeLoading == false) ? false : true}>
          <NoSelectionOrEmptyArrayMessage
          message={'You do not have permission to view this AFE'}
          />
        </div>
        <div hidden={(afeRecord === null && afeLoading == false) ? true : false}>
      <div className="relative h-full">
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed top-0 bottom-0 right-0 flex max-w-full pl-10 sm:pl-16 items-start pt-20">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-2xl h-full transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="relative flex flex-col overflow-y-auto bg-[var(--dark-teal)]/85 py-6 shadow-xl max-h-[calc(95vh-5rem)] shadow-lg ring-3 ring-[var(--darkest-teal)]/9 rounded-lg">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-base font-semibold text-gray-900"></DialogTitle>
                      <div className="ml-3 flex h-3 items-center">
                        <button
                          type="button"
                          onClick={() => {setOpen(false), setDocToView('')}}
                          className="relative rounded-md text-white/70 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-4 overflow-y-auto">
                    <DocumentBrowser
                  file={docToView}
                  >
                  </DocumentBrowser>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
        <div className="pt-16 px-4 sm:px-16 h-full">
          <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 xl:mx-0 xl:max-w-none xl:grid-cols-3"> 
            {/* Archive Accept Reject Buttons */}
            <div hidden={!doesUserHaveAcceptRejectRole && !doesUserHaveOperatorViewAFERole && !doesUserHaveOperatorViewAFERole}
            className="xl:col-start-3 xl:row-end-1 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:mx-0 px-3 py-3 ">
              <div className="max-w-7xl">
                <div className="flex justify-between max-w-2xl gap-x-1 xl:mx-0 xl:max-w-none">
                  <div className="flex items-center gap-x-4">
                    <button
                      hidden={doesUserHaveAcceptRejectRole ? false : true}
                      className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2 py-1 text-xs/6 2xl:text-sm/7 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                      onClick={(e: any) => {
                        handlePartnerStatusChange(afeRecord!, 'Approved', `${loggedInUser?.firstName} ${loggedInUser?.lastName} at ${afeRecord?.partner_name} marked the AFE as approved`, 'action'),
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
                      className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-white disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2 py-1 text-xs/6 2xl:text-sm/7 font-semibold custom-style text-[var(--dark-teal)] transition-colors ease-in-out duration-300 hover:bg-red-800 hover:outline-red-800 hover:text-white outline-2 -outline-offset-1 outline-[var(--dark-teal)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-800"
                      onClick={(e: any) => {
                        handlePartnerStatusChange(afeRecord!, 'Rejected', `${loggedInUser?.firstName} ${loggedInUser?.lastName} at ${afeRecord?.partner_name} marked the AFE as rejected`, 'action'),
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
                  <div className="flex items-center gap-x-4">
                    <button
                      hidden={doesUserHavePartnerViewAFERole ? false : true}
                      className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2 py-1 text-xs/6 2xl:text-sm/7 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                      onClick={(e: any) => {
                        
                        handlePartnerArchiveStatusChange(afeRecord?.id!, !afeRecord?.partner_archived, `${!afeRecord?.partner_archived === false ? 'The Partner Un-Archived the AFE' : 'The Partner Archived the AFE'}`, 'action', token),
                        setAFERecord(prev => (prev ? { ...prev, partner_archived: !prev.partner_archived } : null));
                      }}
                      >
                      {afeRecord?.partner_archived === true ? 'Un-Archive' : 'Archive'}
                    </button>
                    
                    <button
                      hidden={doesUserHaveOperatorViewAFERole ? false : true}
                      className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2 py-1 text-xs/6 2xl:text-sm/7 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
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
           {/* AFE Details */}
            <div className="px-2 py-1 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:mx-0 sm:px-8 sm:pb-8 xl:col-span-2 xl:row-span-2 xl:row-end-2 xl:px-8 xl:pt-0 xl:pb-8">
               {afeLoading ? (<div><LoadingPage></LoadingPage></div>) : (
                <>
               {/* AFE Header 1 */}
              <div className="m-0 max-w-2xl sm:w-full sm:flex justify-between text-xs/6 2xl:text-sm/6 ">
                <div>
                <h2 className="font-semibold custom-style text-[var(--darkest-teal)] sm:text-left sm:mt-2">{afeRecord?.partner_name} Status<span className={`font-semibold ml-2 pl-2 rounded-md bg-${statusBackgroundColor} px-2 text-${statusColor} ring-1 ring-${statusRingColor} ring-inset`}>{afePartnerStatus}</span></h2>
                <h2 className="font-semibold custom-style text-[var(--darkest-teal)] sm:text-left">{afeRecord?.partner_name.toLowerCase()} WI<span className="font-normal pl-2">{afeRecord?.partner_wi.toFixed(6)}%</span></h2>
                </div>
                <div>
                <h2 className="font-semibold custom-style text-[var(--darkest-teal)] sm:text-right sm:mt-2">Operator<span className="font-normal pl-2">{afeRecord?.operator}</span></h2>
                <h2 className="font-semibold custom-style text-[var(--darkest-teal)] sm:text-right">{afeRecord?.operator} WI<span className="font-normal pl-2">{afeRecord?.operator_wi.toFixed(6)}%</span></h2>
                </div>
              </div>
              {/* AFE Header 2 */}
              <div className="mt-4 sm:w-full border-t border-t-1 border-b border-b-4 border-double border-[var(--darkest-teal)]/70">
                <div className="mt-2 mb-2 pl-2 sm:rounded-xs grid grid-cols-2 text-xs/6 2xl:text-sm/6 bg-[var(--darkest-teal)]/10 sm:grid-cols-15">
                  <div className="2xl:pr-4 text-left sm:col-span-4 col-span-7">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)] ">AFE Number</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] capitalize">
                      {afeRecord?.afe_number}
                    </dd>
                  </div>
                  <div className="2xl:pr-4 text-left sm:col-span-3 col-span-7">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)] ">Version</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] capitalize">
                      {afeRecord?.version_string}
                    </dd>
                  </div>
                  <div className="2xl:pr-4 text-left sm:col-span-4 col-span-7">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)] ">AFE Type</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] capitalize">
                      {afeRecord?.afe_type}
                    </dd>
                  </div>
                  <div className="sm:pr-2 sm:text-right sm:col-span-4 col-span-7">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)] ">Well Name</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] capitalize">
                      {afeRecord?.well_name}
                    </dd>
                  </div>

                  <div className="2xl:pr-4 text-left sm:col-start-1 col-span-7">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">Gross Total</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)]">
                      ${ afeRecord?.supp_gross_estimate! > 0 ?
                      afeRecord?.supp_gross_estimate!.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) :
                      afeRecord?.total_gross_estimate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      }
                    </dd>
                  </div>
                  <div className="2xl:pr-4 text-left col-span-7">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">Net Total</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)]">
                      { afeRecord?.supp_gross_estimate! > 0 ?
                      calcPartnerNet(afeRecord?.supp_gross_estimate!, afeRecord?.partner_wi) :
                      calcPartnerNet(afeRecord?.total_gross_estimate, afeRecord?.partner_wi)
                      }
                    </dd>
                  </div>
                  <div className="sm:pr-4 col-span-15 sm:row-start-3 sm:text-right">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">{afeRecord?.operator} Approved</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)]">
                      {afeRecord?.iapp_date}
                    </dd>
                  </div>
                  
                </div>
              </div>
              </>
               )}
               {/* AFE Wells - Hidden if there is only one */}
               <div 
               hidden={afeWells.length === 0 ? true : false}
               className="rounded-lg bg-white shadow-xl ring-1 ring-[var(--darkest-teal)]/70 my-4 pl-2">
               <h2 className="pt-1 text-xs/6 2xl:text-sm/6 font-semibold text-[var(--darkest-teal)] custom-style">Wells</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-1 text-xs/6 2xl:text-sm/6 custom-style-long-text text-[var(--dark-teal)] capitalize">
                {afeWells.map((item, wellIdx) => (
                  <div key={wellIdx} className="p-0 pb-1">
                    {item.well_name}
                    {item.well_number !== null && (
                      <>
                        <br />
                        {item.well_number}
                      </>
                    )}
                    {item.description !== null && (
                      <>
                        <br />
                        {item.description}
                      </>
                    )}
                  </div>
                ))}
              </div>
              </div>
               {afeEstimatesLoading ? (<div><LoadingPage></LoadingPage></div>) : (
                <>
               {/* AFE Estimates */}
              <div className="2xl:h-100">  
              <table className="w-full text-left text-xs/6 2xl:text-sm/6 2xl:whitespace-nowrap">

                {groupedAccounts && Array.from(groupedAccounts).map(([accountGroup, accounts]) => (
                  <tbody key={accountGroup} >

                    <tr className="border-t border-[var(--darkest-teal)]/90 text-[var(--darkest-teal)] font-semibold custom-style h-10">
                      <td className="hidden sm:table-cell w-2/6 pl-0">{accountGroup.toUpperCase()}</td>
                      <td className="table-cell px-0 py-0 text-left sm:text-center w-1/6 ">Operator Account#</td>
                      <td className="hidden sm:table-cell px-0 py-0 text-center w-1/6 ">Account#</td>
                      <td className="hidden sm:table-cell px-0 py-0 text-right w-1/6 ">Gross Amount</td>
                      <td className="table-cell px-0 py-0 text-right w-1/6 ">Net Amount</td>
                    </tr>
                    {accounts.map((item) => (
                      <tr key={item.id} className="border-t border-[var(--darkest-teal)]/30 text-[var(--darkest-teal)] custom-style-long-text tabular-nums">
                        <td className="hidden sm:table-cell px-0 py-3 text-left sm:w-2/6">
                          {item.operator_account_description}
                        </td>
                        <td className="table-cell px-0 py-3 text-left sm:text-center w-1/6">
                          {item.operator_account_number}
                        </td>
                        <td className="hidden sm:table-cell px-0 py-3 text-center w-1/6">
                          {item.partner_account_number}
                        </td>
                        <td className="hidden sm:table-cell px-0 py-3 text-right w-1/6">
                          ${item.amount_gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="table-cell px-0 py-3 text-right w-1/6">
                          ${item.partner_net_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
              <div hidden={afeEstimates.length > 0 ? false : true}
              className="border-t border-[var(--darkest-teal)]/70 w-full flex justify-end sm:justify-between flex-row sm:flex-row gap-5 px-1 items-center pt-2 text-xs/6 2xl:text-sm/6">
                <UniversalPagination
                  data={afeEstimates}
                  rowsPerPage={6}
                  listOfType="Line Items"
                  onPageChange={handlePageChange}
                />
              </div>
            </div>    
          </>
               )}
              <div hidden={afeEstimates.length > 0 ? false : true} 
              className="mt-4 -mb-8 hidden sm:flex items-center justify-end border-t border-[var(--darkest-teal)]/30 py-4">
                <button
                  onClick={async (e: any) => {
                    e.preventDefault();
                    handleExport();

                  }}
                  className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-xs/6 2xl:text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
                  Export Line Items to Excel
                </button>
              </div>
            
            </div>
            
            {/* AFE DOCS and AFE History*/}
            <div className="xl:col-start-3">
              <div className="sm:flex">
                <div className="w-full">
                  <nav aria-label="Tabs" className="-mb-px flex rounded-t-md border border-[var(--darkest-teal)]">
                    {tabList.map((item, index) => (
                      <Button
                        key={item.id}
                        onClick={e => {
                          handleTabChanged(
                            {
                              selected: item.id,
                              tabs: tabs,
                              onTabChange: (currentTab) => setCurrentTab(currentTab),
                              onTabListChange: (tabs) => setTabList(tabs)
                            }
                          )
                        }}
                        className={`flex-1 text-center custom-style transition-colors ease-in-out duration-300 text-xs/6 2xl:text-sm/6
                    
                    ${item.current
                            ? 'bg-[var(--dark-teal)] text-white border-t-3 border-t-[var(--bright-pink)] py-2 font-medium shadow-sm z-10'
                            : 'bg-white shadow-2xl text-[var(--darkest-teal)] transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:text-white hover:font-semibold font-normal cursor-pointer'}
                        ${index !== 0 ? 'border-l border-[var(--darkest-teal)]' : ''}
                        ${index === 0 ? 'rounded-tl-md' : ''}
                        ${index === tabList.length - 1 ? 'rounded-tr-md' : ''}
                        `}>
                        <span className="">{item.name}</span>
                      </Button>
                    ))}
                  </nav>
                </div>
              </div>
              <div hidden={currentTab !== 1}>
                <div hidden={afeDocs.length <= 0 ? false : true}
                  className="mt-4 rounded-lg shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:mx-0 sm:rounded-b-lg">
                  <NoSelectionOrEmptyArrayMessage
                    message={
                      <>
                        There are no documents for this AFE.
                        <br /><br />
                        If you are the Operator and expect to see attachments please verify the comments associated to the files are correct.
                      </>
                    }
                  />
                </div>
                <div hidden={afeDocs.length > 0 ? false : true}>
                  <div className="mb-6 bg-white mb-4 mt-4 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:mx-0 sm:rounded-b-lg px-5 py-3">
                    <ul role="list" className="divide-y divide-[var(--darkest-teal)]/20">
                      {afeDocs?.map((afeDoc) => (
                        <li key={afeDoc.id}>
                          <div className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style font-medium">
                            {afeDoc.filename_display}
                          </div>
                          <div className="flex items-center gap-x-3 pl-5 custom-style-long-text font-semibold underline text-xs/6 2xl:text-sm/6 mb-3 mt-1">
                            <ul
                              className="flex justify-center items-center align-center gap-x-[10px]"
                              role="navigation"
                              aria-label="View Document">
                              <li className="cursor-pointer"
                                onClick={(e) => {
                                  handleDownloadDocument(afeDoc.storage_path, afeDoc.filename_display, afeDoc.mimeype),
                                  insertAFEHistory(afeRecord?.id!, loggedInUser!.firstName!.concat(' ', loggedInUser!.lastName!, ' downloaded the AFE attachment ', afeDoc.filename_display, ' for AFE# ', afeRecord!.afe_number!, afeRecord?.version_string ? ' '.concat(afeRecord?.version_string) : ''), 'file download', token)
                                }}>
                                Download
                              </li>
                              <li className="cursor-pointer"
                                hidden={afeDoc.mimeype === 'pdf' ? false : true}
                                onClick={(e) => {
                                  setOpen(true), handleViewDocument(afeDoc.storage_path),
                                  insertAFEHistory(afeRecord?.id!, loggedInUser!.firstName!.concat(' ', loggedInUser!.lastName!, ' viewed the AFE attachment ', afeDoc.filename_display, ' for AFE# ', afeRecord!.afe_number!, afeRecord?.version_string ? ' '.concat(afeRecord?.version_string) : ''), 'file viewed', token)
                                }}>
                                View
                              </li>
                            </ul>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  className="">
                  <FileUpload
                  apc_afe_id={afeRecord?.id!}
                  apc_op_id={afeRecord?.apc_op_id!}
                  apc_part_id={afeRecord?.apc_partner_id!}
                  apc_partner_name={afeRecord?.partner_name!}
                  userName={loggedInUser?.firstName+' '+loggedInUser?.lastName}
                  loggedInUserEmail={loggedInUser?.email!}
                  token={token}
                  afe_number={afeRecord?.afe_number!}
                  afe_version={afeRecord?.version_string!}
                  ></FileUpload>
                  <ToastContainer/>
                </div>
              </div>
              <div hidden={currentTab !== 2}>
                <AFEHistory historyAFEs={afeHistoriesComments}
                apc_afe_id={afeID!}
                userName={loggedInUser?.firstName}
                maxRowsToShow={5}
                onlyShowRecentFileHistory={false}
                hideCommentBox={false}
                />
              </div>
              
              <div hidden={currentTab !== 3} >
                <AFEHistory historyAFEs={afeHistoriesActions}
                apc_afe_id={afeID!}
                userName={loggedInUser?.firstName}
                maxRowsToShow={5}
                onlyShowRecentFileHistory={true}
                hideCommentBox={true}
                />
              </div>
              
            </div>
          </div>
        </div>
        </div>
      </main>
      <ToastContainer/>
    </>
  )
}



