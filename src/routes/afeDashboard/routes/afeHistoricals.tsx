import { Link } from "react-router";
import { useSupabaseData } from "../../../types/SupabaseContext";
import { getViewRoleNonOperatorIds, getViewRoleOperatorIds } from "./helpers/helpers";
import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@headlessui/react";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { type AFEType } from "src/types/interfaces";
import { fetchAFEs } from "provider/fetch";
import { transformAFEs } from "src/types/transform";
import LoadingPage from "src/routes/sharedComponents/loadingPage";
import UniversalPagination from "src/routes/sharedComponents/pagnation";
import { handleSendEmail } from "email/emailBasic";
import { insertAFEHistory, updateAFEPartnerStatus } from "provider/write";
import { handleTabChanged } from "src/routes/sharedComponents/tabChange";
import { ToastContainer } from "react-toastify";
import { AFECard } from "./helpers/afeCard";
import { AFEHeader, NoFilteredAFEsToView } from "./helpers/afeHeader";
import { AFEFilters } from "./helpers/afeFilters";

const tabs = [
  {id:1, name:"Non-Operated AFEs", current: true},
  {id:2, name:"Operated AFEs", current: false},
  {id:3, name:"All AFEs", current: false},
];
export default function AFE() {
  const { loggedInUser, session } = useSupabaseData();
  const token = session?.access_token ?? "";
  const [tabList, setTabList] = useState(tabs);
  const [currentTab, setCurrentTab] = useState(1);
  const [nonOperatedAFEs, setNonOperatedAFEs] = useState<AFEType[]>([]);
  const [operatedAFEs, setOperatedAFEs] = useState<AFEType[]>([]);
  const [allAFEs, setAllAFEs] = useState<AFEType[]>([]);
  const [afeLoading, setAFELoading] = useState(false);
  const [partnerSearch, setPartnerSearch] = useState('');
  const [operatorSeach, setOperatorSearch] = useState('');
  const [afeStatusSearch, setAFEStatusSearch] = useState('');
  const [operatorApprovedDaysAgo, setOperatorApprovedDaysAgo] = useState(100);
  const [partnerStatusDaysAgo, setPartnerStatusDaysAgo] = useState(100);
  const [afeNumberSearch, setAFENumberSearch] = useState('');
  const [afeFetchError, setAFEFetchError] = useState(false);

  // State for paginated data
  const [rowsToShowOperated, setRowsToShowOperated] = useState<AFEType[]>([]);
  const [currentPageOperated, setCurrentPageOperated] = useState(0);
  const [rowsToShowNonOperated, setRowsToShowNonOperated] = useState<AFEType[]>([]);
  const [currentPageNonOperated, setCurrentPageNonOperated] = useState(0);
 
  const operatorApprovedCutoffDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - operatorApprovedDaysAgo);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [operatorApprovedDaysAgo]);

  const partnerStatusCutOffDate = useMemo(() => {
  const date = new Date();
  date.setDate(date.getDate() - partnerStatusDaysAgo);
  date.setHours(0, 0, 0, 0);
  return date;
}, [partnerStatusDaysAgo]);
  
  const getAFEs = useCallback(async (signal: AbortSignal) => {
    if(!loggedInUser?.user_id || token === '') return;
    setAFELoading(true);
    
    try{
          const afes = await fetchAFEs(token, signal);

          if(!afes.ok) {
            throw new Error((afes as any).message ?? "Cannot find AFE Details");
          }
          
          if(!signal.aborted) {
            setAllAFEs(transformAFEs(afes.data));
          }
        } catch (err) {
          if(!signal.aborted) {
            setAFEFetchError(true);
          }
      
        } finally {
          if (!signal.aborted) {
            setAFELoading(false);
          }
        } 

  }, [loggedInUser?.user_id, token])

  useEffect(() => {
  const controller = new AbortController();
  void getAFEs(controller.signal);
  return () => controller.abort();
}, [getAFEs]);

  useEffect(() => {
    if (!loggedInUser || !allAFEs) return;

    const sorted = [...allAFEs].sort((a, b) => b.sortID - a.sortID);
    const allowedOperatorIds = new Set(getViewRoleOperatorIds(loggedInUser));
    const allowedPartnerIds = new Set(getViewRoleNonOperatorIds(loggedInUser));

    if(loggedInUser.is_super_user) {
      const isArchived = sorted.filter(
        (afe) => afe.archived ===true && afe.partner_archived ===true
      );
      setOperatedAFEs(isArchived);
      setNonOperatedAFEs(isArchived);
    } else {
      const opAFEs = sorted.filter(
        (afe) => 
          allowedOperatorIds.has(afe.apc_op_id) &&
        afe.archived === true &&
        !allowedPartnerIds.has(afe.apc_partner_id)
      );
      const nonOpAFEs = sorted.filter(
        (afe) => 
          allowedPartnerIds.has(afe.apc_partner_id) &&
        afe.partner_archived === true &&
        !allowedOperatorIds.has(afe.apc_op_id)
      );
      setOperatedAFEs(opAFEs);
      setNonOperatedAFEs(nonOpAFEs);
    }
  },[loggedInUser, allAFEs])

  const handleAFENumberSearchChange = useCallback((e: any) => {
    const value = e.target.value;
    startTransition(() => {
      setAFENumberSearch(value);
    });
  }, []);

  const handleFilterReset = useCallback(() => {
    setAFENumberSearch('');
    setPartnerStatusDaysAgo(100);
    setOperatorApprovedDaysAgo(100);
    setPartnerSearch('');
    setOperatorSearch('');
    setAFEStatusSearch('');
  },[])

  const filteredOperatedAFEs = useMemo(() => {
    return operatedAFEs.filter(afe => {
      const matchesAFENumberSearch = afe.afe_number.toUpperCase().includes(afeNumberSearch.toUpperCase()) || afeNumberSearch === '';
      const matchesPartner = afe.apc_partner_id === partnerSearch || partnerSearch === '';
      const matchesPartnerStatus = afe.partner_status === afeStatusSearch || afeStatusSearch ==='';
      const afePartnerStatusDate = new Date(afe.partner_status_date);
      afePartnerStatusDate.setHours(0, 0, 0, 0);
      const isWithinDateRange = partnerStatusDaysAgo !==100 ? partnerStatusCutOffDate <= afePartnerStatusDate : afe.partner_status_date !==null || afe.partner_status_date === null;
      return matchesPartner && matchesPartnerStatus && isWithinDateRange && matchesAFENumberSearch;
    });
  }, [operatedAFEs, partnerSearch, afeStatusSearch, partnerStatusDaysAgo, afeNumberSearch]);

  const filteredNonOperatedAFEs = useMemo(() => {
    return nonOperatedAFEs.filter(afe => {
      const matchesAFENumberSearch = afe.afe_number.toUpperCase().includes(afeNumberSearch.toUpperCase()) || afeNumberSearch === '';
      const matchesOperator = afe.apc_op_id === operatorSeach || operatorSeach === '';
      const matchesPartnerStatus = afe.partner_status === afeStatusSearch || afeStatusSearch ==='';
      const afeOpApproveDate = new Date(afe.iapp_date);
      afeOpApproveDate.setHours(0, 0, 0, 0);
      const isWithinDateRange = operatorApprovedDaysAgo !==100 ? operatorApprovedCutoffDate <= afeOpApproveDate : afe.iapp_date !==null || afe.iapp_date === null;

      return matchesOperator && matchesPartnerStatus && isWithinDateRange && matchesAFENumberSearch;
    });
  }, [nonOperatedAFEs, operatorSeach, afeStatusSearch, operatorApprovedDaysAgo, afeNumberSearch]);

  const handlePageChangeOperatedAFEs = (paginatedData: AFEType[], page: number) => {
          setRowsToShowOperated(paginatedData);
          setCurrentPageOperated(page);
  };

  const handlePageChangeNonOperatedAFEs = (paginatedData: AFEType[], page: number) => {
          setRowsToShowNonOperated(paginatedData);
          setCurrentPageNonOperated(page);
  };

  return (
    <>
    <div className="px-4 sm:px-10 sm:py-4">
      <div className="h-4 backdrop-blur-xs sm:sticky z-11 sm:top-16"></div>
      <div className="grid grid-cols-1 sm:hidden">
        {}
        <select
          value={tabList.find((tab) => tab.current)?.id || ''}
          onChange={e => {handleFilterReset(), 
            handleTabChanged(
              {
                selected: parseInt(e.target.value, 10),
                tabs: tabs,
                onTabChange: (currentTab)=>setCurrentTab(currentTab),
                onTabListChange: (tabs)=>setTabList(tabs)
              }
            )
          }}
          aria-label="Select a tab"
          name="MobileMenu"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 custom-style text-[var(--dark-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--darkest-teal)]">
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>{tab.name}</option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 gap-x-8 mr-2 size-5 self-center justify-self-end fill-[var(--darkest-teal)]"
        />
        
      </div>
      <div className="hidden sm:flex ">
        <div className="pb-1 w-full">
          <nav aria-label="Tabs" className="-mb-px flex rounded-t-md border border-[var(--darkest-teal)]">
            {tabList.map((item, index) => (
                <Button
                key={item.id}
                onClick={e => {handleFilterReset(),
                  handleTabChanged(
              {
                selected: item.id,
                tabs: tabs,
                onTabChange: (currentTab)=>setCurrentTab(currentTab),
                onTabListChange: (tabs)=>setTabList(tabs)
              }
            )
                }}
                className={`flex-1 text-center px-4 py-3 custom-style transition-colors ease-in-out duration-300
      
      ${item.current
          ? 'bg-[var(--darkest-teal)] text-white border-t-3 border-t-[var(--bright-pink)] py-4 font-medium shadow-sm z-10'
          : 'bg-white text-[var(--darkest-teal)] transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:text-white hover:font-semibold font-normal cursor-pointer'}
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
      </div>
    {afeLoading ? (<div className="mt-60"><LoadingPage></LoadingPage></div>) : (<>
    <div className="py-0 px-4 sm:px-8">
      {/*AFE Page Header for all tabs.  Tab 2 is Operated AFEs*/}
      <AFEHeader
      afeLength={currentTab === 2 ? operatedAFEs.length : nonOperatedAFEs.length}
      afeFetchError={afeFetchError}
      mode={currentTab === 2 ? 'Operated' : 'Non-Operated'}
      >
      </AFEHeader>
      {/*AFE Filters - Hidden on view all AFE */}
      <div hidden={currentTab === 3}>
        <AFEFilters
      afeLength={currentTab === 2 ? operatedAFEs.length : nonOperatedAFEs.length}
      afeNumberSearch={afeNumberSearch}
      onAFENumberChange={handleAFENumberSearchChange}
      operatorSearch={operatorSeach}
      onOperatorChange={setOperatorSearch}
      partnerSearch={partnerSearch}
      onPartnerChange={setPartnerSearch}
      afeStatusSearch={afeStatusSearch}
      onAFEStatusSearchChange={setAFEStatusSearch}
      daysAgo={currentTab === 2 ? partnerStatusDaysAgo : operatorApprovedDaysAgo}
      onDaysAgoChange={currentTab === 2 ? setPartnerStatusDaysAgo : setOperatorApprovedDaysAgo}
      mode={currentTab === 2 ? 'Operated' : 'Non-Operated'}
      ></AFEFilters> 
      </div>
      {/*No AFE Message when filtered or [] On all Tabs, for Tab 2 it's operated*/}
      <div hidden ={ afeFetchError ? true : (
        currentTab === 2 ? 
        ((filteredOperatedAFEs.length > 0 ) ? true : false)
      : ((filteredNonOperatedAFEs.length > 0 ) ? true : false) )} >
      <NoFilteredAFEsToView
      mode={currentTab === 2 ? 'Operated' : 'Non-Operated'}
      >        
      </NoFilteredAFEsToView>
      </div>
      {/*Non Operated AFEs List.  Hidden on tab 2 or if there are no AFEs*/}
      <div hidden ={ (nonOperatedAFEs.length < 1 || filteredNonOperatedAFEs.length < 1) || currentTab === 2 ? true : false} >
      <ul role="list" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" data-testid="Non-OperatedAFElist">
      {rowsToShowNonOperated.map((afe) => (
        <Link key={afe.id} 
        aria-label={`AFE ${afe.afe_number} ${afe.version_string ?? ""}`.trim()}
        to={`../afeDetail/${afe.id}`}
        className="col-span-1 divide-y divide-[var(--darkest-teal)]/40 rounded-lg bg-white shadow-2xl hover:shadow-lg hover:shadow-[#F61067] transition-shadow ease-in-out duration-500 custom-style ring-1 ring-[var(--darkest-teal)]/70">
       
          <AFECard 
          operatedAFE={false}
          afe={afe}
          >
          </AFECard>
        </Link>
      ))}
    </ul>
    <div className="mt-4 text-xs/6 2xl:text-sm/6">
    <UniversalPagination
            data={filteredNonOperatedAFEs}
            rowsPerPage={6}
            listOfType="Non-Operated AFEs"
            onPageChange={handlePageChangeNonOperatedAFEs}
          />
          </div>
          <div className="h-4"></div>
          
    </div>
    {/*Operated AFEs Header.  Hidden on tab 1 and 2 or if there are no AFEs*/}
    <div hidden ={afeFetchError || currentTab !== 3 || (currentTab === 3 && filteredOperatedAFEs.length > 0 ) || (currentTab === 3 && operatedAFEs.length > 0) ? true : false}>
      <NoFilteredAFEsToView
      mode={'Operated'}
      >        
      </NoFilteredAFEsToView>
      
      </div>
    {/*No AFE Message when filtered or [] On all Tabs, hidden on all tabs except 3 and only for Operated AFEs*/}
    <div hidden={currentTab !==3}>
      <AFEHeader
      afeLength={operatedAFEs.length}
      afeFetchError={afeFetchError}
      mode={'Operated'}
      >
      </AFEHeader>

    </div>
    <div  hidden ={ (operatedAFEs.length < 1 && filteredOperatedAFEs.length < 1) || currentTab === 1 ? true : false } >
    <ul role="list" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" data-testid="OperatedAFElist">
      {rowsToShowOperated?.map((afe) => (
        <Link key={afe.id} 
        to={`../afeDetail/${afe.id}`}
        className="col-span-1 divide-y divide-[var(--darkest-teal)]/40 rounded-lg bg-white shadow-2xl hover:shadow-lg hover:shadow-[#F61067] transition-shadow ease-in-out duration-500 custom-style ring-1 ring-[var(--darkest-teal)]/70">
          <AFECard 
          operatedAFE={true}
          afe={afe}
          >
          </AFECard>
        </Link>
      ))}
    </ul>
    <div className="mt-4 text-xs/6 2xl:text-sm/6">
          <UniversalPagination
            data={filteredOperatedAFEs}
            rowsPerPage={6}
            listOfType="Operated AFEs"
            onPageChange={handlePageChangeOperatedAFEs}
          />
          </div>
          
          <div className="h-4"></div>
          
          </div>
      </div>
    </>
    )}
    <ToastContainer/>
    </>
    
  )
}


