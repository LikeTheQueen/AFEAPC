import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import LoadingPage from "../../loadingPage";

//import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?worker&url';
//THIS IS A HACK AND YOU NEED TO UPDATE THE NPM PACKAGE
import workerSrc from "react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs?worker&url";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;


export default function DocumentBrowser( {file}:{file:string}) {
 
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [minPageNumber, setMinPageNumber] = useState(1);
  const [maxPageNumber, setMaxPageNumber] = useState(3);
 
  const docToView = useMemo(() => ({ url: file }), [file]);


  function createArrayWithArrayFrom(length: number): number[] {
  return Array.from({ length: length }, (_, index) => index + 1);
  }
  
  function onDocumentLoadSuccess({ numPages } : {numPages: number}) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function setPage(page: number) {

    setPageNumber(page);

     if((page) - 1 > numPages-2) {
      setMinPageNumber(numPages-2);
    } else {
      setMinPageNumber(Math.max(1, (page) - 1));
    }
    
    setMaxPageNumber(Math.min(numPages, (page) + 1));
  }

  function changePage(offset: number) {

    setPageNumber(prevPageNumber => prevPageNumber + offset);

    if((pageNumber+offset) - 1 > numPages-2) {
      setMinPageNumber(numPages-2);
    } else {
      setMinPageNumber(Math.max(1, (pageNumber+offset) - 1));
    }
    
    setMaxPageNumber(Math.min(numPages, (pageNumber+offset) + 1));
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }
console.log('NUM PAGE', numPages,'CURRENT', pageNumber, 'MIN PAGE', minPageNumber, 'MAX PAGE', maxPageNumber)
console.log(window.scrollY,'SCROLL')  
return (
    <>
    {docToView.url==='' ? (
      <LoadingPage></LoadingPage>
    ) : (
      <>
      <Document file={docToView}
      onLoadSuccess={onDocumentLoadSuccess}>
      <Page pageNumber={pageNumber} key={`page-${pageNumber}`}  
      />
      </Document>
    
    <div className="sticky bottom-0 left-0 right-0 w-full z-50 bg-white">
    <div className="flex justify-center sm:justify-between flex-col sm:flex-row gap-5 px-1 pt-3 items-center z-50 bg-[var(--dark-teal)]/85">
    <div className="text-sm/6 text-white custom-style font-medium">
            Showing page {pageNumber} {" "}of {numPages} Pages
    </div>
              <div className="flex ">
                <ul
                  className="flex justify-center items-center align-center gap-x-[10px] "
                  role="navigation"
                  aria-label="Pagination">
                  <li
                    className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid disabled] ${pageNumber === 1
                        ? "border-[var(--darkest-teal)]/30 bg-white/50 text-[var(--darkest-teal)]/30 pointer-events-none"
                        : "cursor-pointer border-[var(--darkest-teal)]/30 bg-white text-[var(--darkest-teal)]/90 hover:border-[var(--bright-pink)] hover:border-2 "
                      }`}
                    onClick={previousPage}>
                    <ChevronLeftIcon className="w-5 h-5"></ChevronLeftIcon>
                  </li>
                  {createArrayWithArrayFrom(numPages).map((pageNum) => (
                    <li hidden={(pageNum <= maxPageNumber && pageNum >= minPageNumber) || numPages <= 1 ? false : true}
                      className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid bg-white cursor-pointer ${pageNumber === (pageNum)
                          ? "border-[var(--bright-pink)] pointer-events-none"
                          : "border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)]"
                        }`}
                      onClick={() => setPage(pageNum)}
                      key={pageNum}>
                      {pageNum}
                    </li>
                  ))}
                  <li
                    className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid disabled] ${pageNumber == numPages
                        ? "border-[var(--darkest-teal)]/30 bg-white/50 text-[var(--darkest-teal)]/30 pointer-events-none"
                        : "cursor-pointer border-[var(--darkest-teal)]/30 bg-white text-[var(--darkest-teal)]/90 hover:border-[var(--bright-pink)] hover:border-2 "
                      }`}
                    onClick={nextPage}>
                    <ChevronRightIcon className="w-5 h-5"></ChevronRightIcon>
                  </li>
                </ul>
              </div>
    </div>
    </div>
    </>
    )}
    </>
  );
}