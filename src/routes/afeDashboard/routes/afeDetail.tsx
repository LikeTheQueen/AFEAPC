import { useSupabaseData } from "src/types/SupabaseContext";
import { fetchAFEDetails, fetchAFEDocs, fetchRelatedDocuments,fetchAFEAttachments, fetchAFEEstimates, fetchAFEHistory, fetchAFEWells } from "provider/fetch";
import { setAFEHistoryMaxID, groupByAccountGroup, calcPartnerNet, toggleStatusButtonDisable } from "src/helpers/helpers";
import { doesLoggedInUserHaveCorrectRole } from "src/helpers/styleHelpers";
import { setStatusTextColor, setStatusBackgroundColor, setStatusRingColor } from "./helpers/styleHelpers";
import { useParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { type AFEDocuments, type AFEHistorySupabaseType, type AFEType, type AFEWells, type EstimatesSupabaseType } from "../../../types/interfaces";
import { transformAFEHistorySupabase, transformSingleAFE, transformEstimatesSupabase, transformAFEDocumentList, transformAFEWells } from "src/types/transform";
import AFEHistory from "./afeHistory";
import { handleOperatorArchiveStatusChange, handlePartnerArchiveStatusChange, handlePartnerStatusChange } from "./helpers/helpers";
import LoadingPage from "src/routes/loadingPage";
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon} from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import DocumentBrowser from '../../documentViewer';
import * as XLSX from 'xlsx';

export default function AFEDetailURL() {
  const { afeID } = useParams<{ afeID: string }>();
  const { loggedInUser, session } = useSupabaseData();
  const token = session?.access_token ?? "";
  const [open, setOpen] = useState(false)

  const [afeHistoryloading, setAFEHistoryLoading] = useState(false);
  const [afeLoading, setAFELoading] = useState(false);
  const [afeEstimatesLoading, setAFEEstimatesLoading] = useState(false);
  const [afeDocumentLoading, setAFEDocumentLoading] = useState(false);

  const [afeRecord, setAFERecord] = useState<AFEType | null>(null);
  const [afeEstimates, setEstimates] = useState<EstimatesSupabaseType[] | []>([]);
  const [afeHistories, setHistory] = useState<AFEHistorySupabaseType[] | []>([]);
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

  const [rowsLimit] = useState(8);
  const [rowsToShow, setRowsToShow] = useState<EstimatesSupabaseType[]>([]);
  const [customPagination, setCustomPagination] = useState<number[] | []>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  
  const [paginationData, setPaginationData] = useState<{
  pageNumber: number;
  numPages: number;
  setPageNumber: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
} | null>(null);

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
        setHistory(historyTransformed);
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
        
        if(!documentResponse.ok || !attachmentResponse.ok) {
          return;
        }
        if(isMounted) {
          const documentTransformed: AFEDocuments[] = transformAFEDocumentList(documentResponse.data);
          const attachmentTransformed: AFEDocuments[] = transformAFEDocumentList(attachmentResponse.data);
          setDocs(documentTransformed.concat(attachmentTransformed));
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
          setEstimates(estimatesTransformed);
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

  useEffect(() => {
  if (afeEstimates.length > 0) {
    const startIndex = currentPage * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    setRowsToShow(afeEstimates.slice(startIndex, endIndex));
  }
}, [afeEstimates, currentPage, rowsLimit]);

  useMemo(() => {
    setCustomPagination(
      Array(Math.ceil(afeEstimates.length / rowsLimit)).fill(null)
    );
      setTotalPage(
      Math.ceil(afeEstimates.length / rowsLimit)
    )
      }, [afeEstimates]);

  const groupedAccounts = groupByAccountGroup(rowsToShow);
  
  function handleStatusComment(status: string) {
    setAFEHistoryMaxID(afeHistories);
    const newComment: AFEHistorySupabaseType = { id: afeHistoryMaxId, afe_id: afeID!, user: 'You', description: `AFE has been marked as ${status}`, type: "action", created_at: new Date() };
    setHistory([...afeHistories, newComment]);
  };

  async function handleViewDocument(url:string) {
    try{
    const file = await fetchRelatedDocuments(url,token);
console.log(file)
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
  
  const nextPage = () => {
        const startIndex = rowsLimit * (currentPage + 1);
        const endIndex = startIndex + rowsLimit;
        const newArray = afeEstimates.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(currentPage + 1);
  };
  const changePage = (value: number) => {
        const startIndex = value * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = afeEstimates.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(value);
  };
  const previousPage = () => {
        const startIndex = (currentPage - 1) * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = afeEstimates.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else {
            setCurrentPage(0);
        }
  };
  console.log(afeWells,'the well')
  console.log(afeRecord?.source_system_id)
  console.log(afeRecord?.apc_op_id)
  
  return (
    <>
      <main >
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
        <div className="pt-16 px-4 sm:px-16 ">
          <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 xl:mx-0 xl:max-w-none xl:grid-cols-3"> 
            {/* Archive Accept Reject Buttons */}
            <div className="xl:col-start-3 xl:row-end-1 h-15 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:mx-0 px-3 py-3">
              <div className="max-w-7xl">
                <div className="flex justify-between max-w-2xl gap-x-1 xl:mx-0 xl:max-w-none">
                  <div className="flex gap-x-4 sm:gap-x-6">
                    <button
                      hidden={doesUserHaveAcceptRejectRole ? false : true}
                      className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
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
                      className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-white disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-[var(--dark-teal)] transition-colors ease-in-out duration-300 hover:bg-red-800 hover:outline-red-800 hover:text-white outline-2 -outline-offset-1 outline-[var(--dark-teal)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-800"
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
                      className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                      onClick={(e: any) => {
                        
                        handlePartnerArchiveStatusChange(afeRecord?.id!, !afeRecord?.partner_archived, `${!afeRecord?.partner_archived === false ? 'The Partner Un-Archived the AFE' : 'The Partner Archived the AFE'}`, 'action', token),
                        setAFERecord(prev => (prev ? { ...prev, partner_archived: !prev.partner_archived } : null));
                      }}
                      >
                      {afeRecord?.partner_archived === true ? 'Un-Archive' : 'Archive'}
                    </button>
                    
                    <button
                      hidden={doesUserHaveOperatorViewAFERole ? false : true}
                      className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
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
            <div className="sm:-mx-4 px-2 py-1 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:mx-0 sm:px-8 sm:pb-8 xl:col-span-2 xl:row-span-2 xl:row-end-2 xl:px-8 xl:pt-0 xl:pb-8">
               {afeLoading ? (<div><LoadingPage></LoadingPage></div>) : (
                <>
               {/* AFE Header 1 */}
              <div className="m-0 max-w-2xl sm:w-full sm:flex justify-between">
                <div>
                <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] sm:text-left mt-2">{afeRecord?.partner_name} Status<span className={`font-semibold ml-2 pl-2 rounded-md bg-${statusBackgroundColor} px-2 text-${statusColor} ring-1 ring-${statusRingColor} ring-inset`}>{afePartnerStatus}</span></h2>
                <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] sm:text-left">{afeRecord?.partner_name.toLowerCase()} WI<span className="font-normal pl-2">{afeRecord?.partner_wi.toFixed(6)}%</span></h2>
                </div>
                <div>
                <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] sm:text-right mt-2">Operator<span className="font-normal pl-2">{afeRecord?.operator}</span></h2>
                <h2 className="text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] sm:text-right">{afeRecord?.operator} WI<span className="font-normal pl-2">{afeRecord?.operator_wi.toFixed(6)}%</span></h2>
                </div>
              </div>
              {/* AFE Header 2 */}
              <div className="mt-4 sm:w-full border-t border-t-1 border-b border-b-4 border-double border-[var(--darkest-teal)]/70">
                <div className="mt-2 mb-2 pl-2 sm:rounded-xs grid grid-cols-2 text-sm/6 bg-[var(--darkest-teal)]/10 sm:grid-cols-15">
                  <div className="sm:pr-4 text-left col-span-4">
                    <dt className="inline text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] ">AFE Number</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] pl-2 capitalize">
                      {afeRecord?.afe_number}
                    </dd>
                  </div>
                  <div className="sm:pr-4 text-left col-span-3">
                    <dt className="inline text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] ">Version</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] pl-2 capitalize">
                      {afeRecord?.version_string}
                    </dd>
                  </div>
                  <div className="sm:pr-4 text-left col-span-4">
                    <dt className="inline text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] ">AFE Type</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] pl-2 capitalize">
                      {afeRecord?.afe_type}
                    </dd>
                  </div>
                  <div className="sm:pr-4 sm:text-right col-span-4">
                    <dt className="inline text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] ">Well Name</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] pl-2 capitalize">
                      {afeRecord?.well_name}
                    </dd>
                  </div>

                  <div className="sm:pr-4 text-left sm:col-start-1 col-span-4">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">Gross Total</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] pl-2">
                      ${ afeRecord?.supp_gross_estimate! > 0 ?
                      afeRecord?.supp_gross_estimate!.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) :
                      afeRecord?.total_gross_estimate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      }
                    </dd>
                  </div>
                  <div className="sm:pr-4 text-left col-span-3">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">Net Total</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] pl-2">
                      { afeRecord?.supp_gross_estimate! > 0 ?
                      calcPartnerNet(afeRecord?.supp_gross_estimate!, afeRecord?.partner_wi) :
                      calcPartnerNet(afeRecord?.total_gross_estimate, afeRecord?.partner_wi)
                      }
                    </dd>
                  </div>
                  <div className="sm:pr-4 col-span-8 sm:text-right shrink">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">{afeRecord?.operator} Approved</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] pl-2">
                      {afeRecord?.iapp_date}
                    </dd>
                  </div>
                  
                </div>
              </div>
              </>
               )}
               <div 
               hidden={afeWells.length === 0 ? true : false}
               className="rounded-lg bg-white shadow-xl ring-1 ring-[var(--darkest-teal)]/70 my-4 pl-2">

               
               <h2 className="pt-1 text-sm/6 font-semibold text-[var(--darkest-teal)] custom-style">Wells</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm/6 custom-style-long-text text-[var(--dark-teal)] capitalize">
                {afeWells.map((item, wellIdx) => (
                  <div key={wellIdx} className="p-2">
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
               <div className="sm:w-full">
                
              <table className="text-left text-xs/6 2xl:whitespace-nowrap table-fixed">

                {groupedAccounts && Array.from(groupedAccounts).map(([accountGroup, accounts]) => (
                  <tbody key={accountGroup}>

                    <tr className="border-t border-b border-[var(--darkest-teal)]/70 text-[var(--darkest-teal)] font-semibold custom-style h-10">
                      <td className="hidden w-1/5 table-cell pl-2">{accountGroup}</td>
                      <td className="hidden px-0 py-0 text-right w-1/5 table-cell">Operator Account#</td>
                      <td className="px-0 py-0 text-right w-1/5 table-cell">Account#</td>
                      <td className="hidden px-0 py-0 text-right w-1/5 table-cell">Gross Amount</td>
                      <td className="px-0 py-0 pr-2 text-right w-1/5 table-cell">Net Amount</td>
                    </tr>
                    {accounts.map((item) => (
                      <tr key={item.id} className="border-b border-[var(--darkest-teal)]/30 text-[var(--darkest-teal)] custom-style-long-text tabular-nums ">
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
              <div className="border-t border-[var(--darkest-teal)]/70 w-full flex justify-center sm:justify-between flex-col sm:flex-row gap-5 px-1 items-center pt-4">
                  <div className="text-sm/6 text-[var(--darkest-teal)] custom-style font-medium">
                    Showing {currentPage == 0 ? 1 : currentPage * rowsLimit + 1} to{" "}
                    {currentPage == totalPage - 1
                      ? afeEstimates?.length
                      : (currentPage + 1) * rowsLimit}{" "}
                      of {afeEstimates?.length} Line Items
                    </div>
                                                        <div className="flex">
                                                            <ul
                                                                className="flex justify-center items-center align-center gap-x-2 z-30"
                                                                role="navigation"
                                                                aria-label="Pagination">
                                                                <li
                                                                    className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid disabled] ${currentPage == 0
                                                                            ? "bg-white border-[var(--darkest-teal)]/10 text-[var(--darkest-teal)]/20 pointer-events-none"
                                                                            : "bg-white cursor-pointer border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                                                                        }`}
                                                                    onClick={previousPage}>
                                                                    <ChevronLeftIcon></ChevronLeftIcon>
                                                                </li>
                                                                {customPagination?.map((data, index) => (
                                                                    <li
                                                                        className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid bg-white cursor-pointer ${currentPage == index
                                                                                ? "bg-white border-[var(--bright-pink)] pointer-events-none"
                                                                                : "bg-white border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                                                                            }`}
                                                                        onClick={() => changePage(index)}
                                                                        key={index}
                                                                    >
                                                                        {index + 1}
                                                                    </li>
                                                                ))}
                                                                <li
                                                                    className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid disabled] ${currentPage == totalPage - 1
                                                                            ? "bg-white border-[var(--darkest-teal)]/10 text-[var(--darkest-teal)]/20 pointer-events-none"
                                                                            : "bg-white cursor-pointer border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                                                                        }`}
                                                                    onClick={nextPage}>
                                                                    <ChevronRightIcon></ChevronRightIcon>
                                                                </li>
                                                            </ul>
                                                        </div>
              </div>
              
              </div>
              
              </>
               )}
            <div className="mt-4 -mb-8 flex items-center justify-end border-t border-[var(--darkest-teal)]/30 py-4">
                              <button
                            onClick={async(e: any) => { 
                              e.preventDefault();
                              handleExport();
                              
                          }}
                            className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
                            Export Line Items to Excel
                              </button>
                            </div>
            
            </div>
            
            {/* AFE DOCS and AFE History*/}
            <div className="xl:col-start-3">
              <div hidden={afeDocs.length> 0 ? false : true }>
              <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">AFE Documents </h2>
              <div className="mb-6 mt-2 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:mx-0 sm:rounded-lg px-5 py-3">
              <ul role="list" className="divide-y divide-[var(--darkest-teal)]/20">
              {afeDocs?.map((afeDoc) => (
                <li key={afeDoc.id}>
                  <div className="text-sm/6 text-[var(--darkest-teal)] custom-style font-medium">
                  {afeDoc.filename_display}
                  </div>
                  <div className="flex items-center gap-x-3 pl-5 custom-style-long-text font-semibold underline text-sm/6 mb-3 mt-1">
                    <ul
              className="flex justify-center items-center align-center gap-x-[10px]"
              role="navigation"
              aria-label="View Document">
                <li className="cursor-pointer"
                onClick={(e) => handleDownloadDocument(afeDoc.storage_path, afeDoc.filename_display, afeDoc.mimeype)}>
                  Download
                </li>
                <li className="cursor-pointer"
                hidden={afeDoc.mimeype==='pdf'? false : true}
                onClick={(e) => {setOpen(true), handleViewDocument(afeDoc.storage_path)}}>
                  View
                </li>
                </ul>
                  </div>
                </li>
              ))}
            </ul>
            </div>
            </div>
            <AFEHistory historyAFEs={afeHistories}
            apc_afe_id={afeID!}
            userName={loggedInUser?.firstName}
            />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}



