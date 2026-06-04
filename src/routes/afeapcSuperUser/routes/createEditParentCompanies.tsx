
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { type OperatorType, type AFESourceSystemType, type AddressType, type ParentCompanyWrite, type ParentCompany } from 'src/types/interfaces';
import { useEffect, useState, useMemo } from 'react';
import { addOParentCompanyRecordSupabase, addParentCompanyAdressSupabase, updateOParentCompanyRecordSupabase, updateParentCompanyAdressSupabase } from 'provider/write';
import { isAddressValid, isOperatorValid } from 'src/helpers/helpers';
import { notifyStandard, useWarnUnsavedChanges } from "src/helpers/helpers";
import NoSelectionOrEmptyArrayMessage from 'src/routes/sharedComponents/noSelectionOrEmptyArrayMessage';
import { useSupabaseData } from 'src/types/SupabaseContext';

type Props = {
   selectedParentCompany: ParentCompany;
    billingAddress: AddressType; 
    showSaveMessage: boolean;
}
export function CreateParentCompany() {
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
    const [parentCompany, setParentCompany] = useState<ParentCompanyWrite>(parentCompanyBlank)
    const [parentCoBillingAddress, setParentCOBillAddress] = useState<AddressType>(parentCoAddressBlank);
    const [showSaved, setShowSaved] = useState<boolean>(false);
    const [parentCompanyWriteErrorMessage, setParentCoWriteErrorMessage] = useState<string | null>(null);

    
  function handleAddressChange(e: { target: { name: any; value: any; }; }) {
    setParentCOBillAddress({
      ...parentCoBillingAddress,
      [e.target.name]: e.target.value
    })
  };
  function handleParentCoNameChange(e: { target: { name: any; value: any; }; }) {
    if(e.target.name === 'max_users') {
      setParentCompany({
      ...parentCompany,
      [e.target.name]: parseInt(e.target.value)
    })
    } else {
    setParentCompany({
      ...parentCompany,
      [e.target.name]: e.target.value
    })
  }
  };
  
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
    <div className="px-4 sm:px-12 sm:py-2 divide-y divide-[var(--darkest-teal)]/40">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8  md:grid-cols-7">
        <div className="px-4 sm:px-0 md:col-span-2">
          <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Parent Company</h2>
          <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">
            Create the Parent Company with the billing address and license information.  All Operator addresses will be associated under this umbrella.
          </p>
        </div>
        <form className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 md:col-span-5">
          <div className="px-4 py-2 mb-4">
            <div className="grid max-w-5xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Parent Company Name
                </label>
                <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Nav Oil Inc."
                      autoComplete="off"
                      value={parentCompany.apc_name}
                      onChange={handleParentCoNameChange}
                      autoFocus={true}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                    />
                </div>
              </div>
              <div className="sm:col-span-4 sm:col-start-1">
                <label htmlFor="street" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Street Address
                </label>
                <div className="mt-1">
                  <input
                    id="street"
                    name="street"
                    type="text"
                    autoComplete="off"
                    value={parentCoBillingAddress.street}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="suite" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Suite
                </label>
                <div className="mt-1">
                  <input
                    id="suite"
                    name="suite"
                    type="text"
                    autoComplete="off"
                    value={parentCoBillingAddress.suite}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="city" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  City
                </label>
                <div className="mt-1">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="off"
                    value={parentCoBillingAddress.city}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="state" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  State / Province
                </label>
                <div className="mt-1">
                  <input
                    id="state"
                    name="state"
                    type="text"
                    autoComplete="off"
                    value={parentCoBillingAddress.state}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="zip" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  ZIP / Postal Code
                </label>
                <div className="mt-1">
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    autoComplete="off"
                    value={parentCoBillingAddress.zip}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="country" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Country
                </label>
                <div className="grid grid-cols-1 mt-1">
                  <select
                    id="country"
                    name="country"
                    autoComplete="off"
                    value={parentCoBillingAddress.country}
                    onChange={handleAddressChange}
                    className="col-start-1 row-start-1 w-full appearance-none w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  > <option></option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-[var(--darkest-teal)] sm:size-4"
                  />
                </div>
              </div>
                <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="max_users" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Number of Licenses
                </label>
                <div className="mt-1">
                  <input
                    id="max_users"
                    name="max_users"
                    type="number"
                    autoComplete="off"
                    value={parentCompany.max_users}
                    onChange={handleParentCoNameChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 sm:col-start-3">
                <label htmlFor="license_expires" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  License Expiration
                </label>
                <div className="mt-1">
                  <input
                    id="license_expires"
                    name="license_expires"
                    type="date"
                    autoComplete="off"
                    value={parentCompany.license_expires}
                    onChange={handleParentCoNameChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end border-t border-t-[var(--darkest-teal)]/30 px-4 py-4 sm:px-8">
            <button
              //type="submit"
              disabled={!isAddressValid(parentCoBillingAddress) || parentCompanyWriteErrorMessage !==null || parentCompany.apc_name === '' || parentCompany.license_expires === ''}
              onClick={async(e: any) => { 
                e.preventDefault();
                handleClickSaveOpName();
                }}
              className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
              Save
            </button>
          </div>
          <div hidden={!showSaved}
          className="border-t border-t-[var(--darkest-teal)]/30 p-1 text-base/7 font-semibold text-[var(--darkest-teal)] custom-style text-center">
          Parent Company has been saved.</div>
          
          <div hidden={parentCompanyWriteErrorMessage === null}
          className="border-t border-t-[var(--darkest-teal)]/30 p-1 bg-[var(--bright-pink)] text-base/7 font-semibold text-[var(--darkest-teal)] custom-style text-center">
          <NoSelectionOrEmptyArrayMessage
          message={'There was an error writing the Parent Company Record or the Parent Company Billing Address: '+parentCompanyWriteErrorMessage}
          ></NoSelectionOrEmptyArrayMessage>
          </div>
        </form>
      </div>
    </div>
    </>
  )
};

export function EditParentCompany({selectedParentCompany, billingAddress, showSaveMessage}: Props) {
    const [parentCompany, setParentCompany] = useState<ParentCompany>(selectedParentCompany)
    const [parentCoBillingAddress, setParentCOBillAddress] = useState<AddressType>(billingAddress);
    const [showSaved, setShowSaved] = useState<boolean>(false);
    const [parentCompanyWriteErrorMessage, setParentCoWriteErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if(!selectedParentCompany) return;
        setParentCompany(selectedParentCompany);
        setParentCOBillAddress(billingAddress);
        setShowSaved(showSaveMessage);
    },[selectedParentCompany, billingAddress])

    
  function handleAddressChange(e: { target: { name: any; value: any; }; }) {
    setParentCOBillAddress({
      ...parentCoBillingAddress,
      [e.target.name]: e.target.value
    })
  };
  function handleParentCoNameChange(e: { target: { name: any; value: any; }; }) {
    if(e.target.name === 'max_users') {
      setParentCompany({
      ...parentCompany,
      [e.target.name]: parseInt(e.target.value)
    })
    } else {
    setParentCompany({
      ...parentCompany,
      [e.target.name]: e.target.value
    })
  }
  };
  
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

  try {
    
    const createParentCompany = await updateOParentCompanyRecordSupabase(parentCompany);
    if (!createParentCompany.ok) throw new Error(createParentCompany.message);

    const parentCompanyAddressRecord = await updateParentCompanyAdressSupabase(
      parentCoBillingAddress
    );
    if (!parentCompanyAddressRecord.ok) throw new Error(parentCompanyAddressRecord.message);

    
    setShowSaved(true);
    notifyStandard(`Parent Company name and billing address have been saved  Let's call it a clean tie-in.\n\n(TLDR: Parent Company and billing address ARE saved)`);

  } catch (error) {
    setParentCoWriteErrorMessage('Failed to save the Parent Company: ' + error);
  }
  };
  
  
  return (
    <>
    <form className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 ">
          <div className="px-4 py-2 mb-4">
            <div className="grid max-w-5xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="apc_name" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Parent Company Name
                </label>
                <div className="mt-1">
                    <input
                      id="apc_name"
                      name="apc_name"
                      type="text"
                      placeholder="Nav Oil Inc."
                      autoComplete="off"
                      value={parentCompany.apc_name}
                      onChange={handleParentCoNameChange}
                      autoFocus={true}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                    />
                </div>
              </div>
              <div className="sm:col-span-4 sm:col-start-1">
                <label htmlFor="street" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Street Address
                </label>
                <div className="mt-1">
                  <input
                    id="street"
                    name="street"
                    type="text"
                    autoComplete="off"
                    value={parentCoBillingAddress.street}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="suite" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Suite
                </label>
                <div className="mt-1">
                  <input
                    id="suite"
                    name="suite"
                    type="text"
                    autoComplete="off"
                    value={parentCoBillingAddress.suite}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="city" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  City
                </label>
                <div className="mt-1">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="off"
                    value={parentCoBillingAddress.city}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="state" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  State / Province
                </label>
                <div className="mt-1">
                  <input
                    id="state"
                    name="state"
                    type="text"
                    autoComplete="off"
                    value={parentCoBillingAddress.state}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="zip" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  ZIP / Postal Code
                </label>
                <div className="mt-1">
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    autoComplete="off"
                    value={parentCoBillingAddress.zip}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="country" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Country
                </label>
                <div className="grid grid-cols-1 mt-1">
                  <select
                    id="country"
                    name="country"
                    autoComplete="off"
                    value={parentCoBillingAddress.country}
                    onChange={handleAddressChange}
                    className="col-start-1 row-start-1 w-full appearance-none w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  > <option></option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-[var(--darkest-teal)] sm:size-4"
                  />
                </div>
              </div>
                <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="max_users" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Number of Licenses
                </label>
                <div className="mt-1">
                  <input
                    id="max_users"
                    name="max_users"
                    type="number"
                    autoComplete="off"
                    value={parentCompany.max_users}
                    onChange={handleParentCoNameChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 sm:col-start-3">
                <label htmlFor="license_expires" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  License Expiration
                </label>
                <div className="mt-1">
                  <input
                    id="license_expires"
                    name="license_expires"
                    type="date"
                    autoComplete="off"
                    value={parentCompany.license_expires}
                    onChange={handleParentCoNameChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end border-t border-t-[var(--darkest-teal)]/30 px-4 py-4 sm:px-8">
            <button
              //type="submit"
              disabled={!isAddressValid(parentCoBillingAddress) || parentCompanyWriteErrorMessage !==null || parentCompany.apc_name === '' || parentCompany.license_expires === ''}
              onClick={async(e: any) => { 
                e.preventDefault();
                handleClickSaveOpName();
                }}
              className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
              Save
            </button>
          </div>
          <div hidden={!showSaved}
          className="border-t border-t-[var(--darkest-teal)]/30 p-1 text-base/7 font-semibold text-[var(--darkest-teal)] custom-style text-center">
          Parent Company has been saved.</div>
          
          <div hidden={parentCompanyWriteErrorMessage === null}
          className="border-t border-t-[var(--darkest-teal)]/30 p-1 bg-[var(--bright-pink)] text-base/7 font-semibold text-[var(--darkest-teal)] custom-style text-center">
          <NoSelectionOrEmptyArrayMessage
          message={'There was an error writing the Parent Company Record or the Parent Company Billing Address: '+parentCompanyWriteErrorMessage}
          ></NoSelectionOrEmptyArrayMessage>
          </div>
        </form>
    </>
  )
};