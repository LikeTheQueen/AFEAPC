import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { type AFESourceSystemType, type OperatorPartnerAddressType, type OperatorPartnerRecord, type OperatorRecordWithNonOpAddresses, type PartnerRecordToDisown } from 'src/types/interfaces';
import { useEffect, useState } from 'react';
import { insertPartnerRecord, updateOperatorAddress, updateOperatorNameAndStatus, updatePartnerAddress, updatePartnerNameAndStatus, updatePartnerWithOpID } from 'provider/write';
import PartnerToOperatorGrid from 'src/routes/partnerToOperatorGrid';
import { ToastContainer } from 'react-toastify';
import { notifyStandard, warnUnsavedChanges } from "src/helpers/helpers";

type EditOperatorProps = {
    operatorToEdit: OperatorRecordWithNonOpAddresses;
    token: string;
};

export default function EditOperator({operatorToEdit, token} : EditOperatorProps) {
    
    const [saveOpNameChange, setSaveOpNameChange] = useState(false);
    const [saveOpAddressChange, setSaveOpAddressChange] = useState(false);
    const [operatorRecord, setOperatorRecord] = useState<OperatorRecordWithNonOpAddresses>(operatorToEdit);

    const [partnerList, setPartnerList] = useState<OperatorPartnerRecord[] | []>([]);
    const [partnerAddressUpdate, setPartnerAddressUpdate] = useState<boolean[] | []>([]);
    const [partnerNameUpdate, setPartnerNameUpdate] = useState<boolean[] | []>([]);
    const [partnerListToDisown, setPartnerListToDisown] = useState<PartnerRecordToDisown[]>([]);

    const [newPartnerAddress, setNewPartnerAddress] = useState<OperatorPartnerRecord | null>(null);
    const [saveNewPartnerAddress, setSaveNewPartnerAddress] = useState(false);

//Use Effect to set the Operator Record that is being edited, the Partner List and the array to know which Partner may have changed    
    useEffect(() => {
        if(!operatorToEdit) return;

        async function setOperatorAndPartners() {
            
            if(!operatorToEdit) return;

            setOperatorRecord(operatorToEdit);
            setPartnerList(operatorToEdit.partners);

            const falseArray = new Array(operatorToEdit.partners.length).fill(false);

            setPartnerAddressUpdate(falseArray);
            setPartnerNameUpdate(falseArray);
        }
        setOperatorAndPartners();
    }, [])
  
  function handleOperatorAddressChange(e: { target: { name: any; value: any; }; }) {
    setOperatorRecord({
      ...operatorRecord,
      [e.target.name]: e.target.value
    });
    setSaveOpAddressChange(true);
  }
  function handleOperatorNameChange(e: { target: { name: any; value: any; }; }) {
    setOperatorRecord({
      ...operatorRecord,
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
      const operatorToEdit = await updateOperatorNameAndStatus(operatorRecord, token);
      
      if(!operatorToEdit.ok) {
        throw new Error(operatorToEdit.message as any).message
      }
    
    } catch (error) {
      console.error("Failed to update Operator:", error);
    }
  }
  async function handleClickSaveOpAddress() {
    try {
      const operatorAddress = await updateOperatorAddress(operatorRecord, token);
      
      if(!operatorAddress.ok) {
        throw new Error(operatorAddress.message as any).message
      } 
    
    } catch (error) {
      console.error("Failed to update Operator Address:", error);
    }
  }
  async function handleClickActivateOrDeactivateOperator() {
    if(!operatorRecord.apc_id || !operatorRecord.apc_address_id) return;

    const updatedOperator = {
            ...operatorRecord,
        active: !operatorRecord.active,
        address_active: !operatorRecord.address_active
        };

    setOperatorRecord({
        ...operatorRecord,
        active: !operatorRecord.active,
        address_active: !operatorRecord.address_active
    })

    try {
        const [operatorStatusChange, operatorAddressStatusChange] = await Promise.all([
            updateOperatorNameAndStatus(updatedOperator, token),
            updateOperatorAddress(updatedOperator, token)
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
            ? false : item
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
            ? false : item
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
    active: !partnerToUpdate.address_active,
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
  async function handleDisownPartner(partnerIdx: number, id: string) {
    setPartnerListToDisown(prevPartnerListToDisown => {
            const updatedPartnerListToDisown = [...prevPartnerListToDisown];
            const existingIndex = updatedPartnerListToDisown.findIndex(
                entry => entry.id === id && entry.apc_op_id === null

            );
            if (existingIndex > -1) {
                updatedPartnerListToDisown.splice(existingIndex,1);
            } else {
                updatedPartnerListToDisown.push({
                    id: id,
                    apc_op_id: null

                })
            }
            return updatedPartnerListToDisown;
        });
  const partnerToUpdate = partnerList[partnerIdx];
  const updatedPartner = {
    ...partnerToUpdate,
    apc_op_id: null
  }
  setPartnerList(prevPartnerList => 
    prevPartnerList.map((partner, index) =>  
      index === partnerIdx 
        ? updatedPartner
        : partner
    )
  );
  
 
  }
  function handleNewAddressChange(e: { target: { name: any; value: any; }; }) {
    setNewPartnerAddress({
      ...newPartnerAddress,
      active: true,
      name: newPartnerAddress?.name ?? operatorRecord.name,
      address_active: true,
      apc_op_id: operatorRecord.apc_id,
      [e.target.name]: e.target.value!
    });
    setSaveNewPartnerAddress(true);
  };
  async function updatePartnerWithOpIDChange() {
          updatePartnerWithOpID(partnerListToDisown)
  };
  async function handleClickDisownPartner(partnerIdx: number, id: string) {
  await handleDisownPartner(partnerIdx,id);
  console.log(partnerListToDisown,'THE LIST TO DISOWN')
  await updatePartnerWithOpIDChange();
  };


  return (
    <>
    {!operatorToEdit ? (<div className="flex items-start justify-start bg-white shadow-m ring-1 ring-[var(--darkest-teal)]/70 sm:rounded-xl">
    <p className="custom-style font-semibold text-[var(--darkest-teal)]">No Operator Selected</p>
    </div>) : (
          <div className="">
            <form className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:grid-cols-6 mb-4">
              <div className="px-4 py-2">
                <div className="grid max-w-5xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                  <div className="sm:col-span-3 sm:col-start-1">
                    <label htmlFor="name" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                      Operator Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Nav Oil Inc."
                        autoComplete="off"
                        value={operatorRecord.name}
                        onChange={handleOperatorNameChange}
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
                        value={operatorRecord.street}
                        onChange={handleOperatorAddressChange}
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
                        value={operatorRecord.suite}
                        onChange={handleOperatorAddressChange}
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
                        value={operatorRecord.city}
                        onChange={handleOperatorAddressChange}
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
                        value={operatorRecord.state}
                        onChange={handleOperatorAddressChange}
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
                        value={operatorRecord.zip}
                        onChange={handleOperatorAddressChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-4 pb-2 sm:col-start-1">
                    <label htmlFor="country" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                      Country
                    </label>
                    <div className="mt-1 grid grid-cols-1">
                      <select
                        id="country"
                        name="country"
                        autoComplete="off"
                        value={operatorRecord.country}
                        onChange={handleOperatorAddressChange}
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
                  <div className="sm:col-span-2 flex items-end justify-end gap-x-6 pb-2">
                    <button
                      disabled={(!operatorRecord.apc_id && !operatorRecord.apc_address_id) ? true : false}
                      onClick={async (e: any) => {
                        e.preventDefault();
                        handleClickActivateOrDeactivateOperator();
                        notifyStandard(`Operator name and billing address have been ${operatorRecord.active ? 'deactivated' : 'activated'}.  Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE ${operatorRecord.active ? 'deactivated' : 'activated'}.)`);
                      }}
                      className={
                        `cursor-pointer disabled:cursor-not-allowed rounded-md disabled:bg-[var(--darkest-teal)]/20 px-3 py-2 text-sm/6 font-semibold custom-style shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] hover:bg-[var(--bright-pink)] hover:text-white hover:outline-[var(--bright-pink)]
                        ${!operatorRecord.active
                          ? 'bg-[var(--darkest-teal)] text-white outline-[var(--darkest-teal)] outline-1'
                          : 'bg-white text-[var(--darkest-teal outline-[var(--darkest-teal)] outline-1'}`
                      }>
                      {operatorRecord.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      name={`save-${operatorRecord.name}`}
                      disabled={(!operatorRecord.apc_id && !operatorRecord.apc_address_id) || (!saveOpNameChange && !saveOpAddressChange) ? true : false}
                      onClick={async (e: any) => {
                        e.preventDefault();
                        { saveOpNameChange ? handleClickSaveOpName() : null };
                        { saveOpAddressChange ? handleClickSaveOpAddress() : null };
                        setSaveOpAddressChange(false);
                        setSaveOpNameChange(false);
                        notifyStandard(`Operator name and billing address have been saved  Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE saved)`);
                      }}
                      className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div hidden={partnerList.length < 1 ? true : false}>
                <form className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:grid-cols-6 mb-4">
                  <div className="p-4 border-b border-[var(--darkest-teal)]/30">
                    <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Edit the Operator Addresses for Non-Op AFEs</h2>
                  </div>
                  {partnerList.map((partner, partnerIdx) => (
                  <div key={partner.apc_id} className="px-4 pt-4">
                    <div className="grid max-w-5xl grid-cols-1 gap-x-6 gap-y-2 pb-4 sm:grid-cols-6 border-b border-[var(--darkest-teal)]/40">
                      <div className="sm:col-span-3">
                        <label htmlFor={`partner-name-${partnerIdx}`} className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                          Name
                        </label>
                        <div className="mt-1">
                          <input
                            id={`partner-name-${partnerIdx}`}
                            name="name"
                            type="text"
                            placeholder="Nav Oil Inc."
                            autoComplete="off"
                            value={partner.name}
                            onChange={(e) => handlePartnerNameChange(e, partnerIdx)}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-4 sm:col-start-1">
                        <label htmlFor={`partner-street-${partnerIdx}`} className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                          Street Address
                        </label>
                        <div className="mt-1">
                          <input
                            id={`partner-street-${partnerIdx}`}
                            name="street"
                            type="text"
                            autoComplete="off"
                            value={partner.street}
                            onChange={(e) => handlePartnerAddressChange(e, partnerIdx)}
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
                            value={partner.suite}
                            onChange={(e) => handlePartnerAddressChange(e, partnerIdx)}
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
                            value={partner.city}
                            onChange={(e) => handlePartnerAddressChange(e, partnerIdx)}
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
                            value={partner.state}
                            onChange={(e) => handlePartnerAddressChange(e, partnerIdx)}
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
                            value={partner.zip}
                            onChange={(e) => handlePartnerAddressChange(e, partnerIdx)}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-4 pb-2 sm:col-start-1">
                        <label htmlFor="country" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                          Country
                        </label>
                        <div className="mt-1 grid grid-cols-1 ">
                          <select
                            id="country"
                            name="country"
                            autoComplete="off"
                            value={partner.country}
                            onChange={(e) => handlePartnerAddressChange(e, partnerIdx)}
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
                      <div className="sm:col-span-2 flex items-end justify-end gap-x-6 pb-2">
                        {/* Button to Deactive the Partner Name and Partner Address*/}
                        <button
                          //type="submit"
                          disabled={(!partner.apc_id && !partner.apc_address_id) ? true : false}
                          onClick={async (e: any) => {
                            e.preventDefault();
                            handleClickActivateOrDeactivatePartner(partnerIdx);
                            notifyStandard(`Operator's Partner name and address have been ${partner.address_active ? 'deactivated' : 'activated'}.  Let's call it a clean tie-in.\n\n(TLDR: Operator's Partner name and address ARE ${partner.address_active ? 'deactive' : 'active'})`);
                          }}
                          //className="  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]">
                          className={
                            `cursor-pointer disabled:cursor-not-allowed rounded-md disabled:bg-[var(--darkest-teal)]/20 px-3 py-2 text-sm/6 font-semibold custom-style shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] hover:bg-[var(--bright-pink)] hover:text-white hover:outline-[var(--bright-pink)]
                        ${!partner.address_active
                              ? 'bg-[var(--darkest-teal)] text-white outline-[var(--darkest-teal)] outline-1'
                              : 'bg-white text-[var(--darkest-teal outline-[var(--darkest-teal)] outline-1'}`
                          }>
                          {partner.address_active ? 'Deactivate' : 'Activate'}
                        </button>
                        {/* Button to Disown the Partner Name and Partner Address*/}
                        <button
                          //type="submit"
                          disabled={(!partner.apc_id && !partner.apc_address_id) ? true : false}
                          onClick={async (e: any) => {
                            e.preventDefault();
                            handleClickDisownPartner(partnerIdx, partner.apc_id!);
                            notifyStandard(`Operator's Partner name and address have been ${partner.address_active ? 'deactivated' : 'activated'}.  Let's call it a clean tie-in.\n\n(TLDR: Operator's Partner name and address ARE ${partner.address_active ? 'deactive' : 'active'})`);
                          }}
                          //className="  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]">
                          className='cursor-pointer disabled:cursor-not-allowed rounded-md disabled:bg-[var(--darkest-teal)]/20 px-3 py-2 text-sm/6 font-semibold custom-style shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] hover:bg-[var(--bright-pink)] hover:text-white hover:outline-[var(--bright-pink)] bg-[var(--darkest-teal)] text-white outline-[var(--darkest-teal)] outline-1'>
                          {'Disown'}
                        </button>
                        <button
                          //type="submit"
                          disabled={((!partner.apc_id && !partner.apc_address_id) || (partnerAddressUpdate[partnerIdx] === false && partnerNameUpdate[partnerIdx] === false)) ? true : false}
                          onClick={async (e: any) => {
                            e.preventDefault();
                            { partnerAddressUpdate[partnerIdx] === true ? handleClickSavePartnerAddress(partner, partnerIdx) : null };
                            { partnerNameUpdate[partnerIdx] === true ? handleClickSavePartnerName(partner, partnerIdx) : null }
                            notifyStandard(`Operator's Partner name and address have been saved  Let's call it a clean tie-in.\n\n(TLDR: Operator's Partner name and address ARE saved)`);
                          }}
                          className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                </form>
            </div>
            <div className="grid max-w-5xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
              <form className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:col-span-6 mb-4">
              <div className="p-4 border-b border-[var(--darkest-teal)]/30">
                <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Claim Partner Addresses for Operator</h2>
                <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text">
                  From the list of addresses claim those for the Operator.  Additional addresses can be added below.  Only unclaimed addresses are visible.
                </p>
              </div>
                <div >
                  <PartnerToOperatorGrid
                    currentOpID={ operatorToEdit.apc_id ? operatorToEdit.apc_id : null }>
                  </PartnerToOperatorGrid>
                </div>
              </form>
            </div>
            <form className="bg-white rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:grid-cols-6">
              <div className="px-4 py-2">
                <div className="mb-4 border-b border-[var(--darkest-teal)]/30">
                    <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Add New Addresses for Non-Op AFEs</h2>
                  </div>
                <div className="grid max-w-5xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                      Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Nav Oil Inc."
                        autoComplete="off"
                        value={newPartnerAddress?.name || ''}
                        onChange={handleNewAddressChange}
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
                        value={newPartnerAddress?.street || ''}
                        onChange={handleNewAddressChange}
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
                        value={newPartnerAddress?.suite || ''}
                        onChange={handleNewAddressChange}
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
                        value={newPartnerAddress?.city || ''}
                        onChange={handleNewAddressChange}
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
                        value={newPartnerAddress?.state || ''}
                        onChange={handleNewAddressChange}
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
                        value={newPartnerAddress?.zip || ''}
                        onChange={handleNewAddressChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-4 pb-2 sm:col-start-1">
                    <label htmlFor="country" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                      Country
                    </label>
                    <div className="mt-1 grid grid-cols-1 ">
                      <select
                        id="country"
                        name="country"
                        autoComplete="off"
                        value={newPartnerAddress?.country || ''}
                        onChange={handleNewAddressChange}
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
                  <div className="sm:col-span-2 flex items-end justify-end gap-x-6 pb-2">
                    <button
                      disabled={!saveNewPartnerAddress}
                      onClick={async (e: any) => {
                        e.preventDefault();
                        if (!newPartnerAddress) return;
                        insertPartnerRecord(newPartnerAddress, token);
                        setSaveNewPartnerAddress(false);
                        notifyStandard(`Operator's Partner name and address have been saved  Let's call it a clean tie-in.\n\n(TLDR: Operator's Partner name and address ARE saved)`);
                      }}
                      className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
    )}
    <ToastContainer />
    </>
  )
}
