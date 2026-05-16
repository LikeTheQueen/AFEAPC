
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { type OperatorType, type AddressType } from 'src/types/interfaces';
import { useState } from 'react';
import { addUnrelatedPartnerSupabase } from 'provider/write';
import { isAddressValid, notifyFailure } from 'src/helpers/helpers';
import { ToastContainer } from 'react-toastify';
import { notifyStandard } from "src/helpers/helpers";
import NoSelectionOrEmptyArrayMessage from 'src/routes/sharedComponents/noSelectionOrEmptyArrayMessage';
import { useSupabaseData } from 'src/types/SupabaseContext';
import { supportEmail } from 'src/constants/variables';
import PartnerFileUploadAFEAPC from './createNewPartnerBulk';

export default function CreateOperator() {
    let operatorBlank : OperatorType = {
      name:''
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
    
    const { loggedInUser } = useSupabaseData();
    const [partner, setPartner] = useState<OperatorType>(operatorBlank);
    const [partnerAddress, setPartnerAddress] = useState<AddressType>(opAddressBlank);
    const [showSaved, setShowSaved] = useState<boolean>(false);
    const [operatorWriteErrorMessage, setPartnerWriteErrorMessage] = useState<string | null>(null);

  function handleAddressChange(e: { target: { name: any; value: any; }; }) {
    setPartnerAddress({
      ...partnerAddress,
      [e.target.name]: e.target.value
    })
  };
  function handlePartnerNameChange(e: { target: { name: any; value: any; }; }) {
    setPartner({
      ...partner,
      [e.target.name]: e.target.value
    })
  };
  
  async function handleClickSavePartnerName() {
  // Validate everything upfront before any writes
  if (!partner.name ) {
    setPartnerWriteErrorMessage('The Partner name is not valid');
    return;
  }

  if (!isAddressValid(partnerAddress)) {
    setPartnerWriteErrorMessage('The address is not valid');
    return;
  }

  try {
    
    const insertPartnerResult = await addUnrelatedPartnerSupabase(
      partner.name, partnerAddress
    );
    if (!insertPartnerResult.ok) throw new Error(insertPartnerResult.message);
    notifyStandard(`Partner name and address have been saved  Let's call it a clean tie-in.\n\n(TLDR: Partner and their address ARE saved)`);
    setShowSaved(true);

  } catch (error) {
    setPartnerWriteErrorMessage('Failed to save Partner: ' + error);
    notifyFailure(`Partner name and address have NOT been saved  Let's call it a busted pipe.\n\n(TLDR: Partner and their address are NOT saved)`)
  }
  };
  
  
  return (
    <>
    <div hidden={loggedInUser?.is_super_user} className="flex max-w-7xl mx-auto justify-center px-4 sm:pt-[33vh] sm:py-4">
    <NoSelectionOrEmptyArrayMessage
   message={
        <>
            Oh hey there <span className="font-bold">{loggedInUser?.firstName} {loggedInUser?.lastName}</span>! Nice to see you here but you do not actually have permissions to add Partners. For that you will need to reach out to AFE Partner Connections. Drop us a line on the Contact Support page or send an email to {supportEmail}
        </>
    }>
    </NoSelectionOrEmptyArrayMessage>
    </div>
    <div hidden={!loggedInUser?.is_super_user || !loggedInUser} className="px-4 sm:px-10 sm:py-4 divide-y divide-[var(--darkest-teal)]/40">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-7">
        <div className="px-4 sm:px-0 md:col-span-2">
          <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Partner Information</h2>
          <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">
            Add the Partner name and address.  Partners created here will be unrelated to any Operators.  They are used for mapping the Operator's Partner Library to AFE Partner Connections.  Partner Addresses created without an Operator can be claimed by an Operator when they are added to AFE Parner Connections.
          </p>
        </div>
        <form className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 md:col-span-5">
          <div className="px-4 py-2 mb-4">
            <div className="grid max-w-5xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                  Partner Name
                </label>
                <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Nav Oil Inc."
                      autoComplete="off"
                      value={partner.name}
                      onChange={handlePartnerNameChange}
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
                    value={partnerAddress.street}
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
                    value={partnerAddress.suite}
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
                    value={partnerAddress.city}
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
                    value={partnerAddress.state}
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
                    value={partnerAddress.zip}
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
                    value={partnerAddress.country}
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
            </div>
          </div>
          <div className="flex items-center justify-end border-t border-t-[var(--darkest-teal)]/30 px-4 py-4 sm:px-8">
            <button
              //type="submit"
              disabled={!isAddressValid(partnerAddress) || operatorWriteErrorMessage !==null}
              onClick={async(e: any) => { 
                e.preventDefault();
                handleClickSavePartnerName();
                }}
              className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
              Save
            </button>
          </div>
          <div hidden={!showSaved}
          className="border-t border-t-[var(--darkest-teal)]/30 p-1 text-base/7 font-semibold text-[var(--darkest-teal)] custom-style text-center">
          Partner has been saved.</div>
          
          <div hidden={operatorWriteErrorMessage === null}
          className="border-t border-t-[var(--darkest-teal)]/30 p-1 bg-[var(--bright-pink)] text-base/7 font-semibold text-[var(--darkest-teal)] custom-style text-center">
          <NoSelectionOrEmptyArrayMessage
          message={'There was an error writing the Partner Record or the Partner Address: '+operatorWriteErrorMessage}
          ></NoSelectionOrEmptyArrayMessage>
          </div>
        </form>
        <div className="px-4 sm:px-0 md:col-span-7">
        <PartnerFileUploadAFEAPC></PartnerFileUploadAFEAPC>
        </div>
      </div>
      
    </div>
    <ToastContainer icon={false} />
    </>
  )
}
