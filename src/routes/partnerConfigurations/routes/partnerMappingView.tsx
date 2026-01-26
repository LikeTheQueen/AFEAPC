import { fetchPartnersFromPartnersCrosswalk } from "provider/fetch";
import { useEffect, useState } from "react";
import type { PartnerMappingDisplayRecord } from "src/types/interfaces";
import LoadingPage from "src/routes/loadingPage";
import { ToastContainer } from 'react-toastify';
import { ArrowRightIcon, ArrowTurnDownLeftIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import { updatePartnerMapping, updatePartnerProcessedMapping } from "provider/write";
import { notifyStandard } from "src/helpers/helpers";
import { OperatorDropdown } from "src/routes/sharedComponents/operatorDropdown";
import UniversalPagination from "src/routes/sharedComponents/pagnation";

export default function PartnerMappingView() {
    const [partnerMapRecord, setPartnerMapRecord] = useState<PartnerMappingDisplayRecord[] | []>([]);
    const [opAPCID, setOpAPCID] = useState('');
    const [loading, setLoading] = useState(false);
    const [rowsToShow, setRowsToShow] = useState<PartnerMappingDisplayRecord[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const maxRowsToShow = (5);
        
    const handlePageChange = (paginatedData: PartnerMappingDisplayRecord[], page: number) => {
                  setRowsToShow(paginatedData);
                  setCurrentPage(page);
    };
 
    useEffect(() => {
        let isMounted = true;
                async function getPartnerLists() { 
                    setLoading(true);
                    try {
                        const apcPartList = await fetchPartnersFromPartnersCrosswalk(opAPCID);
                        if (isMounted) {
                            setPartnerMapRecord(apcPartList ?? [])
                            
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

    const removeMapping = (partnerIDX: number) => {
        const actualIndex = currentPage * maxRowsToShow + partnerIDX;
        const recordFromList = partnerMapRecord[actualIndex];
        const recordToDeletePartnerProcessedTableArray: string[] = [];
        const recordToDeletePartnerProcessedTable = recordFromList.source_partner.source_id;
        const recordToDeleteMappingTableArray: string[] = [];
        const recordToDeleteMappingTable = recordFromList.id;

        setPartnerMapRecord(prevMap => {
            const updatedMap = [...prevMap];
            updatedMap.splice(actualIndex, 1);
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
                <div className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 p-4 mb-5">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 sm:divide-x sm:divide-[var(--darkest-teal)]/40">
                        <div className="">
                            <h2 className="text-sm/6 2xl:text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">View and Manage your Partner Mappings</h2>
                            <p className="text-sm/6 2xl:text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">These are the Partners you will be sending AFEs <span className="font-bold">TO</span>, as the Operator.</p>
                            <br></br><p className="text-sm/6 2xl:text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">Select your Operating company from the dropdown menu to view mappings.</p>
                        </div> 
                        <div className="col-span-1 grid grid-cols-1 gap-x-8 gap-y-10 ">
                            <div className="">
                                <h1 className="text-sm/6 2xl:text-sm/6 2xl:text-base/7 font-medium text-[var(--darkest-teal)] custom-style">Select an Operator to View Mappings For:</h1>
                                <div className="">
                                    <OperatorDropdown
                                        value={opAPCID}
                                        onChange={(id) => { setOpAPCID(id) }}
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
                            hidden={(opAPCID === '') ? false : true}
                            className="rounded-lg bg-white shadow-2xl outline-1 outline-offset-1 outline-[var(--dark-teal)] flow-root overflow-hidden">
                            <div className="my-0 max-h-80 flex items-center justify-center">
                                <h2 className="font-normal text-[var(--darkest-teal)] custom-style-long-text p-2 text-sm/6 xl:text-base/7">Select an Operator from the dropdown to view Partner Mappings for.</h2>
                            </div>
                        </div>
                        <div
                            hidden={(opAPCID !== '' && partnerMapRecord.length < 1) ? false : true}
                            className="rounded-lg bg-white shadow-2xl outline-1 outline-offset-1 outline-[var(--dark-teal)] flow-root overflow-hidden">
                            <div className="my-0 max-h-80 flex items-center justify-center">
                                <h2 className="font-normal text-[var(--darkest-teal)] custom-style-long-text py-2 text-sm/6 xl:text-base/7">This Operator has not mapped thier Partners to the AFE Partner Connection Library.</h2>
                            </div>
                        </div>
                            <div hidden={(opAPCID !== '' && partnerMapRecord.length > 0 ? false : true)} className="">
                                <div className="rounded-lg bg-white shadow-2xl outline-1 outline-offset-1 outline-[var(--dark-teal)] flow-root overflow-hidden">
                                    <div className="py-2 mx-auto max-w-7xl">
                                        <table className="w-full table-fixed">

                                            <thead className="w-full border-b-2 border-b border-[var(--darkest-teal)]/40 ">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="sticky xl:w-1/2 xl:table-cell sticky top-0 z-10 border-b border-[var(--darkest-teal)] bg-white/75 py-3.5 pr-3 pl-2 text-center xl:text-left text-sm/6 xl:text-base/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter">
                                                        <div>Partner Address in your AFE System</div>
                                                        <div className="xl:hidden custom-style-long-text font-normal text-sm">mapped to the</div>
                                                        <div className="xl:hidden">Partner Address in AFE Partner Connections</div>
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="hidden xl:w-1/20 xl:table-cell sticky top-0 z-10 border-b border-[var(--darkest-teal)] bg-white/75 py-3.5 pr-3 pl-10 text-left text-sm/6 xl:text-base/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter">
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="hidden xl:w-1/2 xl:table-cell xl:pr-3 xl:pl-10 sticky top-0 z-10 border-b border-[var(--darkest-teal)] bg-white/75 py-3.5 pr-3 pl-10 text-left text-sm/6 xl:text-base/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter">
                                                        <div>Partner Address in AFE Partner Connections</div>
                                                    </th>
                                                    <th scope="col" className="hidden xl:w-1/30 xl:table-cell sticky top-0 z-10 bg-white/75 py-3.5 pr-4 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8">
                                                        <span className="sr-only">Delete</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="">
                                                {rowsToShow.map((partner, partnerIdx) => (
                                                    <tr key={partnerIdx} className={`${partnerIdx !== rowsToShow.length - 1 ? 'border-b border-[var(--darkest-teal)]/40' : ''} items-center`}>
                                                        <td>
                                                            {/* Partner Source Address.  Stays put no matter the screen size.  Truncates when small*/}
                                                            <div className="pt-2 pl-3 pr-5 text-sm/6 xl:pr-3">
                                                                <p className="max-w-full flex-1 truncate xl:whitespace-normal text-sm/6 custom-style font-medium text-[var(--darkest-teal)]">
                                                                    {partner.source_partner.name}
                                                                </p>
                                                                <p className="max-w-full flex-1 truncate xl:whitespace-normal text-sm/6 custom-style-long-text text-[var(--dark-teal)]">
                                                                    {partner.source_partner.street.concat(' ',
                                                                        `${partner.source_partner.suite === undefined ? '' : partner.source_partner.suite.concat(' ')}`,
                                                                        `${partner.source_partner.city === undefined ? '' : partner.source_partner.city.concat(', ')}`,
                                                                        `${partner.source_partner.state === undefined ? '' : partner.source_partner.state.concat(' ')}`,
                                                                        `${partner.source_partner.zip === undefined ? '' : partner.source_partner.zip.concat(' ')}`,
                                                                        `${partner.source_partner.country === undefined ? '' : partner.source_partner.country}`)}
                                                                    <ArrowTurnDownLeftIcon className="xl:hidden size-7 stroke-2 text-[var--(darkest-teal)] justify-self-end mr-2"></ArrowTurnDownLeftIcon>
                                                                </p>
                                                            </div>
                                                            {/* Partner APC Address.  Only shows when screen is not xl*/}
                                                            <div className="-mt-5 pl-3 pr-5 text-sm/6 xl:pr-3 xl:hidden">
                                                                <p className="max-w-full flex-1 truncate custom-style font-medium text-[var(--darkest-teal)] ">
                                                                    {partner.apc_partner.name}
                                                                </p>
                                                                <p className="max-w-full flex-1 truncate custom-style-long-text text-[var(--dark-teal)]">
                                                                    {partner.apc_partner.street!.concat(' ',
                                                                        `${partner.apc_partner.suite === undefined ? '' : partner.apc_partner.suite.concat(' ')}`,
                                                                        `${partner.apc_partner.city === undefined ? '' : partner.apc_partner.city.concat(', ')}`,
                                                                        `${partner.apc_partner.state === undefined ? '' : partner.apc_partner.state.concat(' ')}`,
                                                                        `${partner.apc_partner.zip === undefined ? '' : partner.apc_partner.zip.concat(' ')}`,
                                                                        `${partner.apc_partner.country === undefined ? '' : partner.apc_partner.country}`)}
                                                                </p>
                                                                <div className="m-2 size-6 pt-1 justify-self-end">
                                                                    <button
                                                                        onClick={() => { removeMapping(partnerIdx), notifyStandard(`Partner pipeline shut in successfully.\n\n(TLDR: Partner Mapping successfully deleted)`) }}
                                                                        className="text-red-500 hover:text-red-900 cursor-pointer ">
                                                                        <TrashIcon className="size-5" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {/* Arrow Icon Only shows when screen is xl*/}
                                                        <td className="hidden xl:table-cell">
                                                            <div className="size-6 justify-self-center text-[var(--darket-teal)]">
                                                                <ArrowRightIcon></ArrowRightIcon>
                                                            </div>
                                                        </td>
                                                        {/* Partner APC Address.  Only shows when screen is xl  Padding matches header column*/}
                                                        <td className="hidden xl:table-cell ">
                                                            <p className="pt-4 xl:pr-3 xl:pl-10 text-sm/6 custom-style font-medium text-[var(--darkest-teal)]">
                                                                {partner.apc_partner.name}
                                                            </p>
                                                            <p className="mt-1 xl:pr-3 xl:pl-10 text-sm/6 custom-style-long-text text-[var(--dark-teal)]">
                                                                {partner.apc_partner.street!.concat(' ',
                                                                    `${partner.apc_partner.suite === undefined ? '' : partner.apc_partner.suite.concat(' ')}`,
                                                                    `${partner.apc_partner.city === undefined ? '' : partner.apc_partner.city.concat(', ')}`,
                                                                    `${partner.apc_partner.state === undefined ? '' : partner.apc_partner.state.concat(' ')}`,
                                                                    `${partner.apc_partner.zip === undefined ? '' : partner.apc_partner.zip.concat(' ')}`,
                                                                    `${partner.apc_partner.country === undefined ? '' : partner.apc_partner.country}`)}
                                                            </p>
                                                        </td>
                                                        <td className="hidden xl:table-cell justify-self-center">
                                                            <div className="size-6 justify-self-center pt-1 mr-3">
                                                                <button
                                                                    onClick={() => { removeMapping(partnerIdx), notifyStandard(`Partner pipeline shut in successfully.\n\n(TLDR: Partner Mapping successfully deleted)`) }}
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

                                {/* Paging */}
                                <div
                                    hidden={partnerMapRecord.length === 0 ? true : false}>
                                    <UniversalPagination
                                        data={partnerMapRecord}
                                        rowsPerPage={maxRowsToShow}
                                        listOfType="Mapped Partners"
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                    </>

                )}
        </div>
        <ToastContainer />
        </>
    )
}