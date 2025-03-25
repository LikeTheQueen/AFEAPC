import React, { useEffect, useState } from 'react';
import { useParams, Await, useLoaderData } from 'react-router';
import fetchAuthToken  from '../scripts/executeGetAFEs'; // Import API call function
const baseURL='https://executedemo.quorumsoftware.com/';

const urlPath = "api/Authentication/ApiKey/Login";
const ID = 'b236d444-ebb2-470d-bcc5-d1ef8c21e4fb';
const Key = '9Sr9xstNsdU5L2PUWG236JGR2YZ7l6FiqCxTA41p71gRsIkHl4xo9Au12YIXfO6X';

const AuthButton = () => {
    const [authToken, setAuthToken] = useState(sessionStorage.getItem('authToken') || '');
  
    const handleClick = async () => {
      if (!authToken) {
        console.log('Fetching new auth token...');
        const token = await fetchAuthToken();
  
        if (token) {
          sessionStorage.setItem('authToken', token);
          setAuthToken(token);
          console.log('Token stored:', token);
        } else {
          console.error('Failed to retrieve auth token');
        }
      } else {
        console.log('Using stored token:', authToken);
      }
    };
    const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }
    return (
      
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
        <div>
            <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
          <div className="col-span-full">
              <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  value={inputs.about || ""}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  
                />
              </div>
              <p className="mt-3 text-sm/6 text-gray-600">Write a few sentences about yourself.</p>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                Execute ID
              </label>
              <div className="mt-2">
                <input
                  id="execute-id"
                  name="execute-id"
                  type="text"
                  value={inputs.executeID || ""}
                  onChange={handleChange}
                  autoComplete="given-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
      </div>
          </div>
        </div>
        <button className = 'w-1/4 border px-1 py-4 text-center text-m font-medium custom-style hover:border-b-2 hover:border hover:border-b-2-[var(--darkest-teal)] hover:text-white hover:font-semibold hover:bg-[var(--dark-teal)]' onClick={handleClick}>Get Auth Token</button>
         <p>Token: {authToken}</p>
         <p>TOKEN</p>
         <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                First name
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
      </div>
      </div>
      
    );
  };
  
  export default AuthButton;