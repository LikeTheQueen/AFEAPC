import type { ExecuteAFEDocIDType } from "../types/index";
import { transformExecuteAFEsID } from "../types/transform";

const baseURL='/api';
const urlPath = "/api/Documents/Read";
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchExecuteAFEData = async (item: ExecuteAFEDocIDType, authenticationToken: string): Promise<any> => {
  
    const requestBody = {
        AuthenticationToken: authenticationToken, 
        DocumentHandle: item.docHandle,
        SerializeDocumentTypes: ["ACCOUNT", "PARTNER"],
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
        console.log(response);
        const errorText = await response.text();
        console.error('Response body:', errorText);
        throw new Error(`Failed to fetch AFE Data ${item.docHandle}: ${response.statusText}`);
    }
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    return jsonResponse;
    
  } catch (error) {
    return { item, error: (error as Error).message };
  }
};

export const retryAFEDataWithBackoff = async (item: ExecuteAFEDocIDType, authToken: string, maxRetries: number) => {
  let attempt = 0;
  let delayMs = 1000; // Start with 1 second delay

  while (attempt < maxRetries) {
    const result = await fetchExecuteAFEData(item, authToken);
    if (!result.error) return result; // Success, return response

    console.warn(`Retry ${attempt + 1} for item ${item.docHandle} failed. Retrying in ${delayMs}ms...`);
    await delay(delayMs);
    delayMs *= 2; // Exponential backoff (1s → 2s → 4s)
    attempt++;
  }

  console.error(`Giving up on item ${item.docHandle} after ${maxRetries} attempts. Sending email...`);
  // TODO: Implement email notification logic here
  return { item, error: "Max retries reached" };
};

export const getAFEData = async (items: ExecuteAFEDocIDType[], authToken: string, batchSize: number, delayMs: number, maxRetries: number) => {
  const batches = Array.from({ length: Math.ceil(items.length / batchSize) }, (_, i) =>
    items.slice(i * batchSize, i * batchSize + batchSize)
  );

  for (const batch of batches) {
    console.log(`Processing AFE DATA of ${batch.length} requests...`);
    const results = await Promise.all(batch.map(item => retryAFEDataWithBackoff(item, authToken, maxRetries)));
    console.log(results);
    console.log(results, "i am error");
    //const afeDocHandleList: ExecuteAFEDocIDType[] = transformExecuteAFEsID(results);
    //console.log('Ive ot doc handles and need to call',afeDocHandleList);

    const failedRequests = results.filter(result => result.error);
    if (failedRequests.length > 0) {
      console.error(`Giving up on ${failedRequests.length} requests. Sending email...`);
      // TODO: Implement email notification logic here
    }

    await delay(delayMs);
  }
};

