import fetchAuthToken  from "./executeFetchAuthToken";
import fetchExecuteAFEData from "./executeFetchExecuteAFEData";
import { processAFEDocIDsToDocHandle } from "./executeBatchProcessAFEDocIDToDocHandle";
import { transformExecuteAFEsID } from "../types/transform";
import type { ExecuteAFEDocIDType } from "../types/interfaces";
import executeLogout from "./executeLogout";


const baseURL = '/api';
const urlPath = "api/Authentication/ApiKey/Login";
const docId = '6d2f6718-f745-421a-b8d9-0ae03f853b01';
const key = 'KjOVeS5N24jQtMPxfLR9Fr3d6fpWCGNCgoYXizfcBqjuHuMtKlBcjjQjh5xOF35G';
const operator ='a4367e56-14bf-4bd1-b0f1-fecc7d97b58c';

export default async function executeAFECall(baseURL:string, urlPath: string, docId: string, key:string, operator:string) {
    let authToken: string='';
    try {
        authToken = await fetchAuthToken(docId, key, urlPath, baseURL);
        const afeData =  await fetchExecuteAFEData(authToken, operator);
        //Transform the results to a type, find unique values and then transform again.
        const afeDocIDList: ExecuteAFEDocIDType[] = transformExecuteAFEsID(afeData);
        const uniqueAFEDocIDList = Array.from(new Set(afeDocIDList.map(item => item.docID))).map(id => afeDocIDList.find(item => item.docID === id));
        const validData: ExecuteAFEDocIDType[] = uniqueAFEDocIDList.filter((item) => item !== undefined) as ExecuteAFEDocIDType[];
        //Make a call to get the Doc Handle, a call to get the AFE Document and write Estimates to DB
        await processAFEDocIDsToDocHandle(validData, authToken, 2, 60000, 1);
       
        
    } catch(errorMessage) {
        
        return errorMessage;
      } finally {
        if(authToken!=='') {
            await executeLogout(authToken, "api/Authentication/Logout", baseURL);
        }
      };
};
//executeAFECall(baseURL,urlPath,docId,key,operator);

