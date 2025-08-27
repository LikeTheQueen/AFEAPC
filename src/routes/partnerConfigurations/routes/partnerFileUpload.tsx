import * as XLSX from 'xlsx';
import { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import type { PartnerRowData } from 'src/types/interfaces';
import { writePartnerlistFromSourceToDB } from 'provider/write';
import { notifyStandard, warnUnsavedChanges } from 'src/helpers/helpers';
import { ToastContainer } from 'react-toastify';

const expectedHeaders = ["Source_id","Name", "Street", "Suite", "City", "State", "Zip", "Country"];

export default function PartnerFileUpload() {
    const [data, setData] = useState<PartnerRowData[]>([]);
    const [fileName, setFileName] = useState('');
    const [rowsLimit] = useState(10);
    const [rowsToShow, setRowsToShow] = useState<PartnerRowData[]>([]);
    const [customPagination, setCustomPagination] = useState<number[] | []>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const nextPage = () => {
    const startIndex = rowsLimit * (currentPage + 1);
    const endIndex = startIndex + rowsLimit;
    const newArray = data.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(currentPage + 1);
    };
    const changePage = (value: number) => {
    const startIndex = value * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = data.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(value);
    };
    const previousPage = () => {
    const startIndex = (currentPage - 1) * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = data.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(0);
    }
    };
    useMemo(() => {
    setCustomPagination(
      Array(Math.ceil(data.length / rowsLimit)).fill(null)
    );
    setTotalPage(
        Math.ceil(data.length / rowsLimit)
    )
    }, [data]);
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    console.log(file,'the file')
    if (!file) return;

    const reader = new FileReader();
console.log(data,'THE DATA')
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
      console.log(firstRow,'THIS IS THE FIRST WO')
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

      const mappedData: PartnerRowData[] = dataRows.map((row) => ({
        source_id: String(row[0] ?? ''),
        apc_op_id: String('a4367e56-14bf-4bd1-b0f1-fecc7d97b58c'),
        name: String(row[1] ?? ''),
        street: String(row[2] ?? ''),
        suite: String(row[3] ?? ''),
        city: String(row[4] ?? ''),
        state: String(row[5] ?? ''),
        zip: String(row[6] ?? ''),
        country: String(row[7] ?? ''),
        active: true,

      }))
      setData(mappedData);
      setFileName(e.target.value)
      setRowsToShow(mappedData.slice(0,rowsLimit))
      e.target.value='';
    };
    reader.readAsArrayBuffer(file);
    };

  return (
    <>
    <div className="shadow-lg sm:rounded-lg ring-1 ring-[var(--darkest-teal)]/20">
      <div className="py-3 px-2">
        <h2 className="custom-style text-lg font-semibold text-[var(--darkest-teal)]">Upload Partner Library from AFE System</h2>
        <div className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text px-3">
          <p>
            Upload an Excel file with the following headers:<span className="font-semibold"> {expectedHeaders.map(header => header.concat(' '))}</span>
            <br></br>Do <span className="font-semibold">not</span> include your own addresses.  Only Partner Addresses should be uploaded.
          </p>
        </div>
        <div className="mt-5 px-3">
          <div className="flex justify-left">
                    <div className="flex justify-left">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-[var(--darkest-teal)] font-semibold text-white hover:text-white ">
                        <span className="rounded-md bg-[var(--darkest-teal)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--bright-pink)] custom-style">Choose File</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".xlsx, .xls" onChange={handleFileUpload} />
                      </label>
                    </div>

                </div>
                <p className="mt-4 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">{fileName}</p>
        </div>
      </div>
    </div>  
        <div className="mt-5">
                <table className="table-auto min-w-full">
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
                        <td scope="col" className="pl-2 border-r border-r-[var(--darkest-teal)]/30">{partnerRow.name}
                        <dl className="font-normal sm:hidden">
                    <dt className="sr-only">Address</dt>
                    <dd className="mt-1 truncate text-end">{partnerRow.street} {partnerRow.suite}</dd>
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
              ? data?.length
              : (currentPage + 1) * rowsLimit}{" "}
            of {data?.length} Partners
          </div>
          <div className="flex">
            <ul
              className="flex justify-center items-center align-center gap-x-[10px] z-30"
              role="navigation"
              aria-label="Pagination">
              <li
                className={`flex items-center justify-center w-[32px] rounded-[6px] h-[32px] border-[1px] border-solid disabled] ${
                  currentPage == 0
                    ? "border-[var(--darkest-teal)]/10 text-[var(--darkest-teal)]/20 pointer-events-none"
                    : "cursor-pointer border-[var(--darkest-teal)]/30 hover:border-[var(--bright-pink)] hover:border-[2px]"
                }`}
                onClick={previousPage}>
                <ChevronLeftIcon></ChevronLeftIcon>
              </li>
              {customPagination?.map((data, index) => (
                <li
                  className={`flex items-center justify-center w-[32px] rounded-[6px] h-[32px] border-[2px] border-solid bg-white cursor-pointer ${
                    currentPage == index
                      ? "border-[var(--bright-pink)]"
                      : "border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)]"
                  }`}
                  onClick={() => changePage(index)}
                  key={index}
                >
                  {index + 1}
                </li>
              ))}
              <li
                className={`flex items-center justify-center w-[32px] rounded-[6px] h-[32px] border-[1px] border-solid disabled] ${
                  currentPage == totalPage - 1
                    ? "border-[var(--darkest-teal)]/10 text-[var(--darkest-teal)]/20 pointer-events-none"
                    : "cursor-pointer border-[var(--darkest-teal)]/30 hover:border-[var(--bright-pink)] hover:border-[2px]"
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
                    className="w-full sm:w-60 rounded-md bg-white outline-[var(--darkest-teal)] outline-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:outline-none px-3 py-2 text-sm font-semibold custom-style text-[var(--darkest-teal)] shadow-xs hover:bg-[var(--bright-pink)] hover:text-white hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] justify-end"
                    onClick={(e) => {setData([]),setRowsToShow([]),setFileName(''),notifyStandard(`Well shut-in, no data flowed to the database\n\n(TLDR: Partners were NOT saved)`)}}>
                        Cancel
                    </button>
                    <button
                    disabled={data.length>0 ? false : true}
                    className="w-full sm:w-60 rounded-md bg-[var(--dark-teal)] disabled:bg-gray-300 disabled:text-gray-500 px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] justify-end"
                    onClick={(e) => {writePartnerlistFromSourceToDB(data),setFileName(''),notifyStandard(`Changes tucked in safely.  Now they need to be mapped.\n\n(TLDR: Partners ARE saved)`)}}>
                        Save Partner List
                    </button>
            </div>     
           <ToastContainer />
          {warnUnsavedChanges(data.length>0,"You have NOT saved your Partners to the AFE Partner Connections Library")}
    </>
  )
}