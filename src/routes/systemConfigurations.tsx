import React, { useEffect, useState, useId } from 'react';
import { useParams, Await, useLoaderData } from 'react-router';
import fetchAuthToken from '../scripts/executeConnection'; // Import Execute API login function
import executeLogout from '../scripts/executeLogout';
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/20/solid';
const baseURL = '/api';
const urlPath = "api/Authentication/ApiKey/Login";
const ID = 'b236d444-ebb2-470d-bcc5-d1ef8c21e4fb';
const Key = '9Sr9xstNsdU5L2PUWG236JGR2YZ7l6FiqCxTA41p71gRsIkHl4xo9Au12YIXfO6X';
const urlPathLogout = "api/Authentication/Logout";
const AuthButton = () => {
  const [authToken, setAuthToken] = useState(sessionStorage.getItem('authToken') || '');
  const [responseError, setResponseError] = useState('');
  const handleClick = async () => {
    if (!authToken) {
      setResponseError('');
      console.log('Fetching new auth token...');
      const result = await fetchAuthToken(docId, key, urlPath, baseURL);
      if (result.AuthenticationToken) {
        sessionStorage.setItem('authToken', result.AuthenticationToken);
        setAuthToken(result.AuthenticationToken);
        console.log('Token stored:', result.AuthenticationToken);
      } else {
        console.error('Failed to retrieve auth token');
        console.error('Response', result);
        setResponseError(result);
      }
    } else {
      console.log('Using stored token:', authToken);
    }
  };
  const handleLogout = async () => {
    if (!authToken) {
      console.log('Fetching new auth token to login and then logout');
      fetchAuthToken(ID, Key, urlPath, baseURL)
        .then(resolvedValue => {
          console.log(resolvedValue.AuthenticationToken);
          sessionStorage.setItem('authToken', resolvedValue.AuthenticationToken);
          setAuthToken(resolvedValue.AuthenticationToken);
          executeLogout(resolvedValue.AuthenticationToken, urlPathLogout, baseURL)
            .then(resolvedValue => {
              console.log(resolvedValue);
              if (resolvedValue === 'Success') {
                sessionStorage.setItem('authToken', '');
                setAuthToken('');
              }
            })
        })
    } else {
      const logoutResult = await executeLogout(authToken, urlPathLogout, baseURL);
      if (logoutResult === 'Success') {
        sessionStorage.setItem('authToken', '');
        setAuthToken('');
      }
    }
  }
  const [key, setKey] = useState(sessionStorage.getItem('key') || '');
  const [docId, setDocID] = useState(sessionStorage.getItem('docId') || '');
  useEffect(() => {
    const storedKey = sessionStorage.getItem('key');
    if(storedKey) {
      setKey(storedKey);
    }
  },[]);
  useEffect(() => {
    sessionStorage.setItem('key',key);
  },[key]);
  useEffect(() => {
    const storedDocID = sessionStorage.getItem('docId');
    if(storedDocID) {
      setDocID(storedDocID);
    }
  },[]);
  useEffect(() => {
    sessionStorage.setItem('docId',docId);
  },[docId]);
  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKey(event.target.value);
    sessionStorage.setItem('key', event.target.value);
  };
  const handleDocIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocID(event.target.value);
    sessionStorage.setItem('docId', event.target.value);
  };
  const [hideKey, setShowKideKey] = useState(true);
  const toggleMode = () => {
    setShowKideKey(!hideKey);
  }
  const apiKeyId = useId();
  const docIdId = useId();
  const isLoginButtonDisabled = (!key || !docId) || authToken ? true : false;
  const isLogoutButtonDisabled = !authToken;
  const isSuccessVisible = authToken ? true : false;
  const isErrorVisible = responseError ? true : false;
  const isInputFieldsEditable = authToken ? true : false;

  

  return (

    <div className="mt-10">
      <div className="grid grid-cols-1 gap-x-30 gap-y-10 border-b-4 border-gray-900/20 pb-12 md:grid-cols-5">
        <div className="w-full md:col-span-2">
          <h2 className="text-base/7 font-semibold text-gray-900 custom-style">Execute API Key</h2>
          <p className="mt-1 text-sm/6 text-gray-600 custom-style-long-text">
            You will need to create an API Key in your Execute Environment.  Once generated you will <span className="font-bold text-gray-900 custom-style">not</span> be able to view this key again.  When generated, store this key where it will be accessible in the future.
          </p>
          <p className="mt-3 text-sm/6 text-gray-900 custom-style-long-text">
            Create a Key by going to Tools {">"} Configuration {">"} View API Keys {">"} Click 'Create New API Key' in the toolbar.
          </p>
          <li className="mt-1 ml-3 text-sm/6 text-gray-600 custom-style-long-text italic">If you do not see this option contact Quorum Support</li>
          <p className="mt-1 text-sm/6 text-gray-900 custom-style-long-text">
            You will also need the Document ID which can be found when viewing the list of API Keys.
          </p>
        </div>
        <div className="w-3/4 grid max-w-2x2 grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8 md:col-span-3">
          <div className="col-span-full ">
            <label htmlFor={apiKeyId} className="text-sm/6 font-semibold text-gray-900 custom-style ">
              Execute API Key
            </label>
            <div className="mt-2 grid grid-cols-1">
              <input
                disabled={isInputFieldsEditable}
                id={apiKeyId}
                type={hideKey ? "password" : "text" }
                autoComplete="off"
                value={key}
                placeholder={'The API Key is roughly 64 characters'}
                onChange={handleKeyChange}
                className="col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--dark-teal)] sm:text-sm/6"
              />
              <span className="col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-[var(--dark-teal)] sm:size-4" onClick={toggleMode}>
                  {
                    hideKey ? <EyeSlashIcon aria-hidden="true" className="size-5 shrink-0 "/> : <EyeIcon aria-hidden="true" className="size-5 shrink-0 "/>
                  }
              </span>
              
              </div>
            <label htmlFor={docIdId} className="text-sm/6 font-semibold text-gray-900 custom-style ">
              Execute Document ID 
            </label>
            <div className="">
              <input
                disabled={isInputFieldsEditable}
                id={docIdId}
                name="docId"
                type="text"
                value={docId}
                onChange={handleDocIDChange}
                autoComplete="off"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--dark-teal)] sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex col-span-full ">
            <button className='mt-4 mr-4 w-1/2 border px-1 py-4 text-center text-m font-medium custom-style hover:border-b-2 hover:border hover:border-b-2-[var(--darkest-teal)] hover:text-white hover:font-semibold hover:bg-[var(--dark-teal)] disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white disabled:hover:font-medium disabled:hover:border' onClick={handleClick} disabled={isLoginButtonDisabled}>Test Connection (Login)</button>
            <button className='mt-4 w-1/2 border px-1 py-4 text-center text-m font-medium custom-style hover:border-b-2 hover:border hover:border-b-2-[var(--darkest-teal)] hover:text-white hover:font-semibold hover:bg-[var(--dark-teal)] disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white disabled:hover:font-medium disabled:hover:border' onClick={handleLogout} disabled={isLogoutButtonDisabled}>Test Connection (Logout)</button>
          </div>
        </div>
      </div>
      <div className={(isErrorVisible ? 'visible' : 'invisible')}>
        <h2 className="text-base/7 font-semibold text-gray-900 custom-style">The response returned an error</h2>
        <p className="mt-1 text-sm/6 text-gray-600 custom-style-long-text">{`${responseError}`}</p>
      </div>
      <div className={(isSuccessVisible ? 'visible' : 'invisible')}>
        <h2 className="text-base/7 font-semibold text-gray-900 custom-style">Success!</h2>
        <p className="mt-1 text-sm/6 text-gray-600 custom-style-long-text">
          The API Key and Document ID were successful in logging into your Execute Environment.  Do you want to save these now?  By clicking the Save Credentials button we will encrypt and store these to access AFE information and related details from your environment. The API Key will <span className="font-bold text-gray-900 custom-style">never</span> be visible to you again, because security, ya' know?  Your secret (key) is safe with us.
        </p>
        <p className="mt-1 text-sm/6 text-gray-600 custom-style-long-text">
          If you're not sure just close your browser or logout and we can pretend none of this ever happened and we'll forget all the details.  You can add them again later and save when you are ready.
        </p>
        <button className='float-right mt-4 w-1/4 border-b-2 bg-[var(--dark-teal)] text-white px-1 py-4 text-center text-m font-semibold custom-style hover:border-b-2 hover:border hover:border-b-2-[var(--darkest-teal)] hover:text-white hover:font-semibold hover:bg-[var(--darkest-teal)] disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white disabled:hover:font-medium disabled:hover:border'>Save API Key and Document ID</button>
      </div>
    </div>

  );
};

export default AuthButton;