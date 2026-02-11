import { fetchPartnersLinkedOrUnlinkedToOperator, fetchClaimProofPrompt, verifyClaimProof } from 'provider/fetch';
import { useEffect, useMemo, useState, memo, useRef } from 'react';
import type { OperatorPartnerAddressWithOpNameType, PartnerRecordToUpdate, ClaimProof } from 'src/types/interfaces';
import LoadingPage from './loadingPage';
import { updatePartnerWithOpID } from 'provider/write';
import NoSelectionOrEmptyArrayMessage from './sharedComponents/noSelectionOrEmptyArrayMessage';
import { transformOperatorPartnerAddressWithOpName, transformClaimProof } from 'src/types/transform';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function PartnerToOperatorGrid ({currentOpID = null, token}:{currentOpID: string | null, token: string}) {
    const [partnerListToLink, setPartnerListToLink] = useState<PartnerRecordToUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [partnerListToOperator, setPartnerListToOperator] = useState<OperatorPartnerAddressWithOpNameType[]>([]);
    const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);
    const [claimProof, setClaimProof] = useState<ClaimProof | null>(null);
    const [claimProofOpen, setClaimProofOpen] = useState(false);
    const [claimProofAFEDocID, setClaimProofAFEDocID] = useState<string | null>(null);
    const [claimProofPartnerDocID, setClaimProofPartnerDocID] = useState<string | null>(null);
    const [claimProofAFEDocIDValid, setClaimProofAFEDocIDValid] = useState(true);
    const [claimProofPartnerDocIDValid, setClaimProofPartnerDocIDValid] = useState(true);
    const [afeDocIDFocused, setAfeDocIDFocused] = useState(false);
    const [partnerDocIDFocused, setPartnerDocIDFocused] = useState(false);
    const [verificationErrorMessage, setVerificationErrorMessage] = useState<string | null>(null);
    const [claimProofNoRecordToVerify, setClaimProofNoRecordToVerify] = useState(false);

    const opId = currentOpID;
    
    useEffect(() => {
      let isMounted = true;
      async function loadPartnersToOperatorsList() {
        setLoading(true);
        try {
          const partnerFetchResult = await fetchPartnersLinkedOrUnlinkedToOperator();
          console.log(partnerFetchResult.data,'the partner data')

          if (isMounted && partnerFetchResult.ok) {
            
            const dataTransformed = transformOperatorPartnerAddressWithOpName(partnerFetchResult.data);
            const filterNull = dataTransformed.filter(record => record.apc_op_id === "");
            setPartnerListToOperator(filterNull);
            setLoading(false);
          } else if (isMounted) {
            throw new Error(partnerFetchResult.message);
          }
        } catch (error) {

          if (isMounted) {
            console.error('Failed to load partners:', error);
            setFetchErrorMessage(error as string);
            setLoading(false);
          }
        } 
      }
      loadPartnersToOperatorsList();
      return () => {
        isMounted = false;
      };
    }, []);

    const gridData = useMemo(() => {
        return [...partnerListToOperator].sort((a, b) => {
    const nameA = a.name;
    const nameB = b.name;

    if (nameA == null && nameB == null) return 0;      
    if (nameA == null) return -1;                      
    if (nameB == null) return 1;                       
    return nameA.localeCompare(nameB);                 
  });
    }, [partnerListToOperator]);

    const handleCheckboxChange = (
        id: string,
        apc_op_id: string | null
    ) => {
        setPartnerListToLink(prevPartnerListToLink => {
            const updatedPartnerListToLink = [...prevPartnerListToLink];
            const existingIndex = updatedPartnerListToLink.findIndex(
                entry => entry.id === id && entry.apc_op_id === apc_op_id

            );
            if (existingIndex > -1) {
                updatedPartnerListToLink.splice(existingIndex,1);
            } else {
                updatedPartnerListToLink.push({
                    id: id,
                    apc_op_id: apc_op_id!

                })
            }
            return updatedPartnerListToLink;
        })
    };

    async function updatePartnerWithOpIDVerification() {
        const claimProofResult = await fetchClaimProofPrompt(currentOpID!);
        if(claimProofResult.ok) {
          console.log(claimProofResult.data)
          const claimProofTransformed = transformClaimProof(claimProofResult.data);
          console.log(claimProofTransformed,'the transform')
          setClaimProof(claimProofTransformed);
          setClaimProofOpen(true);
        } else {
          setClaimProofNoRecordToVerify(true);
          setClaimProofOpen(true);
        }
       
        
    };

    async function handleVerifiationSubmit() {
      if(claimProofAFEDocID === null || claimProofPartnerDocID === null || !claimProof?.id) {
        setVerificationErrorMessage('Verification fields cannot be null');
        return;
      }

      const checkValidAFEDocID = isValidUUID(claimProofAFEDocID);
        setClaimProofAFEDocIDValid(checkValidAFEDocID);
      const checkValidPartnerDocID = isValidUUID(claimProofPartnerDocID);
        setClaimProofPartnerDocIDValid(checkValidPartnerDocID);
      
        if(!checkValidAFEDocID || !checkValidPartnerDocID) {
          return;
        } 
          try {
            const verifyResult = await verifyClaimProof(claimProofAFEDocID, claimProofPartnerDocID, claimProof?.id!, token);
          
            if(!verifyResult.ok) {
              throw new Error('Verification Failed');
            }

            await updatePartnerWithOpID(partnerListToLink);
            
            setClaimProofOpen(false);

          } catch (error) {
            setVerificationErrorMessage('Verification Failed');
            return;
          }
    };

    const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
    };

    const maskUUIDDisplay = (uuid: string | null) => {
    if (!uuid || uuid === null) return '';
    if (uuid.length <= 4) return uuid;
    
    return uuid.substring(0, 4) + '*'.repeat(Math.min(uuid.length - 4, 32));
    };
    
    const handleClickCancelButton = () => {
      setClaimProofOpen(false), 
      setClaimProofPartnerDocID(null), 
      setClaimProofAFEDocID(null), 
      setClaimProofAFEDocIDValid(true), 
      setClaimProofPartnerDocIDValid(true),
      setVerificationErrorMessage(null)
    };

if (loading) return <LoadingPage/>
    return (
        <>
    <div className="px-4 py-4 sm:py-6">
      <div hidden={gridData.length > 0}>
      <NoSelectionOrEmptyArrayMessage message={'There are no unclaimed addresses to show'}      
      ></NoSelectionOrEmptyArrayMessage>
      </div>
      <div hidden={fetchErrorMessage === null}>
      <NoSelectionOrEmptyArrayMessage message={'Error retrieving unclaimed addresses: '+fetchErrorMessage}      
      ></NoSelectionOrEmptyArrayMessage>
      </div>
      <ul role="list" 
      hidden={gridData.length < 1}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
        {gridData.map((partner) => (
          <li key={partner.apc_id} className="col-span-1 flex rounded-md shadow-lg ">
            <div
              className="bg-[var(--darkest-teal)]/20 flex w-16 shrink-0 items-center justify-center rounded-l-md text-sm/6 font-medium text-white">
              <div className="group grid size-6 grid-cols-1">          
                <input
                  type="checkbox"
                  disabled={opId === null ? true : false}
                  onChange={(e) => handleCheckboxChange(partner.apc_id!, opId)}
                  aria-describedby="comments-description"
                  className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--darkest-teal)] checked:border-[var(--bright-pink)] checked:bg-gray-200 
                  group-has-disabled:checked:bg-gray-300 group-has-disabled:checked:border-gray-500 ..."/>
                            <svg
                              fill="none"
                              viewBox="0 0 14 14"
                              className="pointer-events-none col-start-1 row-start-1 size-5.5 self-center justify-self-center stroke-black group-has-disabled:stroke-gray-950/25">
                              <path
                                d="M3 8L6 11L11 3.5"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-has-checked:opacity-100"/>
                              <path
                                d="M3 7H11"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-has-indeterminate:opacity-100"/>
                            </svg>
                          </div>
            </div>
            <div className="flex flex-1 items-center justify-between rounded-r-md border-t border-r border-b border-gray-200 bg-white ">
              <div className="flex-1  px-4 py-2 text-xs/6 2xl:text-sm/6">
                <p className="font-bold text-[var(--dark-teal)] custom-style">Associated Operator: <span className="font-medium not-italic custom-style-long-text">Unclaimed</span></p>
                <p className="font-bold text-[var(--dark-teal)] custom-style">Alias: <span className="font-medium not-italic custom-style-long-text">{partner.name}</span></p>
                <p className="text-[var(--dark-teal)] custom-style-long-text font-normal mt-1 w-full ">{partner.street} {partner.suite} {partner.city}, {partner.state} {partner.zip}</p>  
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
        <div hidden={gridData.length < 1} 
        className="flex items-center justify-end gap-x-6 border-t border-[var(--darkest-teal)]/30 px-4 py-4 sm:px-8">
          <button
            disabled={opId === null || partnerListToLink.length < 1}
            onClick={async (e: any) => {
              e.preventDefault();
              updatePartnerWithOpIDVerification();
            }}
            className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
            Save
          </button>
        </div>
    <div>
      <Dialog open={claimProofOpen} onClose={setClaimProofOpen} className="relative z-60">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                  <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left custom-style">
                  <DialogTitle as="h3" className="text-base font-semibold text-[var(--darkest-teal)]">
                    Verification Required
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-[var(--dark-teal)]">
                      To claim this address verifiation is required.
                      <br></br><br></br>In your AFE System for AFE# {claimProof?.afe_number} {claimProof?.afe_version} please provide the Document ID.  
                      <br></br><br></br>In addiiton please provide the Document ID for {claimProof?.apc_partner_name} who has a WI% of {claimProof?.partner_wi} on this same AFE.
                    </p>
                  </div>
                  
                </div>
              </div>
              <div hidden={verificationErrorMessage === null}
              className='mt-5 text-base font-semibold text-red-900 custom-style'>
               Error:
              </div>
              <div hidden={!claimProofNoRecordToVerify}
              className='mt-5 text-base font-semibold text-red-900 custom-style'>
               There is not an AFE imported from the source system to verify against.
               <br></br><br></br>AFEs will need to be imported first.  Inspect what you expect.
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6 mt-5">
                    
                  <div className="sm:col-span-3">
                    <label htmlFor="afeDocID" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                      AFE Document ID
                    </label>
                    <div className="mt-1">
                        <input
                          id="afeDocID"
                          name="afeDocID"
                          type="text"
                          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                          autoComplete="off"
                          value={(afeDocIDFocused ? claimProofAFEDocID : maskUUIDDisplay(claimProofAFEDocID)) ?? ''}
                          onChange={e => {setClaimProofAFEDocID(e.target.value)}}
                          onFocus={() => setAfeDocIDFocused(true)}
                          onBlur={(e) => (setAfeDocIDFocused(false), setClaimProofAFEDocIDValid(isValidUUID(e.target.value)))}
                          maxLength={36}
                          autoFocus={false}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                        />
                    </div>
                    <div
                    hidden={claimProofAFEDocIDValid} 
                    className='text-xs/6 font-medium text-red-900 custom-style'>
                       Not a valid AFE Document ID
                    </div>
                    </div>
                    <div className="sm:col-span-3">
                    <label htmlFor="partnerDocID" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                      Partner Document ID
                    </label>
                    <div className="mt-1">
                        <input
                          id="partnerDocID"
                          name="partnerDocID"
                          type="text"
                          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                          autoComplete="off"
                          value={(partnerDocIDFocused ? claimProofPartnerDocID : maskUUIDDisplay(claimProofPartnerDocID)) ?? ''}
                          onChange={e => setClaimProofPartnerDocID(e.target.value)}
                          onFocus={() => setPartnerDocIDFocused(true)}
                          onBlur={(e) => (setPartnerDocIDFocused(false), setClaimProofPartnerDocIDValid(isValidUUID(e.target.value)))}
                          maxLength={36}
                          autoFocus={false}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                        />
                    </div>
                    <div
                    hidden={claimProofPartnerDocIDValid} 
                    className='text-xs/6 font-medium text-red-900 custom-style'>
                      Not a valid Partner Document ID
                    </div>
                    </div>
                  
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  disabled={claimProofAFEDocID === null || claimProofPartnerDocID === null || !claimProofAFEDocIDValid || !claimProofPartnerDocIDValid || !claimProof?.id}
                  onClick={() => handleVerifiationSubmit()}
                  className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:ring-0 px-3 py-2 text-sm/6 font-semibold custom-style text-white ring-1 ring-[var(--dark-teal)] ring-inset hover:bg-[var(--bright-pink)] hover:ring-[var(--bright-pink)] focus-visible:ring-0 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => handleClickCancelButton()}
                  className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-white disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-[var--(dark-teal)] ring-1 ring-[var(--dark-teal)] ring-inset hover:bg-[var(--bright-pink)] hover:text-white hover:ring-[var(--bright-pink)] focus-visible:ring-0 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
    </>
  )
};

export default memo(PartnerToOperatorGrid);