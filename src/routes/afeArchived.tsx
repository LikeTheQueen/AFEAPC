import executeAFECall from "src/scripts/executeReadWritePromise";
const baseURL = '/api';
const urlPath = "api/Authentication/ApiKey/Login";
const docId = '6d2f6718-f745-421a-b8d9-0ae03f853b01';
const key = 'KjOVeS5N24jQtMPxfLR9Fr3d6fpWCGNCgoYXizfcBqjuHuMtKlBcjjQjh5xOF35G';
const operator ='a4367e56-14bf-4bd1-b0f1-fecc7d97b58c';
executeAFECall(baseURL,urlPath,docId,key,operator);
export default function AFEArchived() {
    return <div>This is a hold for the AFE Archived Screen</div>;
  }