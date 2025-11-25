import * as XLSX from 'xlsx';
import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import type { PartnerRowData } from 'src/types/interfaces';
import { writePartnerlistFromSourceToDB } from 'provider/write';
import { notifyStandard, warnUnsavedChanges } from 'src/helpers/helpers';
import { ToastContainer } from 'react-toastify';
import { useSupabaseData } from 'src/types/SupabaseContext';
import { OperatorDropdownMultiSelect } from 'src/routes/operatorDropdownMultiSelect';

const expectedHeaders = ["Source_id","Name", "Street", "Suite", "City", "State", "Zip", "Country"];
interface PartnerOpList {
    apc_id: string;
    apc_name: string;
};

export default function PartnerFileUpload() {
    const [data, setData] = useState<PartnerRowData[]>([]);
    const [fileName, setFileName] = useState('');
    const [opAPCID, setOpAPCID] = useState('');
    const [rowsLimit] = useState(10);
    const [rowsToShow, setRowsToShow] = useState<PartnerRowData[]>([]);
    const [customPagination, setCustomPagination] = useState<number[] | []>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const { loggedInUser } = useSupabaseData();
    const [opAPCIDArray, setOpAPCIDArray] = useState<string[]>([]);
    const [distinctAccountArray, setDistinctAccountArray] = useState<PartnerRowData[]>([]);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    function filterOpsList() {
        if (!loggedInUser) return [];
        return (loggedInUser.operatorRoles ?? [])
            .filter(operator => operator.role === 7)
            .map(({ apc_id, apc_name }) => ({ apc_id, apc_name }));
    };
    
    const filteredOperators: PartnerOpList[] = filterOpsList();
    
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
    
    useEffect(() => {
      if (!loggedInUser) return;
      if (filteredOperators.length === 1) {
        setOpAPCID(filteredOperators[0].apc_id)
            }
        }, [loggedInUser])
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

      const fullJson = XLSX.utils.sheet_to_json<PartnerRowData>(worksheet, {
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
      
      const multiplePartnerMap: PartnerRowData[] = dataRows.flatMap<PartnerRowData>((row) => {
        const basic = {
        source_id: String(row[0] ?? ''),
        apc_op_id: '',
        name: String(row[1] ?? ''),
        street: String(row[2] ?? ''),
        suite: String(row[3] ?? ''),
        city: String(row[4] ?? ''),
        state: String(row[5] ?? ''),
        zip: String(row[6] ?? ''),
        country: String(row[7] ?? ''),
        active: true,
        };

        const looped = opAPCIDArray.map<PartnerRowData>((operator) => ({
          ...basic,
          apc_op_id: operator
        }))
        return looped;
      });

      const distinctItems = getDistinctItemsByProperties(multiplePartnerMap, ["source_id","name", "street", "suite", "city", "state", "zip", "country"]);
      setDistinctAccountArray(distinctItems);
      setData(prevData => {
        const updatedData = [...prevData];
        const merged = [...updatedData, ...multiplePartnerMap]
        return merged;
      });
      setFileName(e.target.value);
      setIsDisabled(true);
      setRowsToShow(distinctItems.slice(0,rowsLimit));
      e.target.value='';
    };
    reader.readAsArrayBuffer(file);
    };

  function getDistinctItemsByProperties(
    arr: PartnerRowData[],
    props: Array<keyof PartnerRowData>
  ): PartnerRowData[] {
    const seen = new Set<string>();
    const distinctItems: PartnerRowData[] = [];
  
    for (const item of arr) {
      const identifier = props.map((p) => item[p]).join("|"); // Create unique identifier
      if (!seen.has(identifier)) {
        seen.add(identifier);
        distinctItems.push(item);
      }
    }
    return distinctItems;
  }

  return (
    <>
    <div className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 p-4 mb-5">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 sm:divide-x sm:divide-[var(--darkest-teal)]/40">
                <div className="">
                    <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Upload Partner Library from Your AFE System</h2>
                        <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">These are the Partners you will be sending AFEs <span className="font-bold">TO</span>, as the Operator.</p>
                        <br></br><p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">Upload an Excel file with the following headers:<span className="font-semibold"> {expectedHeaders.map(header => header.concat(' '))}</span></p>
                        <br></br><p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">Do <span className="font-semibold">NOT</span> include your own addresses.  Only your Partner Addresses should be uploaded.</p>
                 </div>
                 <div className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 ">
                        <div className="">
                        <h1 className="text-base/7 font-medium text-[var(--darkest-teal)] custom-style">Select an Operator to upload Partners For:</h1>
                        <div className="flex flex-col lg:flex-row w-1/2">
                                        <div className='grow m-3 '>
                                            <OperatorDropdownMultiSelect 
                                                onChange={(ids) => {setOpAPCIDArray(ids)} }
                                                limitedList={true}
                                                initialSelectedIds={[]}
                                                isDisabled={isDisabled}
                                            />
                                            </div>
                                      </div>
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
    
        <div className="bg-white">
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
                       {rowsToShow.map(partnerRow =>(
                        <tr key={partnerRow.source_id} className="text-end sm:text-start custom-style-long-text border-l border-l-[var(--darkest-teal)]/30 even:bg-[var(--darkest-teal)]/20">
                        <td scope="col" className="text-start pl-2 border-r border-r-[var(--darkest-teal)]/30">{partnerRow.source_id}</td>
                        <td scope="col" className="px-2 border-r border-r-[var(--darkest-teal)]/30">{partnerRow.name}
                        <dl className="font-normal sm:hidden">
                    <dt className="sr-only">Address</dt>
                    <dd className="mt-1 truncate text-end ">{partnerRow.street} {partnerRow.suite}</dd>
                    <dd className="mt-1 truncate text-end sm:hidden">{partnerRow.city}, {partnerRow.state}</dd>
                    <dd className="mt-1 truncate text-end sm:hidden">{partnerRow.zip}</dd>
                  </dl>
                        </td>
                        <td scope="col" className="pl-2 border-r border-r-[var(--darkest-teal)]/30 hidden sm:table-cell">{partnerRow.street}</td>
                        <td scope="col" className="pl-2 border-r border-r-[var(--darkest-teal)]/30 hidden sm:table-cell">{partnerRow.suite}</td>
                        <td scope="col" className="pl-2 border-r border-r-[var(--darkest-teal)]/30 hidden sm:table-cell">{partnerRow.city}</td>
                        <td scope="col" className="pl-2 border-r border-r-[var(--darkest-teal)]/30 hidden sm:table-cell">{partnerRow.state}</td>
                        <td scope="col" className="pl-2 border-r border-r-[var(--darkest-teal)]/30 hidden sm:table-cell">{partnerRow.zip}</td>
                        <td scope="col" className="pl-2 border-r border-r-[var(--darkest-teal)]/30 hidden sm:table-cell">{partnerRow.country}</td>
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
            of {distinctAccountArray?.length} Partners
          </div>
          <div className="flex">
            <ul
              className="flex justify-center items-center align-center gap-x-2 z-30"
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
                  className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid bg-white cursor-pointer ${
                    currentPage == index
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
                className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid disabled] ${
                  currentPage == totalPage - 1
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
                    onClick={(e) => {setData([]),setRowsToShow([]),setIsDisabled(false),setFileName(''),notifyStandard(`Well shut-in, no data flowed to the database\n\n(TLDR: Partners were NOT saved)`)}}>
                        Cancel
                    </button>
                    <button
                    disabled={data.length>0 ? false : true}
                    className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] justify-end"
                    onClick={(e) => {writePartnerlistFromSourceToDB(data),setIsDisabled(false),setFileName(''), setData([])}}>
                        Save Partner List
                    </button>
            </div>     
           <ToastContainer />
          {warnUnsavedChanges(data.length>0,"You have NOT saved your Partners to the AFE Partner Connections Library")}
    </>
  )
}