import type { ExecuteAFEDocIDType } from "../types/interfaces";
import { fetchExecuteAFEDocHandle } from "./executeFetchExecuteAFEDocHandle"


const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const retryWithBackoff = async (item: ExecuteAFEDocIDType, authToken: string, maxRetries: number) => {
  let attempt = 0;
  let delayMs = 1000; // Start with 1 second delay

  while (attempt < maxRetries) {
    const result = await fetchExecuteAFEDocHandle(item, authToken);
    if (result) {
      return result; // Success, return response
    }
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
  for (const batch of batches) {
      const results = await Promise.all(batch.map(item => retryWithBackoff(item, authToken, maxRetries)))
      const failedRequests = results.filter(result => result.error);
      if (failedRequests.length > 0) {
      console.error(`Giving up on ${failedRequests.length} requests. Sending email...`);
      // TODO: Implement email notification logic here
    }
    
    await delay(delayMs);
    return results;
  }
};

