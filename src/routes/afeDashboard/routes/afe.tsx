import { Link } from "react-router";
import { useSupabaseData } from "../../../types/SupabaseContext";
import { formatDate } from "src/helpers/styleHelpers";
import { setStatusBackgroundColor, setStatusRingColor, setStatusTextColor, noAFEsToView, PartnerStatusDropdown, OperatorApprovalDropdown } from "./helpers/styleHelpers";
import { getViewRoleNonOperatorIds, getViewRoleOperatorIds } from "./helpers/helpers";
import { handlePartnerStatusChange } from "./helpers/helpers";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@headlessui/react";
import { activeTab } from "src/helpers/styleHelpers";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { type AFEType } from "src/types/interfaces";
import { fetchAFEs } from "provider/fetch";
import { transformAFEs } from "src/types/transform";
import LoadingPage from "src/routes/loadingPage";
import { PartnerDropdown } from "src/routes/partnerDropdown";
import { OperatorDropdown } from "src/routes/operatorDropdown";

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
  const [nonOperatedAFEs, setNonOperatedAFEs] = useState<AFEType[] | []>([]);
  const [operatedAFEs, setOperatedAFEs] = useState<AFEType[] | []>([]);
  const [allAFEs, setAllAFEs] = useState<AFEType[] | []>([]);
  const [afeLoading, setAFELoading] = useState(false);
  const [partnerSearch, setPartnerSearch] = useState('');
  const [operatorSeach, setOperatorSearch] = useState('');
  const [partnerStatusSearch, setPartnerStatusSearch] = useState('');
  const [operatorApprovedDaysAgo, setOperatorApprovedDaysAgo] = useState(100);
  const [partnerStatusDaysAgo, setPartnerStatusDaysAgo] = useState(100);
  
  const today = new Date();
  const operatorApprovedcutOffDate = new Date(today);
  const partnerStatusCutOffDate = new Date(today);
  operatorApprovedcutOffDate.setDate(operatorApprovedcutOffDate.getDate() - operatorApprovedDaysAgo);
  operatorApprovedcutOffDate.setHours(0, 0, 0, 0);
  
  partnerStatusCutOffDate.setDate(partnerStatusCutOffDate.getDate() - partnerStatusDaysAgo);
  partnerStatusCutOffDate.setHours(0, 0, 0, 0);
  console.log(partnerStatusCutOffDate, 'Partner cutoff');

  function handleTabChange(selected: number){
    const updateCurrentTab = activeTab(tabs, selected);
    setCurrentTab(updateCurrentTab.selectedTabId);
    setTabList(updateCurrentTab.updatedTabs);
  };

  useEffect(() => {
    if(!token || token==='') return;
      let cancelled = false;
      async function getAFERecord() {
        setAFELoading(true);
        try{
          const afes = await fetchAFEs(token);
  
          if(!afes.ok) {
            throw new Error((afes as any).message ?? "Cannot find AFE Details");
          }
          const transformedAFEs = transformAFEs(afes.data)

          if (!cancelled) {
            
            setAllAFEs(transformedAFEs);
          }
        } catch (err) {
      
      console.error(err);
    } finally {
                  if (!cancelled) {
                      setAFELoading(false);
                  }
      } 
      }; 
    getAFERecord();
    return () => {
              cancelled = true;
          };
    }, [token])

  useEffect(() => {
  function sortAndFilterAFEs() {
  allAFEs.sort((a,b) => b.sortID - a.sortID)
  const allowedOperatorIds = new Set(getViewRoleOperatorIds(loggedInUser));
  const allowedPartnerIds = new Set(getViewRoleNonOperatorIds(loggedInUser));
  
  const opAFEs: AFEType[] = (allAFEs ?? []).filter((afe) => allowedOperatorIds.has(afe.apc_op_id) && afe.archived !==true && !allowedPartnerIds.has(afe.partnerID));
  setOperatedAFEs(opAFEs);
  
  const nonOpAFEs: AFEType[] = (allAFEs ?? []).filter((afe) => allowedPartnerIds.has(afe.partnerID) && afe.partner_archived !==true );
  //&& !allowedOperatorIds.has(afe.apc_op_id)
  setNonOperatedAFEs(nonOpAFEs);    
};
    sortAndFilterAFEs();
  },[loggedInUser, allAFEs])

  const filterOperatedAFEs = (opAFEs: AFEType[], partner: string, partnerStatus: string) => {
    return opAFEs.filter(afe => {
      const matchesPartner = afe.apc_partner_id === partner || partner === '';
      const matchesPartnerStatus = afe.partner_status === partnerStatus || partnerStatus==='';
      const afePartnerStatusDate = new Date(afe.partner_status_date);
      afePartnerStatusDate.setHours(0, 0, 0, 0);
      const isWithinDateRange = partnerStatusDaysAgo !==100 ? partnerStatusCutOffDate <= afePartnerStatusDate : afe.partner_status_date !==null || afe.partner_status_date === null;
      return matchesPartner && matchesPartnerStatus && isWithinDateRange;
    });
  };

  const filterNonOpAFEs = (nonOpAFEs: AFEType[], operator: string, partnerStatus: string) => {
    return nonOpAFEs.filter(afe => {
      const matchesOperator = afe.apc_op_id === operator || operator === '';
      console.log(afe.apc_op_id, operator)
      const matchesPartnerStatus = afe.partner_status === partnerStatus || partnerStatus==='';
      const afeOpApproveDate = new Date(afe.iapp_date);
      afeOpApproveDate.setHours(0, 0, 0, 0);
      const isWithinDateRange = operatorApprovedcutOffDate <= afeOpApproveDate;

      return matchesOperator && matchesPartnerStatus && isWithinDateRange;
    })
  }

  const filteredOperatedAFEs = useMemo(() => {
    return filterOperatedAFEs(operatedAFEs, partnerSearch, partnerStatusSearch);
  }, [operatedAFEs, partnerSearch, partnerStatusSearch, partnerStatusDaysAgo]);

  const filteredNonOperatedAFEs = useMemo(() => {
    return filterNonOpAFEs(nonOperatedAFEs, operatorSeach, partnerStatusSearch);
  }, [nonOperatedAFEs, operatorSeach, partnerStatusSearch, operatorApprovedDaysAgo])

  return (
    <>
    <div className="px-4 sm:px-10 sm:py-4">
      <div className="h-4 backdrop-blur-xs sm:sticky z-11 sm:top-16"></div>
      
      <div className="grid grid-cols-1 sm:hidden">
        {}
        <select
          value={tabList.find((tab) => tab.current)?.id || ''}
          onChange={e => {handleTabChange(parseInt(e.target.value, 10))}}
          aria-label="Select a tab"
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
                onClick={e => handleTabChange(item.id)}
                className={`flex-1 text-center px-4 py-3 custom-style transition-colors ease-in-out duration-300
      
      ${item.current
          ? 'bg-[var(--darkest-teal)] text-white border-t-3 border-t-[var(--bright-pink)] py-4 font-medium shadow-sm z-10'
          : 'bg-white text-[var(--darkest-teal)] transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:text-white hover:font-semibold font-normal'}
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
    
    {/* Non-Operated AFEs */}
    <div hidden = {currentTab ===2} className="py-4 px-4 sm:px-8">
      <div className="mt-2 p-3 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70">
      <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Non-Operated AFEs</h2>
        <p className="mt-1 text-center text-sm/6 sm:text-base/7 text-[var(--darkest-teal)] custom-style">AFEs older than 45 days can be found on the Historical AFE tab, unless the partner status is New.  AFEs can be archived from the AFE.</p>
      <div hidden ={(nonOperatedAFEs.length>0 && nonOperatedAFEs !== undefined) ? true : false} >
      {
      noAFEsToView('There are no Non-Operated AFEs to view')
      }
    </div>
    
      </div>
      <div className="mt-4 p-3 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70"
      hidden ={(nonOperatedAFEs.length>0 && nonOperatedAFEs !== undefined && currentTab===1) ? false : true} >
      <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Filter AFEs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6">
      <div className="pr-1">
      <h2 className="text-sm/6 sm:text-base/7 text-[var(--darkest-teal)] custom-style">Filter on Operator Name</h2>
      <OperatorDropdown
      onChange={setOperatorSearch}
      limitedList={false}>
      </OperatorDropdown>
    </div>
    <div >
      <h2 className="text-sm/6 sm:text-base/7 text-[var(--darkest-teal)] custom-style">Filter on Your AFE Status</h2>
      <PartnerStatusDropdown
      onChange={setPartnerStatusSearch}>
      </PartnerStatusDropdown>
    </div>
    <div >
      <h2 className="text-sm/6 sm:text-base/7 text-[var(--darkest-teal)] custom-style">Filter when Operator Approved the AFE</h2>
      <OperatorApprovalDropdown
      onChange={setOperatorApprovedDaysAgo}>
      </OperatorApprovalDropdown>
    </div>
      </div>
      </div>
      <div hidden ={(filteredNonOperatedAFEs.length>0 ) ? true : false}>
      {
      noAFEsToView('There are no Non-Operated AFEs to view')
      }
      </div>
      <ul role="list" hidden ={(nonOperatedAFEs.length>0 && nonOperatedAFEs !== undefined) ? false : true} className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3" data-testid="NonOperatedAFElist">
      {filteredNonOperatedAFEs?.map((afe) => (
        <Link key={afe.id} 
        to={`/mainscreen/afeDetail/${afe.id}`}
        onClick={ (e:any) =>{handlePartnerStatusChange(`${afe.id}`, `${afe.partner_status}`,afe.partner_status === 'New' ? 'Viewed' : `${afe.partner_status}`, 'The Partner Status on the AFE changed from New to Viewed','action', token)}}
        className="col-span-1 divide-y divide-[var(--darkest-teal)]/40 rounded-lg bg-white shadow-2xl hover:shadow-lg hover:shadow-[#F61067] transition-shadow ease-in-out duration-500 custom-style ring-1 ring-[var(--darkest-teal)]/70">
       
          <div className="flex w-full items-center justify-between p-3 pt-3">
            <div className="flex-1 truncate">
              <div className="flex items-center justify-between">
                <h3 className="truncate text-sm/6 font-medium text-[var(--darkest-teal)]/80"><span className="font-semibold">Operator: </span>{afe.operator}</h3>
                <span className={`shrink-0 rounded-full bg-${setStatusBackgroundColor(afe.partner_status)} px-1.5 py-0.5 text-sm/6 font-semibold text-${setStatusTextColor(afe.partner_status)} ring-1 ring-${setStatusRingColor(afe.partner_status)} ring-inset`}>
                  {afe.partner_status}
                </span>
              </div>
              <p className="truncate text-sm/6 font-medium text-[var(--darkest-teal)]/80"><span className="font-semibold">Approved by Operator: </span>{formatDate(afe.iapp_date)}</p>
              <p className="truncate text-sm/6 font-medium text-[var(--darkest-teal)]/80"><span className="font-semibold">Well Name: </span>{afe.well_name}</p>
              <div className="flex flex-row items-center justify-between">
              <p className="truncate text-sm/6 font-medium text-[var(--darkest-teal)]/80"><span className="font-semibold">AFE Type: </span>{afe.afe_type}</p>
              <p className="truncate text-sm/6 font-semibold text-[var(--darkest-teal)]/80">AFE Number: {afe.afe_number} {afe.version_string}</p>
            </div>
            
            </div>
            
          </div>
          <div className="-mt-px flex divide-x divide-[var(--darkest-teal)]/40">
              <div className="flex w-0 flex-1">
                <div
                  className="relative -mr-px inline-flex flex-wrap w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 px-1 text-sm/6 font-semibold text-[var(--darkest-teal)]/80">
                  <span>Gross:</span>
                  { afe.supp_gross_estimate > 0 ?
                  Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format(afe.supp_gross_estimate) :
                  Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format(afe.total_gross_estimate)
                  }
                </div>
              </div>
              <div className="flex w-0 flex-1">
                <div
                  className="relative -mr-px inline-flex flex-wrap w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 px-1 text-sm/6 font-semibold text-[var(--darkest-teal)]/80">
                  <span>Partner WI:</span>
                   {afe.partner_wi.toFixed(6)}%
                </div>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <div
                  className="relative inline-flex flex-wrap w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 px-1 text-sm/6 font-semibold text-[var(--darkest-teal)]/80">
                  <span>Net:</span>
                  { afe.supp_gross_estimate > 0 ?
                  Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format((afe.supp_gross_estimate*afe.partner_wi)/100) :
                  Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format((afe.total_gross_estimate*afe.partner_wi)/100)
                  }
                </div>
              </div>
            </div>
        </Link>
      ))}
    </ul>
    
    </div>
       {/* Operated AFEs */}
    <div hidden = {currentTab ===1} className="py-4 px-4 sm:px-8">
      <div className="mt-2 p-3 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70">
    <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Operated AFEs</h2>
      <p className="mt-1 text-center text-sm/6 sm:text-base/7 text-[var(--darkest-teal)] custom-style">AFEs older than 45 days can be found on the Historical AFE tab, unless the partner status is New.  AFEs can be archived from the AFE.</p>
      <div hidden ={(operatedAFEs.length>0 && operatedAFEs !== undefined) ? true : false}>
      {
      noAFEsToView('There are no Operated AFEs to view')
      }
      </div>
      </div>
      <div className="mt-4 p-3 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70"
      hidden ={(operatedAFEs.length>0 && operatedAFEs !== undefined && currentTab===2) ? false : true} >
      <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Filter AFEs</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3 gap-x-6">
      <div className="pr-1">
      <h2 className="text-sm/6 sm:text-base/7 text-[var(--darkest-teal)] custom-style">Filter on Partner Name</h2>
      <PartnerDropdown
      onChange={setPartnerSearch}
      limitedList={false}>
      </PartnerDropdown>
    </div>
    <div>
      <h2 className="text-sm/6 sm:text-base/7 text-[var(--darkest-teal)] custom-style">Filter on Partner Status</h2>
      <PartnerStatusDropdown
      onChange={setPartnerStatusSearch}>
      </PartnerStatusDropdown>
    </div>
    <div>
      <h2 className="text-sm/6 sm:text-base/7 text-[var(--darkest-teal)] custom-style">Filter on Partner Status Change</h2>
      <OperatorApprovalDropdown
      onChange={setPartnerStatusDaysAgo}>
      </OperatorApprovalDropdown>
    </div>
      </div>
      </div>
      <div hidden ={(filteredOperatedAFEs.length>0 ) ? true : false}>
      {
      noAFEsToView('There are no Operated AFEs to view')
      }
      </div>
      <ul role="list" hidden ={(operatedAFEs.length>0 && operatedAFEs !== undefined) ? false : true} className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3" data-testid="OperatedAFElist">
      {filteredOperatedAFEs?.map((afe) => (
        <Link key={afe.id} 
        to={`/mainscreen/afeDetail/${afe.id}`}
        className="col-span-1 divide-y divide-[var(--darkest-teal)]/40 rounded-lg bg-white shadow-2xl hover:shadow-lg hover:shadow-[#F61067] transition-shadow ease-in-out duration-500 custom-style ring-1 ring-[var(--darkest-teal)]/70">
          
          <div className="flex w-full items-center justify-between p-3 pt-3">
            <div className="flex-1 truncate">
              <div className="flex items-end justify-between mb-2">
                <h3 className="truncate text-sm/6 font-medium text-[var(--darkest-teal)]/80"><span className="font-semibold">Partner Status: </span></h3>
                <span className={`shrink-0 rounded-full bg-${setStatusBackgroundColor(afe.partner_status)} px-1.5 py-0.5 text-sm/6 font-semibold text-${setStatusTextColor(afe.partner_status)} ring-1 ring-${setStatusRingColor(afe.partner_status)} ring-inset`}>
                  {afe.partner_status}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-t-[var(--darkest-teal)]/40 pt-2">
                <h3 className="truncate text-sm/6 font-medium text-[var(--darkest-teal)]/80"><span className="font-semibold">Partner: </span>{afe.partner_name}</h3>
                
                
              </div>
              <p className="truncate text-sm/6 font-medium text-[var(--darkest-teal)]/80"><span className="font-semibold">Partner Status Date: </span>
              
              {formatDate(afe.partner_status_date)}
                            
              </p>
              <p className="truncate text-sm/6 font-medium text-[var(--darkest-teal)]/80"><span className="font-semibold">Well Name: </span>{afe.well_name}</p>
              <div className="flex flex-row items-center justify-between">
              <p className="truncate text-sm/6 font-medium text-[var(--darkest-teal)]/80"><span className="font-semibold">AFE Type: </span>{afe.afe_type}</p>
              <p className="truncate text-sm/6 font-semibold text-[var(--darkest-teal)]/80">AFE Number: {afe.afe_number} {afe.version_string}</p>
            </div>
            </div>
            
          </div>
          
            <div className="-mt-px flex divide-x divide-[var(--darkest-teal)]/40">
              <div className="flex w-0 flex-1">
                <div
                  className="relative -mr-px inline-flex flex-wrap w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 px-1 text-sm/6 font-semibold text-[var(--darkest-teal)]/80">
                  <span>Gross:</span>
                  { afe.supp_gross_estimate > 0 ?
                  Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format(afe.supp_gross_estimate) :
                  Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format(afe.total_gross_estimate)
                 }
                </div>
              </div>
              <div className="flex w-0 flex-1">
                <div
                  className="relative -mr-px inline-flex flex-wrap w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 px-1 text-sm/6 font-semibold text-[var(--darkest-teal)]/80">
                  <span>Partner WI:</span>
                   {afe.partner_wi.toFixed(6)}%
                </div>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <div
                  className="relative inline-flex flex-wrap w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 px-1 text-sm/6 font-semibold text-[var(--darkest-teal)]/80">
                  <span>Net:</span>
                  { afe.supp_gross_estimate > 0 ?
                  Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format((afe.supp_gross_estimate*afe.partner_wi)/100) :
                  Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format((afe.total_gross_estimate*afe.partner_wi)/100)
                  }
                </div>
              </div>
            </div>
          
        </Link>
      ))}
    </ul>
    </div>
    </>
    )}
    </>
    
  )
}


