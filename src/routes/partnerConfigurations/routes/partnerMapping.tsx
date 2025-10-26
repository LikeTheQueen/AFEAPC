import { fetchPartnersFromSourceSystemInSupabase, fetchPartnersLinkedOrUnlinkedToOperator } from "provider/fetch";
import { useState, useEffect, useMemo } from "react";
import { type PartnerRowData, type OperatorPartnerAddressType, type PartnerRowUpdate } from "src/types/interfaces";
import { useSupabaseData } from "src/types/SupabaseContext";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { ArrowTurnDownLeftIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { updatePartnerMapping, updatePartnerProcessedMapValue, writePartnerMappingsToDB } from "provider/write";
import { ToastContainer } from 'react-toastify';
import { notifyStandard, warnUnsavedChanges } from "src/helpers/helpers";
import LoadingPage from "src/routes/loadingPage";
import { OperatorDropdown } from 'src/routes/operatorDropdown';

interface PartnerMappingRecord {
    operator?: string;
    op_partner_id?: string;
    partner_id?: string;
};

interface PartnerMapDisplay {
    apc_partner_name?: string;
    apc_partner_address?: string;
    apc_partner_id?: string;
    source_partner_name?: string;
    source_partner_address?: string;
    source_partner_id?: string;
    afe_partner_processed_id?: number | null;
};

export default function PartnerMapping() {
    const [apcPartnerList, setAPCPartnerList] = useState<OperatorPartnerAddressType[] | []>([]);
    const [sourcePartnerList, setSourcePartnerList] = useState<PartnerRowData[] | []>([]);
    const [currentPartnerMapDisplay, setCurrentPartnerMapDisplay] = useState<PartnerMapDisplay | null>(null);
    const [cumaltivePartnerMapDisplay, setCumlativePartnerDisplay] = useState<PartnerMapDisplay[] | []>([]);
    const [loading, setLoading] = useState(false);
    const [opAPCID, setOpAPCID] = useState('');
    const [rowsLimit] = useState(5);
    const [rowsToShow, setRowsToShow] = useState<PartnerMapDisplay[]>([]);
    const [customPagination, setCustomPagination] = useState<number[] | []>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    
    const nextPage = () => {
        const startIndex = rowsLimit * (currentPage + 1);
        const endIndex = startIndex + rowsLimit;
        const newArray = cumaltivePartnerMapDisplay.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(currentPage + 1);
        };
    const changePage = (value: number) => {
        const startIndex = value * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = cumaltivePartnerMapDisplay.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(value);
        };
    const previousPage = () => {
        const startIndex = (currentPage - 1) * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = cumaltivePartnerMapDisplay.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          setCurrentPage(0);
        }
        };
    
    useMemo(() => {
            setCustomPagination(
              Array(Math.ceil(cumaltivePartnerMapDisplay.length / rowsLimit)).fill(null)
            );
            setTotalPage(
                Math.ceil(cumaltivePartnerMapDisplay.length / rowsLimit)
            )
            }, [cumaltivePartnerMapDisplay]);

    useEffect(() => {
        let isMounted = true;
        async function getPartnerLists() {
            setLoading(true);
            try {
                const apcPartList = await fetchPartnersLinkedOrUnlinkedToOperator();
                const sourcePartList = await fetchPartnersFromSourceSystemInSupabase(opAPCID);
                if (isMounted) {
                    setAPCPartnerList(apcPartList ?? [])
                    setSourcePartnerList(sourcePartList ?? [])
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }
        getPartnerLists();
        return () => {
            isMounted = false;
        };
    }, [opAPCID]);
    
    const toggleSourcePartner = (
        sourcePartner: PartnerRowData
    ) => {
        if (currentPartnerMapDisplay?.source_partner_id === sourcePartner.source_id) {
            setCurrentPartnerMapDisplay({
                ...currentPartnerMapDisplay,
                source_partner_id: '',
                source_partner_name: '',
                source_partner_address: '',
               
            })

        } else {
            setCurrentPartnerMapDisplay({
                ...currentPartnerMapDisplay,
                afe_partner_processed_id:sourcePartner.id!,
                source_partner_id: sourcePartner.source_id,
                source_partner_name: sourcePartner.name,
                source_partner_address: sourcePartner.street.concat(' ',
                    `${sourcePartner.suite === undefined ? '' : sourcePartner.suite.concat(' ')}`,
                    `${sourcePartner.city === undefined ? '' : sourcePartner.city.concat(', ')}`,
                    `${sourcePartner.state === undefined ? '' : sourcePartner.state.concat(' ')}`,
                    `${sourcePartner.zip === undefined ? '' : sourcePartner.zip.concat(' ')}`,
                    `${sourcePartner.country === undefined ? '' : sourcePartner.country}`)
            })
        }

    };
    const toggleAPCPartner = (
        apc_partner: OperatorPartnerAddressType
    ) => {
        if (currentPartnerMapDisplay?.apc_partner_id === apc_partner.apc_id) {
            setCurrentPartnerMapDisplay({
                ...currentPartnerMapDisplay,
                apc_partner_id: '',
                apc_partner_address: '',
                apc_partner_name: ''            
            })

        } else {
            setCurrentPartnerMapDisplay({
                ...currentPartnerMapDisplay,
                apc_partner_id: apc_partner.apc_id,
                apc_partner_name: apc_partner.name,
                apc_partner_address: apc_partner.street!.concat(' ',
                    `${apc_partner.suite === undefined ? '' : apc_partner.suite.concat(' ')}`,
                    `${apc_partner.city === undefined ? '' : apc_partner.city.concat(', ')}`,
                    `${apc_partner.state === undefined ? '' : apc_partner.state.concat(' ')}`,
                    `${apc_partner.zip === undefined ? '' : apc_partner.zip.concat(' ')}`,
                    `${apc_partner.country === undefined ? '' : apc_partner.country}`)
            })
        }

    };
    const savePartnerMapping = () => {
        setCurrentPartnerMapDisplay(null)
        setCumlativePartnerDisplay(prevCumlativeList => {
            const updatedCumlativeList = [...prevCumlativeList];
            updatedCumlativeList.push(currentPartnerMapDisplay!)
            return updatedCumlativeList;
        });
        setRowsToShow(prevMap => {
            const updatedMap = [...prevMap];
            updatedMap.push(currentPartnerMapDisplay!)
            return updatedMap;
        });
    };
    console.log(cumaltivePartnerMapDisplay);
    const savePartnerMappingRecords = () => {
        if (cumaltivePartnerMapDisplay.length < 1) return;
        const mappedData: PartnerMappingRecord[] = cumaltivePartnerMapDisplay.map(({ apc_partner_id, source_partner_id }) => ({ partner_id: apc_partner_id, operator: opAPCID, op_partner_id: source_partner_id }))
        const mappedPartnerUpdate = cumaltivePartnerMapDisplay.map(({ 
            afe_partner_processed_id,
         }) => (afe_partner_processed_id!));
        updatePartnerProcessedMapValue(mappedPartnerUpdate, true);
        writePartnerMappingsToDB(mappedData);
        setCumlativePartnerDisplay([]);
    };
    const removeMapping = (index: number) => {
        setCumlativePartnerDisplay(prevMap => {
            const updatedMap = [...prevMap];
            updatedMap.splice(index, 1);
            return updatedMap;
        });
        setRowsToShow(prevMap => {
            const updatedMap = [...prevMap];
            updatedMap.splice(index, 1);
            return updatedMap;
        });
    };
    return (
        <>
            <div>
                <div className="shadow-lg sm:rounded-lg ring-1 ring-[var(--darkest-teal)]/20 p-4 mb-5">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 sm:divide-x sm:divide-gray-300">
                                <div className="">
                                    <h2 className="custom-style text-sm sm:text-md xl:text-lg font-medium text-[var(--darkest-teal)]">Map Partners from your AFE System to Partners in AFE Partner Connections</h2>
                                        <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text px-3">These are the Partners you will be sending AFEs <span className="font-bold">TO</span>, as the Operator.</p>
                                        <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text px-3">Select your Operating company from the dropdown menu to map Partners from your AFE System</p>
                                        <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text px-3"><span className="font-bold">YES, </span>you do need to do this for each Operator you have in AFE Partner Connections.  <span className="font-bold">Why?  </span>Because we said so, and also because we need to know which Partner the Operator is sending an AFE to.</p>
                                 </div>
                                 <div className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 ">
                                        <div className="">
                                        <h1 className="custom-style text-[var(--darkest-teal)] font-medium text-sm xl:text-base">Select an Operator to Create Mappings For:</h1>
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
                    <div className="divide-y divide-gray-900/20">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 sm:px-0 sm:grid-cols-2 pb-8">
                            <div className="divide-y divide-gray-900/20 ">
                                <h2 className="2xl:w-3/4 font-semibold text-[var(--darkest-teal)] custom-style text-sm xl:text-base">Partner Library in Your AFE System</h2>
                                <div className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl ">
                                    <div
                                        hidden={(opAPCID === '') ? false : true}
                                        className="mt-8 max-h-80 flex items-center justify-center">
                                        <h2 className="sm:w-3/4 font-normal text-[var(--darkest-teal)] custom-style-long-text py-2 text-sm xl:text-base">You haven't selected an Operator from the dropdown.</h2>
                                    </div>
                                    <div
                                        hidden={(opAPCID !== '' && sourcePartnerList.length < 1) ? false : true}
                                        className="mt-8 max-h-80 flex items-center justify-center">
                                        <h2 className="sm:w-3/4 font-normal text-[var(--darkest-teal)] custom-style-long-text py-2 text-sm xl:text-base">Interesting...  Very interesting.  The Partner Library from your source system has not been loaded for the Operator selected.  Head back over there and upload the file, will ya?</h2>
                                    </div>
                                    <div
                                        hidden={(opAPCID !== '' && sourcePartnerList.length > 0) ? false : true}
                                        className="mt-8 flow-root max-h-80 overflow-y-auto overflow-x-hidden sm:rounded-xl">
                                        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 align-middle">
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="sticky top-0 z-10 border-b border-gray-900 bg-white/75 py-3.5 pr-3 pl-10 text-left text-sm xl:text-base font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter sm:pl-10 lg:pl-10">
                                                                Partner Name and Address
                                                            </th>

                                                            <th
                                                                scope="col"
                                                                className="sticky top-0 z-10 border-b border-gray-900 bg-white/75 py-3.5 pr-4 pl-3 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8 text-center">
                                                                <span className="sr-only">Select</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sourcePartnerList.map((partner, partnerIdx) => (
                                                            <tr key={partner.source_id}>

                                                                <td
                                                                    className={`${partnerIdx !== apcPartnerList.length - 1 ? 'border-b border-gray-300' : ''}
                                                                ${cumaltivePartnerMapDisplay.find(list => list.source_partner_id === partner.source_id) ? 'bg-[var(--darkest-teal)]/20' : ''}
                                                                max-w-xs overflow-hidden text-ellipsis`}>
                                                                    <p className="pt-4 pr-3 pl-10 text-sm/6 custom-style font-medium whitespace-wrap text-[var(--dark-teal)] sm:pl-10 lg:pl-10">
                                                                        {partner.name}

                                                                    </p>
                                                                    <p className="pt-2 pr-3 pl-10 text-sm/6 custom-style-long-text whitespace-wrap text-gray-500 ">
                                                                        {partner.street.concat(' ',
                                                                            `${partner.suite === undefined ? '' : partner.suite.concat(' ')}`,
                                                                            `${partner.city === undefined ? '' : partner.city.concat(', ')}`,
                                                                            `${partner.state === undefined ? '' : partner.state.concat(' ')}`,
                                                                            `${partner.zip === undefined ? '' : partner.zip.concat(' ')}`,
                                                                            `${partner.country === undefined ? '' : partner.country}`)}

                                                                    </p>
                                                                </td>
                                                                <td
                                                                    className={`${partnerIdx !== sourcePartnerList.length - 1 ? 'border-b border-gray-300' : ''} pt-2 pr-15 pl-2 whitespace-nowrap sm:pr-15 lg:pr-15
                                                                ${cumaltivePartnerMapDisplay.find(list => list.source_partner_id === partner.source_id) ? 'bg-[var(--darkest-teal)]/20' : ''}
                                                                `}>
                                                                    <div className="flex shrink-0 items-center justify-center">
                                                                        <div className="group grid size-4 grid-cols-1">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={partner.source_id === currentPartnerMapDisplay?.source_partner_id}
                                                                                //disabled={(currentPartnerMap?.op_partner_id?.length ? true : false) && (currentPartnerMap?.op_partner_id !== partner.source_id)}
                                                                                value={partner.source_id}
                                                                                onChange={(e) => toggleSourcePartner(partner)}
                                                                                aria-describedby="checkbox"
                                                                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] group-has-disabled:checked:bg-gray-300 group-has-disabled:checked:border-gray-500 ..." />
                                                                            <svg
                                                                                fill="none"
                                                                                viewBox="0 0 14 14"
                                                                                className={`pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25`}>
                                                                                <path
                                                                                    d="M3 8L6 11L11 3.5"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    className="opacity-0 group-has-checked:opacity-100" />
                                                                                <path
                                                                                    d="M3 7H11"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    className="opacity-0 group-has-indeterminate:opacity-100" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-900/20 ">
                                <h2 className="truncate 2xl:w-3/4 font-semibold text-[var(--darkest-teal)] custom-style text-sm xl:text-base">Partner Library in AFE Partner Connections</h2>
                                <div className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl ">
                                    <div className="mt-8 flow-root max-h-80 overflow-y-auto overflow-x-hidden sm:rounded-xl">
                                        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 items-center">
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="sticky top-0 z-10 border-b border-gray-900 bg-white/75 py-3.5 pr-3 pl-10 text-left text-sm xl:text-base font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter sm:pl-10 lg:pl-10">
                                                                Partner Name and Address
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="sticky top-0 z-10 border-b border-gray-900 bg-white/75 py-3.5 pr-4 pl-3 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8 text-center">
                                                                <span className="sr-only">Edit</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {apcPartnerList.map((partner, partnerIdx) => (
                                                            <tr key={partner.apc_id}>
                                                                <td
                                                                    className={`${partnerIdx !== apcPartnerList.length - 1 ? 'border-b border-gray-300' : ''}
                                                                ${cumaltivePartnerMapDisplay.find(list => list.apc_partner_id === partner.apc_id) ? 'bg-[var(--darkest-teal)]/20' : ''}
                                                                max-w-xs`}>
                                                                    <p className="pt-4 pr-3 pl-10 text-sm/6 custom-style font-medium whitespace-wrap text-[var(--dark-teal)] sm:pl-10 lg:pl-10">
                                                                        {partner.name}

                                                                    </p>
                                                                    <p className="pt-2 pr-3 pl-10 text-sm/6 custom-style-long-text whitespace-wrap text-gray-500 ">
                                                                        {partner.street} {partner.suite} {partner.city}, {partner.state} {partner.zip}
                                                                    </p>
                                                                </td>
                                                                <td
                                                                    className={`${partnerIdx !== apcPartnerList.length - 1 ? 'border-b border-gray-300' : ''} pt-2 pr-15 pl-2 whitespace-nowrap sm:pr-15 lg:pr-15
                                                                ${cumaltivePartnerMapDisplay.find(list => list.apc_partner_id === partner.apc_id) ? 'bg-[var(--darkest-teal)]/20' : ''}
                                                                `}>
                                                                    <div className="flex shrink-0 items-center justify-center">
                                                                        <div className="group grid size-4 grid-cols-1">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={partner.apc_id === currentPartnerMapDisplay?.apc_partner_id}
                                                                                //disabled={(currentPartnerMap?.partner_id?.length ? true : false) && (currentPartnerMap?.partner_id !== partner.apc_id)}
                                                                                value={partner.apc_id}
                                                                                onChange={(e) => toggleAPCPartner(partner)}
                                                                                aria-describedby="checkbox"
                                                                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] group-has-disabled:checked:bg-gray-300 group-has-disabled:checked:border-gray-500 ..." />
                                                                            <svg
                                                                                fill="none"
                                                                                viewBox="0 0 14 14"
                                                                                className={`pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25`}>
                                                                                <path
                                                                                    d="M3 8L6 11L11 3.5"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    className="opacity-0 group-has-checked:opacity-100" />
                                                                                <path
                                                                                    d="M3 7H11"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    className="opacity-0 group-has-indeterminate:opacity-100" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row gap-5 justify-between py-4 divide-y divide-gray-900/20 items-center">

                            <button
                                disabled={(currentPartnerMapDisplay?.apc_partner_id && currentPartnerMapDisplay.source_partner_id) ? false : true}
                                className="cursor-pointer disabled:cursor-not-allowed w-full lg:w-60 rounded-md bg-[var(--dark-teal)] outline-[var(--dark-teal)] outline-1 -outline-offset-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:outline-none px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] justify-end "
                                onClick={(e) => { savePartnerMapping() }}>
                                Create Mapping
                            </button>
                            <div className="w-full sm:w-125 flex flex-col lg:flex-row gap-5 justify-end items-center ">
                                <button
                                    disabled={(cumaltivePartnerMapDisplay.length > 0 && opAPCID !== '') ? false : true}
                                    className="cursor-pointer disabled:cursor-not-allowed w-full xl:w-60 rounded-md bg-white outline-[var(--darkest-teal)] outline-1 -outline-offset-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:outline-none px-3 py-2 text-sm font-semibold custom-style text-[var(--darkest-teal)] shadow-xs hover:bg-[var(--bright-pink)] hover:text-white hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] justify-end"
                                    onClick={(e) => { setCumlativePartnerDisplay([]), notifyStandard(`Partner Mappings cleared.  No leaks, no flare, just fresh pipe.\n\n(TLDR: Partner Mappings reset without saving)`) }}>
                                    Clear Mappings
                                </button>
                                <button
                                    disabled={(cumaltivePartnerMapDisplay.length > 0 && opAPCID !== '') ? false : true}
                                    className="cursor-pointer disabled:cursor-not-allowed w-full xl:w-60 rounded-md bg-[var(--dark-teal)] outline-[var(--dark-teal)] outline-1 -outline-offset-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:outline-none px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] justify-end"
                                    onClick={(e) => { savePartnerMappingRecords(), notifyStandard(`Partner Mappings have been saved.  Let's call it a clean tie-in.\n\n(TLDR: Partner Mappings ARE saved)`) }}>
                                    Save Mappings
                                </button>
                            </div>
                        </div>
                        <div hidden={cumaltivePartnerMapDisplay.length > 0 ? false : true} className="">
                            <h1 className="mt-4 custom-style text-[var(--darkest-teal)] font-semibold">Pending Mappings</h1>
                            <div className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl flow-root overflow-hidden">
                                
                                        <div className="py-2 mx-auto max-w-7xl">
                                            <table className="w-full table-fixed">
                                                <thead className="w-full border-b-2 border-b border-gray-900 ">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="sticky xl:w-1/2 xl:table-cell top-0 z-10 bg-white/75 py-3.5 pr-3 xl:text-left text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter pl-2">
                                                            <div>Partner Address in your AFE System</div>
                                                            <div className="xl:hidden custom-style-long-text font-normal justify-self-center text-md">to be mapped to the</div>
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
                                                <tbody>
                                                    {rowsToShow.map((partner, partnerIdx) => (
                                                        <tr key={partnerIdx} className={`${partnerIdx !== cumaltivePartnerMapDisplay.length - 1 ? 'border-b border-gray-900 xl:border-gray-300' : ''} items-center`}>
                                                            <td>
                                                                {/* Partner Source Address.  Stays put no matter the screen size.  Truncates when small*/}
                                                                <div className="pt-2 pl-3 pr-5 text-sm/6 xl:pr-3">
                                                                <p className="max-w-full flex-1 truncate xl:whitespace-normal text-sm/6 custom-style font-medium text-[var(--dark-teal)]">
                                                                    {partner.source_partner_name}
                                                                </p>
                                                                <p className="max-w-full flex-1 truncate xl:whitespace-normal text-sm/6 custom-style-long-text text-gray-500">
                                                                    {partner.source_partner_address}
                                                                <ArrowTurnDownLeftIcon className="xl:hidden size-7 stroke-2 text-[var(--(darkest-teal))] justify-self-end mr-2"></ArrowTurnDownLeftIcon>
                                                                </p>
                                                                </div>
                                                                {/* Partner APC Address.  Only shows when screen is not xl*/}
                                                                <div className="-mt-5 pl-3 pr-5 text-sm/6 xl:pr-3 xl:hidden">
                                                                <p className="max-w-full flex-1 truncate custom-style font-medium text-[var(--dark-teal)] ">
                                                                    {partner.apc_partner_name}
                                                                </p>
                                                                <p className="max-w-full flex-1 truncate custom-style-long-text text-gray-500">
                                                                    {partner.apc_partner_address}
                                                                </p>
                                                                <div className="m-2 size-6 pt-1 justify-self-end">
                                                                            <button
                                                                    onClick={() => removeMapping(partnerIdx)}
                                                                    className="text-red-500 hover:text-red-900 cursor-pointer ">
                                                                    <TrashIcon className="size-5" />
                                                                </button>
                                                                </div>
                                                                </div>
                                                            </td>
                                                            
                                                            <td className="hidden xl:table-cell">
                                                                <div className="size-6 justify-self-center">
                                                                            <ArrowRightIcon></ArrowRightIcon>
                                                                </div>
                                                            </td>
                                                            {/* Partner APC Address.  Only shows when screen is xl  Padding matches header column*/}
                                                            <td className="hidden xl:table-cell ">
                                                                <p className="pt-4 xl:pr-3 xl:pl-10 text-sm/6 custom-style font-medium text-[var(--dark-teal)]">
                                                                    {partner.apc_partner_name}
                                                                </p>
                                                                <p className="mt-1 xl:pr-3 xl:pl-10 text-sm/6 custom-style-long-text text-gray-500">
                                                                    {partner.apc_partner_address}
                                                                </p>
                                                            </td>
                                                            <td className="hidden xl:table-cell justify-self-center">
                                                                <div className="size-6 justify-self-center pt-1 mr-3">
                                                                            <button
                                                                    onClick={() => removeMapping(partnerIdx)}
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
                                      ? cumaltivePartnerMapDisplay?.length
                                      : (currentPage + 1) * rowsLimit}{" "}
                                    of {cumaltivePartnerMapDisplay?.length} Partners
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
                    </div>
                )}
            </div>
            <ToastContainer />
            {warnUnsavedChanges(cumaltivePartnerMapDisplay.length > 0, "You have NOT saved your Partner Mappings")}
        </>
    )
}