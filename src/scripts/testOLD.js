import { transformExecuteAFEsID } from "../types/transform";
//import type { ExecuteAFEDocIDType } from "../types/index";
import { processDocIDs } from "./executeAFEgetDocHandle";

const baseURL='/api';
const urlPath = "/api/Documents/Reporting/Execute";
const AuthenticationToken = '1uJWmfAyFze3s5Op0M9kXi2eU';
const Columns = [
  "DOCUMENT_ID",
  "AFENUMBER_DOC/AFENUMBER" ,
  "DESCRIPTION" ,
  "CUSTOM/AFE_TYPE/VALUE" ,
  "TOTAL_GROSS_ESTIMATE" ,
  "VERSION_STRING" ,
  "SUPPLEMENTAL_GROSS_ESTIMATE" ,
  "OPERATING_COMPANY/COMNAME" ,
  "OPERATING_COMPANY/CUSTOM/INTEGRATION_ID" ,
  "OPERATOR_WI" ,
  
  "STATUS" ,
  "INTERNAL_APPROVAL_DATE" ,
  "!LAST_MODIFIED_DATE" ,
  "LEGACY_CHAINID" ,
  "LEGACY_AFEID" ,
  "CHAIN_VERSION" ,


];

export default async function fetchExecuteAFEDocID() {
  console.log('this is here');
  var requestOptions = {
    method: 'POST',
    body: JSON.stringify ({ AuthenticationToken: AuthenticationToken, 
      DocumentType: 'AFE',
      ReportType: "AFEs - Partners",
      Columns: Columns,
      SortColumns: [], 
      Filter: [
        {
          "Column": "!LAST_MODIFIED_DATE",
          "Operator": ">",
          "Value": "2018-01-01"
      }
      ],
    IncludeRawData: false,
    MaxRowCount: 1}),
    headers: {"Content-type": "application/json"}
  };
  try {
    console.log('hi');
    const response = await fetch(baseURL+urlPath, requestOptions);
  if (!response.ok) {
  console.error('Request failed with status:', response.status);
  const errorText = await response.text();
  console.error('Response body:', errorText);
  return [];
}

if(response.ok) {
  const jsonResponse = await response.json();
  //const afeList: ExecuteAFEDocIDType[] = transformExecuteAFEsID(jsonResponse.Rows);
  console.log(jsonResponse.Rows[0].Data);
  console.log(typeof(jsonResponse));
  return jsonResponse;
  //return importAFESupabase('AFE',afeList);
  //return processDocIDs(afeList, AuthenticationToken, 5, 6000, 3);
}
  }
  catch (error) {
    console.log(error);
    return [];
  }
};

fetchExecuteAFEDocID();