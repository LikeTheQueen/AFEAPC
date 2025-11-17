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
    try {
      const executeResult = await fetchAuthToken(executeDocID, executeKey, '/api/Authentication/ApiKey/Login', baseURL);
    
      if(!executeResult.ok) {
        setHideWarning(false);
        setResponseError(executeResult.data);
        notifyStandard(`API Integration failed.  This well isn't producing.\n\n(TLDR: Failed connection)`);
      } else {
        setExecuteAuthToken(executeResult.data);
        setHideSuccess(false);
        notifyStandard(`API Integration passed.  This integration just struck oil.\n\n(TLDR: Successful connection)`);
        //await executeLogout(executeAuthToken, 'api/Authentication/Logout', baseURL);
      }
  
    } catch (error) {
      notifyFailure('An error occurred while testing the connection');
    }
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
    || !executeDocID 
    || !executeBaseURL 
    || executeKey==='' 
    || executeDocID===''
    || executeBaseURL==='' ? true : false);
  
 
  return (
    <>
    <div className="">
    <div className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 p-4 mb-5">
        <div className="">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-5 sm:divide-x sm:divide-[var(--darkest-teal)]/40">
            <div className="col-span-2">
                        <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Test with an Execute API Key</h2>
                        <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">You will need to create an API Key in your Execute Environment.  Once generated you will <span className="font-bold text-gray-900 custom-style">not</span> be able to view this key again.  When generated, store this key where it will be accessible in the future.</p>
                        <br></br><p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">Create a Key by going to Tools {">"} Configuration {">"} View API Keys {">"} Click 'Create New API Key' in the toolbar.<span className="font-bold text-gray-900 custom-style">not</span> be able to view this key again.  When generated, store this key where it will be accessible in the future.</p>
                        <br></br><li className="ml-3 text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3 italic">If you do not see this option contact Quorum Support</li>
                        <br></br><p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">You will also need the Document ID which can be found when viewing the list of API Keys.</p>
            </div>
            <div className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-0">
                      
            <div>
            <label htmlFor={'executeKey'} className="text-base/7 font-medium text-[var(--darkest-teal)] custom-style">
              Execute API Key
            </label>
            <div className="grid grid-cols-1">
              <input
                disabled={executeAuthToken==='' ? false : true}
                id={'executeKey'}
                type={hideKey ? "password" : "text" }
                autoComplete="off"
                value={executeKey}
                placeholder={'The API Key is roughly 64 characters'}
                onChange={handleKeyChange}
                className="col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
              />
              <span className="col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-[var(--dark-teal)] sm:size-4" onClick={toggleMode}>
                  {
                    hideKey ? <EyeSlashIcon aria-hidden="true" className="size-5 shrink-0 "/> : <EyeIcon aria-hidden="true" className="size-5 shrink-0 "/>
                  }
              </span>
              
            </div>
            </div>

            <div>
            <label htmlFor={'executeDocID'} className="text-base/7 font-medium text-[var(--darkest-teal)] custom-style">
              Execute Document ID 
            </label>
            <div className="">
              <input
                disabled={executeAuthToken==='' ? false : true}
                id={'executeDocID'}
                name="executeDocID"
                type="text"
                value={executeDocID}
                onChange={handleDocIDChange}
                autoComplete="off"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
              />
            </div>
            </div>

            <div>
            <label htmlFor={'executeBaseURL'} className="text-base/7 font-medium text-[var(--darkest-teal)] custom-style">
              Execute Base URL
            </label>
            <div className="">
              <input
                disabled={executeAuthToken==='' ? false : true}
                id={'executeBaseURL'}
                name="executeBaseURL"
                type="text"
                value={executeBaseURL}
                onChange={handleURLChange}
                placeholder={'https://quorumexecute.company.com'}
                autoComplete="off"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
              />
            </div>
            </div>

            <div className="text-right ">
              <button
                 className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                disabled={isTestButtonDisabled}
                onClick={(e: any) =>  handleClick()}
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
        </div>
        
    
</>
  );
};

