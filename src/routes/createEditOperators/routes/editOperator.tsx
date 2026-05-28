import { type AddressType, type OperatorPartnerRecord, type PartnerRecordToDisown, type RoleEntryRead } from 'src/types/interfaces';
import { useEffect, useState } from 'react';
import { addOperatorPartnerAddressSupabase, addPartnerSupabase, updateOperatorAddress, updateOperatorNameAndStatus, updatePartnerAddress, updatePartnerNameAndStatus, updatePartnerWithOpID, writeToFunctionLogs } from 'provider/write';
import PartnerToOperatorGrid from 'src/routes/partnerToOperatorGrid';
import { ToastContainer } from 'react-toastify';
import { notifyFailure, notifyStandard } from "src/helpers/helpers";
import { OperatorNonOperatorAddressCard } from './helpers/addressCard';
import NoSelectionOrEmptyArrayMessage from 'src/routes/sharedComponents/noSelectionOrEmptyArrayMessage';
import { transformPartnerSingle } from 'src/types/transform';

type EditOperatorProps = {
    token: string;
    opToEdit: RoleEntryRead;
    NonOpAddress: RoleEntryRead[];
};

export default function EditOperator({token, opToEdit, NonOpAddress} : EditOperatorProps) {
    //Imported variables
    const [opRecordToEdit, setOpRecordToEdit] = useState<RoleEntryRead>(opToEdit);
    const [relatedNonOpAddress, setRelatedNonOpAddress] = useState<RoleEntryRead[]>(NonOpAddress);  
    
    //Track if there are changes to the Operator Name and Address
    const [saveOpNameChange, setSaveOpNameChange] = useState(false);
    const [saveOpAddressChange, setSaveOpAddressChange] = useState(false);

    //Track Changes to the NonOp Name and Address
    const [nonOpAddressUpdate, setNonOpAddressUpdate] = useState<boolean[] | []>([]);
    const [nonOpNameUpdate, setNonOpNameUpdate] = useState<boolean[] | []>([]);

    //Add a New Address
    const [newNonOpAddress, setNewNonOpAddress] = useState<Partial<RoleEntryRead>>({
      apc_name: '',
      apc_name_active: true,
      apc_op_id: opToEdit.apc_id,
      apc_address: {
        id: 0,
        street: '',
        suite:'',
        city: '',
        state: '',
        zip: '',
        country: '',
        address_active: true,
      } as AddressType,
    });
    const [saveNewNonOpAddress, setSaveNewNonOpAddress] = useState(false);

    //Disown the Non Op Address
    const [partnerList, setPartnerList] = useState<OperatorPartnerRecord[] | []>([]);    
    const [partnerListToDisown, setPartnerListToDisown] = useState<PartnerRecordToDisown[]>([]);

    
//Use Effect to set the Operator Record that is being edited, the Partner List and the array to know which Partner may have changed    
    useEffect(() => {
        if(!opToEdit) return;

        async function setOperatorAndPartners() {

            const falseArray = new Array(relatedNonOpAddress.length).fill(false);

            setNonOpAddressUpdate(falseArray);
            setNonOpNameUpdate(falseArray);
        }
        setOperatorAndPartners();
    }, [opToEdit]);

  function handleOperatorNameChange(e: { target: { name: any; value: any; }; }) {
    
    setSaveOpNameChange(true);
    setOpRecordToEdit({
      ...opRecordToEdit,
      [e.target.name]: e.target.value
    })
    
  };
  function handleOperatorAddressChange(e: { target: { name: any; value: any; }; }) {
    
    setSaveOpAddressChange(true);
    setOpRecordToEdit({
      ...opRecordToEdit,
      apc_address: {
        ...opRecordToEdit.apc_address,
        [e.target.name]: e.target.value
    }
    })
  };
  function handleNonOpNameChange(e: { target: { name: any; value: any; }; }, partnerIdx: number) {
    setNonOpNameUpdate(prevnonOpNameUpdate =>
        prevnonOpNameUpdate.map((item, index) =>
        index === partnerIdx
            ? true : item
        )
    );
    
    setRelatedNonOpAddress(prevPartnerList => 
    prevPartnerList.map((partner, index) =>  
      index === partnerIdx 
        ? { ...partner, [e.target.name]: e.target.value }
        : partner
        )
    );
    
  };
  function handleNonOpAddressChange(e: { target: { name: any; value: any; }; }, partnerIdx: number) {
    setNonOpAddressUpdate(prevnonOpAddressUpdate =>
        prevnonOpAddressUpdate.map((item, index) =>
        index === partnerIdx
            ? true : item
        )
    );
    setRelatedNonOpAddress(prevPartnerList => 
    prevPartnerList.map((partner, index) =>  
      index === partnerIdx 
        ? { ...partner, apc_address: {
          ...partner.apc_address,
          [e.target.name]: e.target.value }
        }
        : partner
        )
    );
  };
  function handleNewNonOpName(e: { target: { name: any; value: any; }; }) {
    
    const updated = {
       ...newNonOpAddress,
      [e.target.name]: e.target.value
    };
    setNewNonOpAddress(updated);
    setSaveNewNonOpAddress(isValidNewRecord(updated));
    
  };
  function handleNewNonOpAddressChange(e: { target: { name: any; value: any; }; }) {
    
    const updated = {
        ...newNonOpAddress,
        apc_address: {
            ...newNonOpAddress.apc_address,
            [e.target.name]: e.target.value
        } as AddressType,
    };
    setNewNonOpAddress(updated);
    setSaveNewNonOpAddress(isValidNewRecord(updated));
  };
  //Check if new record is valid before allowing for a save
  function isValidNewRecord(record: Partial<RoleEntryRead>): boolean {
    return !!(
      record.apc_name &&
      record.apc_address?.street &&
      record.apc_address?.city &&
      record.apc_address?.state &&
      record.apc_address?.zip &&
      record.apc_address?.country
    );
  };
   
  //Save changes to the DB
  async function handleClickSaveChanges(mode: string, nonOpIndex: number) {
    if(mode === 'Operated') {
    if(saveOpNameChange) {
      const saveOpNameChangeResult = await handleClickSaveOpName();
      handlenotification(saveOpNameChangeResult.ok, mode, opRecordToEdit.active, 'name change');
    }

    if(saveOpAddressChange) {
      const saveOpAddressChange = await handleClickSaveOpAddress();
      handlenotification(saveOpAddressChange.ok, mode, opRecordToEdit.apc_address.address_active, 'address change');
    }
    
    } if(mode === 'Non-Operated') {
    if(nonOpNameUpdate[nonOpIndex]) {
    const saveNonOpNameResult = await handleClickSaveNonOpName(relatedNonOpAddress[nonOpIndex],nonOpIndex);
    handlenotification(saveNonOpNameResult.ok, mode, true, 'name change');
    }

    if(nonOpAddressUpdate[nonOpIndex]) {
      const saveNonOpAddressResult = await handleClickSaveNonOpAddress(relatedNonOpAddress[nonOpIndex],nonOpIndex);
      handlenotification(saveNonOpAddressResult.ok, mode, true, 'address change');
    }

  } else if(mode === 'New Non-Operated') {
    handleClickSaveNewNonOp();
  }
  };
  async function handleClickSaveOpName() {
    try {
      const operatorToEdit = await updateOperatorNameAndStatus(opRecordToEdit.apc_name, opRecordToEdit.active, opRecordToEdit.apc_id!);

      if(!operatorToEdit.ok) {
        throw new Error(operatorToEdit.message);
      }
      setSaveOpNameChange(false);
      return operatorToEdit;

    } catch (error) {
      return {ok: false, message: error};
    } 
  };
  async function handleClickSaveOpAddress() {
    try {
      const operatorAddress = await updateOperatorAddress(opRecordToEdit.apc_address);
      
      if(!operatorAddress.ok) {
        throw new Error(operatorAddress.message)
      } 
      setSaveOpAddressChange(false);
      return operatorAddress;
    } catch (error) {
      return {ok: false, message: error};
    }
  };
  async function handleClickActivateOrDeactivateOperator() {
    if (!opToEdit.apc_id || !opToEdit.apc_address_id) return;

    const updatedOperator = {
      ...opToEdit,
      apc_name_active: !opToEdit.apc_name_active,
      apc_address: {
        ...opToEdit.apc_address,
        address_active: !opToEdit.apc_address.address_active
      }
    };

    setOpRecordToEdit(updatedOperator);

    try {

      const operatorStatusChangeResult = await updateOperatorNameAndStatus(updatedOperator.apc_name, updatedOperator.apc_name_active!, updatedOperator.apc_id);

      if (!operatorStatusChangeResult.ok) {
        throw new Error(operatorStatusChangeResult.message);
      }

      handlenotification(true, 'Operated', updatedOperator.apc_name_active, "active change");

    } catch (error) {
      handlenotification(false, 'Operated', updatedOperator.apc_name_active, "active change");
    }
  };

  async function handleClickSaveNonOpName(nonOpRecord: RoleEntryRead, partnerIdx?: number) {
    try {
      const partnerToEdit = await updatePartnerNameAndStatus(nonOpRecord);
      
      if(!partnerToEdit.ok) {
        throw new Error(partnerToEdit.message as any).message
      }
      setNonOpNameUpdate(prevnonOpNameUpdate =>
        prevnonOpNameUpdate.map((item, index) =>
        index === partnerIdx
            ? false : item
        )
    );
    return partnerToEdit;
    
    } catch (error) {
      return {ok: false, message: error};
    }
  };
  async function handleClickSaveNonOpAddress(nonOpRecord: RoleEntryRead, partnerIdx?: number) {
    try {
      const partnerAddress = await updatePartnerAddress(nonOpRecord.apc_address);
      
      if(!partnerAddress.ok) {
        throw new Error(partnerAddress.message as any).message
      } 
      setNonOpAddressUpdate(prevnonOpAddressUpdate =>
        prevnonOpAddressUpdate.map((item, index) =>
        index === partnerIdx
            ? false : item
        )
    );
    return partnerAddress;
    
    } catch (error) {
      return {ok: false, message: error};
    }
  };
  async function handleClickSaveNewNonOp() {
    try {
          const insertPartnerResult = await addPartnerSupabase(newNonOpAddress.apc_name!, newNonOpAddress.apc_op_id!, newNonOpAddress.apc_address!);
    
          if(insertPartnerResult.ok) {
            setSaveNewNonOpAddress(false);
              handlenotification(true, "Non-Operated", true, 'name change');
            
          }
    
          if(!insertPartnerResult.ok) {
            throw new Error(insertPartnerResult.message);
          }
        } catch(error) {
          handlenotification(false, error as string, true, 'name change');
        }
  };

  async function handleClickActivateOrDeactivateNonOpRecord(nonOpIdx: number) {
    
  const partnerToUpdate = relatedNonOpAddress[nonOpIdx];
  const updatedPartner = {
    ...partnerToUpdate,
    apc_name_active: !partnerToUpdate.apc_name_active,
    apc_address: {
        ...partnerToUpdate.apc_address,
        address_active: !partnerToUpdate.apc_address.address_active
    }
  };
  
  setRelatedNonOpAddress(prevPartnerList => 
    prevPartnerList.map((partner, index) =>  
      index === nonOpIdx 
        ? updatedPartner
        : partner
    )
  );
  
  try {
    
   const partnerStatusChange = await updatePartnerNameAndStatus(updatedPartner);

    if(!partnerStatusChange.ok) {
        throw new Error(partnerStatusChange.message as any).message;
    }
    
    handlenotification(true, 'Non-Operated', updatedPartner.apc_name_active, "active change");
    
  } catch (error) {
      handlenotification(false, 'Non-Operated', updatedPartner.apc_name_active, "active change");
     
    }
  };

  //Disown Partner
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
  
 
  };
  async function updatePartnerWithOpIDChange() {
          updatePartnerWithOpID(partnerListToDisown)
  };
  async function handleClickDisownPartner(partnerIdx: number, id: string) {
  await handleDisownPartner(partnerIdx,id);
  await updatePartnerWithOpIDChange();
  };

  function handlenotification(success: boolean, mode:string, active: boolean, action: 'name change' | 'address change' | 'active change') {
    if(action === 'active change') {
    if(!success) {
      notifyFailure(`${mode} name and billing address have NOT been ${active ? 'activated' : 'deactivated'}. No tie-in.\n\n(TLDR: Operator and billing address are NOT ${active ? 'activated' : 'deactivated'}.)`);
    }
    if(success) {
      notifyStandard(`${mode} name and billing address have been ${active ? 'activated' : 'deactivated'}. Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE ${active ? 'activated' : 'deactivated'}.)`);
    }
  }
  if(action === 'address change' || action === 'name change') {
    if(!success) {
      notifyFailure(`${mode} name and billing address have NOT been saved. No tie-in.\n\n(TLDR: Operator and billing address are NOT saved.)`);
    }
    if(success) {
      notifyStandard(`${mode} name and billing address have been saved. Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE saved.)`);
    }
  }
  };

  return (
    <>
    {opToEdit === null || !opToEdit.apc_id || !opToEdit ? (<div className="flex items-start justify-start bg-white shadow-m ring-1 ring-[var(--darkest-teal)]/70 sm:rounded-xl">
    <p className="custom-style font-semibold text-[var(--darkest-teal)]">No Operator Selected</p>
    </div>) : (
          <div className="">
            <div className='rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 mb-4'>
            <OperatorNonOperatorAddressCard
            record={opRecordToEdit}
            saveButtonDisabledOp={!saveOpNameChange && !saveOpAddressChange}
            onSave={() => [
              handleClickSaveChanges('Operated',0),
            ]}
            onActivateDeactivate={() => [
              handleClickActivateOrDeactivateOperator()
            ]}
            onNameChange={(e) => handleOperatorNameChange(e)}
            onAddressChange={(e) => handleOperatorAddressChange(e)}
            mode='Operated'
            ></OperatorNonOperatorAddressCard>
            </div>
            <div className='rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 mb-4'>
              <div className="p-4 border-b border-[var(--darkest-teal)]/30">
                <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Edit the Operator Addresses for Non-Op AFEs</h2>
              </div>
              <div hidden={ relatedNonOpAddress.length > 0 } className='w-3/4 mx-auto px-2 py-4'>
                <NoSelectionOrEmptyArrayMessage
                message="There are no Non-Op Addresses that you have permissions to edit."
                ></NoSelectionOrEmptyArrayMessage>
              </div>
              {relatedNonOpAddress.map((partner, partnerIdx) => (
                <div key={partner.apc_id}>
                  <OperatorNonOperatorAddressCard
            record={partner}
            saveButtonDisabledOp={!nonOpNameUpdate[partnerIdx] && !nonOpAddressUpdate[partnerIdx]}
            onSave={() => [
              handleClickSaveChanges('Non-Operated',partnerIdx),
            ]}
            onActivateDeactivate={() => [
              handleClickActivateOrDeactivateNonOpRecord(partnerIdx)
            ]}
            onNameChange={(e) => handleNonOpNameChange(e, partnerIdx)}
            onAddressChange={(e) => handleNonOpAddressChange(e, partnerIdx)}
            mode='Non-Operated'
            ></OperatorNonOperatorAddressCard>
                </div>
              ))}
            </div>
              <div className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 mb-4">
              <div className="p-4 border-b border-[var(--darkest-teal)]/30">
                <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Claim Partner Addresses for Operator</h2>
                <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text">
                  From the list of addresses claim those for the Operator.  Additional addresses can be added below.  Only unclaimed addresses are visible.
                </p>
              </div>
                <div >
                  <PartnerToOperatorGrid
                    currentOpID={ opToEdit.apc_id }
                    token={token}>
                  </PartnerToOperatorGrid>
                </div>
              </div>
            <div className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 mb-4">
            <div className="p-4 border-b border-[var(--darkest-teal)]/30">
                <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Add New Addresses for Non-Op AFEs</h2>
              </div>
              <OperatorNonOperatorAddressCard
            record={newNonOpAddress as RoleEntryRead}
            saveButtonDisabledOp={!saveNewNonOpAddress}
            onSave={() => [
              handleClickSaveChanges('New Non-Operated',0),
            ]}
            onActivateDeactivate={() => [
              handleClickActivateOrDeactivateOperator()
            ]}
            onNameChange={(e) => handleNewNonOpName(e)}
            onAddressChange={(e) => handleNewNonOpAddressChange(e)}
            mode='New Non-Operated'
            ></OperatorNonOperatorAddressCard>
              
            </div>
          </div>
    )}
    <ToastContainer icon={false}/>
    </>
  )
}
