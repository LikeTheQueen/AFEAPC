import fetchAuthToken  from "./executeConnection";
import fetchExecuteAFEData from "./executeGetAFEs";
import { processAFEDocIDsToDocHandle } from "./executeAFEgetDocHandle";
import { transformExecuteAFEsID } from "../types/transform";
import type { ExecuteAFEDocIDType } from "../types/index";
import executeLogout from "./executeLogout";

const baseURL = '/api';
const urlPath = "api/Authentication/ApiKey/Login";
const docId = 'b236d444-ebb2-470d-bcc5-d1ef8c21e4fb';
const key = '9Sr9xstNsdU5L2PUWG236JGR2YZ7l6FiqCxTA41p71gRsIkHl4xo9Au12YIXfO6X';
const operator ='a4367e56-14bf-4bd1-b0f1-fecc7d97b58c';

export default async function executeAFECall() {
    try {
        const authToken = await fetchAuthToken(docId, key, urlPath, baseURL);
        const afeData = await fetchExecuteAFEData(authToken, operator);
        //Transform the results to a type, find unique values and then transform again.
        const afeDocIDList: ExecuteAFEDocIDType[] = transformExecuteAFEsID(afeData);
        const uniqueAFEDocIDList = Array.from(new Set(afeDocIDList.map(item => item.docID))).map(id => afeDocIDList.find(item => item.docID === id));
        const validData: ExecuteAFEDocIDType[] = uniqueAFEDocIDList.filter((item) => item !== undefined) as ExecuteAFEDocIDType[];
        //Make a call to get the Doc Handle, a call to get the AFE Document and write Estimates to DB
        const afeDocHandle = await processAFEDocIDsToDocHandle(validData, authToken, 2, 60000, 1);
        console.log("Phew lots of work.  Now I'll log off");
        const logout = await executeLogout(authToken, "api/Authentication/Logout", baseURL);

    } catch(errorMessage) {
        console.log(errorMessage);
      };
};
executeAFECall();