import type { ExecuteAFEDocIDType } from "../types/interfaces";
import { retryWithBackoff } from "./executeAFEgetEstimatesRetryFunc";

export const fetchExecuteAFEDocHandle = async (item: ExecuteAFEDocIDType, authenticationToken: string): Promise<any> => {
  const baseURL = '/api';
  const urlPath = "/api/Documents/OpenReadonly";
  const requestBody = {
    AuthenticationToken: authenticationToken,
    DocumentID: item.docID,
    DocumentType: 'AFE',
  };
  try {
    const response = await fetch(baseURL + urlPath, {
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
    await retryWithBackoff(jsonResponse.DocumentHandle, authenticationToken, 5, item.docID);

    return jsonResponse;

  } catch (error) {
    return { item, error: (error as Error).message };
  }
};