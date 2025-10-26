// DocumentBrowser.tsx
import { useMemo, useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import LoadingPage from "./loadingPage";

//import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?worker&url';
//THIS IS A HACK AND YOU NEED TO UPDATE THE NPM PACKAGE
import workerSrc from "react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs?worker&url";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;


export default function DocumentBrowser( {file}:{file:string}) {
 
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
 
  const docToView = useMemo(() => ({ url: file }), [file]);

  function createArrayWithArrayFrom(length: number): number[] {
  return Array.from({ length: length }, (_, index) => index + 1);
}
  
  function onDocumentLoadSuccess({ numPages } : {numPages: number}) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return (
    <>
    {docToView.url==='' ? (
      <LoadingPage></LoadingPage>
    ) : (
      <>
      <Document file={docToView}
      
      onLoadSuccess={onDocumentLoadSuccess}>
        
      <Page pageNumber={pageNumber} />
    </Document>
    
    <div className="w-full flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-2 px-1 items-center">
    <div className="text-sm/6 text-white custom-style font-medium">
            Showing page {pageNumber} {" "}of {numPages} Pages
          </div>
          <div className="flex">
                      <ul
                        className="flex justify-center items-center align-center gap-x-[10px] z-30"
                        role="navigation"
                        aria-label="Pagination">
                        <li
                          className={`flex items-center justify-center w-[22px] rounded-[6px] h-[22px] border-[1px] border-solid disabled] ${
                            pageNumber === 1
                              ? "border-[var(--darkest-teal)]/30 bg-white/50 text-gray-900/30 pointer-events-none"
                              : "cursor-pointer border-[var(--darkest-teal)]/30 bg-white text-gray-900/90 hover:border-[var(--bright-pink)] hover:border-[2px] "
                          }`}
                          onClick={previousPage}>
                          <ChevronLeftIcon></ChevronLeftIcon>
                        </li> 
                        {createArrayWithArrayFrom(numPages).map((pageNum) => (
                          <li
                            className={`flex items-center justify-center w-[22px] rounded-[6px] h-[22px] border-[2px] border-solid bg-white cursor-pointer ${
                              pageNumber === (pageNum)
                                ? "border-[var(--bright-pink)] pointer-events-none"
                                : "border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)]"
                            }`}
                            onClick={() => setPageNumber(pageNum)}
                            key={pageNum}>
                            {pageNum}
                          </li>
                        ))}
                        <li
                          className={`flex items-center justify-center w-[22px] rounded-[6px] h-[22px] border-[1px] border-solid disabled] ${
                            pageNumber == numPages
                              ? "border-[var(--darkest-teal)]/30 bg-white/50 text-gray-900/30 pointer-events-none"
                              : "cursor-pointer border-[var(--darkest-teal)]/30 bg-white text-gray-900/90 hover:border-[var(--bright-pink)] hover:border-[2px] "
                          }`}
                          onClick={nextPage}>
                          <ChevronRightIcon></ChevronRightIcon>
                        </li>
                      </ul>
                    </div>
                    </div>
    
    </>
    )}
    </>
  );
}