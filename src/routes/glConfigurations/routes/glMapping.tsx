import { fetchAccountCodesforOperatorToMap } from "provider/fetch";
import { useState, useEffect, useMemo } from "react";
import { type GLCodeType } from "src/types/interfaces";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { ArrowTurnDownLeftIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { writeGLCodeMapping } from "provider/write";
import { ToastContainer } from 'react-toastify';
import { notifyStandard, warnUnsavedChanges } from "src/helpers/helpers";
import LoadingPage from "src/routes/loadingPage";
import { OperatorDropdown } from 'src/routes/sharedComponents/operatorDropdown';
import { PartnerDropdown } from "src/routes/sharedComponents/partnerDropdown";
import { type GLMappingRecord } from 'src/types/interfaces';
import NoSelectionOrEmptyArrayMessage from "src/routes/sharedComponents/noSelectionOrEmptyArrayMessage";
import UniversalPagination from "src/routes/sharedComponents/pagnation";

export default function GLMapping() {

    const [cumaltiveGLMap, setCumaltiveGLMap] = useState<GLMappingRecord[] | []>([]);
    const [currentGLMap, setCurrentGLMap] = useState<GLMappingRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [operatorAccountCodes, setOperatorAccountCodes] = useState<GLCodeType[] | []>([])
    const [partnerAccountCodes, setPartnerAccountCodes] = useState<GLCodeType[] | []>([])

    const [opAPCID, setOpAPCID] = useState('');
    const [partnerAPCID, setPartnerAPCID] = useState('');
    
    const [rowsToShow, setRowsToShow] = useState<GLMappingRecord[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    
    const handlePageChange = (paginatedData: GLMappingRecord[], page: number) => {
              setRowsToShow(paginatedData);
              setCurrentPage(page);
      };
   
    useEffect(() => {
        let isMounted = true;
        async function getAccountCodes() {
            if (opAPCID === '' || partnerAPCID === '') return;
            setLoading(true);
            try {
                const operatorAccountList = await fetchAccountCodesforOperatorToMap(opAPCID, partnerAPCID, true, false);
                const partnerAccountList = await fetchAccountCodesforOperatorToMap(opAPCID, partnerAPCID, false, true);

                if (isMounted) {
                    setOperatorAccountCodes(operatorAccountList ?? []);
                    setPartnerAccountCodes(partnerAccountList ?? []);

                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }
        getAccountCodes();
        return () => {
            isMounted = false;
        };
    }, [opAPCID, partnerAPCID]);

    const toggleOperatorGLCode = (
        sourceGLCode: GLCodeType

    ) => {
        console.log(sourceGLCode, 'THE PASSES GL');
        if (currentGLMap?.operator_account_number === sourceGLCode.account_number && currentGLMap?.apc_operator_id !== '') {
            setCurrentGLMap({
                ...currentGLMap,
                operator_account_number: '',
                operator_account_description: '',
                operator_account_group: '',
                apc_operator_id: '',
                apc_op_account_id: null
            })

        } else {
            setCurrentGLMap({
                ...currentGLMap,
                operator_account_number: sourceGLCode.account_number ?? '',
                operator_account_description: sourceGLCode.account_description ?? '',
                operator_account_group: sourceGLCode.account_group ?? '',
                apc_operator_id: opAPCID ?? '',
                apc_op_account_id: sourceGLCode.id,
                partner_account_number: currentGLMap?.partner_account_number ?? '',
                partner_account_description: currentGLMap?.partner_account_description ?? '',
                partner_account_group: currentGLMap?.partner_account_group ?? '',
                apc_partner_id: currentGLMap?.apc_partner_id ?? '',
                apc_partner_account_id: currentGLMap?.apc_partner_account_id!
            })
        }

    };
    const togglePartnerGLCode = (
        sourceGLCode: GLCodeType
    ) => {
        if (currentGLMap?.partner_account_number === sourceGLCode.account_number && currentGLMap?.apc_partner_id !== '') {
            setCurrentGLMap({
                ...currentGLMap,
                partner_account_number: '',
                partner_account_description: '',
                partner_account_group: '',
                apc_partner_id: '',
                apc_partner_account_id: null
            })

        } else {
            setCurrentGLMap({
                ...currentGLMap,
                partner_account_number: sourceGLCode.account_number ?? '',
                partner_account_description: sourceGLCode.account_description ?? '',
                partner_account_group: sourceGLCode.account_group ?? '',
                apc_partner_id: partnerAPCID ?? '',
                apc_op_account_id: currentGLMap?.apc_op_account_id!,
                operator_account_number: currentGLMap?.operator_account_number ?? '',
                operator_account_description: currentGLMap?.operator_account_description ?? '',
                operator_account_group: currentGLMap?.operator_account_group ?? '',
                apc_operator_id: currentGLMap?.apc_operator_id ?? '',
                apc_partner_account_id: sourceGLCode.id
            })
        }

    };
    const saveGLMapping = () => {

        setCumaltiveGLMap(prevCumlativeList => {

            const exists = prevCumlativeList.some(item =>
                JSON.stringify(item) === JSON.stringify(currentGLMap)
            );

            if (exists) {
                notifyStandard('Duplicate Mapping Detected. This route has already been drilled. Choose a new path before you hit a pressure breach.')
                return prevCumlativeList;
            }

            const updatedCumlativeList = [...prevCumlativeList];
            updatedCumlativeList.push(currentGLMap!)
            setCurrentGLMap(null)
            return updatedCumlativeList
        });

        setRowsToShow(prevMap => {
            const exists = prevMap.some(item =>
                JSON.stringify(item) === JSON.stringify(currentGLMap)
            );

            if (exists) return prevMap;

            const updatedMap = [...prevMap];
            updatedMap.push(currentGLMap!)
            return updatedMap;
        });

    };
    const saveGLMappingRecords = () => {
        if (cumaltiveGLMap.length < 1) return;
        writeGLCodeMapping(cumaltiveGLMap);
        setCumaltiveGLMap([]);
    };
    const removeMapping = (index: number) => {
        setCumaltiveGLMap(prevMap => {
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
            <div >
                <div className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 p-4 mb-5">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 sm:divide-x sm:divide-[var(--darkest-teal)]/40">
                        <div className="">
                            <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Map GL Account Codes for Non-Op AFEs</h2>
                            <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">Select an Operator you receive Non-Op AFEs from and your company as the Partner to map GL Account Codes</p><br></br>
                        </div>

                        <div className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 ">
                            <div className="w-1/2">
                                <h1 className="text-base/7 font-medium text-[var(--darkest-teal)] custom-style">Operator of Non-Op AFEs:</h1>
                                <div className="">
                                    <OperatorDropdown
                                        value={opAPCID}
                                        onChange={(id) => { setOpAPCID(id) }}
                                        limitedList={false}
                                    />
                                </div>
                            </div>
                            <div className="w-1/2">
                                <h1 className="text-base/7 font-medium text-[var(--darkest-teal)] custom-style">Your company as a Partner on Non-Op AFEs:</h1>
                                <div className="">
                                    <PartnerDropdown
                                    value={partnerAPCID}
                                        onChange={(id) => { setPartnerAPCID(id) }}
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
                        {/* Default display for screen loading.  Assuming the Operator and Partner have not been selected */}
                        <div
                            hidden={(opAPCID === '' && partnerAPCID === '') ||
                                    (opAPCID !== '' && partnerAPCID === '') ||
                                    (opAPCID === '' && partnerAPCID !== '') ? false : true}>
                            <NoSelectionOrEmptyArrayMessage
                                    message={'Select both an Operator and Your Company as a Partner from the dropdowns to show both account lists for mapping.'}>      
                            </NoSelectionOrEmptyArrayMessage>
                        </div>
                        {/* If an Operator and Partner have been selected show warnings when there are no accounts for one or both */}
                        <div
                            hidden={(opAPCID === '' && partnerAPCID === '') ||
                                    (opAPCID !== '' && partnerAPCID === '') ||
                                    (opAPCID === '' && partnerAPCID !== '') ? true : false}
                            className="mt-10">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 sm:px-0 sm:grid-cols-2 pb-8">
                                <div className="divide-y divide-[var(--darkest-teal)]/40 ">
                                    <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Operator Account Codes</h2>
                                    {/* Warning if there are no Account Codes loaded by the Operator */}
                                    <div className="mt-8 border-b-0" hidden={operatorAccountCodes.length < 1 ? false : true}>
                                            <NoSelectionOrEmptyArrayMessage
                                                message={
                                                    <>
                                                        There are no account codes to show. Maybe they haven't been uploaded yet?
                                                        <br /><br />
                                                        If they haven't been uploaded you can reach out to the Operator to let them know.
                                                        <br /><br />
                                                        Or send us a message on the Contact Support Tab and we'll reach out.
                                                    </>
                                                }
                                            />
                                    </div>
                                    <div hidden={(opAPCID !== '' && operatorAccountCodes.length > 0) ? false : true} 
                                    className="rounded-lg bg-white shadow-2xl outline-1 outline-offset-1 outline-[var(--dark-teal)]">
                                        <div className="mt-8 flow-root h-80 overflow-y-auto overflow-x-hidden sm:rounded-xl">
                                            <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                                                <div className="inline-block min-w-full py-2 align-middle">
                                                    <table className="min-w-full">
                                                        <thead>
                                                            <tr>
                                                                <th
                                                                    scope="col"
                                                                    className="sticky top-0 z-10 border-b border-[var(--darkest-teal)] bg-white/75 py-3.5 pr-3 pl-10 text-left text-sm/6 xl:text-base/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter ">
                                                                    Account Group, Number and Description
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="sticky top-0 z-10 border-b border-[var(--darkest-teal)] bg-white/75 py-3.5 pr-3 pl-3 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8 text-center">
                                                                    <span className="sr-only">Select</span>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {operatorAccountCodes.map((account, accountIdx) => (
                                                                <tr key={accountIdx}>
                                                                    <td className={`${accountIdx !== operatorAccountCodes.length - 1 ? 'border-b border-[var(--darkest-teal)]/30' : ''}
                                                                ${cumaltiveGLMap.find(list => list.operator_account_number === account.account_number) ? 'bg-[var(--darkest-teal)]/20' : ''}
                                                                max-w-xs overflow-hidden text-ellipsis`}>
                                                                        <p className="pt-4 pr-3 pl-10 text-sm/6 custom-style font-medium whitespace-wrap text-[var(--dark-teal)]">
                                                                            {account.account_group}
                                                                        </p>
                                                                        <p className="pt-2 pr-3 pl-10 text-sm/6 custom-style-long-text whitespace-wrap text-[var(--dark-teal)] ">
                                                                            <span className="font-semibold">{account.account_number}</span> {' | '}
                                                                            <span className="font-medium">{account.account_description}</span>
                                                                        </p>
                                                                    </td>
                                                                    <td className={`${accountIdx !== operatorAccountCodes.length - 1 ? 'border-b border-[var(--darkest-teal)]/30' : ''} pt-2 pr-10 pl-2 whitespace-nowrap
                                                                ${cumaltiveGLMap.find(list => list.operator_account_number === account.account_number) ? 'bg-[var(--darkest-teal)]/20 border-none' : ''}
                                                                `}>
                                                                        <div className="flex shrink-0 items-center justify-center">
                                                                            <div className="group grid size-4 grid-cols-1">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={account.account_number === currentGLMap?.operator_account_number}
                                                                                    //disabled={(account.apc_op_id === currentGLMap?.apc_operator_id)}
                                                                                    //value={accountIdx}
                                                                                    onChange={(e) => toggleOperatorGLCode(account)}
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
                                <div className="divide-y divide-[var(--darkest-teal)]/40 ">
                                    <h2 className="truncate text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Your Account Codes</h2>
                                    {/* Warning if there are no Account Codes loaded by the Partner */}
                                    <div className="mt-8 border-b-0" hidden={partnerAccountCodes.length < 1 ? false : true}>
                                            <NoSelectionOrEmptyArrayMessage
                                                message={
                                                    <>
                                                        There are no account codes to show.  Maybe they haven't been uploaded yet?
                                                        <br /><br />
                                                        If they haven't been uploaded head back to the upload screen to get those accounts in the system.
                                                        <br /><br />
                                                        If account codes were uploaded they may take a few minutes to process.
                                                    </>
                                                }
                                            />
                                    </div>
                                    <div hidden={(partnerAPCID !== '' && partnerAccountCodes.length > 0) ? false : true} 
                                    className="rounded-lg bg-white shadow-2xl outline-1 outline-offset-1 outline-[var(--dark-teal)] ">
                                        <div className="mt-8 flow-root h-80 overflow-y-auto overflow-x-hidden sm:rounded-xl">
                                            <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                                                <div className="inline-block min-w-full py-2 align-middle">
                                                    <table className="min-w-full">
                                                        <thead>
                                                            <tr>
                                                                <th
                                                                    scope="col"
                                                                    className="sticky top-0 z-10 border-b border-[var(--darkest-teal)] bg-white/75 py-3.5 pr-3 pl-10 text-left text-sm/6 xl:text-base/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter ">
                                                                    Account Group, Number and Description
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="sticky top-0 z-10 border-b border-[var(--darkest-teal)] bg-white/75 py-3.5 pr-3 pl-3 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8 text-center">
                                                                    <span className="sr-only">Edit</span>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {partnerAccountCodes.map((account, accountIdx) => (
                                                                <tr key={accountIdx}>
                                                                    <td className={`${accountIdx !== partnerAccountCodes.length - 1 ? 'border-b border-[var(--darkest-teal)]/30' : ''}
                                                                ${cumaltiveGLMap.find(list => list.partner_account_number === account.account_number) ? 'bg-[var(--darkest-teal)]/20' : ''}
                                                                max-w-xs overflow-hidden text-ellipsis`}>
                                                                        <p className="pt-4 pr-3 pl-10 text-sm/6 custom-style font-medium whitespace-wrap text-[var(--dark-teal)]">
                                                                            {account.account_group}

                                                                        </p>
                                                                        <p className="pt-2 pr-3 pl-10 text-sm/6 custom-style-long-text whitespace-wrap text-[var(--dark-teal)]">
                                                                            <span className="font-semibold">{account.account_number}</span> {' | '}
                                                                            <span className="font-medium">{account.account_description}</span>


                                                                        </p>
                                                                    </td>
                                                                    <td className={`${accountIdx !== partnerAccountCodes.length - 1 ? 'border-b border-[var(--darkest-teal)]/30' : ''} pt-2 pr-10 pl-2 whitespace-nowrap
                                                                ${cumaltiveGLMap.find(list => list.partner_account_number === account.account_number) ? 'bg-[var(--darkest-teal)]/20 border-none' : ''}
                                                                `}>
                                                                        <div className="flex shrink-0 items-center justify-center">
                                                                            <div className="group grid size-4 grid-cols-1">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={account.account_number === currentGLMap?.partner_account_number}
                                                                                    //disabled={(account.apc_op_id === currentGLMap?.apc_operator_id)}
                                                                                    //value={accountIdx}
                                                                                    onChange={(e) => togglePartnerGLCode(account)}
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
                                    disabled={(currentGLMap?.apc_operator_id && currentGLMap.apc_partner_id && currentGLMap.operator_account_number && currentGLMap.partner_account_number) ? false : true}
                                    className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] min-w-40"
                                    onClick={(e) => { saveGLMapping() }}>
                                    Create Mapping
                                </button>
                                <div className="w-full sm:w-125 flex flex-col lg:flex-row gap-5 justify-end items-center ">
                                    <button
                                        hidden={(cumaltiveGLMap.length > 0) ? false : true}
                                        disabled={(cumaltiveGLMap.length > 0) ? false : true}
                                        className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] min-w-40"
                                        onClick={(e) => { setCurrentGLMap(null), setCumaltiveGLMap([]), setRowsToShow([]), notifyStandard(`GL Account Code Mappings cleared.  No leaks, no flare, just fresh pipe.\n\n(TLDR: GL Account Code Mappings reset without saving)`) }}>
                                        Clear Mappings
                                    </button>
                                    <button
                                        hidden={(cumaltiveGLMap.length > 0) ? false : true}
                                        disabled={(cumaltiveGLMap.length > 0) ? false : true}
                                        className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] min-w-40"
                                        onClick={(e) => { setCurrentGLMap(null), saveGLMappingRecords(), notifyStandard(`GL Account Code Mappings have been saved.  Let's call it a clean tie-in.\n\n(TLDR: GL Account Code Mappings ARE saved)`) }}>
                                        Save Mappings
                                    </button>
                                </div>
                            </div>
                            <div hidden={cumaltiveGLMap.length > 0 ? false : true} className="">
                                <h1 className="mt-4 custom-style text-[var(--darkest-teal)] font-semibold">Pending Mappings</h1>
                                <div className="bg-white">
                                    <table className="table-auto min-w-full outline-1 outline-offset-1 outline-[var(--darkest-teal)]/70 rounded-lg shadow-2xl">
                                            <thead className="border-b-2 border-b border-[var(--darkest-teal)]">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="sticky rounded-t-lg xl:w-1/2 xl:table-cell top-0 z-10 bg-white/75 py-3.5 pr-3 pl-2 xl:text-left text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter ">
                                                        <div>Operator GL Account Code</div>
                                                        <div className="xl:hidden custom-style-long-text font-normal justify-self-center text-base/7">to be mapped to </div>
                                                        <div className="xl:hidden">Your GL Account Code</div>
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="hidden xl:w-1/20 xl:table-cell sticky top-0 z-10 bg-white/75 py-3.5 pr-3 text-left text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter">

                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="hidden xl:w-1/2 xl:table-cell xl:pr-3 xl:pl-10 sticky top-0 z-10 bg-white/75 py-3.5 pr-3 text-left text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter">
                                                        <div>Your GL Account Code</div>
                                                    </th>
                                                    <th scope="col" className="hidden rounded-tr-lg xl:w-1/30 xl:table-cell sticky top-0 z-10 bg-white/75 py-3.5 pr-4 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8">
                                                        <span className="sr-only">Delete</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rowsToShow.map((glCode, glCodeIdx) => (
                                                    <tr key={glCodeIdx} className={`${glCodeIdx !== cumaltiveGLMap.length - 1 ? '' : ''} items-center`}>
                                                        <td>
                                                            {/* Operator GL Code.  Stays put no matter the screen size.  Truncates when small*/}
                                                            <div className="pt-2 pl-3 pr-5 text-sm/6 xl:pr-3">
                                                                <p className="max-w-full flex-1 truncate xl:whitespace-normal text-sm/6 custom-style font-medium text-[var(--darkest-teal)]">
                                                                    {glCode.operator_account_group}
                                                                </p>
                                                                <p className="max-w-full flex-1 truncate xl:whitespace-normal text-sm/6 custom-style-long-text text-[var(--dark-teal)]">
                                                                    {glCode.operator_account_number} | {glCode.operator_account_description}
                                                                    <ArrowTurnDownLeftIcon className="xl:hidden size-7 stroke-2 text-[var(--darkest-teal)] justify-self-end mr-2"></ArrowTurnDownLeftIcon>
                                                                </p>
                                                            </div>
                                                            {/* User's GL Code  Only shows when screen is not xl*/}
                                                            <div className="-mt-5 pl-3 pr-5 text-sm/6 xl:pr-3 xl:hidden">
                                                                <p className="max-w-full flex-1 truncate custom-style font-medium text-[var(--darkest-teal)] ">
                                                                    {glCode.partner_account_group}
                                                                </p>
                                                                <p className="max-w-full flex-1 truncate xl:whitespace-normal text-sm/6 custom-style-long-text text-[var(--dark-teal)]">
                                                                    {glCode.partner_account_number} | {glCode.partner_account_description}
                                                                </p>
                                                                <div className="m-2 size-6 pt-1 justify-self-end">
                                                                    <button
                                                                        onClick={() => removeMapping(glCodeIdx)}
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
                                                            <p className="pt-4 xl:pr-3 xl:pl-10 text-sm/6 custom-style font-medium text-[var(--darestk-teal)]">
                                                                {glCode.partner_account_group}
                                                            </p>
                                                            <p className="mt-1 xl:pr-3 xl:pl-10 text-sm/6 custom-style-long-text text-[var(--dark-teal)]">
                                                                {glCode.partner_account_number} | {glCode.partner_account_description}
                                                            </p>
                                                        </td>
                                                        <td className="hidden xl:table-cell justify-self-center">
                                                            <div className="size-6 justify-self-center pt-1 mr-3">
                                                                <button
                                                                    onClick={() => removeMapping(glCodeIdx)}
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
                                                hidden={cumaltiveGLMap.length === 0 ? true : false}>
                                                <UniversalPagination
                                                    data={cumaltiveGLMap}
                                                    rowsPerPage={10}
                                                    listOfType="Pending Mapped GL Codes"
                                                    onPageChange={handlePageChange}
                                                />
                                            </div>
                                </div>
                                
                            </div>
                        </div>
                    </>
                )}
            </div>
            <ToastContainer />
            {warnUnsavedChanges(cumaltiveGLMap.length > 0, "You have NOT saved your Partner Mappings")}
        </>
    )
}