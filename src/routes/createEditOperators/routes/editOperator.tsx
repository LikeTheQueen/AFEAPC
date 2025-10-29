import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { type OperatorType, type AFESourceSystemType, type AddressType, type OperatorPartnerRecord } from 'src/types/interfaces';
import { sourceSystemList, writeOperatorToSupabase } from 'src/helpers/helpers';
import { useEffect, useState } from 'react';
import { addOperatorAdressSupabase, addOperatorPartnerAddressSupabase, addOperatorSupabase, addPartnerSupabase, updateOperatorAddress, updateOperatorNameAndStatus, updatePartnerAddress, updatePartnerNameAndStatus } from 'provider/write';
import { disableCreateButton, disableSaveAndSaveAnother, isAddressListHidden } from './helpers/helpers';
import PartnerToOperatorGrid from 'src/routes/partnerToOperatorGrid';
import { ToastContainer } from 'react-toastify';
import { notifyStandard, warnUnsavedChanges } from "src/helpers/helpers";



type EditOperatorProps = {
    operatorToEdit: OperatorPartnerRecord;
    partnerRecords: OperatorPartnerRecord[];
    token: string;
    onClose: () => void;
};

export default function EditOperator({operatorToEdit, partnerRecords, onClose, token} : EditOperatorProps) {
    
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
        address_active: true
    }; 
      
    
    const [sourceSystems, setSourceSystems] = useState<AFESourceSystemType[] | []>([]);
    
    const [operator, setOperator] = useState<OperatorType>(operatorBlank);
    const [operatorBillingAddress, setOpBillAddress] = useState<AddressType>(opAddressBlank);
    const [saveOpNameChange, setSaveOpNameChange] = useState(false);
    const [saveOpAddressChange, setSaveOpAddressChange] = useState(false);

    const [partnerList, setPartnerList] = useState<OperatorPartnerRecord[] | []>([]);
    const [partnerAddressUpdate, setPartnerAddressUpdate] = useState<boolean[] | []>([]);
    const [partnerNameUpdate, setPartnerNameUpdate] = useState<boolean[] | []>([]);
    
    useEffect(() => {
        if(!operatorToEdit) return;

        async function setOperatorAndPartners() {
            setOperator({
                id: operatorToEdit.apc_id,
                name: operatorToEdit.name,
                active: operatorToEdit.active
            }
            );
            setOpBillAddress({
                id: operatorToEdit.apc_address_id!,
                street: operatorToEdit.street,
                suite: operatorToEdit.suite,
                city: operatorToEdit.city,
                state: operatorToEdit.state,
                zip: operatorToEdit.zip,
                country: operatorToEdit.country,
                address_active: operatorToEdit.address_active

            });

            if(!operatorToEdit || !partnerRecords) return;
            const filteredPartners = partnerRecords.filter(item => item.apc_op_id === operatorToEdit.apc_id);
            setPartnerList(filteredPartners);
            const falseArray = new Array(partnerList.length).fill(false);
            setPartnerAddressUpdate(falseArray);
            setPartnerNameUpdate(falseArray);
        }
        setOperatorAndPartners();
    },[operatorToEdit, partnerRecords])
  
  function handleOperatorAddressChange(e: { target: { name: any; value: any; }; }) {
    setOpBillAddress({
      ...operatorBillingAddress,
      [e.target.name]: e.target.value!
    });
    setSaveOpAddressChange(true);
  }
  function handleOperatorNameChange(e: { target: { name: any; value: any; }; }) {
    setOperator({
      ...operator,
      [e.target.name]: e.target.value
    });
    setSaveOpNameChange(true);
  }
  function handlePartnerNameChange(e: { target: { name: any; value: any; }; }, partnerIdx: number) {
    setPartnerList(prevPartnerList => 
    prevPartnerList.map((partner, index) =>  
      index === partnerIdx 
        ? { ...partner, [e.target.name]: e.target.value }
        : partner
        )
    );
    setPartnerNameUpdate(prevPartnerNameUpdate =>
        prevPartnerNameUpdate.map((item, index) =>
        index === partnerIdx
            ? true : item
        )
    );
  }
  function handlePartnerAddressChange(e: { target: { name: any; value: any; }; }, partnerIdx: number) {
    setPartnerList(prevPartnerList => 
    prevPartnerList.map((partner, index) =>  
      index === partnerIdx 
        ? { ...partner, [e.target.name]: e.target.value }
        : partner
        )
    );
    setPartnerAddressUpdate(prevPartnerAddressUpdate =>
        prevPartnerAddressUpdate.map((item, index) =>
        index === partnerIdx
            ? true : item
        )
    );
  }
  async function handleClickSaveOpName() {
    try {
      const operatorToEdit = await updateOperatorNameAndStatus(operator, token);
      
      if(!operatorToEdit.ok) {
        throw new Error(operatorToEdit.message as any).message
      }
    
    } catch (error) {
      console.error("Failed to update Operator:", error);
    }
  }
  async function handleClickSaveOpAddress() {
    try {
      const operatorAddress = await updateOperatorAddress(operatorBillingAddress, token);
      
      if(!operatorAddress.ok) {
        throw new Error(operatorAddress.message as any).message
      } 
    
    } catch (error) {
      console.error("Failed to update Operator Address:", error);
    }
  }
  async function handleClickActivateOrDeactivateOperator() {
    if(!operator.id) return;

    setOperator({
      ...operator,
      active: !operator.active
    })

    setOpBillAddress({
        ...operatorBillingAddress,
        address_active: !operatorBillingAddress.address_active
    })

    try {
        const [operatorStatusChange, operatorAddressStatusChange] = await Promise.all([
            updateOperatorNameAndStatus(operator, token),
            updateOperatorAddress(operatorBillingAddress, token)
        ])

      if(!operatorStatusChange.ok) {
        throw new Error(operatorStatusChange.message as any).message
      }
      if(!operatorAddressStatusChange.ok) {
        throw new Error(operatorAddressStatusChange.message as any).message
      }
      
    } catch (error) {
      console.error("Failed to change Operator status:", error);
    }
  }
  async function handleClickSavePartnerName(partnerRecord: OperatorPartnerRecord, partnerIdx: number) {
    try {
      const partnerToEdit = await updatePartnerNameAndStatus(partnerRecord, token);
      
      if(!partnerToEdit.ok) {
        throw new Error(partnerToEdit.message as any).message
      }
      setPartnerNameUpdate(prevPartnerNameUpdate =>
        prevPartnerNameUpdate.map((item, index) =>
        index === partnerIdx
            ? true : item
        )
    );
    
    } catch (error) {
      console.error("Failed to update Partner:", error);
    }
  }
  async function handleClickSavePartnerAddress(partnerRecord: OperatorPartnerRecord, partnerIdx: number) {
    try {
      const partnerAddress = await updatePartnerAddress(partnerRecord, token);
      
      if(!partnerAddress.ok) {
        throw new Error(partnerAddress.message as any).message
      } 
      setPartnerAddressUpdate(prevPartnerAddressUpdate =>
        prevPartnerAddressUpdate.map((item, index) =>
        index === partnerIdx
            ? true : item
        )
    );
    
    } catch (error) {
      console.error("Failed to update Partner Address:", error);
    }
  }
  async function handleClickActivateOrDeactivatePartner( partnerIdx: number) {
    
  const partnerToUpdate = partnerList[partnerIdx];
  const updatedPartner = {
    ...partnerToUpdate,
    active: !partnerToUpdate.active,
    address_active: !partnerToUpdate.address_active
  }
  setPartnerList(prevPartnerList => 
    prevPartnerList.map((partner, index) =>  
      index === partnerIdx 
        ? updatedPartner
        : partner
    )
  );
  
  try {
    
   const [partnerStatusChange, partnerAddressStatusChange] = await Promise.all([
        updatePartnerNameAndStatus(updatedPartner, token),
        updatePartnerAddress(updatedPartner, token)
    ])
    if(!partnerStatusChange.ok) {
        throw new Error(partnerStatusChange.message as any).message;
    }
    if(!partnerAddressStatusChange.ok) {
        throw new Error(partnerAddressStatusChange.message as any).message;
    }
    
  } catch (error) {
      console.error("Failed to change Operator status:", error);
    }
  }

  return (
    <>
    {!operatorToEdit ? (<div className="flex items-start justify-start bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl">
    <p className="custom-style font-semibold text-[var(--darkest-teal)]">No Operator Selected</p>
    </div>) : (
    <div className="divide-y divide-gray-900/20">
      
        <form className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl sm:grid-cols-6 mb-6">
          <div className="px-4 py-2">
            <div className="grid max-w-5xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
              <div className="sm:col-span-3 sm:col-start-1">
                <label htmlFor="name" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
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
                    {/* //onChange={handleOperatorNameChange} */}
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4 sm:col-start-1">
                <label htmlFor="street" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Street Address
                </label>
                <div className="mt-2">
                  <input
                    id="street"
                    name="street"
                    type="text"
                    autoComplete="off"
                    value={operatorBillingAddress.street}
                    onChange={handleOperatorAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="suite" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Suite
                </label>
                <div className="mt-2">
                  <input
                    id="suite"
                    name="suite"
                    type="text"
                    autoComplete="off"
                    value={operatorBillingAddress.suite}
                    onChange={handleOperatorAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="city" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  City
                </label>
                <div className="mt-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="off"
                    value={operatorBillingAddress.city}
                    onChange={handleOperatorAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="state" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  State / Province
                </label>
                <div className="mt-2">
                  <input
                    id="state"
                    name="state"
                    type="text"
                    autoComplete="off"
                    value={operatorBillingAddress.state}
                    onChange={handleOperatorAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="zip" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  ZIP / Postal Code
                </label>
                <div className="mt-2">
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    autoComplete="off"
                    value={operatorBillingAddress.zip}
                    onChange={handleOperatorAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-4 pb-2 sm:col-start-1">
                <label htmlFor="country" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Country
                </label>
                <div className="mt-2 grid grid-cols-1 ">
                  <select
                    id="country"
                    name="country"
                    autoComplete="off"
                    value={operatorBillingAddress.country}
                    onChange={handleOperatorAddressChange}
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
              <div className="sm:col-span-2 flex items-end justify-end gap-x-6 pb-2">
            <button
              disabled={(!operator.id && operatorBillingAddress.id === 0) ? true : false}
              onClick={async(e: any) => { 
                e.preventDefault();
                handleClickActivateOrDeactivateOperator();
                notifyStandard(`Operator name and billing address have been ${operator.active ? 'deactivated' : 'activated'}.  Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE ${operator.active ? 'deactivated' : 'activated'}.)`);
            }}
              className="rounded-md bg-[var(--darkest-teal)] disabled:bg-gray-300 px-3 py-2 text-sm font-semibold text-white custom-style shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]">
              {operator.active ? 'Deactivate' : 'Activate'}
            </button>
            <button
              disabled={(!operator.id && operatorBillingAddress.id === 0) || (!saveOpNameChange && !saveOpAddressChange) ? true : false}
              onClick={async(e: any) => { 
                e.preventDefault();
                {saveOpNameChange ? handleClickSaveOpName() : null};
                {saveOpAddressChange ? handleClickSaveOpAddress() : null};
                setSaveOpAddressChange(false);
                setSaveOpNameChange(false);
                notifyStandard(`Operator name and billing address have been saved  Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE saved)`);
            }}
              className="rounded-md bg-[var(--darkest-teal)] disabled:bg-gray-300 px-3 py-2 text-sm font-semibold text-white custom-style shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]">
              Save
                </button>
              </div>
            </div>
          </div>
        </form>
        <p className="custom-style font-semibold text-[var(--darkest-teal)]">Edit the Operator Addresses for Non-Op AFEs.</p>
        {partnerList.map((partner, partnerIdx) => (
        <form key={partner.apc_id} className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl sm:grid-cols-6 mb-6">
          <div className="px-4 py-2">
            <div className="grid max-w-5xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Name
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-[var(--darkest-teal)] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--bright-pink)]">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Nav Oil Inc."
                      autoComplete="off"
                      value={partner.name}
                      onChange={(e) => handlePartnerNameChange(e, partnerIdx)}
                      className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4 sm:col-start-1">
                <label htmlFor="street" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Street Address
                </label>
                <div className="mt-2">
                  <input
                    id="street"
                    name="street"
                    type="text"
                    autoComplete="off"
                    value={partner.street}
                    onChange={(e) => handlePartnerAddressChange(e, partnerIdx)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="suite" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Suite
                </label>
                <div className="mt-2">
                  <input
                    id="suite"
                    name="suite"
                    type="text"
                    autoComplete="off"
                    value={partner.suite}
                    onChange={(e) => handlePartnerAddressChange(e, partnerIdx)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="city" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  City
                </label>
                <div className="mt-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="off"
                    value={partner.city}
                    onChange={(e) => handlePartnerAddressChange(e, partnerIdx)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="state" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  State / Province
                </label>
                <div className="mt-2">
                  <input
                    id="state"
                    name="state"
                    type="text"
                    autoComplete="off"
                    value={partner.state}
                    onChange={(e) => handlePartnerAddressChange(e, partnerIdx)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="zip" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  ZIP / Postal Code
                </label>
                <div className="mt-2">
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    autoComplete="off"
                    value={partner.zip}
                    onChange={(e) => handlePartnerAddressChange(e, partnerIdx)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-4 pb-2 sm:col-start-1">
                <label htmlFor="country" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Country
                </label>
                <div className="mt-2 grid grid-cols-1 ">
                  <select
                    id="country"
                    name="country"
                    autoComplete="off"
                    value={partner.country}
                    onChange={(e) => handlePartnerAddressChange(e, partnerIdx)}
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
              <div className="sm:col-span-2 flex items-end justify-end gap-x-6 pb-2">
                <button
              //type="submit"
              disabled={(!partner.apc_id && !partner.apc_address_id) ? true : false}
              onClick={async(e: any) => { 
                e.preventDefault();
                handleClickActivateOrDeactivatePartner(partnerIdx);
                notifyStandard(`Operator's Partner name and address have been saved  Let's call it a clean tie-in.\n\n(TLDR: Operator's Partner name and address ARE saved)`);
            }}
              className="rounded-md bg-[var(--darkest-teal)] disabled:bg-gray-300 px-3 py-2 text-sm font-semibold text-white custom-style shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]">
              {partner.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
              //type="submit"
              disabled={((!partner.apc_id && !partner.apc_address_id) || (partnerAddressUpdate[partnerIdx]===false && partnerNameUpdate[partnerIdx]===false)) ? true : false}
              onClick={async(e: any) => { 
                e.preventDefault();
                {partnerAddressUpdate[partnerIdx] === true ? handleClickSavePartnerAddress(partner, partnerIdx) : null};
                {partnerNameUpdate[partnerIdx] === true ? handleClickSavePartnerName(partner, partnerIdx) : null}
                notifyStandard(`Operator's Partner name and address have been saved  Let's call it a clean tie-in.\n\n(TLDR: Operator's Partner name and address ARE saved)`);
            }}
              className="rounded-md bg-[var(--darkest-teal)] disabled:bg-gray-300 px-3 py-2 text-sm font-semibold text-white custom-style shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]">
              Save
                </button>
              </div>
              
            </div>
          </div>
        </form>
      ))}
      
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 sm:grid-cols-6">
        <div className="px-4 sm:px-0 sm:col-span-6">
          <p className="font-semibold text-[var(--darkest-teal)] custom-style">Claim Partner Addresses for Operator</p>
          <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">
            From the list of addresses claim those for the Operator.  Additional addresses can be added below.  Only unclaimed addresses are visible.
          </p>
        </div>

        <form className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl sm:col-span-6">
          <div >
            <PartnerToOperatorGrid
            singleOpID={true}
            currentOpID={operatorToEdit.apc_id!}>
            </PartnerToOperatorGrid>
          </div>
        </form>
        
      </div>
      
    </div>
    )}
    <ToastContainer />
    </>
  )
}
