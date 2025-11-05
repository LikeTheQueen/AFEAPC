
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { type OperatorType, type AFESourceSystemType, type AddressType } from 'src/types/interfaces';
import { sourceSystemList, writeOperatorToSupabase } from 'src/helpers/helpers';
import { useEffect, useState } from 'react';
import { addOperatorAdressSupabase, addOperatorPartnerAddressSupabase, addOperatorSupabase, addPartnerSupabase } from 'provider/write';
import { disableCreateButton, disableSaveAndSaveAnother, isAddressListHidden } from './helpers/helpers';
import PartnerToOperatorGrid from 'src/routes/partnerToOperatorGrid';
import { ToastContainer } from 'react-toastify';
import { notifyStandard, warnUnsavedChanges } from "src/helpers/helpers";

export default function CreateOperator() {
    let operatorBlank : OperatorType = {
      name:'',
      source_system:0
    }; 
    let opAddressBlank : AddressType = {
        id:0,
        street: '',
        suite: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        address_active: true,
    }; 
    let opPartnerAddressBlank : AddressType = {
        id:0,
        street: '',
        suite: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        address_active: true
    };  
    
    const [sourceSystems, setSourceSystems] = useState<AFESourceSystemType[] | []>([]);
    const [operator, setOperator] = useState<OperatorType>(operatorBlank);
    const [operatorBillingAddress, setOpBillAddress] = useState<AddressType>(opAddressBlank);
    const [operatorPartnerAddressSingle, setOpPartnerAddressSingle] = useState<AddressType>(opPartnerAddressBlank);
    const [operatorPartnerAddresses, setOpPartnerAddress] = useState<AddressType[] | []>([]);
    const [opPartnerID, setOpPartnerID] = useState<string | null>(null);
    const [showSaved, setShowSaved] = useState<boolean>(false);
    
    
    const fetchData = async () => {
    const afeSystemList = await sourceSystemList();
    const blankOption: AFESourceSystemType = {
    id: 0,
    system: '', 
  };
    const extendedList = [blankOption, ...afeSystemList];
    setSourceSystems(extendedList);
  }
    useEffect(() => {
        fetchData();
    },[]);
  
  function handleAddressChange(e: { target: { name: any; value: any; }; }) {
    setOpBillAddress({
      ...operatorBillingAddress,
      [e.target.name]: e.target.value
    })
  }
  function handleOperatorNameChange(e: { target: { name: any; value: any; }; }) {
    setOperator({
      ...operator,
      [e.target.name]: e.target.value
    })
  }
  function handlePartnerAddressChange(e: { target: { name: any; value: any; }; }) {
    setOpPartnerAddressSingle({
      ...operatorPartnerAddressSingle,
      [e.target.name]: e.target.value
    })
  }
  async function handleClickSaveOpName() {
    try {
      const operatorRecord = await addOperatorSupabase(operator?.name!, operator?.source_system!);
      
      if (operatorRecord) {
        setOperator(operatorRecord); 
        setShowSaved(true);
        try {
        const operatorAddressRecord = await addOperatorAdressSupabase(operatorRecord.id!, 
        operatorBillingAddress?.street!,
        operatorBillingAddress?.suite!,
        operatorBillingAddress?.city!,
        operatorBillingAddress?.state!,
        operatorBillingAddress?.zip!,
        operatorBillingAddress?.country!
      );
      if (operatorAddressRecord) {
        setOpBillAddress(operatorAddressRecord);
      } else {
        console.warn("No Address returned");
      }
    } catch (error) {
      console.error("Failed to add operator Address:", error);
    } 
      }  else {
        console.warn("No operator returned");
      }
    
    } catch (error) {
      console.error("Failed to add operator:", error);
    }
  }
  async function handleClickSaveAnother() {
    const partnerRecord = await addPartnerSupabase(operator.name!, operator.id!);
      
      if (partnerRecord) {
        setOpPartnerID(partnerRecord?.id!);
      }
    try {
        const operatorAddressRecord = await addOperatorPartnerAddressSupabase(partnerRecord?.id!, 
        operatorPartnerAddressSingle?.street!,
        operatorPartnerAddressSingle?.suite!,
        operatorPartnerAddressSingle?.city!,
        operatorPartnerAddressSingle?.state!,
        operatorPartnerAddressSingle?.zip!,
        operatorPartnerAddressSingle?.country!
      );
      if (operatorAddressRecord) {
        setOpPartnerAddressSingle(opPartnerAddressBlank);
        setOpPartnerAddress([
          ...operatorPartnerAddresses,
          operatorAddressRecord
        ])
      } else {
        console.warn("No Address returned");
      }
    } catch (error) {
      console.error("Failed to add operator Address:", error);
    }
  }
  
  return (
    <>
    <div className="px-4 sm:px-10 sm:py-4 divide-y divide-[var(--darkest-teal)]/40">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-7">
        <div className="px-4 sm:px-0 md:col-span-2">
          <h2 className="text-md/7 font-semibold text-[var(--darkest-teal)] custom-style">Operator Information</h2>
          <p className="mt-1 text-md/6 text-[var(--darkest-teal)] custom-style-long-text">
            Create the Operator with the billing address.  Below add additional addresses to be used as Partner addresses
          </p>
        </div>
        <form className="bg-white shadow-lg sm:rounded-lg ring-1 ring-[var(--darkest-teal)]/30 p-1 mb-5 md:col-span-5">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="operatorName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Operator Name
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-[var(--darkest-teal)] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--bright-pink)]">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Nav Oil Inc."
                      autoComplete="off"
                      value={operator.name}
                      onChange={handleOperatorNameChange}
                      autoFocus={true}
                      className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4 sm:col-start-1">
                <label htmlFor="operatorName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Street Address
                </label>
                <div className="mt-2">
                  <input
                    id="street"
                    name="street"
                    type="text"
                    autoComplete="off"
                    value={operatorBillingAddress.street}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="operatorName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Suite
                </label>
                <div className="mt-2">
                  <input
                    id="suite"
                    name="suite"
                    type="text"
                    autoComplete="off"
                    value={operatorBillingAddress.suite}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="operatorName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  City
                </label>
                <div className="mt-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="off"
                    value={operatorBillingAddress.city}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="operatorName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  State / Province
                </label>
                <div className="mt-2">
                  <input
                    id="state"
                    name="state"
                    type="text"
                    autoComplete="off"
                    value={operatorBillingAddress.state}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="operatorName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  ZIP / Postal Code
                </label>
                <div className="mt-2">
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    autoComplete="off"
                    value={operatorBillingAddress.zip}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label htmlFor="operatorName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Country
                </label>
                <div className="mt-2 grid grid-cols-1 ">
                  <select
                    id="country"
                    name="country"
                    autoComplete="off"
                    value={operatorBillingAddress.country}
                    onChange={handleAddressChange}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  > <option></option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>
                <div className="sm:col-span-4">
                <label htmlFor="operatorName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Source System for AFEs
                </label>
                <div className="mt-2 grid grid-cols-1 ">
                  <select
                    id="source_system"
                    name="source_system"
                    autoComplete="off"
                    value={operator.source_system}
                    onChange={handleOperatorNameChange}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
                    {sourceSystems.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.system}
                    </option>
                ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/20 px-4 py-4 sm:px-8">
            <button
              //type="submit"
              disabled={disableCreateButton(operator,operatorBillingAddress)}
              onClick={async(e: any) => { 
                e.preventDefault();
                handleClickSaveOpName();
                notifyStandard(`Operator name and billing address have been saved  Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE saved)`);
                
            }}
              className="rounded-md bg-[var(--darkest-teal)] disabled:bg-gray-300 px-3 py-2 text-sm font-semibold text-white custom-style shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]">
              Save
            </button>
          </div>
          <div hidden={!showSaved}
          className="border-t border-gray-900/20 p-1 text-m font-semibold text-[var(--darkest-teal)] custom-style text-center">
          Operator has been saved.</div>
        </form>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-7">
        <div className="px-4 sm:px-0 md:col-span-2">
          <h2 className="text-md/7 font-semibold text-[var(--darkest-teal)] custom-style">Claim Partner Addresses for Operator</h2>
          <p className="mt-1 text-md/6 text-[var(--darkest-teal)] custom-style-long-text">
            From the list of addresses claim those for the Operator.  Additional addresses can be added below.  Only unclaimed addresses are visible.
          </p>
        </div>

        <form className="bg-white shadow-lg sm:rounded-lg ring-1 ring-[var(--darkest-teal)]/30 p-1 mb-5 md:col-span-5">
          <div >
            <PartnerToOperatorGrid
            singleOpID={true}
            currentOpID={operator.id!}>
            </PartnerToOperatorGrid>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-7">
        <div className="px-4 sm:px-0 md:col-span-2">
          <h2 className="text-md/7 font-semibold text-[var(--darkest-teal)] custom-style">Operator Addresses as a Partner</h2>
          <p className="mt-1 text-md/6 text-[var(--darkest-teal)] custom-style-long-text">
            Add Addresses to be used when the Operator is a Partner.  Add the billing address (again) if applicable.
          </p>
          
          
          <ul role="list" hidden={isAddressListHidden(operatorPartnerAddresses)}>
            <div 
          className="mt-6 border-t border-gray-900/20 p-1 text-m font-semibold text-[var(--darkest-teal)] custom-style ">
          The addresses below have been saved</div>
            {operatorPartnerAddresses?.map((address) => (
              <ol key={address.id} className="p-1 text-sm font-normal text-[var(--darkest-teal)] custom-style ">
                {address.street} {address.suite} {address.city} {address.state} {address.zip}
                </ol>
            ))}

          </ul>
        </div>

        <form className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl md:col-span-5">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              
              <div className="sm:col-span-4 sm:col-start-1">
                <label htmlFor="operatorName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Street Address
                </label>
                <div className="mt-2">
                  <input
                    id="street"
                    name="street"
                    type="text"
                    value={operatorPartnerAddressSingle.street}
                    onChange={handlePartnerAddressChange}
                    autoComplete="off"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="operatorName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Suite
                </label>
                <div className="mt-2">
                  <input
                    id="suite"
                    name="suite"
                    type="text"
                    autoComplete="off"
                    value={operatorPartnerAddressSingle.suite}
                    onChange={handlePartnerAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="operatorName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  City
                </label>
                <div className="mt-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="off"
                    value={operatorPartnerAddressSingle.city}
                    onChange={handlePartnerAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="operatorName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  State / Province
                </label>
                <div className="mt-2">
                  <input
                    id="state"
                    name="state"
                    type="text"
                    autoComplete="off"
                    value={operatorPartnerAddressSingle.state}
                    onChange={handlePartnerAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="operatorName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  ZIP / Postal Code
                </label>
                <div className="mt-2">
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    autoComplete="off"
                    value={operatorPartnerAddressSingle.zip}
                    onChange={handlePartnerAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="operatorName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Country
                </label>
                <div className="mt-2 grid grid-cols-1 ">
                  <select
                    id="country"
                    name="country"
                    autoComplete="off"
                    value={operatorPartnerAddressSingle.country}
                    onChange={handlePartnerAddressChange}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
                    <option></option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/20 px-4 py-4 sm:px-8">
            <button
              disabled={disableSaveAndSaveAnother(operator.id,operatorPartnerAddressSingle)}
              onClick={async(e: any) => { 
                e.preventDefault();
                handleClickSaveAnother(); 
                notifyStandard(`Operator partner address has been saved  Let's call it a clean tie-in.\n\n(TLDR: Operator partner address IS saved)`);
            }}
              className="rounded-md bg-[var(--darkest-teal)] disabled:bg-gray-300 px-3 py-2 text-sm font-semibold text-white custom-style shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]">
              Save 
            </button>
          </div>
        </form>
      </div>
    </div>
    <ToastContainer />
            {warnUnsavedChanges((operator.name !=='' && operator.id !=='' && !showSaved), "You have not saved the Operator")}
    </>
  )
}
