import { fetchPartnersFromPartnersCrosswalk } from "provider/fetch";
import { useEffect, useMemo, useState } from "react";
import type { PartnerMappingDisplayRecord } from "src/types/interfaces";
import LoadingPage from "src/routes/loadingPage";
import { ToastContainer } from 'react-toastify';
import { ArrowRightIcon, ArrowTurnDownLeftIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { updatePartnerMapping, updatePartnerProcessedMapping } from "provider/write";
import { notifyStandard } from "src/helpers/helpers";
import { OperatorDropdown } from "src/routes/operatorDropdown";

export default function PartnerMappingView() {
    const [partnerMapRecord, setPartnerMapRecord] = useState<PartnerMappingDisplayRecord[] | []>([]);
    const [opAPCID, setOpAPCID] = useState('');
    const [loading, setLoading] = useState(false);
    const [rowsLimit] = useState(5);
    const [rowsToShow, setRowsToShow] = useState<PartnerMappingDisplayRecord[]>([]);
    const [customPagination, setCustomPagination] = useState<number[] | []>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
        
    const nextPage = () => {
        const startIndex = rowsLimit * (currentPage + 1);
        const endIndex = startIndex + rowsLimit;
        const newArray = partnerMapRecord.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(currentPage + 1);
        };
    const changePage = (value: number) => {
        const startIndex = value * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = partnerMapRecord.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(value);
        };
    const previousPage = () => {
        const startIndex = (currentPage - 1) * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = partnerMapRecord.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          setCurrentPage(0);
        }
    };

    useMemo(() => {
        setCustomPagination(
          Array(Math.ceil(partnerMapRecord.length / rowsLimit)).fill(null)
        );
        setTotalPage(
            Math.ceil(partnerMapRecord.length / rowsLimit)
        )
        }, [partnerMapRecord]);

    
    useEffect(() => {
        let isMounted = true;
                async function getPartnerLists() { 
                    setLoading(true);
                    try {
                        const apcPartList = await fetchPartnersFromPartnersCrosswalk(opAPCID);
                        if (isMounted) {
                            setPartnerMapRecord(apcPartList ?? [])
                            setRowsToShow(apcPartList ? apcPartList.slice(0,rowsLimit) : [])
                        }
                    } finally {
                        if (isMounted) {
                            setLoading(false);
                        }
                    }
                }
                if(opAPCID===''){
                    return;
                }
                getPartnerLists();
                return () => {
                    isMounted = false;
                };

    },[opAPCID]);

    const removeMapping = (index: number) => {
        const recordFromList = partnerMapRecord[index];
        const recordToDeletePartnerProcessedTableArray: string[] = [];
        const recordToDeletePartnerProcessedTable = recordFromList.source_partner.source_id;
        const recordToDeleteMappingTableArray: string[] = [];
        const recordToDeleteMappingTable = recordFromList.id;

        setPartnerMapRecord(prevMap => {
            const updatedMap = [...prevMap];
            updatedMap.splice(index, 1);
            return updatedMap;
        });
        setRowsToShow(prevMap => {
            const updatedMap = [...prevMap];
            updatedMap.splice(index, 1);
            return updatedMap;
        });
        async function deletePartnerRecord() {
        recordToDeletePartnerProcessedTableArray.push(recordToDeletePartnerProcessedTable);
        recordToDeleteMappingTableArray.push(recordToDeleteMappingTable);
        updatePartnerMapping(recordToDeleteMappingTableArray, false);
        updatePartnerProcessedMapping(recordToDeletePartnerProcessedTableArray, false);
        };
        deletePartnerRecord();
    };
    return (
        <>
        <div>
            <div className="shadow-lg sm:rounded-lg ring-1 ring-[var(--darkest-teal)]/20 p-4 mb-5">
                                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 sm:divide-x sm:divide-gray-300">
                                            <div className="">
                                                <h2 className="custom-style text-sm sm:text-md xl:text-lg font-medium text-[var(--darkest-teal)]">View and Manage your Partner Mappings</h2>
                                                    <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text px-3">These are the Partners you will be sending AFEs <span className="font-bold">TO</span>, as the Operator.</p>
                                                    <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text px-3">Select your Operating company from the dropdown menu to view mappings.</p>
                                             </div>
                                             <div className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 ">
                                                    <div className="">
                                                    <h1 className="custom-style text-[var(--darkest-teal)] font-medium text-sm xl:text-base">Select an Operator to View Mappings For:</h1>
                                                    <div className="">
                                                    <OperatorDropdown 
                                                        onChange={(id) => {setOpAPCID(id)} }
                                                        limitedList={true}
                                                    />
                                                    </div>
                                                    
                                                    </div>
                                                    
                                             </div>
                                    
                                    </div>
                                          
                            </div>
            
                            {loading ? (
                                <div className="mt-60">
                                    <LoadingPage></LoadingPage>
                                </div>
                            ) : (
                                <>
                                <div 
                                hidden={(opAPCID === '' || partnerMapRecord.length < 1) ? false : true}
                                className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl flow-root overflow-hidden">
                                <h1 className="custom-style text-[var(--darkest-teal)] font-semibold justify-self-center p-2">There are no Partners mapped to the AFE Partner Connections Library or you have not selected an Operator from the dropdown to view Partner Mappings for.</h1> 
                                </div>
                                <div hidden={(opAPCID !== '' && partnerMapRecord.length > 0 ? false : true)} className="divide-y divide-gray-900/20 ">
                                    <div className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl flow-root overflow-hidden">
                                        <div className="py-2 mx-auto max-w-7xl">
                                            <table className="w-full table-fixed">
                                                
                                                <thead className="w-full border-b-2 border-b border-gray-900 ">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="sticky xl:w-1/2 xl:table-cell top-0 z-10 bg-white/75 py-3.5 pr-3 xl:text-left text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter pl-2">
                                                            <div>Partner Address in your AFE System</div>
                                                            <div className="xl:hidden custom-style-long-text font-normal justify-self-center text-md">mapped to the</div>
                                                            <div className="xl:hidden">Partner Address in AFE Partner Connections</div>
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="hidden xl:w-1/20 xl:table-cell sticky top-0 z-10 bg-white/75 py-3.5 pr-3 text-left text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter">
                                                        
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="hidden xl:w-1/2 xl:table-cell xl:pr-3 xl:pl-10 sticky top-0 z-10 bg-white/75 py-3.5 pr-3 text-left text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter">
                                                        <div>Partner Address in AFE Partner Connections</div>
                                                        </th>
                                                        
                                                        <th scope="col" className="hidden xl:w-1/30 xl:table-cell sticky top-0 z-10 bg-white/75 py-3.5 pr-4 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8">
                                                            <span className="sr-only">Delete</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="">
                                                    {rowsToShow.map((partner, partnerIdx) => (
                                                        <tr key={partnerIdx} className={`${partnerIdx !== rowsToShow.length - 1 ? 'border-b border-gray-900 xl:border-gray-300' : ''} items-center`}>
                                                            <td>
                                                                {/* Partner Source Address.  Stays put no matter the screen size.  Truncates when small*/}
                                                                <div className="pt-2 pl-3 pr-5 text-sm/6 xl:pr-3">
                                                                <p className="max-w-full flex-1 truncate xl:whitespace-normal text-sm/6 custom-style font-medium text-[var(--dark-teal)]">
                                                                    {partner.source_partner.name}
                                                                </p>
                                                                <p className="max-w-full flex-1 truncate xl:whitespace-normal text-sm/6 custom-style-long-text text-gray-500">
                                                                    {partner.source_partner.street.concat(' ',
                                                                    `${partner.source_partner.suite === undefined ? '':partner.source_partner.suite.concat(' ')}`,
                                                                    `${partner.source_partner.city === undefined ? '':partner.source_partner.city.concat(', ')}`,
                                                                    `${partner.source_partner.state === undefined ? '':partner.source_partner.state.concat(' ')}`,
                                                                    `${partner.source_partner.zip === undefined ? '':partner.source_partner.zip.concat(' ')}`,
                                                                    `${partner.source_partner.country === undefined ? '':partner.source_partner.country}`)}
                                                                <ArrowTurnDownLeftIcon className="xl:hidden size-7 stroke-2 text-[var(--(darkest-teal))] justify-self-end mr-2"></ArrowTurnDownLeftIcon>
                                                                </p>
                                                                </div>
                                                                {/* Partner APC Address.  Only shows when screen is not xl*/}
                                                                <div className="-mt-5 pl-3 pr-5 text-sm/6 xl:pr-3 xl:hidden">
                                                                <p className="max-w-full flex-1 truncate custom-style font-medium text-[var(--dark-teal)] ">
                                                                    {partner.apc_partner.name}
                                                                </p>
                                                                <p className="max-w-full flex-1 truncate custom-style-long-text text-gray-500">
                                                                    {partner.apc_partner.street!.concat(' ',
                                                                    `${partner.apc_partner.suite === undefined ? '':partner.apc_partner.suite.concat(' ')}`,
                                                                    `${partner.apc_partner.city === undefined ? '':partner.apc_partner.city.concat(', ')}`,
                                                                    `${partner.apc_partner.state === undefined ? '':partner.apc_partner.state.concat(' ')}`,
                                                                    `${partner.apc_partner.zip === undefined ? '':partner.apc_partner.zip.concat(' ')}`,
                                                                    `${partner.apc_partner.country === undefined ? '':partner.apc_partner.country}`)}
                                                                </p>
                                                                <div className="m-2 size-6 pt-1 justify-self-end">
                                                                            <button
                                                                    onClick={() => {removeMapping(partnerIdx),notifyStandard(`Partner pipeline shut in successfully.\n\n(TLDR: Partner Mapping successfully deleted)`)}}
                                                                    className="text-red-500 hover:text-red-900 cursor-pointer ">
                                                                    <TrashIcon className="size-5" />
                                                                </button>
                                                                </div>
                                                                </div>
                                                            </td>
                                                            {/* Arrow Icon Only shows when screen is not xl*/}
                                                            <td className="hidden xl:table-cell">
                                                                <div className="size-6 justify-self-center">
                                                                            <ArrowRightIcon></ArrowRightIcon>
                                                                </div>
                                                            </td>
                                                            {/* Partner APC Address.  Only shows when screen is xl  Padding matches header column*/}
                                                            <td className="hidden xl:table-cell ">
                                                                <p className="pt-4 xl:pr-3 xl:pl-10 text-sm/6 custom-style font-medium text-[var(--dark-teal)]">
                                                                    {partner.apc_partner.name}
                                                                </p>
                                                                <p className="mt-1 xl:pr-3 xl:pl-10 text-sm/6 custom-style-long-text text-gray-500">
                                                                    {partner.apc_partner.street!.concat(' ',
                                                                    `${partner.apc_partner.suite === undefined ? '':partner.apc_partner.suite.concat(' ')}`,
                                                                    `${partner.apc_partner.city === undefined ? '':partner.apc_partner.city.concat(', ')}`,
                                                                    `${partner.apc_partner.state === undefined ? '':partner.apc_partner.state.concat(' ')}`,
                                                                    `${partner.apc_partner.zip === undefined ? '':partner.apc_partner.zip.concat(' ')}`,
                                                                    `${partner.apc_partner.country === undefined ? '':partner.apc_partner.country}`)}
                                                                </p>
                                                            </td>
                                                            <td className="hidden xl:table-cell justify-self-center">
                                                                <div className="size-6 justify-self-center pt-1 mr-3">
                                                                            <button
                                                                    onClick={() => {removeMapping(partnerIdx),notifyStandard(`Partner pipeline shut in successfully.\n\n(TLDR: Partner Mapping successfully deleted)`)}}
                                                                    className="text-red-500 hover:text-red-900 cursor-pointer ">
                                                                    <TrashIcon className="size-5" />
                                                                </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                    <div className="w-full flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-2 px-1 items-center">
                                  <div className="text-sm/6 text-[var(--darkest-teal)] custom-style font-medium">
                                    Showing {currentPage == 0 ? 1 : currentPage * rowsLimit + 1} to{" "}
                                    {currentPage == totalPage - 1
                                      ? partnerMapRecord?.length
                                      : (currentPage + 1) * rowsLimit}{" "}
                                    of {partnerMapRecord?.length} Partners
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
                                </div>
                                </>
                                
                            )}
        </div>
        <ToastContainer />
        </>
    )
}