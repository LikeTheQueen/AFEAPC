import * as XLSX from 'xlsx';
import { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import type { GLCodeRowData } from 'src/types/interfaces';
import { writeGLAccountlistFromSourceToDB } from 'provider/write';
import { notifyStandard, warnUnsavedChanges } from 'src/helpers/helpers';
import { ToastContainer } from 'react-toastify';
import { OperatorDropdownMultiSelect } from 'src/routes/operatorDropdownMultiSelect';
import { PartnerDropdownMultiSelect } from 'src/routes/partnerDropdownMultiSelect';

const expectedHeaders = ["account_number","account_group", "account_description"];

export default function GLFileUpload() {
    const [data, setData] = useState<GLCodeRowData[]>([]);
    const [fileName, setFileName] = useState('');
    const [rowsLimit] = useState(50);
    const [rowsToShow, setRowsToShow] = useState<GLCodeRowData[]>([]);
    const [customPagination, setCustomPagination] = useState<number[] | []>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [opAPCIDArray, setOpAPCIDArray] = useState<string[]>([]);
    const [partnerAPCIDArray, setPartnerAPCIDArray]= useState<string[]>([]);
    const [distinctAccountArray, setDistinctAccountArray] = useState<GLCodeRowData[]>([]);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);


    const nextPage = () => {
    const startIndex = rowsLimit * (currentPage + 1);
    const endIndex = startIndex + rowsLimit;
    const newArray = distinctAccountArray.slice(startIndex, endIndex);
    
    setRowsToShow(newArray);
    setCurrentPage(currentPage + 1);
    };
    const changePage = (value: number) => {
    const startIndex = value * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = distinctAccountArray.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(value);
    };
    const previousPage = () => {
    const startIndex = (currentPage - 1) * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = distinctAccountArray.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(0);
    }
    };
    useMemo(() => {
    setCustomPagination(
      Array(Math.ceil(distinctAccountArray.length / rowsLimit)).fill(null)
    );
    setTotalPage(
        Math.ceil(distinctAccountArray.length / rowsLimit)
    )
    }, [distinctAccountArray]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const arrayBuffer = event.target?.result;
      if (!arrayBuffer) return;

      const data = new Uint8Array(arrayBuffer as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const fullJson = XLSX.utils.sheet_to_json<GLCodeRowData>(worksheet, {
        defval: '',
        raw: false,
      });

      const firstRow = XLSX.utils.sheet_to_json(worksheet, {header: 1})[0] as string[];
      const headersMatch = expectedHeaders.every((expected, i) =>
        String(firstRow?.[i] ?? '').trim().toLowerCase() === expected.toLowerCase()
      );

      if (!headersMatch) {
        alert(
          `Invalid headers. Expected: ${expectedHeaders.join(", ")}\nFound: ${firstRow?.join(", ")}`
        );
        return;
      }

      const rows: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '', 
      });

      const dataRows = rows.slice(1);
      const accountsToOperators: GLCodeRowData[] = dataRows.flatMap<GLCodeRowData>((row) => {
        const basic = {
        account_number: String(row[0] ?? ''),
        account_group: String(row[1] ?? ''),
        account_description: String(row[2] ?? ''),
        apc_op_id: '',
        apc_part_id: '',
        id: null
        };

        const looped = opAPCIDArray.map<GLCodeRowData>((operator) => ({
          ...basic,
          apc_op_id: operator,
          apc_part_id: null
        }))
        
        return looped;
      });
      
      const accountsToPartners: GLCodeRowData[] = dataRows.flatMap<GLCodeRowData>((row) => {
        const basic = {
        account_number: String(row[0] ?? ''),
        account_group: String(row[1] ?? ''),
        account_description: String(row[2] ?? ''),
        apc_op_id: '',
        apc_part_id: '',
        id: null
        };

        const looped = partnerAPCIDArray.map<GLCodeRowData>((partner) => ({
          ...basic,
          apc_op_id: null,
          apc_part_id: partner
        }))
        
        return looped;
      });
      
      const mergedArrays = [...accountsToOperators, ...accountsToPartners];
      const distinctItems = getDistinctItemsByProperties(mergedArrays, ["account_number","account_group", "account_description"]);
      setDistinctAccountArray(distinctItems);
      setData(prevData => {
        const updatedData = [...prevData];
        const merged = [...updatedData, ...accountsToOperators, ...accountsToPartners]
        return merged;
      });

      setFileName(e.target.value);
      setIsDisabled(true);
      setRowsToShow(distinctItems.slice(0,rowsLimit))
      e.target.value='';
    };
    reader.readAsArrayBuffer(file);
    };


function getDistinctItemsByProperties(
  arr: GLCodeRowData[],
  props: Array<keyof GLCodeRowData>
): GLCodeRowData[] {
  const seen = new Set<string>();
  const distinctItems: GLCodeRowData[] = [];

  for (const item of arr) {
    const identifier = props.map((p) => item[p]).join("|"); // Create unique identifier
    if (!seen.has(identifier)) {
      seen.add(identifier);
      distinctItems.push(item);
    }
  }
  return distinctItems;
}
console.log('the array', opAPCIDArray); 
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
                <div className='grow m-4 '>
                    <OperatorDropdownMultiSelect 
                        onChange={(ids) => {setOpAPCIDArray(ids)} }
                        limitedList={true}
                        initialSelectedIds={[]}
                        isDisabled={isDisabled}
                    />
                    </div>
                    <div className='grow m-4'>
                    <PartnerDropdownMultiSelect 
                        onChange={(ids) => {setPartnerAPCIDArray(ids)} }
                        limitedList={true}
                        initialSelectedIds={[]}
                        isDisabled={isDisabled}
                    />
                    </div>
              </div>

                    <div className="">
                   
                    <div className="mt-4">
                              <label
                                htmlFor="file-upload">
                                <input id="file-upload" name="file-upload" type="file" className="sr-only peer" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={opAPCIDArray.length===0}/>
                                <span className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-[var(--bright-pink)] peer-disabled:bg-[var(--darkest-teal)]/20 peer-disabled:text-[var(--darkest-teal)]/40
                       peer-disabled:hover:bg-[var(--darkest-teal)]/20 peer-disabled:cursor-not-allowed custom-style">Choose File</span>
                              </label>
                            </div>
                        <p className="mt-4 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">{fileName}</p>
                    </div> 
             </div>
    </div> 
      </div>   
        <div className="mt-5 bg-white">
                <table className="table-auto min-w-full ring-1 ring-[var(--darkest-teal)]/70 rounded-t-md">
                    <thead>
                    <tr>
                        {expectedHeaders.map((header, headerIdx) => (
                            <th key={headerIdx} scope="col" className={`border border-[var(--darkest-teal)]/30 custom-style font-medium ${headerIdx===0 ? 'sm:table-cell' : headerIdx===1 ? 'sm:table-cell' : 'hidden sm:table-cell'}`}>
                                {header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="border-b border-b-[var(--darkest-teal)]/30">
                       {rowsToShow.map((accountRow,accountIdx) =>(
                        <tr key={accountIdx} className="text-end sm:text-start custom-style-long-text border-l border-l-[var(--darkest-teal)]/30 even:bg-[var(--darkest-teal)]/20">
                        <td scope="col" className="text-start pl-2 border-r border-r-[var(--darkest-teal)]/30">{accountRow.account_group}</td>
                        <td scope="col" className="px-2 border-r border-r-[var(--darkest-teal)]/30">{accountRow.account_number}</td>
                        <td scope="col" className="px-2 border-r border-r-[var(--darkest-teal)]/30">{accountRow.account_description}</td>
                        </tr>
                       ))}
                    </tbody>
                </table>
            </div>
             <div className="w-full flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-2 px-1 items-center">
          <div className="text-sm/6 text-[var(--darkest-teal)] custom-style font-medium">
            Showing {currentPage == 0 ? 1 : currentPage * rowsLimit + 1} to{" "}
            {currentPage == totalPage - 1
              ? distinctAccountArray?.length
              : (currentPage + 1) * rowsLimit}{" "}
            of {distinctAccountArray?.length} GL Account Codes
          </div>
          <div className="flex">
            <ul
              className="flex justify-center items-center align-center gap-x-[10px] z-30"
              role="navigation"
              aria-label="Pagination">
              <li
                className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid disabled] ${
                  currentPage == 0
                    ? "bg-white border-[var(--darkest-teal)]/10 text-[var(--darkest-teal)]/20 pointer-events-none"
                    : "bg-white cursor-pointer border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                }`}
                onClick={previousPage}>
                <ChevronLeftIcon></ChevronLeftIcon>
              </li>
              {customPagination?.map((data, index) => (
                <li
                  className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid bg-white cursor-pointer ${currentPage == index
                    ? "bg-white border-[var(--bright-pink)] pointer-events-none"
                    : "bg-white border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                    }`}
                  onClick={() => changePage(index)}
                  key={index}
                >
                  {index + 1}
                </li>
              ))}
              <li
              className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid disabled] ${currentPage == totalPage - 1
                ? "bg-white border-[var(--darkest-teal)]/10 text-[var(--darkest-teal)]/20 pointer-events-none"
                : "bg-white cursor-pointer border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                }`}
              onClick={nextPage}>
                <ChevronRightIcon></ChevronRightIcon>
              </li>
            </ul>
          </div>
        </div>   
        <div className="w-full flex justify-end sm:justify-end flex-col sm:flex-row gap-5 mt-5 pt-5 items-center border-t">
            <button
                    disabled={data.length>0 ? false : true}
                    className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] justify-end"
                    onClick={(e) => {setData([]),setRowsToShow([]),setIsDisabled(false),setFileName(''),notifyStandard(`Well shut-in, no data flowed to the database\n\n(TLDR: GL Account Codes were NOT saved)`)}}>
                        Cancel
                    </button>
                    <button
                    disabled={data.length>0 ? false : true}
                    className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] justify-end"
                    onClick={(e) => {writeGLAccountlistFromSourceToDB(data),setIsDisabled(false),setFileName(''),notifyStandard(`Changes tucked in safely.  Now they need to be mapped.\n\n(TLDR: GL Account Codes ARE saved)`), setData([])}}>
                        Save GL Account Code List
                    </button>
            </div>     
           <ToastContainer />
          {warnUnsavedChanges(data.length>0,"You have NOT saved your GL Account Codes to AFE Partner Connections")}
    </>
  )
}