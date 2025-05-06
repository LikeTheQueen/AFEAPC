/*
export const fetchExecuteAFEDocHandle = async (item: ExecuteAFEDocIDType, authenticationToken: string): Promise<any> => {
  
    const requestBody = {
        AuthenticationToken: authenticationToken, 
        DocumentID: item.docID,
        DocumentType: 'AFE',
    };
    try {
    const response = await fetch(baseURL+urlPath, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      },
      redirect: 'follow'
    });

    if (!response.ok) {
      console.log(`Failed to get the Document handle for ${item.docID}`);
      throw new Error(`Failed to fetch item ${item.docID}: ${response.statusText}`);
    }
    const jsonResponse = await response.json();
    console.log("Step 5 I'm wrtiting estimates to the DB after this statement", jsonResponse.DocumentHandle);
    const newResult = await fetchExecuteAFEEstimatesSingleAFE(jsonResponse.DocumentHandle, authenticationToken, item.docID);
    
    return jsonResponse;
    
  } catch (error) {
    return { item, error: (error as Error).message };
  }
};

export const fetchAFEEstimates = async (items: ExecuteAFEDocIDType[], authToken: string, batchSize: number, delayMs: number, maxRetries: number) => {
    const batches: ExecuteAFEDocIDType[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

  for (const batch of batches) {
    console.log(`Processing batch of ${batch.length} requests to get AFE Estimate...`);
    const results = await Promise.all(batch.map(item => retryWithBackoff(item.docHandle, authToken, maxRetries, item.docID)))
    //const jsonResponse = await results.json();
    console.log("thee ar estimate",results);
    
    const failedRequests = results.filter(result => result.error);
    if (failedRequests.length > 0) {
      console.error(`Giving up on ${failedRequests.length} requests. Sending email...`);
      // TODO: Implement email notification logic here
    }
    
    await delay(delayMs);
    
  }
};

import type { ExecuteAFEDocIDType } from "../types/interfaces";

const baseURL='/api';
const urlPath = "/api/Afe/AfeEstimate";

export const fetchExecuteAFEEstimates = async (item: ExecuteAFEDocIDType, authenticationToken: string): Promise<any> => {
  
    const requestBody = {
        AuthenticationToken: authenticationToken, 
        Handle: item.docHandle
    };
    try {
    const response = await fetch(baseURL+urlPath, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      },
      redirect: 'follow'
    });
    console.log(response);
    if (!response.ok) {
        console.log(`Failed to get the Estimates for ${item.docID}`);
      throw new Error(`Failed to get Estimates ${item.docID}: ${response.statusText}`);
    }
    return response;
    
  } catch (error) {
    return { item, error: (error as Error).message };
  }
};

export const fetchExecuteAFEEstimates = async (item: ExecuteAFEDocIDType, authenticationToken: string): Promise<any> => {
  
    const requestBody = {
        AuthenticationToken: authenticationToken, 
        Handle: item.docHandle
    };
    try {
    const response = await fetch(baseURL+urlPath, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      },
      redirect: 'follow'
    });
    console.log(response);
    if (!response.ok) {
        console.log(`Failed to get the Estimates for ${item.docID}`);
      throw new Error(`Failed to get Estimates ${item.docID}: ${response.statusText}`);
    }
    //const jsonResponse = await response.json();
    //const afeEstimatesForAFE : ExecuteAFEEstimatesType[] = transformExecuteAFEEstimates(jsonResponse.LineItems);
    //console.log("this are estimates",jsonResponse.LineItems);
    return response;
    
  } catch (error) {
    return { item, error: (error as Error).message };
  }
};
*/

