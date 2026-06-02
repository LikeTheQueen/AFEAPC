import { useMemo, useState } from "react";
import type { GLCodeRowData } from 'src/types/interfaces';
import { writeGLAccountlistFromSourceToDB } from 'provider/write';
import { notifyFailure, notifyStandard, useWarnUnsavedChanges } from 'src/helpers/helpers';
import { OperatorDropdownMultiSelect } from 'src/routes/sharedComponents/operatorDropdownMultiSelect';
import { PartnerDropdownMultiSelect } from 'src/routes/sharedComponents/partnerDropdownMultiSelect';
import UniversalPagination from 'src/routes/sharedComponents/pagnation';
import { getDistinctAccountsByProperties, parseRowsToAccountData, readWorkbook, validateHeaders } from 'src/helpers/fileUploadHelpers';

const expectedHeaders = ["account_number", "account_group", "account_description"];

export default function GLFileUpload() {
  const [data, setData] = useState<GLCodeRowData[]>([]);
  const [fileName, setFileName] = useState('');
  const [rowsToShow, setRowsToShow] = useState<GLCodeRowData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const maxRowsToShow = 20;
  const [opAPCIDArray, setOpAPCIDArray] = useState<string[]>([]);
  const [partnerAPCIDArray, setPartnerAPCIDArray] = useState<string[]>([]);
  const [distinctAccountArray, setDistinctAccountArray] = useState<GLCodeRowData[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handlePageChange = (paginatedData: GLCodeRowData[], page: number) => {
          setRowsToShow(paginatedData);
          setCurrentPage(page);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const arrayBuffer = event.target?.result;
      if (!arrayBuffer) return;

      try {
        const { worksheet } = readWorkbook(arrayBuffer as ArrayBuffer);

        const { valid, firstRow } = validateHeaders(worksheet, expectedHeaders)

        if (!valid) {
          notifyFailure(
            `Invalid headers. Expected: ${expectedHeaders.join(", ")}\nFound: ${firstRow?.join(", ")}`
          )
          return;
        }

        const accountMap = parseRowsToAccountData(worksheet, opAPCIDArray, partnerAPCIDArray);

        if(accountMap.length < 1) {
          setFileName(e.target.value);
          e.target.value = '';
          notifyFailure('Dry Well.  No rows found in the uploaded file. There’s nothing to run.')
          return;
        }

      const distinctItemsDisplay = getDistinctAccountsByProperties(accountMap, ["account_number", "account_group", "account_description"]);
      const distinctItemsWrite = getDistinctAccountsByProperties(accountMap, ["account_number", "account_group", "account_description","apc_op_id", "apc_part_id"]);

      setDistinctAccountArray(distinctItemsDisplay);
      setData(prevData => {
        const updatedData = [...prevData];
        const merged = [...updatedData, ...distinctItemsWrite]
        return merged;
      });

      setFileName(e.target.value);
      setIsDisabled(true);
      e.target.value = '';
      } catch (err) {
        notifyFailure('Off-Spec Input.  The uploaded file isn’t Excel. Provide a real spreadsheet to proceed.');
      } 
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClickCancel = () => {
    setData([]); 
    setDistinctAccountArray([]); 
    setIsDisabled(false); 
    setFileName(''); 
    notifyStandard(`Well shut-in, no data flowed to the database\n\n(TLDR: GL Account Codes were NOT saved)`); 
  };

  const handleClickSave = async () => {
    const writeAccountsToDBResults = await writeGLAccountlistFromSourceToDB(data);

    if(!writeAccountsToDBResults.ok) {
      notifyFailure(`Well shut-in, no data flowed to the database\n\n(TLDR: ERROR saving the account codes: ${writeAccountsToDBResults.message})`);
    }

    if(writeAccountsToDBResults.ok) {
      notifyStandard(`Changes tucked in safely.  Now they need to be mapped.\n\n(TLDR: GL Account Codes ARE saved)`);
    }
    
    setIsDisabled(false); 
    setFileName(''); 
    setData([]); 
    setDistinctAccountArray([]); 
  }

  return (
    <>
      <div className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 p-4 mb-5">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 sm:divide-x sm:divide-[var(--darkest-teal)]/40">
          <div className="">
            <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Upload GL Account Codes from the AFE System</h2>
            <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">These are the GL Account Codes on <span className="font-bold">YOUR</span> AFEs, as the Operator and/or the GL Account Codes you will <span className="font-bold">MAP</span> an Operator's GL Account Codes to for Non-Op AFEs, when you are the Partner.</p>
            <br></br><p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">You do not have to upload GL Account Codes for your Partner Addresses unless you will be mapping them.  A single file can be used to upload the GL Account Codes for all the selected Operator or Partner addresses. </p>
            <br></br><p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">Upload an Excel file with the following headers:<span className="font-semibold"> {expectedHeaders.map(header => header.concat(' '))}</span></p>
          </div>

          <div className="col-span-2 grid grid-cols-1 gap-x-2 gap-y-0 ">
            <h1 className="text-base/7 font-medium text-[var(--darkest-teal)] custom-style">Select the Operator and Partner addresses the GL Account Codes are applicable for</h1>

            <div className="flex flex-col lg:flex-row">
              <div className='grow m-2 '>
                <OperatorDropdownMultiSelect
                  onChange={(ids) => { setOpAPCIDArray(ids) }}
                  initialSelectedIds={[]}
                  isDisabled={isDisabled}
                />
              </div>
              <div className='grow m-2'>
                <PartnerDropdownMultiSelect
                  onChange={(ids) => { setPartnerAPCIDArray(ids) }}
                  initialSelectedIds={[]}
                  isDisabled={isDisabled}
                />
              </div>
            </div>
              <div className="mt-4">
                <label
                  htmlFor="file-upload">
                  <input id="file-upload" name="file-upload" type="file" className="sr-only peer" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={(opAPCIDArray.length === 0 && partnerAPCIDArray.length === 0)|| isDisabled} />
                  <span className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-[var(--bright-pink)] peer-disabled:bg-[var(--darkest-teal)]/20 peer-disabled:text-[var(--darkest-teal)]/40
                       peer-disabled:hover:bg-[var(--darkest-teal)]/20 peer-disabled:cursor-not-allowed custom-style">Choose File</span>
                </label>
              </div>
              <p className="mt-4 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">{fileName}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 bg-white">
        <table className="table-auto min-w-full ring-1 ring-[var(--darkest-teal)]/70 rounded-t-md">
          <thead>
            <tr>
              {expectedHeaders.map((header, headerIdx) => (
                <th key={headerIdx} scope="col" className={`border border-[var(--darkest-teal)]/30 custom-style font-medium ${headerIdx === 0 ? 'sm:table-cell' : headerIdx === 1 ? 'sm:table-cell' : 'hidden sm:table-cell'}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border-b border-b-[var(--darkest-teal)]/30">
            {rowsToShow.map((accountRow, accountIdx) => (
              <tr key={accountIdx} className="text-end sm:text-start custom-style-long-text border-l border-l-[var(--darkest-teal)]/30 even:bg-[var(--darkest-teal)]/20">
                <td scope="col" className="text-start pl-2 border-r border-r-[var(--darkest-teal)]/30">{accountRow.account_number}</td>
                <td scope="col" className="px-2 border-r border-r-[var(--darkest-teal)]/30">{accountRow.account_group}</td>
                <td scope="col" className="px-2 border-r border-r-[var(--darkest-teal)]/30">{accountRow.account_description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div 
        hidden={distinctAccountArray.length===0 ? true : false}>
        <UniversalPagination
          data={distinctAccountArray}
          rowsPerPage={maxRowsToShow}
          listOfType="GL Account Codes"
          onPageChange={handlePageChange}
        />
        </div>
      </div>
      <div className="w-full flex justify-end sm:justify-end flex-col sm:flex-row gap-5 mt-5 pt-5 items-center border-t">
        <button
          disabled={data.length > 0 ? false : true}
          className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] justify-end"
          onClick={handleClickCancel}>
          Cancel
        </button>
        <button
          disabled={data.length > 0 ? false : true}
          className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] justify-end"
          onClick={handleClickSave}>
          Save GL Account Code List
        </button>
      </div>
    </>
  )
}