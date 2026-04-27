import { type AFEType } from "src/types/interfaces";
import { setStatusBackgroundColor, setStatusRingColor, setStatusTextColor } from "./styleHelpers";
import { formatDate, formatDateShort } from "src/helpers/styleHelpers";

type Props = {
    operatedAFE: boolean
    afe: AFEType
};

export function AFECard({ operatedAFE, afe }: Props) {

    return(
        <>
        <div className="flex w-full items-center justify-between p-3 pt-3">
            <div className="flex-1 truncate">
              <div className="flex items-center justify-between">
                <h3 className="truncate text-sm/6 font-medium text-[var(--darkest-teal)]/80"><span className="font-semibold">{operatedAFE ? 'Partner: ' : 'Operator: '} </span>{operatedAFE ? `${afe.partner_name}` : `${afe.operator}`}</h3>
                <span className={`shrink-0 rounded-full bg-${setStatusBackgroundColor(afe.partner_status)} px-1.5 py-0.5 text-sm/6 font-semibold text-${setStatusTextColor(afe.partner_status)} ring-1 ring-${setStatusRingColor(afe.partner_status)} ring-inset`}>
                  {afe.partner_status}
                </span>
              </div>
              <p className="truncate text-xs/6 2xl:text-sm/6 font-medium text-[var(--darkest-teal)]/80"><span className="font-semibold">{operatedAFE ? 'Partner Status & Date: ' : 'Approved by Operator: '}</span>
              {operatedAFE ? 
              window.innerWidth >= 1440 ? 
              formatDate(afe.partner_status_date) : formatDateShort(afe.partner_status_date) 
              : window.innerWidth >= 1440 ? 
              formatDate(afe.iapp_date) : formatDateShort(afe.iapp_date)}
              </p>
              <p className="truncate text-xs/6 2xl:text-sm/6 font-medium text-[var(--darkest-teal)]/80"><span className="font-semibold">Well Name: </span>{afe.well_name}</p>
              <div className="flex flex-row items-center justify-between">
              <p className="truncate text-xs/6 2xl:text-sm/6 font-medium text-[var(--darkest-teal)]/80"><span className="font-semibold">AFE Type: </span>{afe.afe_type}</p>
              <p className="truncate text-xs/6 2xl:text-sm/6 font-semibold text-[var(--darkest-teal)]/80">AFE Number: {afe.afe_number} {afe.version_string}</p>
            </div>
            
            </div>
            
          </div>
          <div className="-mt-px flex divide-x divide-[var(--darkest-teal)]/40">
              <div className="flex w-0 flex-1">
                <div
                  className="relative -mr-px inline-flex flex-wrap w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 px-1 text-xs/6 2xl:text-sm/6 font-semibold text-[var(--darkest-teal)]/80">
                  <span>Gross:</span>
                  { afe.supp_gross_estimate > 0 ?
                  Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format(afe.supp_gross_estimate) :
                  Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format(afe.total_gross_estimate)
                  }
                </div>
              </div>
              <div className="flex w-0 flex-1">
                <div
                  className="relative -mr-px inline-flex flex-wrap w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 px-1 text-xs/6 2xl:text-sm/6 font-semibold text-[var(--darkest-teal)]/80">
                  <span>Partner WI:</span>
                   {afe.partner_wi.toFixed(6)}%
                </div>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <div
                  className="relative inline-flex flex-wrap w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 px-1 text-xs/6 2xl:text-sm/6 font-semibold text-[var(--darkest-teal)]/80">
                  <span>Net:</span>
                  { afe.supp_gross_estimate > 0 ?
                  Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format((afe.supp_gross_estimate*afe.partner_wi)/100) :
                  Intl.NumberFormat("en-US",{ style: "currency", currency: "USD" } ).format((afe.total_gross_estimate*afe.partner_wi)/100)
                  }
                </div>
              </div>
          </div>
        </>

    );
};