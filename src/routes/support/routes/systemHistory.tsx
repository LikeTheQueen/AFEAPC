import { fetchNotifications } from "provider/fetch";
import { useEffect, useState } from "react"
import { formatDateShort } from "src/helpers/styleHelpers";
import { type Notifications } from "src/types/interfaces";
import { transformNotifications } from "src/types/transform";
import UniversalPagination from "../../sharedComponents/pagnation";

export default function SystemHistory() {
const [notifications, setNotifications] = useState<Notifications[] | []>([]); 
// State for paginated data
    const [rowsToShow, setRowsToShow] = useState<Notifications[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const maxRowsToShow = (6);

useEffect(() => {
    let isMounted = true;
    async function getNotifications() {
        try {
            const result = await fetchNotifications();
        
            if(result.length > 0 ) {
                const transformedNotifications = transformNotifications(result);
                setNotifications(transformedNotifications);
                console.log(transformedNotifications);
            }
        } finally {
            if(isMounted) {
                return;
            }
        }
    }; getNotifications();
    return () => {
            isMounted = false;
        };
    
},[])

const handlePageChange = (paginatedData: Notifications[], page: number) => {
        setRowsToShow(paginatedData);
        setCurrentPage(page);
    };

  return (
    <>
    <div className="px-4 sm:px-16 sm:py-16">
      <h2 className="text-xl font-semibold custom-style">Notifications</h2>
       <p className="text-base/6 custom-style-long-text px-3">
                Cumlative history of actions taken on AFEs.
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
              AFE#
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
                    {item.user.name}
                  </div>
                  <div className="sm:pl-4 text-sm/6 text-[var(--darkest-teal)]/60 custom-style-long-text">
                    {item.user.email}
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
                  <div className="block text-[var(--darkest-teal)] custom-style text-center sm:block">{item.afe_number} {item.afe_version}</div>
              </td>
              <td className="hidden px-3 py-3.5 pl-0 text-center text-sm/6 text-[var(--darkest-teal)] custom-style md:table-cell lg:pr-20">
                {formatDateShort(item.created_at)}
              </td>
              <td className="hidden px-3 py-3.5 pl-0 text-right text-sm/6 text-[var(--darkest-teal)] sm:table-cell sm:pr-6 lg:pr-8">
                      <a
                          href={`/mainscreen/afeDetail/${item.afe_id}`}
                          className="cursor-pointer rounded-md bg-[var(--dark-teal)] px-4 py-2 text-sm leading-6 font-semibold text-white shadow-lg hover:bg-[var(--bright-pink)] custom-style transition-colors w-full max-w-28">
                          View<span className="sr-only">, {item.afe_number}</span>
                      </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full border-t border-[var(--darkest-teal)]">
                                  <UniversalPagination
                                      data={notifications}
                                      rowsPerPage={maxRowsToShow}
                                      listOfType="Notifications"
                                      onPageChange={handlePageChange}
                                  />
                                  </div>
    </div>
    </>
  )
}
