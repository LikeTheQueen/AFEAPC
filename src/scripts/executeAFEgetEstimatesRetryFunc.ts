import { fetchExecuteAFEEstimates } from "./executeFetchExecuteAFEEstimates";

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const retryWithBackoff = async (docHandle: string, authToken: string, maxRetries: number, docID: string) => {
  let attempt = 0;
  let delayMs = 1000; // Start with 1 second delay
console.log(docHandle);
  while (attempt < maxRetries) {
    const result = await fetchExecuteAFEEstimates(docHandle, authToken, docID);
    if (result) {
        console.log("results from retry", result);
        
        return result; // Success, return response
      }

    console.warn(`Retry ${attempt + 1} for item ${docHandle} failed. Retrying in ${delayMs}ms...`);
    await delay(delayMs);
    delayMs *= 2; // Exponential backoff (1s → 2s → 4s)
    attempt++;
  }

  console.error(`Giving up on item ${docHandle} after ${maxRetries} attempts. Sending email...`);
  // TODO: Implement email notification logic here
  return { docHandle, error: "Max retries reached" };
};



