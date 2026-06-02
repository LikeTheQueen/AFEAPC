
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { Button } from "@headlessui/react";
import { type AddressType, type ParentCompanyWrite, type ParentCompany, type OperatorOrPartnerList } from 'src/types/interfaces';
import { useEffect, useState, useMemo } from 'react';
import { addOParentCompanyRecordSupabase, addOParentCompanySupabase, addOperatorAdressSupabase, addOperatorPartnerAddressSupabase, addOperatorSupabase, addParentCompanyAdressSupabase, addPartnerSupabase, updateOParentCompanyRecordSupabase, updateParentCompanyAdressSupabase } from 'provider/write';
import { isAddressValid, isOperatorValid } from 'src/helpers/helpers';
import { notifyStandard, useWarnUnsavedChanges } from "src/helpers/helpers";
import { useSupabaseData } from 'src/types/SupabaseContext';
import { handleTabChanged } from 'src/routes/sharedComponents/tabChange';
import { CreateParentCompany, EditParentCompany } from './createEditParentCompanies';
import { ParentCompanyDropdown } from 'src/routes/sharedComponents/operatorDropdown';

const tabs = [
  {id:1, name:"Create Parent Company", current: true},
  {id:2, name:"Edit Parent Company", current: false}
];

export default function ParentCompanyInterface() {
    let parentCompanyBlank = {
        apc_name: '',
        max_users: 0,
        license_expires: '',
        is_active: true,
    }
    
    let parentCoAddressBlank : AddressType = {
        id:0,
        street: '',
        suite: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        address_active: true,
    }; 
    

    const { loggedInUser, session } = useSupabaseData();
    const token = session?.access_token ?? "";
    const [tabList, setTabList] = useState(tabs);
    const [currentTab, setCurrentTab] = useState(1);
    const [parentCompany, setParentCompany] = useState<ParentCompanyWrite>(parentCompanyBlank)
    const [parentCoBillingAddress, setParentCOBillAddress] = useState<AddressType>(parentCoAddressBlank);
    const [showSaved, setShowSaved] = useState<boolean>(false);
    const [parentCompanyWriteErrorMessage, setParentCoWriteErrorMessage] = useState<string | null>(null);
    const [parentCompanySelected, setParentCompanySelected] = useState<ParentCompany>();
    const [parentCompanyID, setParentCompanyId] = useState('');

    
  
  
  async function handleClickSaveOpName() {
  // Validate everything upfront before any writes
  if (!parentCompany.apc_name ) {
    setParentCoWriteErrorMessage('The Parent Company Name is not valid');
    return;
  }

  if (!isAddressValid(parentCoBillingAddress)) {
    setParentCoWriteErrorMessage('The Billing Address is not valid');
    return;
  }
let parentCompanyID =''
  try {
    
    const createParentCompany = await addOParentCompanyRecordSupabase(parentCompany);
    if (!createParentCompany.ok) throw new Error(createParentCompany.message);

    const parentCompanyAddressRecord = await addParentCompanyAdressSupabase(
      createParentCompany.data.id, parentCoBillingAddress
    );
    if (!parentCompanyAddressRecord.ok) throw new Error(parentCompanyAddressRecord.message);

    parentCompanyID = createParentCompany.data.id;
    setShowSaved(true);
    notifyStandard(`Parent Company name and billing address have been saved  Let's call it a clean tie-in.\n\n(TLDR: Parent Company and billing address ARE saved)`);

  } catch (error) {
    setParentCoWriteErrorMessage('Failed to save the Parent Company: ' + error);
  }
  };
  

  return (
    <>
    <div className="px-4 sm:px-10 sm:py-4">
          <div className="h-4 backdrop-blur-xs sm:sticky z-11 sm:top-16"></div>
          <div className="grid grid-cols-1 sm:hidden">
            {}
            <select
              value={tabList.find((tab) => tab.current)?.id || ''}
              onChange={e => { 
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
    <div hidden={currentTab === 2 || !loggedInUser?.is_super_user} className="">
      <CreateParentCompany></CreateParentCompany>
    </div>
    <div hidden={currentTab === 1 || !loggedInUser?.is_super_user} className="">
        <div className="px-4 sm:px-12 sm:py-2 divide-y divide-[var(--darkest-teal)]/40">
              <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-7">
                <div className="px-4 sm:px-0 md:col-span-2">
                  <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Parent Company</h2>
                  <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">
                    Select a Parent Company from the dropdown menu to edit the Parent Company details
                  </p>
                  <ParentCompanyDropdown
                    value={parentCompanyID}
                    onChange={(id) => {setParentCompanyId(id), setShowSaved(false), setParentCoWriteErrorMessage(null)}}
                    onRecordChange={(record) => setParentCompanySelected(record)}
                    limitedList={true}
                  ></ParentCompanyDropdown>
                </div>
                <div hidden={parentCompanySelected === undefined || parentCompanySelected === null} className='md:col-span-5'>
                {parentCompanySelected && (
                    <EditParentCompany
                    selectedParentCompany={parentCompanySelected}
                    billingAddress={parentCompanySelected?.apc_address!}
                    showSaveMessage={showSaved}
                    ></EditParentCompany>
                    )}
                </div>
              </div>
            </div>
    </div>
    </>
  )
};
