import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from '@heroicons/react/20/solid';

type PaginationProps<T> = {
    data: T[];
    rowsPerPage?: number;
    listOfType: string;
    onPageChange: (paginatedData: T[], currentPage: number) => void;
    totalUnfilteredRows?: number;
};

export default function UniversalPagination<T>({
    data,
    rowsPerPage = 5,
    listOfType,
    onPageChange,
    totalUnfilteredRows = 0,
}: PaginationProps<T>) {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [paginationArray, setPaginationArray] = useState<number[]>([]);
    const [minPageNumber, setMinPageNumber] = useState(0);
    const [maxPageNumber, setMaxPageNumber] = useState(4);

    // Calculate total pages and pagnation array when data changes
    useMemo(() => {
        const pages = Math.ceil(data.length / rowsPerPage);
        console.log(pages,'THE PAGES');
        setTotalPages(pages);
        setPaginationArray(Array(pages).fill(null).map((_, i) => i));

        if(data.length < rowsPerPage*(currentPage+1) && currentPage !==0) {
            console.log(Math.ceil(data.length/rowsPerPage)-1);
            setCurrentPage(Math.ceil(data.length/rowsPerPage)-1);
        }
    }, [data.length, rowsPerPage]);
console.log(paginationArray,'the page aray');
    // Update paginated rows whenever page or data changes
    useEffect(() => {
        const startIndex = currentPage * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);
        onPageChange(paginatedData, currentPage);
    }, [currentPage, data, rowsPerPage]);

    const goToPage = (pageNumber: number) => {
        if (pageNumber >= 0 && pageNumber < totalPages) {
            setCurrentPage(pageNumber);
            setMinPageNumber(Math.min(Math.max(0, pageNumber - 2),4));
            setMaxPageNumber(Math.max(Math.min(totalPages, pageNumber + 2),4));
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
            setMinPageNumber(Math.min(Math.max(0, currentPage - 1), totalPages - 5));
            setMaxPageNumber(Math.min(totalPages, Math.max(0, currentPage + 3, 4)));
        }

    };

    const previousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            setMinPageNumber(Math.min(Math.max(0, currentPage - 3), totalPages - 5));
            setMaxPageNumber(Math.min(totalPages, Math.max(currentPage + 1, 4)));
        }
        
    };

    // Calculate the range of items being shown
    const startItem = currentPage === 0 ? 1 : currentPage * rowsPerPage + 1;
    const endItem = currentPage === totalPages - 1
        ? data.length
        : (currentPage + 1) * rowsPerPage;

    return (
        <>
        <div className="w-full flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-2 px-1 items-center">
            <div className="text-sm/6 text-[var(--darkest-teal)] custom-style font-medium">
                Showing {startItem} to {endItem} of {data.length} {listOfType} {totalUnfilteredRows !== 0 && data.length !== totalUnfilteredRows ? '(Filtered from '+totalUnfilteredRows+' Total)' : ''}
                <br></br>Page {currentPage + 1} of {totalPages}
                
            </div>
            <div className="flex">
                <ul
                    className="flex justify-center items-center align-center gap-x-2"
                    role="navigation"
                    aria-label="Pagination">
                    <li
                        className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid ${currentPage === 0
                                ? "bg-white border-[var(--darkest-teal)]/20 text-[var(--darkest-teal)]/30 pointer-events-none"
                                : "bg-white cursor-pointer border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                            }`}
                        onClick={previousPage}>
                        <ChevronLeftIcon className="w-5 h-5" />
                    </li>
                    {paginationArray.map((pageNum) => (
                        <li hidden={(pageNum <= maxPageNumber-1 && pageNum >= minPageNumber) || paginationArray.length <=1 ? false : true }
                            className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid bg-white cursor-pointer ${currentPage === pageNum
                                    ? "bg-white border-[var(--bright-pink)] pointer-events-none"
                                    : "bg-white border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                                }`}
                            onClick={() => goToPage(pageNum)}
                            key={pageNum}>
                            {pageNum + 1}
                        </li>
                    ))}
                    <li hidden={maxPageNumber >= totalPages ? true : false }
                        className={`flex items-end justify-center w-8 rounded-md h-8 bg-white text-[var(--darkest-teal)]/40 pointer-events-none}`}
                        onClick={nextPage}>
                        <EllipsisHorizontalIcon className="w-5 h-5" />
                    </li>
                    <li
                        className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid ${currentPage === totalPages - 1
                                ? "bg-white border-[var(--darkest-teal)]/20 text-[var(--darkest-teal)]/30 pointer-events-none"
                                : "bg-white cursor-pointer border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                            }`}
                        onClick={nextPage}>
                        <ChevronRightIcon className="w-5 h-5" />
                    </li>
                </ul>
            </div>
            
        </div>
       
        </>
    );

}

export function UniversalPaginationForDarkBackground<T>({
    data,
    rowsPerPage = 5,
    listOfType,
    onPageChange
}: PaginationProps<T>) {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [paginationArray, setPaginationArray] = useState<number[]>([]);

    // Calculate total pages and pagnation array when data changes
    useMemo(() => {
        const pages = Math.ceil(data.length / rowsPerPage);
        setTotalPages(pages);
        setPaginationArray(Array(pages).fill(null).map((_, i) => i));
    }, [data.length, rowsPerPage]);

    // Update paginated rows whenever page or data changes
    useEffect(() => {
        const startIndex = currentPage * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);
        onPageChange(paginatedData, currentPage);
    }, [currentPage, data, rowsPerPage]);

    const goToPage = (pageNumber: number) => {
        if (pageNumber >= 0 && pageNumber < totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const previousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Calculate the range of items being shown
    const startItem = currentPage === 0 ? 1 : currentPage * rowsPerPage + 1;
    const endItem = currentPage === totalPages - 1
        ? data.length
        : (currentPage + 1) * rowsPerPage;

    return (
        <>
        <div className="w-full flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-2 px-1 items-center">
            <div className="text-sm/6 text-white custom-style font-medium">
                Showing {startItem} to {endItem} of {data.length} {listOfType}
            </div>
            <div className="flex">
                <ul
                    className="flex justify-center items-center align-center gap-x-2"
                    role="navigation"
                    aria-label="Pagination">
                    <li
                        className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid ${currentPage === 0
                                ? "bg-white border-[var(--darkest-teal)]/10 text-[var(--darkest-teal)]/20 pointer-events-none"
                                : "bg-white cursor-pointer border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                            }`}
                        onClick={previousPage}>
                        <ChevronLeftIcon className="w-5 h-5" />
                    </li>
                    {paginationArray.map((pageNum) => (
                        <li 
                            className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid bg-white cursor-pointer ${currentPage === pageNum
                                    ? "bg-white border-[var(--bright-pink)] pointer-events-none"
                                    : "bg-white border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                                }`}
                            onClick={() => goToPage(pageNum)}
                            key={pageNum}>
                            {pageNum + 1}
                        </li>
                    ))}
                    <li 
                        className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid ${currentPage === totalPages - 1
                                ? "bg-white border-[var(--darkest-teal)]/10 text-[var(--darkest-teal)]/20 pointer-events-none"
                                : "bg-white cursor-pointer border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                            }`}
                        onClick={nextPage}>
                        <ChevronRightIcon className="w-5 h-5" />
                    </li>
                </ul>
            </div>
            
        </div>
       
        </>
    );

}