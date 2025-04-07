import type { ExecuteAFEDocIDType, ExecuteAFEEstimatesType } from "../types/index";
import { transformExecuteAFEsID, transformExecuteAFEEstimates } from "../types/transform";
import { getAFEData } from "./executeAFEgetAFEData"; 
import { writeExecuteAFEEstimatesSupabase } from "../../provider/writeRecords";

const baseURL='/api';
const urlPath = "/api/Afe/AfeEstimate";
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchExecuteAFEEstimatesSingleAFE = async (docHandle: string, authenticationToken: string, docID: string): Promise<any> => {
  
    const requestBody = {
        AuthenticationToken: authenticationToken, 
        Handle: docHandle
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
        console.log(`Failed to get the Estimates for ${docHandle}`);
      throw new Error(`Failed to get Estimates ${docHandle}: ${response.statusText}`);
    }
    const jsonResponse = await response.json();
    const afeEstimatesForAFE : ExecuteAFEEstimatesType[] = transformExecuteAFEEstimates(jsonResponse.LineItems, docID);
    writeExecuteAFEEstimatesSupabase('ESTIMATES', afeEstimatesForAFE);
    console.log("Step 6 was I wrote this to the DB",afeEstimatesForAFE);
    
    
    
    return jsonResponse;
    
  } catch (error) {
    return { docHandle, error: (error as Error).message };
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

export const retryWithBackoff = async (item: ExecuteAFEDocIDType, authToken: string, maxRetries: number) => {
  let attempt = 0;
  let delayMs = 1000; // Start with 1 second delay

  while (attempt < maxRetries) {
    const result = await fetchExecuteAFEEstimates(item, authToken);
    if (result) {
        console.log("results from retry", result);
        
        return result; // Success, return response
      }

    console.warn(`Retry ${attempt + 1} for item ${item.docHandle} failed. Retrying in ${delayMs}ms...`);
    await delay(delayMs);
    delayMs *= 2; // Exponential backoff (1s → 2s → 4s)
    attempt++;
  }

  console.error(`Giving up on item ${item.docHandle} after ${maxRetries} attempts. Sending email...`);
  // TODO: Implement email notification logic here
  return { item, error: "Max retries reached" };
};

export const fetchAFEEstimates = async (items: ExecuteAFEDocIDType[], authToken: string, batchSize: number, delayMs: number, maxRetries: number) => {
    const batches: ExecuteAFEDocIDType[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

  for (const batch of batches) {
    console.log(`Processing batch of ${batch.length} requests to get AFE Estimate...`);
    const results = await Promise.all(batch.map(item => retryWithBackoff(item, authToken, maxRetries)))
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

