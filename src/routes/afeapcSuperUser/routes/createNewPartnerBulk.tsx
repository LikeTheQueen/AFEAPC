import { useState } from "react";
import type { AddressType, OperatorType, UnrelatedPartnerRowData } from 'src/types/interfaces';
import { addUnrelatedPartnerSupabase } from 'provider/write';
import { notifyFailure, notifyStandard } from 'src/helpers/helpers';
import { ToastContainer } from 'react-toastify';
import UniversalPagination from 'src/routes/sharedComponents/pagnation';
import { parseRowsToUnrelatedPartnerData, readWorkbook, validateHeaders } from 'src/helpers/fileUploadHelpers';

const expectedHeaders = ["Name", "Street", "Suite", "City", "State", "Zip", "Country"];

export default function PartnerFileUploadAFEAPC() {
    const [data, setData] = useState<{ operator: OperatorType; address: AddressType }[]>([]);
    const [fileName, setFileName] = useState('');
    const [rowsToShow, setRowsToShow] = useState<UnrelatedPartnerRowData[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const maxRowsToShow = 20;
    const [distinctPartnerArray, setDistinctPartnerArray] = useState<UnrelatedPartnerRowData[]>([]);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handlePageChange = (paginatedData: UnrelatedPartnerRowData[], page: number) => {
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

        const partnerMap = parseRowsToUnrelatedPartnerData(worksheet);
        
        if(partnerMap.operatorRows.length < 1 || partnerMap.partnerRows.length < 1) {
          setFileName(e.target.value);
          e.target.value = '';
          notifyFailure('Dry Well.  No rows found in the uploaded file. There’s nothing to run.')
          return;
        }

        setDistinctPartnerArray(partnerMap.partnerRows.sort((a, b) => a.name.localeCompare(b.name)));
        setData(partnerMap.operatorRows);
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
    setDistinctPartnerArray([]);
    setIsDisabled(false);
    setFileName('');
    notifyStandard(`Well shut-in, no data flowed to the database\n\n(TLDR: Partners were NOT saved)`);
  };

  const handleClickSave = async () => {
    for (const {operator, address } of data) {
        const writePartnerListResult = await addUnrelatedPartnerSupabase(operator.name, address);
    if(writePartnerListResult.ok) {
      notifyStandard(`Changes tucked in safely.  Now they need to be mapped.\n\n(TLDR: Partners ARE saved)`);
    }
    if(!writePartnerListResult.ok) {
      notifyFailure(`There was an error adding the partner list.\n\n(TLDR: ${writePartnerListResult.message})`);
    }
    setData([]);
    setDistinctPartnerArray([]);
    setIsDisabled(false);
    setFileName('');
    }
  };


  return (
    <>
    <div className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 p-4 mb-5">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 sm:divide-x sm:divide-[var(--darkest-teal)]/40">
            <div className="">
                <h2 className="text-sm/6 2xl:text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Upload Partner Library from Excel</h2>
                <p className="text-sm/6 2xl:text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">These are the Partners in the AFE Partner Connection Library</p>
                <br></br><p className="text-sm/6 2xl:text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">Upload an Excel file with the following headers:<span className="font-semibold"> {expectedHeaders.map(header => header.concat(' '))}</span></p>
                <div className="">
                    <div className="mt-4 flex justify-end pr-6">
                        <label
                            htmlFor="file-upload">
                            <input id="file-upload" name="file-upload" type="file" className="sr-only peer" accept=".xlsx, .xls" onChange={handleFileUpload} />
                            <span className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-[var(--bright-pink)] peer-disabled:bg-[var(--darkest-teal)]/20 peer-disabled:text-[var(--darkest-teal)]/40
                peer-disabled:hover:bg-[var(--darkest-teal)]/20 peer-disabled:cursor-not-allowed custom-style">Choose File</span>
                        </label>
                    </div>
                    <p className="mt-4 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">{fileName}</p>
                </div>
            </div>
            <div className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 ">
                <div className="bg-white">
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
                            {rowsToShow.map((partnerRow, partnerIdx) => (
                                <tr key={partnerIdx} className="text-end sm:text-start custom-style-long-text border-l border-l-[var(--darkest-teal)]/30 even:bg-[var(--darkest-teal)]/20">
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
                <div hidden={distinctPartnerArray.length < 1}>
                    <UniversalPagination
                        data={distinctPartnerArray}
                        rowsPerPage={maxRowsToShow}
                        listOfType='Partners'
                        onPageChange={handlePageChange}
                    ></UniversalPagination>
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
                        Save Partner List
                    </button>
                </div>

            </div>

        </div>

    </div>
        <ToastContainer icon={false} />  
    </>
  )
}