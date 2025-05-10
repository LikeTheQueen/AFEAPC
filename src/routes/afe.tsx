import { Link } from "react-router";
import { useSupabaseData } from "../types/SupabaseContext";
import { CurrencyDollarIcon, ArrowTrendingUpIcon } from '@heroicons/react/20/solid';
import { updateAFEPartnerStatusSupabase, addAFEHistorySupabase } from '../../provider/fetch';


export const handleClick = (id:string, partnerStatus: string) => {
  console.log(partnerStatus)
  if(partnerStatus==='New') {
    updateAFEPartnerStatusSupabase(id);
    addAFEHistorySupabase(id, 'The Partner Status on the AFE changed from New to Viewed','action');
  }
};

function setIsHidden<AFEType>(afes: AFEType[] | undefined): boolean {
  if(afes !== undefined && afes.length>0) {
    return false
  } else {
    return true
  }
}

export default function AFE() {
  const { afes } = useSupabaseData();
  const operatedAFEs = afes?.filter((afe) => afe.operator === 'Navigator Corporation');
  const nonOperatedAFEs = afes?.filter((afe) => afe.partner_name === 'Athena Minerals Inc.');
  console.log(operatedAFEs)
  console.log(setIsHidden(operatedAFEs))
  return (
    <>
    <div className="py-4 px-4 sm:px-6 lg:px-8 ">
    <div hidden ={setIsHidden(operatedAFEs)} className="overflow-hidden bg-white sm:rounded-lg flex justify-center items-center" data-testid="OperatedAFElistHeader">
    <div className="relative w-full mb-4">
      <div aria-hidden="true" className="absolute inset-0 flex justify-center items-center">
        <div className="w-full border-t border-[var(--dark-teal)]/30 border-3" />
      </div>
      <div className="relative flex justify-start items-center">
        <span className="bg-white px-3 text-base font-semibold custom-style text-[var(--darkest-teal)]">Operated AFEs</span>
      </div>
    </div>
        
      </div>
      <ul role="list" hidden ={setIsHidden(operatedAFEs)} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="OperatedAFElist">
      {operatedAFEs?.map((afe) => (
        <Link key={afe.id} 
        to={`/mainscreen/afeDetail/${afe.id}`}
        onClick={ (e:any) => handleClick(`${afe.id}`, `${afe.partner_status}`)}
        className="col-span-1 divide-y divide-[var(--darkest-teal)]/80 rounded-lg bg-white shadow-md hover:shadow-[#F61067] custom-style border border-[var(--dark-teal)]/30">
       
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center justify-between space-x-3">
                <h3 className="truncate text-sm font-medium text-[var(--darkest-teal)]/70"><span className="font-semibold">Operator: </span>{afe.operator}</h3>
                <span className="inline-flex shrink-0 items-center border-r rounded-full bg-[var(--dark-teal)]/30 px-1.5 py-0.5 text-sm font-semibold text-[var(--darkest-teal)] ring-1 ring-[var(--darkest-teal)]/20 ring-inset">
                  {afe.partner_status}
                </span>
              </div>
              <p className="mt-1 truncate text-sm font-medium text-[var(--darkest-teal)]/70"><span className="font-semibold">Approved by Operator: </span>{afe.created_at}</p>
              <p className="mt-1 truncate text-sm font-medium text-[var(--darkest-teal)]/70"><span className="font-semibold">AFE Type: </span>{afe.afe_type}</p>
            </div>
            
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-300">
              <div className="flex w-0 flex-1">
                <div
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                  <CurrencyDollarIcon aria-hidden="true" className="size-5 text-gray-400" />
                  {Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format(afe.total_gross_estimate)}
                </div>
              </div>
              <div className="flex w-0 flex-1">
                <div
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                  <ArrowTrendingUpIcon aria-hidden="true" className="size-5 text-gray-400" />
                  WI: {afe.partner_wi.toFixed(6)}%
                </div>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <div
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                  <CurrencyDollarIcon aria-hidden="true" className="size-5 text-gray-400" />
                  {Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format((afe.total_gross_estimate*afe.partner_wi)/100)}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </ul>
    <div hidden ={!setIsHidden(operatedAFEs)} className="overflow-hidden bg-white shadow-md sm:rounded-lg border flex justify-center items-center" data-testid="NoOperatedAFElist">
    <div className="relative w-2/3 h-20 ">
      <div aria-hidden="true" className="absolute inset-0 flex justify-center items-center">
        <div className="w-full border-t border-[var(--dark-teal)]" />
      </div>
      <div className="relative flex justify-center items-center h-20">
        <span className="bg-white px-3 text-base font-semibold custom-style text-[var(--darkest-teal)]">There are no Operated AFEs to view</span>
      </div>
    </div>
        
      </div>
      </div>
      

      <div className="py-4 px-4 sm:px-6 lg:px-8 ">
      <div hidden ={setIsHidden(nonOperatedAFEs)} className="overflow-hidden bg-white sm:rounded-lg flex justify-center items-center" data-testid="NonOperatedAFElistHeader">
    <div className="relative w-full mb-4">
      <div aria-hidden="true" className="absolute inset-0 flex justify-center items-center">
        <div className="w-full border-t border-[var(--dark-teal)]/30 border-3" />
      </div>
      <div className="relative flex justify-start items-center ">
        <span className="bg-white px-3 text-base font-semibold custom-style text-[var(--darkest-teal)]">Non Operated AFEs</span>
      </div>
    </div>
        
      </div>
      <ul role="list" hidden ={setIsHidden(nonOperatedAFEs)} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="NonOperatedAFElist">
      {nonOperatedAFEs?.map((afe) => (
        <Link key={afe.id} 
        to={`/mainscreen/afeDetail/${afe.id}`}
        onClick={ (e:any) => handleClick(`${afe.id}`, `${afe.partner_status}`)}
        className="col-span-1 divide-y divide-[var(--darkest-teal)]/80 rounded-lg bg-white shadow-md hover:shadow-[#F61067] custom-style border border-[var(--dark-teal)]/30">
       
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center justify-between space-x-3">
                <h3 className="truncate text-sm font-medium text-[var(--darkest-teal)]/70"><span className="font-semibold">Operator: </span>{afe.operator}</h3>
                <span className="inline-flex shrink-0 items-center border-r rounded-full bg-[var(--dark-teal)]/30 px-1.5 py-0.5 text-sm font-semibold text-[var(--darkest-teal)] ring-1 ring-[var(--darkest-teal)]/20 ring-inset">
                  {afe.partner_status}
                </span>
              </div>
              <p className="mt-1 truncate text-sm font-medium text-[var(--darkest-teal)]/70"><span className="font-semibold">Approved by Operator: </span>{afe.created_at}</p>
              <p className="mt-1 truncate text-sm font-medium text-[var(--darkest-teal)]/70"><span className="font-semibold">AFE Type: </span>{afe.afe_type}</p>
            </div>
            
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-300">
              <div className="flex w-0 flex-1">
                <div
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                  <CurrencyDollarIcon aria-hidden="true" className="size-5 text-gray-400" />
                  {Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format(afe.total_gross_estimate)}
                </div>
              </div>
              <div className="flex w-0 flex-1">
                <div
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                  <ArrowTrendingUpIcon aria-hidden="true" className="size-5 text-gray-400" />
                  WI: {afe.partner_wi.toFixed(6)}%
                </div>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <div
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                  <CurrencyDollarIcon aria-hidden="true" className="size-5 text-gray-400" />
                  {Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format((afe.total_gross_estimate*afe.partner_wi)/100)}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </ul>
    <div hidden ={!setIsHidden(nonOperatedAFEs)} className="overflow-hidden bg-white shadow-md sm:rounded-lg border flex justify-center items-center" data-testid="NoNonOperatedAFElist">
    <div className="relative w-2/3 h-20 ">
      <div aria-hidden="true" className="absolute inset-0 flex justify-center items-center">
        <div className="w-full border-t border-[var(--dark-teal)]" />
      </div>
      <div className="relative flex justify-center items-center h-20">
        <span className="bg-white px-3 text-base font-semibold custom-style text-[var(--darkest-teal)]">There are no Operated AFEs to view</span>
      </div>
    </div>
        
      </div>
    </div>
    
    </>
  )
}
