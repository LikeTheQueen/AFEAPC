
import { useEffect } from "react";
import { useBlocker } from "react-router";
import { toast, type ToastContentProps } from "react-toastify";
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
import type { AddressType, AFEHistorySupabaseType, AFEType, EstimatesSupabaseType, OperatorType } from "src/types/interfaces";



export function setAFEHistoryMaxID(afeHistories: AFEHistorySupabaseType[] | []) {
  return afeHistories.length;
};

export function groupByAccountGroup(account: EstimatesSupabaseType[] | []): Map<string, EstimatesSupabaseType[]> | null {
  if (account !== null && account.length > 0 ) {
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
};

export function calcPartnerNet(gross: number | undefined, wi: number | undefined) {
  if (gross && wi) {
    return Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((gross * wi) / 100);
  } else if (gross === undefined && wi) {
    return 'Missing gross amount';
  } else if (gross && wi === undefined) {
    return 'Missing working interest';
  } else {
    return 'Missing WI and gross amount';
  }
};

export function toggleStatusButtonDisable(singleAFE: AFEType | undefined | null) {
  if (singleAFE === null || singleAFE === undefined) {
    return false
  } else if (singleAFE?.partner_status === 'New' || singleAFE?.partner_status === 'Viewed') {
    return false
  } else {
    return true
  }
};

export function activeTab(tabList: any[], selected: number | null) {
  if(!selected) {
    const selectedTabId = tabList.find((tab)=> tab.current === true)?.id;
    const updatedTabs = tabList.map((tab) => ({
      ...tab,
      current: tab.id === selectedTabId,
    }));
    return {updatedTabs, selectedTabId}
  } else {
    
    const selectedTabId = selected;
    const updatedTabs = tabList.map((tab) => ({
      ...tab,
      current: tab.id === selectedTabId,
    }));
    return {updatedTabs, selectedTabId}
  }

};

export const warnUnsavedChanges = (showAlert:boolean, message:string) =>{
        useBlocker(
            () => {
                if(showAlert) {
                    
                    const confirmLeave = window.confirm(message);
                        return !confirmLeave;
                }
                return false;
            }
        );

        useEffect(() => {
            const handleBeforeUnload = (e:any) => {
                if(showAlert) {
                    e.preventDefault();
                    e.returnValue = message;
                }
            };
            if(showAlert) {
                window.addEventListener("beforeunload", handleBeforeUnload);
            }

            return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
        }, [showAlert,message]);
};

export function StandardNotifcation({
  closeToast,
  data, 
}: ToastContentProps<string>) {
  return (
    <div className="w-full custom-style rounded-lg shadow-3xl ring-1 ring-[var(--bright-pink)] p-5">
      <h3 className="text-white text-sm/6 font-normal whitespace-pre-line">{data}</h3>
        <div className="flex items-center">
                  <div className="flex w-0 flex-1 justify-end">
                    
                    <button
                      type="button"
                      onClick={() => closeToast("confirmed")}
                      className="px-3 py-2 shrink-0 rounded-md bg-[var(--bright-pink)] text-sm/6 font-medium text-white hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-white ">
                      Okay, cool!
                    </button>
                  </div>
                  <div className="ml-4 flex shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        closeToast("reply")
                      }}
                      className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 dark:hover:text-white dark:focus:outline-indigo-500"
                    >
                      <span className="sr-only">Close</span>
                      
                    </button>
                  </div>
        </div>  
    </div>
  );
}
export const notifyStandard = (message:string) => toast(StandardNotifcation, {
    data: message,
    closeButton: false,
    position: "top-center",
    autoClose: 4000,
    transition: Flip,
    ariaLabel: "Notification",
    onClose: (reason) => {
      if (reason === "reply") {
        // user clicked Reply
      } else if (reason === "ignore") {
        // user clicked Ignore
      }
    },
  });
export function FailureNotifcation({
  closeToast,
  data, 
}: ToastContentProps<string>) {
  return (
    <div className="w-full custom-style rounded-lg shadow-3xl ring-1 ring-[var(--bright-pink)] p-5">
      <h3 className="text-white text-sm/6 font-normal whitespace-pre-line">{data}</h3>
        <div className="flex items-center">
                  <div className="flex w-0 flex-1 justify-end">
                    
                    <button
                      type="button"
                      onClick={() => closeToast("confirmed")}
                      className="px-3 py-2 shrink-0 rounded-md bg-[var(--bright-pink)] text-sm/6 font-medium text-white hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-white ">
                      Understood.
                    </button>
                  </div>
                  <div className="ml-4 flex shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        closeToast("reply")
                      }}
                      className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 dark:hover:text-white dark:focus:outline-indigo-500"
                    >
                      <span className="sr-only">Close</span>
                      
                    </button>
                  </div>
        </div>  
    </div>
  );
}
export const notifyFailure = (message:string) => toast(FailureNotifcation, {
    data: message,
    closeButton: false,
    position: "top-center",
    autoClose: 4000,
    transition: Bounce,
    ariaLabel: "Notification",
    onClose: (reason) => {
      if (reason === "reply") {
        // user clicked Reply
      } else if (reason === "ignore") {
        // user clicked Ignore
      }
    },
  }); 

export function isAddressValid(address: AddressType): boolean {
  return !!(
    address.street &&
    address.city &&
    address.state &&
    address.zip &&
    address.country
  );
};

export function isOperatorValid(operator: OperatorType): boolean {
  return !!(
    operator.name &&
    operator.source_system !==0 &&
    !operator.id
  );
};