
import { transformExecuteAFEData } from "../types/transform";
import type { ExecuteAFEDataType } from "../types/interfaces";
import { writeExecuteAFEtoSupabase } from "../../provider/writeExecuteRecords";

const baseURL = '/api';
const urlPath = "/api/Documents/Reporting/Execute";

const Columns = [
  "DOCUMENT_ID",
  "AFENUMBER_DOC/AFENUMBER",
  "DESCRIPTION",
  "CUSTOM/AFE_TYPE/VALUE",
  "TOTAL_GROSS_ESTIMATE",
  "VERSION_STRING",
  "SUPPLEMENTAL_GROSS_ESTIMATE",
  "OPERATING_COMPANY/COMNAME",
  "OPERATOR_WI",
  "$COMPANY/DOCUMENT_ID",
  "$COMPANY/COMNAME",
  "$WI_PERCENT",
  "$STATUS",
  "STATUS",
  "INTERNAL_APPROVAL_DATE",
  "!LAST_MODIFIED_DATE",
  "LEGACY_CHAINID",
  "LEGACY_AFEID",
  "CHAIN_VERSION"
];
const Filter = [
  {

    "Column": "!LAST_MODIFIED_DATE",
    "Operator": ">",
    "Value": "2025-04-01"
  },
  {
    "Join": "AND",
    "Column": "$STATUS",
    "Operator": "=",
    "Value": "No Status"
  },
  {
    "LeftParenthesis": "(",
    "Column": "STATUS",
    "Operator": "=",
    "Value": "FAPP"
  },
  {
    "RightParenthesis": ")",
    "Join": "OR",
    "Column": "STATUS",
    "Operator": "=",
    "Value": "IAPP"
  },
  {
    "Join": "AND",
    "Column": "CUSTOM/OPERATOR_STATUS",
    "Operator": "=",
    "Value": "Operated"

  },
  {
    "Join": "AND",
    "Column": "OUR_WI",
    "Operator": "<",
    "Value": "100"

  }
];

export default async function fetchExecuteAFEData(authToken: string, operator: string) {

  var requestOptions: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      AuthenticationToken: authToken,
      DocumentType: 'AFE',
      ReportType: "AFE/PARTNER",
      Columns: Columns,
      SortColumns: [],
      Filter: Filter,
      IncludeRawData: true,
      MaxRowCount: 10
    }),
    headers: { "Content-type": "application/json" }
  };
  try {
    const response = await fetch(baseURL + urlPath, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Request failed with status:', response.status);
      console.error('Response body:', errorText);
      return [];
    }

    if (response.ok) {
      const jsonResponse = await response.json();
      const afeList: ExecuteAFEDataType[] = transformExecuteAFEData(jsonResponse.Rows, operator);
      writeExecuteAFEtoSupabase('AFE_EXECUTE', afeList);
      console.log("Step 2: Get the list of AFE Doc IDs AFTER writing to DB ", afeList);
      console.log("But also return a list of Rows ", jsonResponse.Rows)
      return jsonResponse.Rows;
    }
  }
  catch (error) {
    console.log(error);
    return [];
  }
};

