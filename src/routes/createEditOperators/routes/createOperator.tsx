
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { type OperatorType, type AFESourceSystemType, type AddressType } from 'src/types/interfaces';
import { useEffect, useState } from 'react';
import { addOperatorAdressSupabase, addOperatorPartnerAddressSupabase, addOperatorSupabase, addPartnerSupabase } from 'provider/write';
import { isAddressValid, isOperatorValid } from 'src/helpers/helpers';
import PartnerToOperatorGrid from 'src/routes/partnerToOperatorGrid';
import { ToastContainer } from 'react-toastify';
import { notifyStandard, warnUnsavedChanges } from "src/helpers/helpers";
import { fetchSourceSystems } from 'provider/fetch';
import { transformAddressSupabase, transformOperatorSingle, transformPartnerSingle, transformSourceSystemSupabase } from 'src/types/transform';
import NoSelectionOrEmptyArrayMessage from 'src/routes/sharedComponents/noSelectionOrEmptyArrayMessage';

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
    let nonOpAddressBlank : AddressType = {
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
    const [singleNonOpAddress, setSingleNonOpAddress] = useState<AddressType>(nonOpAddressBlank);
    const [nonOpAddressList, setNonOpAddressList] = useState<AddressType[] | []>([]);
    const [showSaved, setShowSaved] = useState<boolean>(false);
    const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);
    const [operatorWriteErrorMessage, setOperatorWriteErrorMessage] = useState<string | null>(null);
    const [partnerWriteErrorMessage, setPartnerWriteErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        async function getSourceSystemList() {
          try {
            const sourceSystemResult = await fetchSourceSystems();
    
            if (isMounted) {
              if (!sourceSystemResult.ok) {
                throw new Error(sourceSystemResult.message);
              }
              const sourceSystemResultTransformed = transformSourceSystemSupabase(sourceSystemResult.data);
              const blankOption: AFESourceSystemType = {
                id: 0,
                system: '',
              };
            const extendedList = [blankOption, ...sourceSystemResultTransformed];
            setSourceSystems(extendedList);
            }
          } catch (error) {
    
            if (isMounted) {
              const blankOption: AFESourceSystemType = {
                id: 0,
                system: '',
              };
              setFetchErrorMessage(error as string);
              setSourceSystems([blankOption]);
            }
          } finally {
            if (isMounted) {
              return;
            }
          }
        }
        getSourceSystemList();
        return () => {
          isMounted = false;
        };
      }, []);
  
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
    setSingleNonOpAddress({
      ...singleNonOpAddress,
      [e.target.name]: e.target.value
    })
  }
  async function handleClickSaveOpName() {
    if (!operator.name || !operator.source_system || operator.source_system === 0) {
      setOperatorWriteErrorMessage('The Operator name or Source System is not valid and the record cannot be written');  
      return;
    }

    try {
      const insertOperatorResult = await addOperatorSupabase(operator.name, operator.source_system);
      
      if (!insertOperatorResult.ok) {
        throw new Error(insertOperatorResult.message);
      }
        const transformedOperatorResult = transformOperatorSingle(insertOperatorResult.data);
        setOperator(transformedOperatorResult); 
        setShowSaved(true);
        
       if (  
          transformedOperatorResult.id === undefined || !isAddressValid(operatorBillingAddress)
        ) {
          setOperatorWriteErrorMessage("The Operator ID or Billing Address is not valid and the Billing Address cannot be written");
          return;
        }

        try {
              const operatorAddressRecord = await addOperatorAdressSupabase(transformedOperatorResult.id, operatorBillingAddress);
            
              if(!operatorAddressRecord.ok) {

                throw new Error(operatorAddressRecord.message);

              }

              const trasnformedAddress = transformAddressSupabase(operatorAddressRecord.data);
              setOpBillAddress(trasnformedAddress);
            
              } catch (error) {
                  setOperatorWriteErrorMessage('Could not write the Operator Billing Address: '+error)
                } 
        
    } catch (error) {
      setOperatorWriteErrorMessage("Failed to add operator: "+error);
    }
  }
  async function handleClickSaveAnother() {
    if(operator.name === '' || operator.name === null || operator.name === undefined || operator.id === undefined) 
    {
      setPartnerWriteErrorMessage('Missing Operator IDs; Cannot write related record')
      return;
    }
    
    try {
      const insertPartnerResult = await addPartnerSupabase(operator.name, operator.id);

      if(insertPartnerResult.ok) {

        const transformedPartnerResult = transformPartnerSingle(insertPartnerResult.data);

        if(transformedPartnerResult.id === undefined || !isAddressValid(singleNonOpAddress)) {
          setPartnerWriteErrorMessage('The Partner ID or the Address is not valid and the record cannot be written');
          return;
        
        }
        try {

          const operatorNonOpAddressRecord = await addOperatorPartnerAddressSupabase(transformedPartnerResult.id, singleNonOpAddress);

          if (!operatorNonOpAddressRecord.ok) {

            throw new Error(operatorNonOpAddressRecord.message as string);

          }

        const trasnformedAddress = transformAddressSupabase(operatorNonOpAddressRecord.data);
        
        setSingleNonOpAddress(trasnformedAddress);

        setNonOpAddressList([
          ...nonOpAddressList,
          trasnformedAddress
        ]);

        setSingleNonOpAddress(nonOpAddressBlank);

        } catch(error) {
          setPartnerWriteErrorMessage("Failed to add Operator Non Op Address: "+error);
        }

      }

      if(!insertPartnerResult.ok) {
        throw new Error(insertPartnerResult.message);
      }
    } catch(error) {
      setPartnerWriteErrorMessage("Failed to add Partner Record: "+error);
    }
  }
  
  return (
    <>
    <div className="px-4 sm:px-10 sm:py-4 divide-y divide-[var(--darkest-teal)]/40">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-7">
        <div className="px-4 sm:px-0 md:col-span-2">
          <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Operator Information</h2>
          <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">
            Create Operator with the billing address.  Below add additional addresses to be used as Partner addresses
          </p>
        </div>
        <form className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 md:col-span-5">
          <div className="px-4 py-2 mb-4">
            <div className="grid max-w-5xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
              <div className="sm:col-span-3">
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
                      value={operator.name}
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
                    value={operatorBillingAddress.street}
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
                    value={operatorBillingAddress.suite}
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
                    value={operatorBillingAddress.city}
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
                    value={operatorBillingAddress.state}
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
                    value={operatorBillingAddress.zip}
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
                    value={operatorBillingAddress.country}
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
                <div className="sm:col-span-2 sm:col-start-4">
                <label htmlFor="sourceSystem" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Source System for AFEs
                </label>
                <div className="grid grid-cols-1 mt-1">
                  <select
                    id="sourceSystem"
                    name="source_system"
                    autoComplete="off"
                    value={operator.source_system}
                    onChange={handleOperatorNameChange}
                    className="col-start-1 row-start-1 w-full appearance-none w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text">
                    {sourceSystems.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.system}
                    </option>
                ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-[var(--darkest-teal)] sm:size-4"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end border-t border-t-[var(--darkest-teal)]/30 px-4 py-4 sm:px-8">
            <button
              //type="submit"
              disabled={!isOperatorValid(operator) || !isAddressValid(operatorBillingAddress) || operatorWriteErrorMessage !==null}
              onClick={async(e: any) => { 
                e.preventDefault();
                handleClickSaveOpName();
                notifyStandard(`Operator name and billing address have been saved  Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE saved)`);}}
              className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
              Save
            </button>
          </div>
          <div hidden={!showSaved}
          className="border-t border-t-[var(--darkest-teal)]/30 p-1 text-base/7 font-semibold text-[var(--darkest-teal)] custom-style text-center">
          Operator has been saved.</div>
          <div hidden={fetchErrorMessage === null}
          className="border-t border-t-[var(--darkest-teal)]/30 p-1 bg-[var(--bright-pink)] text-base/7 font-semibold text-[var(--darkest-teal)] custom-style text-center">
          <NoSelectionOrEmptyArrayMessage
          message={'There was an issue getting the source systm list: '+fetchErrorMessage}
          ></NoSelectionOrEmptyArrayMessage>
          </div>
          <div hidden={operatorWriteErrorMessage === null}
          className="border-t border-t-[var(--darkest-teal)]/30 p-1 bg-[var(--bright-pink)] text-base/7 font-semibold text-[var(--darkest-teal)] custom-style text-center">
          <NoSelectionOrEmptyArrayMessage
          message={'There was an error writing the Operator Record or the Operator Billing Address: '+operatorWriteErrorMessage}
          ></NoSelectionOrEmptyArrayMessage>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-7">
        <div className="px-4 sm:px-0 md:col-span-2">
          <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Claim Partner Addresses for Operator</h2>
          <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">
            From the list of addresses claim those for the Operator.  Additional addresses can be added below.  Only unclaimed addresses are visible.
          </p>
        </div>

        <form className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 p-1 mb-5 md:col-span-5">
          <div >
            <PartnerToOperatorGrid
            currentOpID={ operator.id ? operator.id : null }>
            </PartnerToOperatorGrid>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-7">
        <div className="px-4 sm:px-0 md:col-span-2">
          <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Operator Addresses as a Partner</h2>
          <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">
            Add Addresses to be used when the Operator is a Partner.  Add the billing address (again) if applicable.
          </p>
          
          
          <ul role="list" hidden={nonOpAddressList !== null && nonOpAddressList.length > 0 ? false : true}>
            <div 
          className="mt-6 border-t border-t-[var(--darkest-teal)]/40 p-1 text-base/7 font-semibold text-[var(--darkest-teal)] custom-style ">
          The addresses below have been saved</div>
            {nonOpAddressList?.map((address) => (
              <ol key={address.id} className="p-1 text-sm/6 font-normal text-[var(--darkest-teal)] custom-style ">
                {address.street} {address.suite} {address.city} {address.state} {address.zip} 
                </ol>
            ))}

          </ul>
        </div>

        <form className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 md:col-span-5">
          <div className="px-4 py-2 mb-4">
            <div className="grid max-w-5xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
              
              <div className="sm:col-span-4 sm:col-start-1">
                <label htmlFor="additionalStreet" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Street Address
                </label>
                <div className="mt-1">
                  <input
                    id="additionalStreet"
                    name="street"
                    type="text"
                    value={singleNonOpAddress.street}
                    onChange={handlePartnerAddressChange}
                    autoComplete="off"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="additionalSuite" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Suite
                </label>
                <div className="mt-1">
                  <input
                    id="additionalSuite"
                    name="suite"
                    type="text"
                    autoComplete="off"
                    value={singleNonOpAddress.suite}
                    onChange={handlePartnerAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="additionalCity" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  City
                </label>
                <div className="mt-1">
                  <input
                    id="additionalCity"
                    name="city"
                    type="text"
                    autoComplete="off"
                    value={singleNonOpAddress.city}
                    onChange={handlePartnerAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="additionalState" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  State / Province
                </label>
                <div className="mt-1">
                  <input
                    id="additionalState"
                    name="state"
                    type="text"
                    autoComplete="off"
                    value={singleNonOpAddress.state}
                    onChange={handlePartnerAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="additionalZip" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  ZIP / Postal Code
                </label>
                <div className="mt-1">
                  <input
                    id="additionalZip"
                    name="zip"
                    type="text"
                    autoComplete="off"
                    value={singleNonOpAddress.zip}
                    onChange={handlePartnerAddressChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="additionalCountry" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Country
                </label>
                <div className="grid grid-cols-1 mt-1">
                  <select
                    id="additionalCountry"
                    name="country"
                    autoComplete="off"
                    value={singleNonOpAddress.country}
                    onChange={handlePartnerAddressChange}
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
            </div>
          </div>
          <div className="flex items-center justify-end border-t border-t-[var(--darkest-teal)]/30 px-4 py-4 sm:px-8">
            <button
              disabled={!operator.id || !isAddressValid(singleNonOpAddress)}
              onClick={async(e: any) => { 
                e.preventDefault();
                handleClickSaveAnother(); 
                notifyStandard(`Operator partner address has been saved  Let's call it a clean tie-in.\n\n(TLDR: Operator partner address IS saved)`);
            }}
              className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
              Save 
            </button>
          </div>
          <div hidden={partnerWriteErrorMessage === null}
          className="border-t border-t-[var(--darkest-teal)]/30 p-1 bg-[var(--bright-pink)] text-base/7 font-semibold text-[var(--darkest-teal)] custom-style text-center">
          <NoSelectionOrEmptyArrayMessage
          message={'There was an error writing the Operators Partner Record or Address: '+operatorWriteErrorMessage}
          ></NoSelectionOrEmptyArrayMessage>
          </div>
        </form>
      </div>
    </div>
    <ToastContainer />
            {warnUnsavedChanges((operator.name !=='' && operator.id !=='' && !showSaved), "You have not saved the Operator")}
    </>
  )
}
