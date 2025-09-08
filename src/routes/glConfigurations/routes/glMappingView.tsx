import { fetchMappedGLAccountCode } from "provider/fetch";
import { useState, useEffect, useMemo } from "react";
import { type GLMappedRecord } from "src/types/interfaces";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { ArrowTurnDownLeftIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { writeGLCodeMappingUpdate } from "provider/write";
import { ToastContainer } from 'react-toastify';
import { notifyStandard } from "src/helpers/helpers";
import LoadingPage from "src/routes/loadingPage";
import { OperatorDropdown } from 'src/routes/operatorDropdown';
import { PartnerDropdown } from "src/routes/partnerDropdown";
import { useSupabaseData } from "src/types/SupabaseContext";
import { transformGLCodeCrosswalk } from "src/types/transform";

export default function GLMapping() {
    const { session } = useSupabaseData();
    const token = session?.access_token ?? "";

    const [cumaltiveGLMap, setCumaltiveGLMap] = useState<GLMappedRecord[] | []>([]);
    const [loading, setLoading] = useState(false);
    const [opAPCID, setOpAPCID] = useState('');
    const [partnerAPCID, setPartnerAPCID] = useState('');

    const [rowsLimit] = useState(10);
    const [rowsToShow, setRowsToShow] = useState<GLMappedRecord[]>([]);
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
            if (opAPCID === '' || partnerAPCID === '') return;
            setLoading(true);
            try {
                const glCodeMapList = await fetchMappedGLAccountCode(opAPCID, partnerAPCID, token);
                
                if(!glCodeMapList.ok) {
                    throw new Error((glCodeMapList as any).message ?? "Unable to get the GL Account Code mappings");
                }

                if (isMounted) {
                    console.log(glCodeMapList.data,'THE RETURN')
                    const glCodeMapListFormatted = transformGLCodeCrosswalk(glCodeMapList.data);
                    setCumaltiveGLMap(glCodeMapListFormatted ?? []);
                    setRowsToShow(glCodeMapListFormatted ?? []);

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

    const removeMapping = async (id: number) => {
        const glMapIdx = cumaltiveGLMap.findIndex(item => item.id === id);
        if (glMapIdx < 0) return;

        const prevMap = [...cumaltiveGLMap];
        const prevRows = [...rowsToShow];
        const removedMapItem = prevMap[glMapIdx];
        const removedRowsItem = prevRows[glMapIdx];

        setCumaltiveGLMap(prevMap => {
            const updatedMap = [...prevMap];
            updatedMap.splice(glMapIdx, 1);
            return updatedMap;
        });
        setRowsToShow(prevMap => {
            const updatedMap = [...prevMap];
            updatedMap.splice(glMapIdx, 1);
            return updatedMap;
        });

        try {
            const res = await writeGLCodeMappingUpdate(id, false, token);
            if (!res.ok) {
                throw new Error((res as any).message ?? "Update failed");
            }
            notifyStandard(`GL Account Code pipeline shut in successfully.\n\n(TLDR: GL Account Code Mapping successfully deleted)`)
        } catch (err) {
            console.error("Failed to deactivate mapping:", err);
            notifyStandard(`GL Account Code couldn't be delete.  Rig it down and try again.\n\n(TLDR: GL Account Code Mapping was NOT deleted)`)
            setCumaltiveGLMap(prevMap => {
                if (prevMap.some((item) => item.id === id)) return prevMap;
                const updatedMap = [...prevMap];
                updatedMap.splice(Math.min(glMapIdx, updatedMap.length), 0, removedMapItem);
                return updatedMap;
            });
            setRowsToShow(prevMap => {
                if (prevMap.some((item) => item.id === id)) return prevMap;
                const updatedMap = [...prevMap];
                updatedMap.splice(Math.min(glMapIdx, updatedMap.length), 0, removedRowsItem);
                return updatedMap;
            });

        }
    };

    return (
        <>

            <div >
                <div className="shadow-lg sm:rounded-lg ring-1 ring-[var(--darkest-teal)]/20 p-4 mb-5">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 sm:divide-x sm:divide-gray-300">
                        <div className="">
                            <h2 className="custom-style text-sm sm:text-md xl:text-lg font-medium text-[var(--darkest-teal)]">View and Manage you GL Account Code Mappings</h2>
                            <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text px-3">Select an Operator you receive Non-Op AFEs from and your company as the Partner to view the GL Account Code Mappings</p><br></br>
                        </div>

                        <div className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 ">
                            <div className="">
                                <h1 className="custom-style text-[var(--darkest-teal)] font-semibold text-sm xl:text-base">Operator of Non-Op AFEs:</h1>
                                <div className="">
                                    <OperatorDropdown
                                        onChange={(id) => { setOpAPCID(id) }}
                                        limitedList={false}
                                    />
                                </div>
                            </div>
                            <div className="">
                                <h1 className="custom-style text-[var(--darkest-teal)] font-semibold text-sm xl:text-base">Your company as a Partner on Non-Op AFEs:</h1>
                                <div className="">
                                    <PartnerDropdown
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
                        <div
                            hidden={(opAPCID === '' && partnerAPCID === '') ||
                                (opAPCID !== '' && partnerAPCID === '') ||
                                (opAPCID === '' && partnerAPCID !== '') ? false : true}
                            className="bg-white shadow-xl ring-1 ring-gray-900/20 sm:rounded-xl ">
                            <div className="my-8 max-h-80 flex items-center justify-center">
                                <h2 className="sm:w-3/4 font-semibold text-[var(--darkest-teal)] custom-style py-2 text-sm xl:text-base">Select both an Operator and Your Company as a Partner from the dropdowns to view the GL Account Code Mappings.</h2>
                            </div>

                        </div>
                        <div
                            hidden={(opAPCID === '' && partnerAPCID === '') ||
                                (opAPCID !== '' && partnerAPCID === '') ||
                                (opAPCID === '' && partnerAPCID !== '') ? true : false}
                            className="divide-y divide-gray-900/20">

                            <div hidden={cumaltiveGLMap.length > 0 ? false : true} className="">
                                <h1 className="mt-4 custom-style text-[var(--darkest-teal)] font-semibold">GL Account Code Mappings</h1>
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
                                                                        onClick={() => { removeMapping(glCode.id!), notifyStandard(`GL Account Code pipeline shut in successfully.\n\n(TLDR: GL Account Code Mapping successfully deleted)`) }}
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
                                                                    onClick={() => { removeMapping(glCode.id!), notifyStandard(`GL Account Code pipeline shut in successfully.\n\n(TLDR: GL Account Code Mapping successfully deleted)`) }}
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
                                                className={`flex items-center justify-center w-[32px] rounded-[6px] h-[32px] border-[1px] border-solid disabled] ${currentPage == 0
                                                        ? "border-[var(--darkest-teal)]/10 text-[var(--darkest-teal)]/20 pointer-events-none"
                                                        : "cursor-pointer border-[var(--darkest-teal)]/30 hover:border-[var(--bright-pink)] hover:border-[2px]"
                                                    }`}
                                                onClick={previousPage}>
                                                <ChevronLeftIcon></ChevronLeftIcon>
                                            </li>
                                            {customPagination?.map((data, index) => (
                                                <li
                                                    className={`flex items-center justify-center w-[32px] rounded-[6px] h-[32px] border-[2px] border-solid bg-white cursor-pointer ${currentPage == index
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
                                                className={`flex items-center justify-center w-[32px] rounded-[6px] h-[32px] border-[1px] border-solid disabled] ${currentPage == totalPage - 1
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

        </>
    )
}