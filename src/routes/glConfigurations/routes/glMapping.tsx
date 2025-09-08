import { fetchAccountCodesforOperatorToMap } from "provider/fetch";
import { useState, useEffect, useMemo } from "react";
import { type GLCodeRowData } from "src/types/interfaces";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { ArrowTurnDownLeftIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { writeGLCodeMapping } from "provider/write";
import { ToastContainer } from 'react-toastify';
import { notifyStandard, warnUnsavedChanges } from "src/helpers/helpers";
import LoadingPage from "src/routes/loadingPage";
import { OperatorDropdown } from 'src/routes/operatorDropdown';
import { PartnerDropdown } from "src/routes/partnerDropdown";
import { type GLMappingRecord } from 'src/types/interfaces';

export default function GLMapping() {
   
    const [cumaltiveGLMap, setCumaltiveGLMap] = useState<GLMappingRecord[] | []>([]);
    const [currentGLMap, setCurrentGLMap] = useState<GLMappingRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [operatorAccountCodes, setOperatorAccountCodes] = useState<GLCodeRowData[]|[]>([])
    const [partnerAccountCodes, setPartnerAccountCodes] = useState<GLCodeRowData[]|[]>([])
    
    const [opAPCID, setOpAPCID] = useState('');
    const [partnerAPCID, setPartnerAPCID] = useState('');
    
    const [rowsLimit] = useState(10);
    const [rowsToShow, setRowsToShow] = useState<GLMappingRecord[]>([]);
    const [customPagination, setCustomPagination] = useState<number[] | []>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const nextPage = () => {
        const startIndex = rowsLimit * (currentPage + 1);
        const endIndex = startIndex + rowsLimit;
        const newArray = cumaltiveGLMap.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(currentPage + 1);
        };
    const changePage = (value: number) => {
        const startIndex = value * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = cumaltiveGLMap.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(value);
        };
    const previousPage = () => {
        const startIndex = (currentPage - 1) * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = cumaltiveGLMap.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          setCurrentPage(0);
        }
        };
    
    useMemo(() => {
            setCustomPagination(
              Array(Math.ceil(cumaltiveGLMap.length / rowsLimit)).fill(null)
            );
            setTotalPage(
                Math.ceil(cumaltiveGLMap.length / rowsLimit)
            )
            }, [cumaltiveGLMap]);

    useEffect(() => {
        let isMounted = true;
        async function getAccountCodes() {
            if(opAPCID === '' || partnerAPCID === '') return;
            setLoading(true);
            try {
                const operatorAccountList = await fetchAccountCodesforOperatorToMap(opAPCID, partnerAPCID,true,false);
                const partnerAccountList = await fetchAccountCodesforOperatorToMap(opAPCID, partnerAPCID,false,true);
                
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
        sourceGLCode: GLCodeRowData
    ) => {
        if (currentGLMap?.apc_operator_id === sourceGLCode.apc_op_id && currentGLMap?.apc_operator_id !=='') {
            setCurrentGLMap({
                ...currentGLMap,
                operator_account_number: '',
                operator_account_description: '',
                operator_account_group: '',
                apc_operator_id: ''
            })

        } else {
            setCurrentGLMap({
                ...currentGLMap,
                operator_account_number: sourceGLCode.account_number ?? '',
                operator_account_description: sourceGLCode.account_description ?? '',
                operator_account_group: sourceGLCode.account_group ?? '',
                apc_operator_id: opAPCID ?? '',
                partner_account_number: currentGLMap?.partner_account_number ?? '',
                partner_account_description: currentGLMap?.partner_account_description ?? '',
                partner_account_group: currentGLMap?.partner_account_group ?? '',
                apc_partner_id: currentGLMap?.apc_partner_id ?? '',
            })
        }

    };
    const togglePartnerGLCode = (
        sourceGLCode: GLCodeRowData
    ) => {
        if (currentGLMap?.apc_partner_id === sourceGLCode.apc_part_id && currentGLMap?.apc_partner_id !=='') {
            console.log(sourceGLCode.apc_part_id,'thepart')
            setCurrentGLMap({
                ...currentGLMap,
                partner_account_number: '',
                partner_account_description: '',
                partner_account_group: '',
                apc_partner_id: ''
            })

        } else {
            setCurrentGLMap({
                ...currentGLMap,
                partner_account_number: sourceGLCode.account_number ?? '',
                partner_account_description: sourceGLCode.account_description ?? '',
                partner_account_group: sourceGLCode.account_group ?? '',
                apc_partner_id: partnerAPCID ?? '',
                operator_account_number: currentGLMap?.operator_account_number ?? '',
                operator_account_description: currentGLMap?.operator_account_description ?? '',
                operator_account_group: currentGLMap?.operator_account_group ?? '',
                apc_operator_id: currentGLMap?.apc_operator_id ?? '',
            })
        }

    };
    const saveGLMapping = () => {
        
        setCumaltiveGLMap(prevCumlativeList => {
            const updatedCumlativeList = [...prevCumlativeList];
            updatedCumlativeList.push(currentGLMap!)
            setCurrentGLMap(null)
            return updatedCumlativeList
        });
        setRowsToShow(prevMap => {
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
    console.count
    return (
        <>
        
            <div >
                <div className="shadow-lg sm:rounded-lg ring-1 ring-[var(--darkest-teal)]/20 p-4 mb-5">
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 sm:divide-x sm:divide-gray-300">
        <div className="">
            <h2 className="custom-style text-sm sm:text-md xl:text-lg font-medium text-[var(--darkest-teal)]">Map GL Account Codes for Non-Op AFEs</h2>
                <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text px-3">Select an Operator you receive Non-Op AFEs from and your company as the Partner to map GL Account Codes</p><br></br>
         </div>
         
         <div className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 ">
                <div className="">
                <h1 className="custom-style text-[var(--darkest-teal)] font-semibold text-sm xl:text-base">Operator of Non-Op AFEs:</h1>
                <div className="">
                <OperatorDropdown 
                    onChange={(id) => {setOpAPCID(id)} }
                    limitedList={false}
                />
                </div>
                </div>
                <div className="">
                <h1 className="custom-style text-[var(--darkest-teal)] font-semibold text-sm xl:text-base">Your company as a Partner on Non-Op AFEs:</h1>
                <div className="">
                <PartnerDropdown 
                    onChange={(id) => {setPartnerAPCID(id)} }
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
                    hidden={(opAPCID === '' && partnerAPCID === '') ||
                                            (opAPCID !== '' && partnerAPCID === '') || 
                                            (opAPCID === '' && partnerAPCID !== '') ? false : true}
                    className="bg-white shadow-xl ring-1 ring-gray-900/20 sm:rounded-xl ">
                                <div className="my-8 max-h-80 flex items-center justify-center">
                                    <h2 className="sm:w-3/4 font-semibold text-[var(--darkest-teal)] custom-style-long-text py-2 text-sm xl:text-base">Select both an Operator and Your Company as a Partner from the dropdowns to show both account lists for mapping.</h2>
                                </div>
                                
                    
                    </div>
                    <div 
                    hidden={(opAPCID === '' && partnerAPCID === '') ||
                                            (opAPCID !== '' && partnerAPCID === '') || 
                                            (opAPCID === '' && partnerAPCID !== '') ? true : false}
                    className="divide-y divide-gray-900/20">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 sm:px-0 sm:grid-cols-2 pb-8">
                            <div className="divide-y divide-gray-900/20 ">
                                <h2 className="2xl:w-3/4 font-semibold text-[var(--darkest-teal)] custom-style text-sm xl:text-base">Operator Account Codes</h2>
                                <div className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl ">
                                    <div
                                        hidden={(partnerAPCID !== '' && opAPCID !=='' && operatorAccountCodes.length < 1) ? false : true}
                                        className="mt-8 max-h-80 flex items-center justify-center">
                                        <h2 className="sm:w-3/4 font-normal text-[var(--darkest-teal)] custom-style py-2 text-sm xl:text-base">There are no account codes to show.  Maybe they haven't been uploaded yet? {<br></br>}{<br></br>}If they haven't been uploaded you can reach out to the Operator to let them know.{<br></br>}{<br></br>}Or send us a message on the Contact Support Tab and we'll reach out.</h2>
                                    </div>
                                    <div
                                        hidden={(opAPCID !== '' && operatorAccountCodes.length > 0) ? false : true}
                                        className="mt-8 flow-root max-h-80 overflow-y-auto overflow-x-hidden sm:rounded-xl">
                                        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 align-middle">
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="sticky top-0 z-10 border-b border-gray-900 bg-white/75 py-3.5 pr-3 pl-10 text-left text-sm xl:text-base font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter sm:pl-10 lg:pl-10">
                                                                Account Group, Number and Description
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="sticky top-0 z-10 border-b border-gray-900 bg-white/75 py-3.5 pr-4 pl-3 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8 text-center">
                                                                <span className="sr-only">Select</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {operatorAccountCodes.map((account, accountIdx) => (
                                                            <tr key={accountIdx}>

                                                                <td
                                                                    className={`${accountIdx !== operatorAccountCodes.length - 1 ? 'border-b border-gray-300' : ''}
                                                                ${cumaltiveGLMap.find(list => list.operator_account_number === account.account_number) ? 'bg-[var(--darkest-teal)]/20' : ''}
                                                                max-w-xs overflow-hidden text-ellipsis`}>
                                                                    <p className="pt-4 pr-3 pl-10 text-sm/6 custom-style font-medium whitespace-wrap text-[var(--dark-teal)] sm:pl-10 lg:pl-10">
                                                                        {account.account_group}

                                                                    </p>
                                                                    <p className="pt-2 pr-3 pl-10 text-sm/6 custom-style-long-text whitespace-wrap text-[var(--dark-teal)] ">
                                                                       <span className="font-semibold">{account.account_number}</span> {' | '}
                                                                        <span className="font-medium">{account.account_description}</span>


                                                                    </p>
                                                                </td>
                                                                <td
                                                                    className={`${accountIdx !== operatorAccountCodes.length - 1 ? 'border-b border-gray-300' : ''} pt-2 pr-15 pl-2 whitespace-nowrap sm:pr-15 lg:pr-15
                                                                ${cumaltiveGLMap.find(list => list.operator_account_number === account.account_number) ? 'bg-[var(--darkest-teal)]/20' : ''}
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
                                <h2 className="truncate 2xl:w-3/4 font-semibold text-[var(--darkest-teal)] custom-style text-sm xl:text-base">Your Account Codes</h2>
                                <div className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl ">
                                    <div
                                        hidden={(partnerAPCID !== '' && opAPCID !=='' && partnerAccountCodes.length < 1) ? false : true}
                                        className="mt-8 max-h-80 flex items-center justify-center">
                                        <h2 className="sm:w-3/4 font-normal text-[var(--darkest-teal)] custom-style-long-text py-2 text-sm xl:text-base">There are no account codes to show.  Maybe they haven't been uploaded yet? {<br></br>}{<br></br>}If they haven't been uploaded head back to the upload screen to get those accounts in the system.{<br></br>}{<br></br>}If account codes were uploaded they may take a few minutes to process.</h2>
                                    </div>
                                    <div 
                                    hidden={(partnerAPCID !== '' && partnerAccountCodes.length > 0) ? false : true}
                                    className="mt-8 flow-root max-h-80 overflow-y-auto overflow-x-hidden sm:rounded-xl">
                                        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 items-center">
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="sticky top-0 z-10 border-b border-gray-900 bg-white/75 py-3.5 pr-3 pl-10 text-left text-sm xl:text-base font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter sm:pl-10 lg:pl-10">
                                                                Account Group, Number and Description
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="sticky top-0 z-10 border-b border-gray-900 bg-white/75 py-3.5 pr-4 pl-3 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8 text-center">
                                                                <span className="sr-only">Edit</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {partnerAccountCodes.map((account, accountIdx) => (
                                                            <tr key={accountIdx}>

                                                                <td
                                                                    className={`${accountIdx !== partnerAccountCodes.length - 1 ? 'border-b border-gray-300' : ''}
                                                                ${cumaltiveGLMap.find(list => list.partner_account_number === account.account_number) ? 'bg-[var(--darkest-teal)]/20' : ''}
                                                                max-w-xs overflow-hidden text-ellipsis`}>
                                                                    <p className="pt-4 pr-3 pl-10 text-sm/6 custom-style font-medium whitespace-wrap text-[var(--dark-teal)] sm:pl-10 lg:pl-10">
                                                                        {account.account_group}

                                                                    </p>
                                                                    <p className="pt-2 pr-3 pl-10 text-sm/6 custom-style-long-text whitespace-wrap text-[var(--dark-teal)] ">
                                                                       <span className="font-semibold">{account.account_number}</span> {' | '}
                                                                        <span className="font-medium">{account.account_description}</span>


                                                                    </p>
                                                                </td>
                                                                <td
                                                                    className={`${accountIdx !== partnerAccountCodes.length - 1 ? 'border-b border-gray-300' : ''} pt-2 pr-15 pl-2 whitespace-nowrap sm:pr-15 lg:pr-15
                                                                ${cumaltiveGLMap.find(list => list.partner_account_number === account.account_number) ? 'bg-[var(--darkest-teal)]/20' : ''}
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
                                disabled={(currentGLMap?.apc_operator_id && currentGLMap.apc_partner_id && currentGLMap.operator_account_number && currentGLMap.partner_account_number) ? false : true}
                                className="cursor-pointer disabled:cursor-not-allowed w-full lg:w-60 rounded-md bg-[var(--dark-teal)] outline-[var(--dark-teal)] outline-1 -outline-offset-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:outline-none px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] justify-end "
                                onClick={(e) => { saveGLMapping() }}>
                                Create Mapping
                            </button>
                            <div className="w-full sm:w-125 flex flex-col lg:flex-row gap-5 justify-end items-center ">
                                <button
                                    disabled={(cumaltiveGLMap.length > 0 ) ? false : true}
                                    className="cursor-pointer disabled:cursor-not-allowed w-full xl:w-60 rounded-md bg-white outline-[var(--darkest-teal)] outline-1 -outline-offset-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:outline-none px-3 py-2 text-sm font-semibold custom-style text-[var(--darkest-teal)] shadow-xs hover:bg-[var(--bright-pink)] hover:text-white hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] justify-end"
                                    onClick={(e) => { setCumaltiveGLMap([]), setRowsToShow([]),notifyStandard(`GL Account Code Mappings cleared.  No leaks, no flare, just fresh pipe.\n\n(TLDR: GL Account Code Mappings reset without saving)`) }}>
                                    Clear Mappings
                                </button>
                                <button
                                    disabled={(cumaltiveGLMap.length > 0 ) ? false : true}
                                    className="cursor-pointer disabled:cursor-not-allowed w-full xl:w-60 rounded-md bg-[var(--dark-teal)] outline-[var(--dark-teal)] outline-1 -outline-offset-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:outline-none px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] justify-end"
                                    onClick={(e) => { saveGLMappingRecords(), notifyStandard(`GL Account Code Mappings have been saved.  Let's call it a clean tie-in.\n\n(TLDR: GL Account Code Mappings ARE saved)`) }}>
                                    Save Mappings
                                </button>
                            </div>
                        </div>
                        <div hidden={cumaltiveGLMap.length > 0 ? false : true} className="">
                            <h1 className="mt-4 custom-style text-[var(--darkest-teal)] font-semibold">Pending Mappings</h1>
                            <div className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl flow-root overflow-hidden">
                                
                                        <div className="py-2 mx-auto max-w-7xl">
                                            <table className="w-full table-fixed">
                                                <thead className="w-full border-b-2 border-b border-gray-900 ">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="sticky xl:w-1/2 xl:table-cell top-0 z-10 bg-white/75 py-3.5 pr-3 xl:text-left text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] backdrop-blur-xs backdrop-filter pl-2">
                                                            <div>Operator GL Account Code</div>
                                                            <div className="xl:hidden custom-style-long-text font-normal justify-self-center text-md">to be mapped to </div>
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
                                                        
                                                        <th scope="col" className="hidden xl:w-1/30 xl:table-cell sticky top-0 z-10 bg-white/75 py-3.5 pr-4 backdrop-blur-xs backdrop-filter sm:pr-6 lg:pr-8">
                                                            <span className="sr-only">Delete</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rowsToShow.map((glCode, glCodeIdx) => (
                                                        <tr key={glCodeIdx} className={`${glCodeIdx !== cumaltiveGLMap.length - 1 ? 'border-b border-gray-900 xl:border-gray-300' : ''} items-center`}>
                                                            <td>
                                                                {/* Operator GL Code.  Stays put no matter the screen size.  Truncates when small*/}
                                                                <div className="pt-2 pl-3 pr-5 text-sm/6 xl:pr-3">
                                                                <p className="max-w-full flex-1 truncate xl:whitespace-normal text-sm/6 custom-style font-medium text-[var(--dark-teal)]">
                                                                    {glCode.operator_account_group}
                                                                </p>
                                                                <p className="max-w-full flex-1 truncate xl:whitespace-normal text-sm/6 custom-style-long-text text-gray-500">
                                                                    {glCode.operator_account_number} | {glCode.operator_account_description}
                                                                <ArrowTurnDownLeftIcon className="xl:hidden size-7 stroke-2 text-[var(--(darkest-teal))] justify-self-end mr-2"></ArrowTurnDownLeftIcon>
                                                                </p>
                                                                </div>
                                                                {/* User's GL Code  Only shows when screen is not xl*/}
                                                                <div className="-mt-5 pl-3 pr-5 text-sm/6 xl:pr-3 xl:hidden">
                                                                <p className="max-w-full flex-1 truncate custom-style font-medium text-[var(--dark-teal)] ">
                                                                    {glCode.partner_account_group}
                                                                </p>
                                                                <p className="max-w-full flex-1 truncate xl:whitespace-normal text-sm/6 custom-style-long-text text-gray-500">
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
                                                                <p className="pt-4 xl:pr-3 xl:pl-10 text-sm/6 custom-style font-medium text-[var(--dark-teal)]">
                                                                    {glCode.partner_account_group}
                                                                </p>
                                                                <p className="mt-1 xl:pr-3 xl:pl-10 text-sm/6 custom-style-long-text text-gray-500">
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
                                        </div>
                                    
                            </div>
                            <div className="w-full flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-2 px-1 items-center">
                                  <div className="text-sm/6 text-[var(--darkest-teal)] custom-style font-medium">
                                    Showing {currentPage == 0 ? 1 : currentPage * rowsLimit + 1} to{" "}
                                    {currentPage == totalPage - 1
                                      ? cumaltiveGLMap?.length
                                      : (currentPage + 1) * rowsLimit}{" "}
                                    of {cumaltiveGLMap?.length} GL Account Code Mappings
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
                    </>
                )}
            </div>
            <ToastContainer />
            {warnUnsavedChanges(cumaltiveGLMap.length > 0, "You have NOT saved your Partner Mappings")}
        </>
    )
}