import type { ExecuteAFEEstimatesType } from "../types/interfaces";
import { transformExecuteAFEEstimates } from "../types/transform";
import { writeExecuteAFEEstimatesSupabase } from "../../provider/writeExecuteRecords";

const baseURL = '/api';
const urlPath = "/api/Afe/AfeEstimate";

export const fetchExecuteAFEEstimates = async (docHandle: string, authenticationToken: string, docID: string): Promise<any> => {

    const requestBody = {
        AuthenticationToken: authenticationToken,
        Handle: docHandle
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
        console.log(response);
        if (!response.ok) {
            console.log(`Failed to get the Estimates for ${docHandle}`);
            throw new Error(`Failed to get Estimates ${docHandle}: ${response.statusText}`);
        }
        const jsonResponse = await response.json();
        const afeEstimatesForAFE: ExecuteAFEEstimatesType[] = transformExecuteAFEEstimates(jsonResponse.LineItems, docID);
        writeExecuteAFEEstimatesSupabase('AFE_ESTIMATES_EXECUTE', afeEstimatesForAFE);
        console.log("Step 6 was I wrote this to the DB", afeEstimatesForAFE);

        return jsonResponse;

    } catch (error) {
        return { docHandle, error: (error as Error).message };
    }
};