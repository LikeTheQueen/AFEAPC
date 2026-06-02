import { useSupabaseData } from "src/types/SupabaseContext";
import { fetchAFEDetails, fetchAFEDocs, fetchRelatedDocuments,fetchAFEAttachments, fetchAFEEstimates, fetchAFEHistory, fetchAFEWells, fetchAFESignedNonOp } from "provider/fetch";
import { setAFEHistoryMaxID, groupByAccountGroup, calcPartnerNet, toggleStatusButtonDisable, notifyStandard, notifyFailure } from "src/helpers/helpers";
import { doesLoggedInUserHaveCorrectRole } from "src/helpers/styleHelpers";
import { setStatusTextColor, setStatusBackgroundColor, setStatusRingColor } from "./helpers/styleHelpers";
import { useParams } from 'react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type AFEDocuments, type AFEHistorySupabaseType, type AFEType, type AFEWells, type EstimatesSupabaseType } from "../../../types/interfaces";
import { transformAFEHistorySupabase, transformSingleAFE, transformEstimatesSupabase, transformAFEDocumentList, transformAFEWells } from "src/types/transform";
import AFEHistory from "./afeHistory";
import { handleOperatorArchiveStatusChange, handlePartnerArchiveStatusChange, handleThePartnerStatusChange } from "./helpers/helpers";
import LoadingPage from "src/routes/sharedComponents/loadingPage";
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon} from '@heroicons/react/24/outline';
import DocumentBrowser from './documentViewer';
import * as XLSX from 'xlsx';
import UniversalPagination from "src/routes/sharedComponents/pagnation";
import { insertAFEHistoryRecord } from "provider/write";
import { handleTabChanged } from "src/routes/sharedComponents/tabChange";
import NoSelectionOrEmptyArrayMessage from "src/routes/sharedComponents/noSelectionOrEmptyArrayMessage";
import FileUpload from "src/routes/sharedComponents/fileUpload";
import { approveRejectNonOpAFEs, viewNonOpAFEPermission, viewOperatedAFEPermission } from "src/constants/variables";

type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };

function getErrorMessage(results: ToggleResult[]): string | undefined {
  return results.find((r): r is { ok: false; message: string } => !r.ok)?.message;
}

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

  const [afeLoading, setAFELoading] = useState(false);

  const [afeRecord, setAFERecord] = useState<AFEType | null>(null);
  const [afeEstimates, setEstimates] = useState<EstimatesSupabaseType[]>([]);
  const [afeHistories, setHistory] = useState<AFEHistorySupabaseType[] >([]);
  const [afeDocs, setDocs] = useState<AFEDocuments[] >([]);
  const [afeWells, setWells] = useState<AFEWells[] >([]);
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
  const [signedNonOpAgreement, setSignedNonOpAgreement] = useState(false);
  const [afeFetchError, setAFEFetchError] = useState(false);

  
  const [rowsToShow, setRowsToShow] = useState<EstimatesSupabaseType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const getAFEDetails = useCallback(async (signal: AbortSignal) => {
    if (!afeID || token ==='') return;
      setAFELoading(true);
    try {
      const afeDetailsResults = await Promise.all([
        fetchAFEDetails(afeID, token, signal),
        fetchAFEHistory(afeID, token, signal)
      ]);

      if (afeDetailsResults.some(r => !r.ok)) {
        throw new Error(getErrorMessage(afeDetailsResults) ?? 'Cannot get AFE Details');
      }

        if(!signal.aborted) {
          
          const afeDetailsResultsSuccesses = afeDetailsResults as { ok: true; data: any[] }[];
          const afeDetailsFormatted = transformSingleAFE(afeDetailsResultsSuccesses[0].data);
          setAFERecord(afeDetailsFormatted);
          const historyTransformed = transformAFEHistorySupabase(afeDetailsResultsSuccesses[1].data);
          setHistory(historyTransformed.sort((a: AFEHistorySupabaseType, b: AFEHistorySupabaseType) => a.id - b.id));
          
          const relatedAFEDetailsResults = await Promise.all([
            fetchAFEDocs(afeID, afeDetailsFormatted.apc_op_id, afeDetailsFormatted.apc_partner_id, token),
            fetchAFEAttachments(afeID, afeDetailsFormatted.apc_op_id, token),
            fetchAFESignedNonOp(afeID, afeDetailsFormatted.apc_op_id, afeDetailsFormatted.apc_partner_id, token),
            fetchAFEEstimates(afeDetailsFormatted.source_system_id, afeDetailsFormatted.apc_partner_id, afeDetailsFormatted.apc_op_id, token),
            fetchAFEWells(afeDetailsFormatted.source_system_id, afeDetailsFormatted.apc_op_id, token)
          ]);

          if (relatedAFEDetailsResults.some(r => !r.ok)) {
            throw new Error(getErrorMessage(relatedAFEDetailsResults) ?? 'Cannot get AFE Details');
          }
          if(!signal.aborted) {
          const relatedAFEDetailsResultsSuccesses = relatedAFEDetailsResults as { ok: true; data: any[] }[];
          const documentTransformed: AFEDocuments[] = transformAFEDocumentList(relatedAFEDetailsResultsSuccesses[0].data);
          const attachmentTransformed: AFEDocuments[] = transformAFEDocumentList(relatedAFEDetailsResultsSuccesses[1].data);
          const signedAFENonOpTransformed: AFEDocuments[] = transformAFEDocumentList(relatedAFEDetailsResultsSuccesses[2].data);
          setDocs(documentTransformed.concat(attachmentTransformed, signedAFENonOpTransformed));
          if(signedAFENonOpTransformed.length > 0 ) setSignedNonOpAgreement(true);
          const estimatesTransformed = transformEstimatesSupabase(relatedAFEDetailsResultsSuccesses[3].data);
          setEstimates(estimatesTransformed.sort((a, b) => a.operator_account_group.localeCompare(b.operator_account_group)));
          const wellTransformed = transformAFEWells(relatedAFEDetailsResultsSuccesses[4].data);
          setWells(wellTransformed);
          const newStatus = afeDetailsFormatted.partner_status;
          setAFEPartnerStatus(newStatus);
          setStatusColor(setStatusTextColor(newStatus));
          setStatusBgColor(setStatusBackgroundColor(newStatus));
          setStatusRgColor(setStatusRingColor(newStatus));
          setButtonDisabled(toggleStatusButtonDisable(afeDetailsFormatted)); 
        }
      }
    } catch(err) {
      if(!signal.aborted) {
        setAFEFetchError(true)
      }
    } finally {
      if(!signal.aborted) {
        setAFELoading(false);
      
      }
    }
  }, [token, afeID]);

  useEffect(() => {
  const controller = new AbortController();
  void getAFEDetails(controller.signal);
  return () => controller.abort();
}, [getAFEDetails]);

  
  useEffect(() => {
    if(!loggedInUser || !afeRecord) return;
    const userAcceptRejectRole = doesLoggedInUserHaveCorrectRole(loggedInUser?.partnerRoles!, approveRejectNonOpAFEs, afeRecord.apc_partner_id)
    const userPartnerViewRole = doesLoggedInUserHaveCorrectRole(loggedInUser?.partnerRoles!, viewNonOpAFEPermission, afeRecord.apc_partner_id)
    const userOperatorViewRole = doesLoggedInUserHaveCorrectRole(loggedInUser?.operatorRoles!, viewOperatedAFEPermission, afeRecord.apc_op_id)
    
    setUserAcceptRejectRole(userAcceptRejectRole);
    setUserPartnerViewAFERole(userPartnerViewRole);
    setUserOperatorViewAFERole(userOperatorViewRole);
  },[loggedInUser, afeRecord]);

  const afeHistoriesComments = useMemo(() => afeHistories.filter(h => h.type === 'comment'), [afeHistories]);
  const afeHistoriesActions = useMemo(() => afeHistories.filter(h => h.type !== 'comment'), [afeHistories]);

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

  async function handleViewDocument(url: string, docName: string) {
    try {
      const file = await fetchRelatedDocuments(url, token);

      if (!file.ok) {
        throw new Error();
      }
      const uri = file.data[0].uri;
        setDocToView(uri);
        if (uri !== '') setOpen(true);
        if(!loggedInUser?.is_super_user) {
        insertAFEHistoryRecord(afeRecord?.id!, loggedInUser!.firstName!.concat(' ', loggedInUser!.lastName!, ' viewed the AFE attachment ', docName, ' for AFE# ', afeRecord!.afe_number!, afeRecord?.version_string ? ' '.concat(afeRecord?.version_string) : ''), 'file viewed')
        }
    } catch {
      notifyFailure(`Blind Well.  The file couldn’t be opened for viewing`);
    }

  };

  async function handleDownloadDocument(url:string, fileName: string, mimetype:string) {
  
    try{
    const file = await fetchRelatedDocuments(url,token);
    const filename = fileName+'.'+mimetype;
    if(!file.ok) {
      throw new Error();
    }
      const downloadURL = file.data[0].uri;
      const a = document.createElement("a");
      a.href = filename ? `${downloadURL}&download=${encodeURIComponent(filename)}` : downloadURL;
      a.setAttribute("download", filename ?? "");
      document.body.appendChild(a);
      a.click();
      a.remove(); 
      insertAFEHistoryRecord(afeRecord?.id!, loggedInUser!.firstName!.concat(' ', loggedInUser!.lastName!, ' downloaded the AFE attachment ', fileName, ' for AFE# ', afeRecord!.afe_number!, afeRecord?.version_string ? ' '.concat(afeRecord?.version_string) : ''), 'file download')
    } catch {
      notifyFailure(`Pressure Loss Detected.  The file couldn’t be delivered`);
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
  
  async function handleStatusChanges(status: string) {
    const partnerStatusChangeResult = await handleThePartnerStatusChange(
      afeRecord!,
      status,
      `The ${afeRecord?.partner_name!} status on the AFE changed from ${afeRecord?.partner_status} to ${status}`,
      'action',
      loggedInUser?.firstName!, 
      loggedInUser?.lastName!,
      loggedInUser?.email!,
      token
    );
    if(!partnerStatusChangeResult?.ok) {
      return {ok: false};
    }
    if (partnerStatusChangeResult.ok) {
      setButtonDisabled(true);
      handleStatusComment(status);
      setAFEPartnerStatus(status);
      setStatusColor(setStatusTextColor(status));
      setStatusBgColor(setStatusBackgroundColor(status));
      setStatusRgColor(setStatusRingColor(status));

      return {ok: true};
    }
  };

  async function handleArchiveChanges(actionBy: 'Operator' | 'Partner') {
    if(actionBy === 'Operator') {
    handleOperatorArchiveStatusChange(afeRecord?.id!, !afeRecord?.archived, `${!afeRecord?.archived === false ? 'The Operator Un-Archived the AFE' : 'The Operator Archived the AFE'}`, 'action', token),
    setAFERecord(prev => (prev ? { ...prev, archived: !prev.archived } : null));           
    } else {
    handlePartnerArchiveStatusChange(afeRecord?.id!, !afeRecord?.partner_archived, `${!afeRecord?.partner_archived === false ? 'The Partner Un-Archived the AFE' : 'The Partner Archived the AFE'}`, 'action', token),
    setAFERecord(prev => (prev ? { ...prev, partner_archived: !prev.partner_archived } : null));
  }
  } ;

  return (
    <>
      <main >
        <div className="h-full text-center mx-20 mt-20" hidden={(afeRecord === null && afeLoading == false) ? false : true}>
          <NoSelectionOrEmptyArrayMessage
          message={'You do not have permission to view this AFE'}
          />
        </div>
        {afeLoading ? (<div className="h-full text-center mx-20 mt-20" ><LoadingPage></LoadingPage></div>) : (
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
                      name="partnerApprove"
                      hidden={doesUserHaveAcceptRejectRole ? false : true}
                      className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2 py-1 text-xs/6 2xl:text-sm/7 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                      onClick={() => { handleStatusChanges('Approved') }}
                      disabled={statusButtonDisabled || !signedNonOpAgreement}>
                      Approve
                    </button>
                    <button
                    name="partnerReject"
                      hidden={doesUserHaveAcceptRejectRole ? false : true}
                      className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-white disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2 py-1 text-xs/6 2xl:text-sm/7 font-semibold custom-style text-[var(--dark-teal)] transition-colors ease-in-out duration-300 hover:bg-red-800 hover:outline-red-800 hover:text-white outline-2 -outline-offset-1 outline-[var(--dark-teal)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-800"
                      onClick={() => { handleStatusChanges('Rejected') }}
                      disabled={statusButtonDisabled || !signedNonOpAgreement}>
                      Reject
                    </button>
                  </div>
                  <div className="flex items-center gap-x-4">
                    <button
                    name="partnerArchive"
                      hidden={doesUserHavePartnerViewAFERole ? false : true}
                      className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2 py-1 text-xs/6 2xl:text-sm/7 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                      onClick={(e: any) => {handleArchiveChanges('Partner')}}>
                      {afeRecord?.partner_archived === true ? 'Un-Archive' : 'Archive'}
                    </button>
                      <button
                        name="operatorArchive"
                        hidden={doesUserHaveOperatorViewAFERole ? false : true}
                        className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2 py-1 text-xs/6 2xl:text-sm/7 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                        onClick={(e: any) => {handleArchiveChanges('Operator')}}>
                        {afeRecord?.archived === true ? 'Un-Archive' : 'Archive'}
                      </button>
                  </div>
                </div>
              </div>
            </div>
           {/* AFE Details */}
            <div className="px-2 py-1 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:mx-0 sm:px-8 sm:pb-8 xl:col-span-2 xl:row-span-2 xl:row-end-2 xl:px-8 xl:pt-0 xl:pb-8">
                <>
               {/* AFE Header 1 */}
              <div className="m-0 w-full flex flex-col 2xl:flex-row xl:justify-between text-xs/6 2xl:text-sm/6">
                <div className="2xl:flex-auto">
                <h2 className="font-semibold custom-style text-[var(--darkest-teal)] sm:text-left mt-2">{afeRecord?.partner_name} Status:<span className={`font-semibold ml-2 pl-2 rounded-md bg-${statusBackgroundColor} px-2 text-${statusColor} ring-1 ring-${statusRingColor} ring-inset`}>{afePartnerStatus}</span></h2>
                <h2 className="font-semibold custom-style text-[var(--darkest-teal)] sm:text-left">{afeRecord?.partner_name.toLowerCase()} WI:<span className="font-normal pl-2">{afeRecord?.partner_wi.toFixed(6)}%</span></h2>
                </div>
                <div className="2xl:flex-auto">
                <h2 className="font-semibold custom-style text-[var(--darkest-teal)] text-left 2xl:text-right mt-4 2xl:mt-2">Operator:<span className="font-normal pl-2">{afeRecord?.operator}</span></h2>
                <h2 className="font-semibold custom-style text-[var(--darkest-teal)] text-left 2xl:text-right">{afeRecord?.operator} WI:<span className="font-normal pl-2">{afeRecord?.operator_wi.toFixed(6)}%</span></h2>
                <h2 className="font-semibold custom-style text-[var(--darkest-teal)] text-left 2xl:text-right">{afeRecord?.operator} Approved:<span className="font-normal pl-2">{afeRecord?.iapp_date}</span></h2>
                </div>
              </div>
              {/* AFE Header 2 */}
              <div className="mt-4 sm:w-full border-t border-t-1 border-b border-b-4 border-double border-[var(--darkest-teal)]/70">
                <div className="mt-2 mb-2 px-4 py-2 sm:rounded-xs grid grid-cols-2 text-xs/6 2xl:text-sm/6 bg-[var(--darkest-teal)]/10 2xl:grid-cols-12">
                  
                  <div className="text-left col-span-1 2xl:col-span-3">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)] ">AFE Number</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] capitalize">
                      {afeRecord?.afe_number}
                    </dd>
                  </div>
                  <div className="text-right col-span-1 2xl:col-span-3 2xl:text-left">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)] ">Version</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] capitalize">
                      {afeRecord?.version_string}
                    </dd>
                  </div>
                  <div className="text-left col-span-1 2xl:col-span-3">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)] ">AFE Type</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] capitalize">
                      {afeRecord?.afe_type}
                    </dd>
                  </div>
                  <div className="text-right col-span-1 2xl:col-span-3 2xl:text-right ">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)] ">Well Name</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)] capitalize">
                      {afeRecord?.well_name}
                    </dd>
                  </div>

                  <div className="text-left col-span-1 2xl:col-span-6">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">Gross Total</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)]">
                      ${ afeRecord?.supp_gross_estimate! > 0 ?
                      afeRecord?.supp_gross_estimate!.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) :
                      afeRecord?.total_gross_estimate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                      } <span className="hidden sm:inline">{afeRecord?.currency_code}</span>
                    </dd>
                  </div>
                  <div className="text-right col-span-1 2xl:col-span-6 2xl:text-left">
                    <dt className="inline font-semibold custom-style text-[var(--darkest-teal)]">Net Total</dt>{' '}
                    <dd className="inline custom-style-long-text text-[var(--dark-teal)]">
                      { afeRecord?.supp_gross_estimate! > 0 ?
                      calcPartnerNet(afeRecord?.supp_gross_estimate!, afeRecord?.partner_wi) :
                      calcPartnerNet(afeRecord?.total_gross_estimate, afeRecord?.partner_wi)
                      } <span className="hidden sm:inline">{afeRecord?.currency_code}</span>
                    </dd>
                  </div>
                  
                  
                </div>
              </div>
              </>
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
                  </div>
                ))}
              </div>
              </div>
                <>
               {/* AFE Estimates */}
              <div className="2xl:h-100">  
              <table className="w-full text-left text-xs/6 2xl:text-sm/6 2xl:whitespace-nowrap">

                {groupedAccounts && Array.from(groupedAccounts).map(([accountGroup, accounts]) => (
                  <tbody key={accountGroup} >

                    <tr className="border-t border-[var(--darkest-teal)]/90 text-[var(--darkest-teal)] font-semibold custom-style h-10">
                      <td className="hidden md:table-cell w-2/6 pl-0">{accountGroup.toUpperCase()}</td>
                      <td className="table-cell px-0 py-0 text-left md:text-center w-1/2 sm:w-1/3 md:w-1/6">Operator Account#</td>
                      <td className="hidden md:table-cell px-0 py-0 text-center w-1/6 ">Account#</td>
                      <td className="hidden sm:table-cell px-0 py-0 text-center w-1/2 sm:w-1/3 md:w-1/6">Gross Amount</td>
                      <td className="table-cell px-0 py-0 text-right w-1/2 sm:w-1/3 md:w-1/6">Net Amount</td>
                    </tr>
                    {accounts.map((item) => (
                      <tr key={item.id} className="border-t border-[var(--darkest-teal)]/30 text-[var(--darkest-teal)] custom-style-long-text tabular-nums">
                        <td className="hidden md:table-cell px-0 py-3 text-left ">
                          {item.operator_account_description}
                        </td>
                        <td className="table-cell px-0 py-3 text-left md:text-center ">
                          {item.operator_account_number}
                        </td>
                        <td className="hidden md:table-cell px-0 py-3 text-center">
                          {item.partner_account_number}
                        </td>
                        <td className="hidden sm:table-cell px-0 py-3 text-center ">
                          ${item.amount_gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="table-cell px-0 py-3 text-right ">
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
                        className={`flex-1 text-center custom-style transition-colors ease-in-out duration-300 text-xs 2xl:text-sm/6
                    
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
                          <div className="text-xs/5 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style font-medium">
                            {afeDoc.filename_display}
                          </div>
                          <div className="flex 2xl:pl-5 custom-style-long-text font-semibold underline text-xs/6 2xl:text-sm/6 mb-3 mt-1">
                            <ul
                              className="flex xl:justify-between 2xl:justify-start w-full gap-x-6"
                              role="navigation"
                              aria-label="View Document">
                              <li className="cursor-pointer"
                                onClick={(e) => {
                                  handleDownloadDocument(afeDoc.storage_path, afeDoc.filename_display, afeDoc.mimetype)
                                  }}>
                                Download
                              </li>
                              <li className="cursor-pointer"
                                hidden={afeDoc.mimetype === 'pdf' ? false : true}
                                onClick={(e) => {
                                  handleViewDocument(afeDoc.storage_path, afeDoc.filename_display)
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
                  apc_operator_name={afeRecord?.operator!}
                  userName={loggedInUser?.firstName+' '+loggedInUser?.lastName}
                  afe_number={afeRecord?.afe_number!}
                  afe_version={afeRecord?.version_string!}
                  mode={loggedInUser?.is_super_user ? 'Partner' : doesUserHaveOperatorViewAFERole ? 'Operator' : 'Partner'}
                  ></FileUpload>
                </div>
              </div>
              <div hidden={currentTab !== 2}>
                <AFEHistory historyAFEs={afeHistoriesComments}
                apc_afe_id={afeID!}
                userName={loggedInUser?.firstName}
                maxRowsToShow={5}
                onlyShowRecentFileHistory={false}
                hideCommentBox={false}
                onCommentAdded={(comment) => setHistory(prev => [...prev, comment])}
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
        )}
      </main>
    </>
  )
}



