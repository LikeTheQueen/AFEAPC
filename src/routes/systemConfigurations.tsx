import React, { useEffect, useState } from 'react';
import { useParams, Await, useLoaderData } from 'react-router';
import fetchAuthToken  from '../scripts/executeConnection'; // Import API call function
const baseURL='https://executedemo.quorumsoftware.com/';

const urlPath = "api/Authentication/ApiKey/Login";
const ID = 'b236d444-ebb2-470d-bcc5-d1ef8c21e4fb';
const Key = '9Sr9xstNsdU5L2PUWG236JGR2YZ7l6FiqCxTA41p71gRsIkHl4xo9Au12YIXfO6X';

const AuthButton: React.FC = () => {
    const [authToken, setAuthToken] = useState<string | null>(null);
  
    const handleClick = async () => {
      const token = await fetchAuthToken(); // Call the API function
      setAuthToken(token); // Store in state
    };
  
    return (
      <div>
        <button onClick={handleClick}>Get Auth Token</button>
        {authToken && <p>Token: {authToken}</p>}
      </div>
    );
  };
  
  export default AuthButton;