import type { ExecuteAFEDocIDType } from "../types/index";

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
      throw new Error(`Failed to fetch item ${item.docID}: ${response.statusText}`);
    }
    const jsonResponse = await response.json();
    console.log(jsonResponse);
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
    if (!result.error) return result; // Success, return response

    console.warn(`Retry ${attempt + 1} for item ${item.docID} failed. Retrying in ${delayMs}ms...`);
    await delay(delayMs);
    delayMs *= 2; // Exponential backoff (1s → 2s → 4s)
    attempt++;
  }

  console.error(`Giving up on item ${item.docID} after ${maxRetries} attempts. Sending email...`);
  // TODO: Implement email notification logic here
  return { item, error: "Max retries reached" };
};

export const processDocIDs = async (items: ExecuteAFEDocIDType[], authToken: string, batchSize: number, delayMs: number, maxRetries: number) => {
  const batches = Array.from({ length: Math.ceil(items.length / batchSize) }, (_, i) =>
    items.slice(i * batchSize, i * batchSize + batchSize)
  );

  for (const batch of batches) {
    console.log(`Processing batch of ${batch.length} requests...`);
    const results = await Promise.all(batch.map(item => retryWithBackoff(item, authToken, maxRetries)));

    const failedRequests = results.filter(result => result.error);
    if (failedRequests.length > 0) {
      console.error(`Giving up on ${failedRequests.length} requests. Sending email...`);
      // TODO: Implement email notification logic here
    }

    await delay(delayMs);
  }
};

