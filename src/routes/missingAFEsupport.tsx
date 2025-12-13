import { fetchNotifications, fetchSystemHistory } from "provider/fetch";
import { useEffect, useState } from "react"
import { formatDateShort } from "src/helpers/styleHelpers";
import { type Notifications, type SystemHistory } from "src/types/interfaces";
import { transformSystemHistory } from "src/types/transform";
import UniversalPagination from "./sharedComponents/pagnation";

export default function SystemHistories() {
const [systemHistory, setSystemHistory] = useState<SystemHistory[] | []>([]); 
// State for paginated data
    const [rowsToShow, setRowsToShow] = useState<SystemHistory[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const maxRowsToShow = (8);

useEffect(() => {
    let isMounted = true;
    async function getSystemHistory() {
        try {
            const result = await fetchSystemHistory();
        
            if(result.length > 0 ) {
                const transformedSystemHistory = transformSystemHistory(result);
                setSystemHistory(transformedSystemHistory);
                console.log(transformedSystemHistory);
            }
        } finally {
            if(isMounted) {
                return;
            }
        }
    }; getSystemHistory();
    return () => {
            isMounted = false;
        };
    
},[])

const handlePageChange = (paginatedData: SystemHistory[], page: number) => {
        setRowsToShow(paginatedData);
        setCurrentPage(page);
    };

  return (
    <>
    <div className="px-4 sm:px-16 sm:py-16">
      <h2 className="text-xl font-semibold custom-style">System Changes</h2>
       <p className="text-base/6 custom-style-long-text px-3">
                Who's doing what and when are they doing it.
              </p>
      <table className="mt-6 sm:w-full text-left whitespace-nowrap">
        <colgroup>
          <col className="w-full sm:w-3/12" />
          <col className="lg:w-4/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-1/12" />
        </colgroup>
        <thead className="border-b border-[var(--darkest-teal)]/30 text-xs/5 sm:text-base/6 text-[var(--darkest-teal)] custom-style">
          <tr>
            <th scope="col" className="py-2 pr-8 pl-4 font-semibold sm:pl-6 lg:pl-8">
              User
            </th>
            <th scope="col" className="hidden py-2 pr-8 pl-0 font-semibold sm:table-cell">
              Description
            </th>
            <th scope="col" className="py-2 pr-4 pl-0 text-left font-semibold sm:pr-8 sm:text-center lg:pr-20">
              Action
            </th>
            <th scope="col" className="hidden py-2 pr-8 pl-0 font-semibold md:table-cell sm:text-center lg:pr-20">
             Date
            </th>
            <th scope="col" className="hidden py-2 pr-4 pl-0 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8">
              <span className="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--darkest-teal)]/20">
          {rowsToShow.sort((a,b) => b.id - a.id).map((item) => (
            <tr key={item.id}>
              <td className="py-4 sm:pr-10 pl-4 sm:pl-6 lg:pl-8">
                <div className="flex items-center">
                  <img
                    alt=""
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${item.user_id}`}
                    className="size-8 sm:size-11 "
                  />
                  <div className="ml-2 sm:ml-6">
                  <div className="text-sm/5 sm:text-base/6 font-medium text-[var(--darkest-teal)] custom-style">
                    {item.created_by.name}
                  </div>
                  <div className="sm:pl-4 text-sm/6 text-[var(--darkest-teal)]/60 custom-style-long-text">
                    {item.created_by.email}
                  </div>
                  </div>
                </div>
              </td>
              <td className="hidden px-3 py-3.5 pl-0 sm:table-cell sm:pr-8">
                <div className="flex gap-x-3">
                  <div className="custom-style-long-text text-sm/6 text-[var(--darkest-teal)]">{item.description}</div>
                </div>
              </td>
              <td className="px-3 py-3.5 pl-0 text-xs/5 sm:text-sm/6 sm:pr-8 lg:pr-20">
                  <div className="block text-[var(--darkest-teal)] custom-style text-center sm:block">{item.action}</div>
              </td>
              <td className="hidden px-3 py-3.5 pl-0 text-center text-sm/6 text-[var(--darkest-teal)] custom-style md:table-cell lg:pr-20">
                {formatDateShort(item.created_at)}
              </td>
              <td className="hidden px-3 py-3.5 pl-0 text-right text-sm/6 text-[var(--darkest-teal)] sm:table-cell sm:pr-6 lg:pr-8">
                      
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full border-t border-[var(--darkest-teal)]">
                                  <UniversalPagination
                                      data={systemHistory}
                                      rowsPerPage={maxRowsToShow}
                                      listOfType="System Changes"
                                      onPageChange={handlePageChange}
                                  />
                                  </div>
    </div>
    </>
  )
}
