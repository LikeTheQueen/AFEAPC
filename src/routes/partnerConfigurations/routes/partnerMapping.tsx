import { fetchPartnersFromPartnersCrosswalk, fetchPartnersFromSourceSystemInSupabase, fetchPartnersLinkedOrUnlinkedToOperator } from "provider/fetch";
import { useState, useEffect, useMemo } from "react";
import { type PartnerRowData, type OperatorPartnerAddressType, type PartnerRowUpdate, type PartnerMappingDisplayRecord } from "src/types/interfaces";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { ArrowTurnDownLeftIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { updatePartnerMapping, updatePartnerProcessedMapValue, writePartnerMappingsToDB } from "provider/write";
import { ToastContainer } from 'react-toastify';
import { notifyStandard, warnUnsavedChanges } from "src/helpers/helpers";
import LoadingPage from "src/routes/loadingPage";
import { OperatorDropdown } from 'src/routes/operatorDropdown';
import UniversalPagination from "src/routes/sharedComponents/pagnation";
import { SingleCheckbox } from "src/routes/sharedComponents/singleCheckbox";
import NoSelectionOrEmptyArrayMessage from "src/routes/sharedComponents/noSelectionOrEmptyArrayMessage";

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
    const [existingPartnerMap, setExistingPartnerMap] = useState<PartnerMappingDisplayRecord[] | []>([]);
    const [loading, setLoading] = useState(false);
    const [opAPCID, setOpAPCID] = useState('');
    const [rowsLimit] = useState(5);
    const [rowsToShow, setRowsToShow] = useState<PartnerMapDisplay[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hideMappedSourcePartners, setHideMappedSourcePartners] = useState<boolean>(false);
    const [hideMappedAPCPartners, setHideMappedAPCPartners] = useState<boolean>(false);

    const handlePageChange = (paginatedData: PartnerMapDisplay[], page: number) => {
        setRowsToShow(paginatedData);
        setCurrentPage(page);
    };

    useEffect(() => {
        let isMounted = true;
        async function getPartnerLists() {
            setLoading(true);
            try {
                const apcPartList = await fetchPartnersLinkedOrUnlinkedToOperator();
                const sourcePartList = await fetchPartnersFromSourceSystemInSupabase(opAPCID);
                const mappedPartnerList = await fetchPartnersFromPartnersCrosswalk(opAPCID);
                if (isMounted) {
                    setAPCPartnerList(apcPartList ?? []);
                    setSourcePartnerList(sourcePartList ?? []);
                    setExistingPartnerMap(mappedPartnerList ?? []);
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
                afe_partner_processed_id: sourcePartner.id!,
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

        setCumlativePartnerDisplay(prevCumlativeList => {
            const exists = prevCumlativeList.some(item =>
                JSON.stringify(item) === JSON.stringify(currentPartnerMapDisplay)
            );

            if (exists) {
                notifyStandard('Duplicate Mapping Detected. This route has already been drilled. Choose a new path before you hit a pressure breach.')
                return prevCumlativeList;
            }
            const updatedCumlativeList = [...prevCumlativeList];
            updatedCumlativeList.push(currentPartnerMapDisplay!)
            setCurrentPartnerMapDisplay(null)
            return updatedCumlativeList;
        });

        setRowsToShow(prevMap => {
            const exists = prevMap.some(item =>
                JSON.stringify(item) === JSON.stringify(currentPartnerMapDisplay)
            );

            if (exists) return prevMap;

            const updatedMap = [...prevMap];
            updatedMap.push(currentPartnerMapDisplay!)
            return updatedMap;
        });
    };
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
    console.log(hideMappedSourcePartners)
    return (
        <>
            <div>
                <div className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 p-4 mb-5">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 sm:divide-x sm:divide-[var(--darkest-teal)]/40">
                        <div className="sm:col-span-1 pr-1">
                            <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Map Partners from your AFE System to Partners in AFE Partner Connections</h2>
                            <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">These are the Partners you will be sending AFEs <span className="font-bold">TO</span>, as the Operator.</p>
                            <br></br><p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">Select your Operating company from the dropdown menu to map Partners from your AFE System</p>
                            <br></br><p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3"><span className="font-bold">YES, </span>you do need to do this for each Operator you have in AFE Partner Connections.  <span className="font-bold">Why?  </span>Because we said so, and also because we need to know which Partner the Operator is sending an AFE to.</p>
                        </div>
                        <div className="sm:col-span-2">
                            <div className="">
                                <h1 className="text-base/7 font-medium text-[var(--darkest-teal)] custom-style">Select your company, as the Operator, to Create Mappings For:</h1>
                                <div className="sm:w-1/2">
                                    <OperatorDropdown
                                        onChange={(id) => { setOpAPCID(id) }}
                                        limitedList={true} />
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
                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 sm:px-0 sm:grid-cols-2 pb-8">
                            {/* Partner Library in your AFE System */}
                            <div className="">
                                <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style border-b border-[var(--darkest-teal)]/40">Partner Library in Your AFE System</h2>
                                {/* Default DIV display and warning if there are no partners for the selected Operator */}
                                <div className="sm:mt-14" hidden={(opAPCID === '') ? false : true}>
                                    <NoSelectionOrEmptyArrayMessage
                                        message={"You haven't selected an Operator from the dropdown."}
                                    ></NoSelectionOrEmptyArrayMessage>
                                </div>
                                <div className="sm:mt-14" hidden={(opAPCID !== '' && sourcePartnerList.length < 1) ? false : true}>
                                    <NoSelectionOrEmptyArrayMessage
                                        message={"Interesting...  Very interesting.  The Partner Library from your source system has not been loaded for the Operator selected.  Head back over there and upload the file, will ya?"}
                                    ></NoSelectionOrEmptyArrayMessage>
                                </div>
                                <div hidden={(opAPCID !== '' && sourcePartnerList.length > 0) ? false : true}
                                    className="flex justify-end gap-3 py-3 px-10">
                                    <SingleCheckbox
                                        onChange={(checked) => setHideMappedSourcePartners(checked)}
                                        label={'Hide Mapped Partners'}
                                        id={'hideMappedPartnersSource'}>
                                    </SingleCheckbox>
                                </div>
                                <div hidden={(opAPCID !== '' && sourcePartnerList.length > 0) ? false : true}
                                    className="rounded-lg bg-white shadow-2xl outline-1 outline-offset-1 outline-[var(--dark-teal)]">
                                    <div className="mt-2 flow-root h-80 overflow-y-auto overflow-x-hidden sm:rounded-xl">
                                        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 align-middle">
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="sticky top-0 z-10 border-b border-[var(--darkest-teal)] bg-white/75 py-3.5 pr-3 pl-10 text-left text-sm/6 xl:text-base/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter">
                                                                Partner Name and Address
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="sticky top-0 z-10 border-b border-[var(--darkest-teal)] bg-white/75 py-3.5 pr-3 pl-3 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8 text-center">
                                                                <span className="sr-only">Select</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sourcePartnerList.map((partner, partnerIdx) => (
                                                            <tr key={partner.source_id}
                                                             hidden={(hideMappedSourcePartners && existingPartnerMap.find(item => item.source_partner.source_id === partner.source_id)) ? true : false}>
                                                                <td
                                                                    className={`${partnerIdx !== sourcePartnerList.length - 1 ? 'border-b border-[var(--darkest-teal)]/40' : ''}
                                                                ${cumaltivePartnerMapDisplay.find(list => list.source_partner_id === partner.source_id) ? 'bg-[var(--darkest-teal)]/20' : ''}
                                                                max-w-xs text-ellipsis`}>
                                                                    <p className="pt-4 pr-3 pl-10 text-sm/6 custom-style font-medium whitespace-wrap text-[var(--dark-teal)]">
                                                                        {partner.name}
                                                                    </p>
                                                                    <p className="pt-2 pr-3 pl-10 text-sm/6 custom-style-long-text whitespace-wrap text-[var(--dark-teal)]">
                                                                        {partner.street.concat(' ',
                                                                            `${partner.suite === undefined ? '' : partner.suite.concat(' ')}`,
                                                                            `${partner.city === undefined ? '' : partner.city.concat(', ')}`,
                                                                            `${partner.state === undefined ? '' : partner.state.concat(' ')}`,
                                                                            `${partner.zip === undefined ? '' : partner.zip.concat(' ')}`,
                                                                            `${partner.country === undefined ? '' : partner.country}`)}

                                                                    </p>
                                                                </td>
                                                                <td
                                                                    className={`${partnerIdx !== sourcePartnerList.length - 1 ? 'border-b border-[var(--darkest-teal)]/40' : ''} pt-2 pr-10 pl-2 whitespace-nowrap
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
                                                                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] indeterminate:border-[var(--bright-pink)] indeterminate:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:border-[var(--darkest-teal)]/40 disabled:bg-[var(--darkest-teal)]/20 disabled:checked:bg-[var(--darkest-teal)]/40 cursor-pointer"
                                                                            />
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
                            {/* Partner Library in AFE Partner Connections */}
                            <div className="">
                                <h2 className="truncate text-base/7 font-semibold text-[var(--darkest-teal)] custom-style border-b border-[var(--darkest-teal)]/40">Partner Library in AFE Partner Connections</h2>
                                <div className="flex justify-end gap-3 py-3 px-10">
                                    <SingleCheckbox
                                        onChange={(checked) => setHideMappedAPCPartners(checked)}
                                        label={'Hide Mapped Partners in AFE Partner Connections'}
                                        id={'hideMappedPartnersAFEPC'}>
                                    </SingleCheckbox>
                                </div>
                                <div className="rounded-lg bg-white shadow-2xl outline-1 outline-offset-1 outline-[var(--dark-teal)] ">
                                    <div className="mt-2 flow-root h-80 overflow-y-auto overflow-x-hidden sm:rounded-xl">
                                        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 items-center">
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="sticky top-0 z-10 border-b border-[var(--darkest-teal)] bg-white/75 py-3.5 pr-3 pl-10 text-left text-sm/6 xl:text-base/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter ">
                                                                Partner Name and Address
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="sticky top-0 z-10 border-b border-[var(--darkest-teal)] bg-white/75 py-3.5 pr-3 pl-3 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8 text-center">
                                                                <span className="sr-only">Edit</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {apcPartnerList.map((partner, partnerIdx) => (
                                                            <tr key={partner.apc_id}
                                                            hidden={(hideMappedAPCPartners && existingPartnerMap.find(item => item.apc_partner.apc_id === partner.apc_id)) ? true : false}>
                                                                <td
                                                                    className={`${partnerIdx !== apcPartnerList.length - 1 ? 'border-b border-[var(--darkest-teal)]/40' : ''}
                                                                ${cumaltivePartnerMapDisplay.find(list => list.apc_partner_id === partner.apc_id) || existingPartnerMap.find(list => list.source_partner.source_id === currentPartnerMapDisplay?.source_partner_id! && list.apc_partner.apc_id === partner.apc_id)
                                                                            ? 'bg-[var(--darkest-teal)]/20' : ''} max-w-xs`}>
                                                                    <p className="pt-4 pr-3 pl-10 text-sm/6 custom-style font-medium whitespace-wrap text-[var(--dark-teal)]">
                                                                        {partner.name}
                                                                    </p>
                                                                    <p className="pt-2 pr-3 pl-10 text-sm/6 custom-style-long-text whitespace-wrap text-[var(--dark-teal)]">
                                                                        {partner.street} {partner.suite} {partner.city}, {partner.state} {partner.zip}
                                                                    </p>
                                                                </td>
                                                                <td
                                                                    className={`${partnerIdx !== apcPartnerList.length - 1 ? 'border-b border-[var(--darkest-teal)]/40' : ''} pt-2 pr-10 pl-2 whitespace-nowrap
                                                                ${cumaltivePartnerMapDisplay.find(list => list.apc_partner_id === partner.apc_id) || existingPartnerMap.find(list => list.source_partner.source_id === currentPartnerMapDisplay?.source_partner_id! && list.apc_partner.apc_id === partner.apc_id)
                                                                            ? 'bg-[var(--darkest-teal)]/20' : ''} `}>
                                                                    <div className="flex shrink-0 items-center justify-center">
                                                                        <div className="group grid size-4 grid-cols-1">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={partner.apc_id === currentPartnerMapDisplay?.apc_partner_id || existingPartnerMap.find(list => list.source_partner.source_id === currentPartnerMapDisplay?.source_partner_id! && list.apc_partner.apc_id === partner.apc_id) ? true : false}
                                                                                disabled={existingPartnerMap.find(list => list.source_partner.source_id === currentPartnerMapDisplay?.source_partner_id! && list.apc_partner.apc_id === partner.apc_id) ? true : false}
                                                                                value={partner.apc_id}
                                                                                onChange={(e) => toggleAPCPartner(partner)}
                                                                                aria-describedby="checkbox"
                                                                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] indeterminate:border-[var(--bright-pink)] indeterminate:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:border-[var(--darkest-teal)]/40 disabled:bg-[var(--darkest-teal)]/20 disabled:checked:bg-[var(--darkest-teal)]/40 cursor-pointer" />
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
                        <div className="w-full flex flex-col lg:flex-row gap-5 justify-between py-4 items-center border-t border-t-[var(--darkest-teal)]/70">
                            <button
                                disabled={(currentPartnerMapDisplay?.apc_partner_id && currentPartnerMapDisplay.source_partner_id) ? false : true}
                                className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] min-w-64"
                                onClick={(e) => { savePartnerMapping() }}>
                                Map Partners
                            </button>
                            <div className="w-full flex flex-col lg:flex-row gap-5 justify-end items-center ">
                                <button
                                    hidden={(cumaltivePartnerMapDisplay.length > 0 && opAPCID !== '') ? false : true}
                                    disabled={(cumaltivePartnerMapDisplay.length > 0 && opAPCID !== '') ? false : true}
                                    className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] min-w-64"
                                    onClick={(e) => { setCumlativePartnerDisplay([]), notifyStandard(`Partner Mappings cleared.  No leaks, no flare, just fresh pipe.\n\n(TLDR: Partner Mappings reset without saving)`) }}>
                                    Clear Mappings
                                </button>
                                <button
                                    hidden={(cumaltivePartnerMapDisplay.length > 0 && opAPCID !== '') ? false : true}
                                    disabled={(cumaltivePartnerMapDisplay.length > 0 && opAPCID !== '') ? false : true}
                                    className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] min-w-64"
                                    onClick={(e) => { savePartnerMappingRecords(), notifyStandard(`Partner Mappings have been saved.  Let's call it a clean tie-in.\n\n(TLDR: Partner Mappings ARE saved)`) }}>
                                    Save Mappings
                                </button>
                            </div>
                        </div>
                        <div hidden={cumaltivePartnerMapDisplay.length > 0 ? false : true} className="pl-0 pr-0 sm:px-0 ">
                            <h1 className="mt-4 custom-style text-[var(--darkest-teal)] font-semibold">Pending Mappings</h1>
                            <div className="bg-white">
                                <table className="table-auto w-full outline-1 outline-offset-1 outline-[var(--darkest-teal)]/70 rounded-lg shadow-2xl">
                                    <thead className="border-b-2 border-b border-[var(--darkest-teal)] ">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="sticky  rounded-t-lg xl:w-1/2 xl:table-cell top-0 z-10 bg-white/75 py-3.5 pr-3 xl:text-left text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter pl-2">
                                                <div>Partner Address in your AFE System</div>
                                                <div className="xl:hidden custom-style-long-text font-normal justify-self-center text-base/7">to be mapped to the</div>
                                                <div className="xl:hidden">Partner Address in AFE Partner Connections</div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="hidden xl:table-cell sticky top-0 z-10 bg-white/75 py-3 pr-3 text-left text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter">

                                            </th>
                                            <th
                                                scope="col"
                                                className="hidden xl:w-1/2 xl:table-cell xl:pr-3 xl:pl-10 sticky top-0 z-10 bg-white/75 py-3 pr-3 text-left text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter">
                                                <div>Partner Address in AFE Partner Connections</div>
                                            </th>

                                            <th scope="col" className="hidden rounded-tr-lg xl:table-cell sticky top-0 z-10 bg-white/75 py-3 pr-4 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8">
                                                <span className="sr-only">Delete</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rowsToShow.map((partner, partnerIdx) => (
                                            <tr key={partnerIdx} 
                                            className={`${partnerIdx !== cumaltivePartnerMapDisplay.length - 1 ? '' : ''} items-center`}>
                                                <td>
                                                    {/* Partner Source Address.  Stays put no matter the screen size.  Truncates when small*/}
                                                    <div className="pt-2 pl-3 pr-3 text-sm/6 xl:pr-3">
                                                        <p className="max-w-full flex-1 truncate xl:whitespace-normal text-sm/6 custom-style font-medium text-[var(--darkest-teal)]">
                                                            {partner.source_partner_name}
                                                        </p>
                                                        <p className="max-w-full flex-1 truncate xl:whitespace-normal text-sm/6 custom-style-long-text text-[var(--dark-teal)]">
                                                            {partner.source_partner_address}
                                                            <ArrowTurnDownLeftIcon className="xl:hidden size-7 stroke-2 text-[var(--darkest-teal)] justify-self-end mr-2"></ArrowTurnDownLeftIcon>
                                                        </p>
                                                    </div>
                                                    {/* Partner APC Address.  Only shows when screen is not xl*/}
                                                    <div className="-mt-5 pl-3 pr-5 text-sm/6 xl:pr-3 xl:hidden">
                                                        <p className="max-w-full flex-1 truncate custom-style font-medium text-[var(--dark-teal)] ">
                                                            {partner.apc_partner_name}
                                                        </p>
                                                        <p className="max-w-full flex-1 truncate custom-style-long-text text-[var(--dark-teal)]">
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
                                                    <p className="pt-4 xl:pr-3 xl:pl-10 text-sm/6 custom-style font-medium text-[var(--darkest-teal)]">
                                                        {partner.apc_partner_name}
                                                    </p>
                                                    <p className="mt-1 xl:pr-3 xl:pl-10 text-sm/6 custom-style-long-text text-[var(--dark-teal)]">
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
                                <div
                                    hidden={cumaltivePartnerMapDisplay.length === 0 ? true : false}>
                                    <UniversalPagination
                                        data={cumaltivePartnerMapDisplay}
                                        rowsPerPage={rowsLimit}
                                        listOfType="Pending Mapped Partners"
                                        onPageChange={handlePageChange}
                                    />
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