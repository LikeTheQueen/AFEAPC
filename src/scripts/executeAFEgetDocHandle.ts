import type { ExecuteAFEDocIDType } from "../types/index";
import { fetchExecuteAFEEstimatesSingleAFE } from "./executeAFEgetEstimates";

const baseURL='/api';
const urlPath = "/api/Documents/OpenReadonly";
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

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

export const retryWithBackoff = async (item: ExecuteAFEDocIDType, authToken: string, maxRetries: number) => {
  let attempt = 0;
  let delayMs = 1000; // Start with 1 second delay

  while (attempt < maxRetries) {
    const result = await fetchExecuteAFEDocHandle(item, authToken);
    if (result) {
      console.log("my attempts are working");
      return result; // Success, return response
    }
    console.warn(`Retry ${attempt + 1} for item ${item.docID} failed. Retrying in ${delayMs}ms...`);
    await delay(delayMs);
    delayMs *= 2; // Exponential backoff (1s → 2s → 4s)
    attempt++;
  }

  console.error(`Giving up on item ${item.docID} after ${maxRetries} attempts. Sending email...`);
  // TODO: Implement email notification logic here
  return { item, error: "Max retries reached" };
};

export const processAFEDocIDsToDocHandle = async (items: ExecuteAFEDocIDType[], authToken: string, batchSize: number, delayMs: number, maxRetries: number) => {
  const batches: ExecuteAFEDocIDType[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
console.log("Step 3 put the AFE DOC IDs to Batches",batches);
  for (const batch of batches) {
    console.log(`Processing batch of ${batch.length} requests to get Doc Handle...`);
    const results = await Promise.all(batch.map(item => retryWithBackoff(item, authToken, maxRetries)))
    console.log("Step here is the results in the for loop of batch of batches",results);
    //const afeDocHandleList: ExecuteAFEDocIDType[] = transformExecuteAFEsID(results);
    //fetchAFEEstimates(afeDocHandleList, authToken, 1, 60000, 1);
    //const afedata = getAFEData(afeDocHandleList, authToken, 1, 6000, 1);

    const failedRequests = results.filter(result => result.error);
    console.log(failedRequests.length," Log failed requests failed requests ",failedRequests);
    if (failedRequests.length > 0) {
      console.error(`Giving up on ${failedRequests.length} requests. Sending email...`);
      // TODO: Implement email notification logic here
    }
    
    await delay(delayMs);
    
  }
  console.log("In theory I've finished all the batches....");
};

