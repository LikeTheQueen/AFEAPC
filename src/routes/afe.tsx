import { Navigate, NavLink, useNavigate } from "react-router";
import { useSupabaseData } from "../types/SupabaseContext";
import { CurrencyDollarIcon, ArrowTrendingUpIcon } from '@heroicons/react/20/solid'
import { useState } from "react";
import type { AFEType } from "../types/index";


export default function AFE() {
  const { afes, loading } = useSupabaseData();
  const [afe, setAFE] = useState<AFEType | null>(null)
  
  if (loading) return <p>Loading...</p>;
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {afes?.map((afe) => (
        <NavLink key={afe.id} 
        to="/mainscreen/afeDetail"
        state={{ selectedAFE: afe }}
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
        </NavLink>
      ))}
    </ul>
    </div>
  )
}
