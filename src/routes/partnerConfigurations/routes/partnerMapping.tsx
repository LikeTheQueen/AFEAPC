import { ChevronDownIcon } from "lucide-react";
import { fetchPartnersFromPartnersCrosswalk, fetchPartnersFromSourceSystemInSupabase, fetchPartnersLinkedOrUnlinkedToOperator } from "provider/fetch";
import { useState, useEffect, useCallback } from "react";
import { type PartnerRowData, type OperatorPartnerAddressType } from "src/types/interfaces";
import { useSupabaseData } from "src/types/SupabaseContext";
import { ArrowsRightLeftIcon } from "@heroicons/react/16/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { updatePartnerMapping, writePartnerMappingsToDB } from "provider/write";
import { type BlockerFunction, useBlocker } from "react-router";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { Button } from "@headlessui/react";
import { notifyStandard, warnUnsavedChanges } from "src/helpers/helpers";

interface PartnerMappingRecord {
    operator?: string;
    op_partner_id?: string;
    partner_id?: string;
};

interface PartnerCrosswalkUpdate {
    source_id?: string;
    mapped: boolean;
}

interface PartnerOpList {
    apc_id: string;
    apc_name: string;
}

interface PartnerMapDisplay {
    apc_partner_name?: string;
    apc_partner_address?: string;
    apc_partner_id?: string;
    source_partner_name?: string;
    source_partner_address?: string;
    source_partner_id?: string;
}

export default function PartnerMapping() {
    fetchPartnersFromPartnersCrosswalk()
    const [apcPartnerList, setAPCPartnerList] = useState<OperatorPartnerAddressType[] | []>([]);
    const [sourcePartnerList, setSourcePartnerList] = useState<PartnerRowData[] | []>([]);
    const [currentPartnerMap, setCurrentPartnerMap] = useState<PartnerMappingRecord | null>(null);
    const [currentPartnerMapDisplay, setCurrentPartnerMapDisplay] = useState<PartnerMapDisplay | null>(null);
    const [cumlativePartnerMap, setCumlativePartnerMap] = useState<PartnerMappingRecord[] | []>([]);
    const [cumaltivePartnerMapDisplay, setCumlativePartnerDisplay] = useState<PartnerMapDisplay[] | []>([]);
    const [loading, setLoading] = useState(true);
    const { loggedInUser } = useSupabaseData();
    const [opDropdownList, setOpDropdownList] = useState<OperatorPartnerAddressType[] | []>([]);
    const [opAPCID, setOpAPCID] = useState('');
    

    function filterOpsList() {
        if (!loggedInUser) return [];
        return (loggedInUser.operatorRoles ?? [])
            .filter(operator => operator.role === 7)
            .map(({ apc_id, apc_name }) => ({ apc_id, apc_name }));
    };

    const filteredOperators: PartnerOpList[] = filterOpsList();

    useEffect(() => {
        let isMounted = true;
        async function getPartnerLists() {
            setLoading(true);
            try {
                const apcPartList = await fetchPartnersLinkedOrUnlinkedToOperator();
                const sourcePartList = await fetchPartnersFromSourceSystemInSupabase();
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
    }, []);
    useEffect(() => {
        if (!loggedInUser) return;
        if (filteredOperators.length === 1) {
            setOpAPCID(filteredOperators[0].apc_id)
        }
    }, [loggedInUser])

    const toggleSourcePartner = (
        sourcePartner: PartnerRowData
    ) => {
        if(currentPartnerMapDisplay?.source_partner_id === sourcePartner.source_id) {
            setCurrentPartnerMapDisplay({
            ...currentPartnerMapDisplay,
            source_partner_id:'',
            source_partner_name:'',
            source_partner_address:''
        })

        } else {
        setCurrentPartnerMapDisplay({
            ...currentPartnerMapDisplay,
            source_partner_id:sourcePartner.source_id,
            source_partner_name: sourcePartner.name,
            source_partner_address: sourcePartner.street.concat(' ',
                `${sourcePartner.suite === undefined ? '':sourcePartner.suite.concat(' ')}`,
                `${sourcePartner.city === undefined ? '':sourcePartner.city.concat(', ')}`,
                `${sourcePartner.state === undefined ? '':sourcePartner.state.concat(' ')}`,
                `${sourcePartner.zip === undefined ? '':sourcePartner.zip.concat(' ')}`,
                `${sourcePartner.country === undefined ? '':sourcePartner.country}`)
        })
    }

    };
    const toggleAPCPartner = (
        apc_partner: OperatorPartnerAddressType
    ) => {
        if(currentPartnerMapDisplay?.apc_partner_id === apc_partner.apc_id) {
            setCurrentPartnerMapDisplay({
            ...currentPartnerMapDisplay,
            apc_partner_id:'',
            apc_partner_address:'',
            apc_partner_name:''
        })

        } else {
        setCurrentPartnerMapDisplay({
            ...currentPartnerMapDisplay,
            apc_partner_id:apc_partner.apc_id,
            apc_partner_name:apc_partner.name,
            apc_partner_address: apc_partner.street!.concat(' ',
                `${apc_partner.suite === undefined ? '':apc_partner.suite.concat(' ')}`,
                `${apc_partner.city === undefined ? '':apc_partner.city.concat(', ')}`,
                `${apc_partner.state === undefined ? '':apc_partner.state.concat(' ')}`,
                `${apc_partner.zip === undefined ? '':apc_partner.zip.concat(' ')}`,
                `${apc_partner.country === undefined ? '':apc_partner.country}`)
        })
    }

    };
    const savePartnerMapping = () => {
        setCurrentPartnerMapDisplay(null)
        setCumlativePartnerDisplay(prevCumlativeList => {
            const updatedCumlativeList = [...prevCumlativeList];
            updatedCumlativeList.push(currentPartnerMapDisplay!)
            return updatedCumlativeList;
        })
    };
    const savePartnerMappingRecords = () => {
        if(cumaltivePartnerMapDisplay.length<1) return;
        const mappedData: PartnerMappingRecord[]= cumaltivePartnerMapDisplay.map(({apc_partner_id, source_partner_id}) =>({partner_id:apc_partner_id,operator:opAPCID,op_partner_id:source_partner_id}))
        const mappedPartnerUpdate = cumaltivePartnerMapDisplay.map(({source_partner_id}) => (source_partner_id ?? ''));
        updatePartnerMapping(mappedPartnerUpdate);
        console.log(mappedData);
        writePartnerMappingsToDB(mappedData);
        setCumlativePartnerMap(mappedData)
        setCumlativePartnerDisplay([]);
    };
    const removeMapping = (index: number) => {
        setCumlativePartnerDisplay(prevMap => {
            const updatedMap = [...prevMap];
            updatedMap.splice(index,1);
            return updatedMap;
        });
    };
    return (
        <>
        <div>
            <h1 className="custom-style text-[var(--darkest-teal)] font-semibold">Operator to create mappings for:</h1> 
                <div className="grid grid-cols-1 gap-x-8 gap-y-8 mb-8 px-0 py-0 sm:px-0 sm:grid-cols-2 sm:mb-10">
                        <select
                            id="operatorMapID"
                            name="operatorMapID"
                            autoComplete="off"
                            value={opAPCID}
                            onChange={(e) => setOpAPCID(e.target.value)}
                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
                            <option></option>
                            {filteredOperators.map((option) => (
                                <option key={option.apc_id} value={option.apc_id}>
                                    {option.apc_name}
                                </option>
                            ))}
                        </select>
                        <ChevronDownIcon
                            aria-hidden="true"
                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        />

                </div>
                <div className="divide-y divide-gray-900/20">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 sm:px-0 sm:grid-cols-2 pb-8">
                        <div className="divide-y divide-gray-900/20 ">
                            <h2 className="sm:w-3/4 font-semibold text-[var(--darkest-teal)] custom-style">Partner Library in Your AFE System</h2>
                            <div className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl ">
                                <div className="mt-8 flow-root max-h-80 overflow-y-auto overflow-x-hidden sm:rounded-xl">
                                    <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 align-middle">
                                            <table className="min-w-full">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="sticky top-0 z-10 border-b border-gray-900 bg-white/75 py-3.5 pr-3 pl-10 text-left text-sm font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter sm:pl-10 lg:pl-10">
                                                            Parner Name and Address
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
                                                                ${ cumaltivePartnerMapDisplay.find(list => list.source_partner_id === partner.source_id) ? 'bg-[var(--darkest-teal)]/20' :''}
                                                                `}>
                                                                <p className="pt-4 pr-3 pl-10 text-sm custom-style font-medium whitespace-nowrap text-[var(--dark-teal)] sm:pl-10 lg:pl-10">
                                                                    {partner.name}
                                                                </p>
                                                                <p className="pt-2 pr-3 pl-10 text-sm custom-style-long-text whitespace-nowrap text-gray-500 sm:table-cell">
                                                                    {partner.street} {partner.suite} {partner.city}, {partner.state} {partner.zip}
                                                                </p>
                                                            </td>
                                                            <td
                                                                className={`${partnerIdx !== sourcePartnerList.length - 1 ? 'border-b border-gray-300' : ''} pt-2 pr-15 pl-2 whitespace-nowrap sm:pr-15 lg:pr-15
                                                                ${ cumaltivePartnerMapDisplay.find(list => list.source_partner_id === partner.source_id) ? 'bg-[var(--darkest-teal)]/20' :''}`}>
                                                                <div className="flex shrink-0 items-center justify-center">
                                                                    <div className="group grid size-4 grid-cols-1">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={partner.source_id===currentPartnerMapDisplay?.source_partner_id}
                                                                            disabled={(currentPartnerMap?.op_partner_id?.length ? true : false) && ( currentPartnerMap?.op_partner_id !==partner.source_id)}
                                                                            value={partner.source_id}
                                                                            onChange={(e) => toggleSourcePartner(partner)}
                                                                            aria-describedby="checkbox"
                                                                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] group-has-disabled:checked:bg-gray-300 group-has-disabled:checked:border-gray-500 ..."/>
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
                            <h2 className="sm:w-3/4 font-semibold text-[var(--darkest-teal)] custom-style">Partner Library in AFE Partner Connections</h2>
                            <div className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl ">
                                <div className="mt-8 flow-root max-h-80 overflow-y-auto overflow-x-hidden sm:rounded-xl">
                                    <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 align-middle">
                                            <table className="min-w-full">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="sticky top-0 z-10 border-b border-gray-900 bg-white/75 py-3.5 pr-3 pl-10 text-left text-sm font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter sm:pl-10 lg:pl-10">
                                                            Parner Name and Address
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
                                                                ${ cumaltivePartnerMapDisplay.find(list => list.apc_partner_id === partner.apc_id) ? 'bg-[var(--darkest-teal)]/20' :''}
                                                                `}>
                                                                <p className="pt-4 pr-3 pl-10 text-sm custom-style font-medium whitespace-nowrap text-[var(--dark-teal)] sm:pl-10 lg:pl-10">
                                                                    {partner.name}
                                                                    
                                                                </p>
                                                                <p className="pt-2 pr-3 pl-10 text-sm custom-style-long-text whitespace-nowrap text-gray-500 sm:table-cell">
                                                                    {partner.street} {partner.suite} {partner.city}, {partner.state} {partner.zip}
                                                                </p>
                                                            </td>
                                                            <td
                                                                className={`${partnerIdx !== apcPartnerList.length - 1 ? 'border-b border-gray-300' : ''} pt-2 pr-15 pl-2 whitespace-nowrap sm:pr-15 lg:pr-15
                                                                ${ cumaltivePartnerMapDisplay.find(list => list.apc_partner_id === partner.apc_id) ? 'bg-[var(--darkest-teal)]/20' :''}
                                                                `}>
                                                                <div className="flex shrink-0 items-center justify-center">
                                                                    <div className="group grid size-4 grid-cols-1">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={partner.apc_id===currentPartnerMapDisplay?.apc_partner_id}
                                                                            disabled={(currentPartnerMap?.partner_id?.length ? true : false) && ( currentPartnerMap?.partner_id !==partner.apc_id)}
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
                    <div className="flex flex-col sm:flex-row gap-5 justify-between py-4 divide-y divide-gray-900/20 ">
                    
                        <button
                          disabled={(currentPartnerMapDisplay?.apc_partner_id && currentPartnerMapDisplay.source_partner_id) ? false : true}
                        className="w-full sm:w-60 rounded-md bg-[var(--dark-teal)] disabled:bg-gray-300 disabled:text-gray-500 px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] justify-end outline-1 -outline-offset-1 disabled:outline-[var(--darkest-teal)]/20"
                        onClick={(e) => {savePartnerMapping()} }>
                        Create Mapping
                        </button>
                        <div className="w-full flex justify-end sm:justify-end flex-col sm:flex-row gap-5 items-center ">
                        <button
                          disabled={(cumaltivePartnerMapDisplay.length>0 && opAPCID !=='') ? false : true}
                        className="w-full sm:w-60 rounded-md bg-white outline-[var(--darkest-teal)] outline-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:outline-none px-3 py-2 text-sm font-semibold custom-style text-[var(--darkest-teal)] shadow-xs hover:bg-[var(--bright-pink)] hover:text-white hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] justify-end"
                        onClick={(e) => {setCumlativePartnerDisplay([]),notifyStandard(`Partner Mappings cleared.  No leaks, no flare, just fresh pipe.\n\n(TLDR: Partner Mappings reset without saving)`)} }>
                        Clear Mappings
                        </button>
                        <button
                          disabled={(cumaltivePartnerMapDisplay.length>0 && opAPCID !=='') ? false : true}
                        className="w-full sm:w-60 rounded-md bg-[var(--dark-teal)] disabled:bg-gray-300 disabled:text-gray-500 px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] justify-end outline-1 -outline-offset-1 disabled:outline-[var(--darkest-teal)]/20"
                        onClick={(e) => {savePartnerMappingRecords(),notifyStandard(`Partner Mappings have been saved.  Let's call it a clean tie-in.\n\n(TLDR: Partner Mappings ARE saved)`)} }>
                        Save Mappings
                        </button>
                        </div>
                    </div>
                    <div hidden={cumaltivePartnerMapDisplay.length>0 ? false:true} className="">
                    <h1 className="mt-4 custom-style text-[var(--darkest-teal)] font-semibold">Pending Mappings</h1> 
                        <div className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl ">
                                
                                <div className="mt-4 flow-root max-h-80 overflow-y-auto overflow-x-hidden sm:rounded-xl">
                                    <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 align-middle">
                                            <table className="min-w-full">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="w-3/8 sticky top-0 z-10 border-b border-gray-900 bg-white/75 py-3.5 pr-3 pl-10 text-left text-sm font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter sm:pl-10 lg:pl-10">
                                                            Partner Name & Address in Your AFE System
                                                        </th>

                                                        <th
                                                            scope="col"
                                                            className="w-1/8 sticky top-0 z-10 border-b border-gray-900 bg-white/75 py-3.5 pr-4 pl-3 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8">
                                                            
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="w-3/8 sticky top-0 z-10 border-b border-gray-900 bg-white/75 py-3.5 pr-3 pl-10 text-left text-sm font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter sm:pl-10 lg:pl-10">
                                                            Partner Name & Address in AFE Partner Connections
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="w-1/8 sticky top-0 z-10 border-b border-gray-900 bg-white/75 py-3.5 pr-4 pl-3 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8">
                                                            
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cumaltivePartnerMapDisplay.map((partner, partnerIdx) => (
                                                        <tr key={partner.apc_partner_id} className={`${partnerIdx !== cumaltivePartnerMapDisplay.length - 1 ? 'border-b border-gray-300' : ''} items-center`}>
                                                            <td>
                                                                <p className="pt-4 pr-3 pl-10 text-sm custom-style font-medium whitespace-nowrap text-[var(--dark-teal)] sm:pl-10 lg:pl-10">
                                                                    {partner.source_partner_name}
                                                                </p>
                                                                <p className="pt-2 pr-3 pl-10 text-sm custom-style-long-text whitespace-nowrap text-gray-500 sm:table-cell">
                                                                    {partner.source_partner_address} 
                                                                </p>
                                                            </td>
                                                            <td className="content-end p-2">
                                                                <div className="size-6 content-end justify-self-center">
                                                                <ArrowsRightLeftIcon></ArrowsRightLeftIcon>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <p className="pt-4 pr-3 pl-10 text-sm custom-style font-medium whitespace-nowrap text-[var(--dark-teal)] sm:pl-10 lg:pl-10">
                                                                    {partner.apc_partner_name}
                                                                </p>
                                                                <p className="pt-2 pr-3 pl-10 text-sm custom-style-long-text whitespace-nowrap text-gray-500 sm:table-cell">
                                                                    {partner.apc_partner_address} 
                                                                </p>
                                                            </td>
                                                            <td className="content-end p-3">
                                                                <div className="size-6 content-end justify-self-center font-normal">
                                                                <button 
                                                                onClick={() => removeMapping(partnerIdx)}
                                                                className="text-red-500 hover:text-red-900 cursor-pointer">
                                                                <TrashIcon className="size-5"/>
                                                                </button>
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
        </div>
        <ToastContainer />
        {warnUnsavedChanges(cumaltivePartnerMapDisplay.length>0,"You have NOT saved your Partner Mappings")}
        </>
    )
}