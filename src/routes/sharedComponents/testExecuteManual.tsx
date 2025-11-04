import React, { useState } from 'react';
import fetchAuthToken from '../../scripts/executeFetchAuthToken'; 
import executeLogout from '../../scripts/executeLogout';
import {EyeIcon, EyeSlashIcon, XMarkIcon} from '@heroicons/react/20/solid';
import { ToastContainer } from 'react-toastify';
import { notifyFailure, notifyStandard } from 'src/helpers/helpers';

const baseURL = '/api';
const urlPath = "api/Authentication/ApiKey/Login";
const ID = 'b236d444-ebb2-470d-bcc5-d1ef8c21e4fb';
const Key = '9Sr9xstNsdU5L2PUWG236JGR2YZ7l6FiqCxTA41p71gRsIkHl4xo9Au12YIXfO6X';
const urlPathLogout = "api/Authentication/Logout";

export default function TestExecuteManual() {
  const [hideWarning, setHideWarning] = useState(true);
  const [hideSuccess, setHideSuccess] = useState(true);
  
  const [executeDocID, setExecuteDocID] = useState('');
  const [executeKey, setExecuteKey] = useState('');
  const [executeBaseURL, setExecuteBaseURL] = useState('');
  const [executeAuthToken, setExecuteAuthToken] = useState('');
  
  const [responseError, setResponseError] = useState('');
  
  const handleClick = async () => {
    //if(executeAuthToken !=='') return;

    const executeResult = await fetchAuthToken(executeDocID, executeKey, '/api/Authentication/ApiKey/Login', baseURL);
    
    if(!executeResult.ok) {
      setHideWarning(false);
      setResponseError(executeResult.data);
      notifyFailure(`API Integration failed.  This well isn't producing.\n\n(TLDR: Failed connection)`);
    return;
    } 
    setExecuteAuthToken(executeResult.data);
    setHideSuccess(false);
    notifyStandard(`API Integration passed.  This integration just struck oil.\n\n(TLDR: Successful connection)`);
    await executeLogout(executeAuthToken, 'api/Authentication/Logout', baseURL);
    
};

  const handleLogout = async () => {
    if(executeAuthToken === '') return;

    const executeLogoutResult = await executeLogout(executeAuthToken, 'api/Authentication/Logout', executeBaseURL);

  };
  
  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExecuteKey(event.target.value);
  };
  const handleDocIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExecuteDocID(event.target.value);
  };
  const handleURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExecuteBaseURL(event.target.value);
  };

  const [hideKey, setShowKideKey] = useState(true);
  const toggleMode = () => {
    setShowKideKey(!hideKey);
  }
  
  const isTestButtonDisabled = (
       !executeKey 
    || !executeDocID) 
    || !executeBaseURL 
    || executeKey==='' 
    || executeDocID===''
    || executeBaseURL==='' ? true : false;
  
 
  return (
    <>
    <div className="mt-10">

      <div className="grid grid-cols-1 gap-x-30 gap-y-10 border-b-4 border-gray-900/20 pb-12 md:grid-cols-5">
        <div className="w-full md:col-span-2">
          <h2 className="custom-style text-[var(--darkest-teal)] font-semibold text-sm xl:text-base">Test with an Execute API Key</h2>
          <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">
            You will need to create an API Key in your Execute Environment.  Once generated you will <span className="font-bold text-gray-900 custom-style">not</span> be able to view this key again.  When generated, store this key where it will be accessible in the future.
          </p>
          <p className="mt-3 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">
            Create a Key by going to Tools {">"} Configuration {">"} View API Keys {">"} Click 'Create New API Key' in the toolbar.
          </p>
          <li className="mt-1 ml-3 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text italic">If you do not see this option contact Quorum Support</li>
          <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">
            You will also need the Document ID which can be found when viewing the list of API Keys.
          </p>
        </div>
        <div className="w-2/3 col-span-3 grid grid-cols-1 gap-x-8 gap-y-6 ">
          <div className="col-span-full">
            
            <label htmlFor={'executeKey'} className="mb-1 custom-style text-[var(--darkest-teal)] font-semibold text-sm/6 xl:text-base">
              Execute API Key
            </label>
            <div className="mt-2 mb-2 grid grid-cols-1">
              <input
                disabled={executeAuthToken==='' ? false : true}
                id={'executeKey'}
                type={hideKey ? "password" : "text" }
                autoComplete="off"
                value={executeKey}
                placeholder={'The API Key is roughly 64 characters'}
                onChange={handleKeyChange}
                className="col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-1.5 text-sm/6 text-[var(--dark-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/80 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] custom-style-long-text"
              />
              <span className="col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-[var(--dark-teal)] sm:size-4" onClick={toggleMode}>
                  {
                    hideKey ? <EyeSlashIcon aria-hidden="true" className="size-5 shrink-0 "/> : <EyeIcon aria-hidden="true" className="size-5 shrink-0 "/>
                  }
              </span>
              
            </div>
            <label htmlFor={'executeDocID'} className="mt-2 mb-1 custom-style text-[var(--darkest-teal)] font-semibold text-sm/6 xl:text-base">
              Execute Document ID 
            </label>
            <div className="mt-2 mb-2 ">
              <input
                disabled={executeAuthToken==='' ? false : true}
                id={'executeDocID'}
                name="executeDocID"
                type="text"
                value={executeDocID}
                onChange={handleDocIDChange}
                autoComplete="off"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-sm/6 text-[var(--dark-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/80 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] custom-style-long-text"
              />
            </div>
            <label htmlFor={'executeBaseURL'} className="mb-1 custom-style text-[var(--darkest-teal)] font-semibold text-sm/6 xl:text-base">
              Execute Base URL
            </label>
            <div className="mt-2 mb-2 ">
              <input
                disabled={executeAuthToken==='' ? false : true}
                id={'executeBaseURL'}
                name="executeBaseURL"
                type="text"
                value={executeBaseURL}
                onChange={handleURLChange}
                placeholder={'https://quorumexecute.company.com'}
                autoComplete="off"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-sm/6 text-[var(--dark-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/80 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] custom-style-long-text"
              />
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="cursor-pointer disabled:cursor-not-allowed w-35 rounded-md bg-[var(--dark-teal)] outline-[var(--dark-teal)] outline-1 -outline-offset-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:outline-none px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                disabled={isTestButtonDisabled}
                onClick={(e: any) => { handleClick() }}
              >Run Test</button>
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
                        The response returned an error: {`${responseError}`}
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
                        AFE Partner Connections successfully connected to Execute.  You will need to get the Key and Document ID to AFE Partner Connections Support.
                    </div>
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

