import { useState } from 'react';
import { XMarkIcon} from '@heroicons/react/20/solid';
import { OperatorDropdown } from '../operatorDropdown';
import { testExecuteConnection } from 'provider/fetch';
import { notifyFailure, notifyStandard } from 'src/helpers/helpers';
import { ToastContainer } from 'react-toastify';

export default function TestExecuteEstablishedConnection() {
  const [opAPCID, setOpAPCID] = useState('');
  const [hideWarning, setHideWarning] = useState(true);
  const [hideSuccess, setHideSuccess] = useState(true);

  const handleTestConnection = async () => {
    if(opAPCID ==='') return;

    try {
      const textConnectionResult = await testExecuteConnection(opAPCID);
      
      if(!textConnectionResult.ok) {
        setHideWarning(false);
        notifyFailure(`API Integration failed.  This well isn't producing.\n\n(TLDR: Failed connection)`);
      }
      setHideSuccess(false);
       notifyStandard(`API Integration passed.  This integration just struck oil.\n\n(TLDR: Successful connection)`);
        } finally {
            return;
             }
  };
    
  return (
    <>
    <div className="mt-10">
      <div className="grid grid-cols-1 gap-x-30 gap-y-10 border-b-4 border-gray-900/20 pb-12 md:grid-cols-5">
        <div className="w-full md:col-span-2">
          <h2 className="custom-style text-[var(--darkest-teal)] font-semibold text-sm xl:text-base">Test the Current Execute Connection</h2>
          <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">
            Select an Operator and we'll poke the integration to make sure it's working.  If the test fails AFEs will <span className="font-bold text-[var(--darkest-teal)] custom-style">not</span> sync to AFE Partner Connections.
          </p>
          
        </div>
        <div className="w-2/3 col-span-3 grid grid-cols-1 gap-x-8 gap-y-6 ">
          <div className="">
            <h1 className="mb-1 custom-style text-[var(--darkest-teal)] font-semibold text-sm xl:text-base">Select an Operator to Test the Connection For:</h1>
            <OperatorDropdown
              onChange={(id) => { setOpAPCID(id) }}
              limitedList={true}
            />
            <div className="flex justify-end mt-6">
              <button
                className="cursor-pointer disabled:cursor-not-allowed w-35 rounded-md bg-[var(--dark-teal)] outline-[var(--dark-teal)] outline-1 -outline-offset-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:outline-none px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                disabled={opAPCID === '' ? true : false}
                onClick={(e: any) => { handleTestConnection() }}
              >Run Test</button>
            </div>
          </div>
            <div 
            hidden={hideWarning}
            className="bg-red-100 border border-red-400 text-red-700 custom-style px-4 py-3 rounded-md relative">
                <div className='grid grid-cols-6'>
                    <div className='col-span-5'>
                        <span className="font-bold ">Warning! </span> 
                    </div>
                    <div className='col-span-1'>
                        <div className="absolute top-0 right-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                        <button type="button" onClick={() => setHideWarning(true)} >
                            <span className="sr-only">Close sidebar</span>
                                  <XMarkIcon aria-hidden="true" className="size-6 text-red-500" />
                              </button>
                          </div>
                    </div>
                    <div className='col-span-6'>
                        The test failed.  The connection needs to be reconfigured.  If you have a new API Key or Document ID please reach out to Support.
                    </div>
                </div>
            </div>
            <div 
            hidden={hideSuccess}
            className="bg-[var(--dark-teal)] border border-[var(--darkest-teal)] text-white custom-style px-4 py-3 rounded-md shadow-xl relative">
                <div className='grid grid-cols-6'>
                    <div className='col-span-5'>
                        <span className="font-bold ">SUCCESS</span> 
                    </div>
                    <div className='col-span-1'>
                        <div className="absolute top-0 right-0 flex w-16 justify-center pt-3 duration-300 ease-in-out data-closed:opacity-0">
                        <button type="button" onClick={() => setHideSuccess(true)} >
                            <span className="sr-only">Close sidebar</span>
                                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                              </button>
                          </div>
                    </div>
                    <div className='col-span-6'>
                        AFE Partner Connections successfully connected to Execute.
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
    <ToastContainer />
    </>

  );
};

