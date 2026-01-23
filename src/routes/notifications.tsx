import { fetchAFEHistoryCount, fetchAFENotificationCount, fetchNotifications } from "provider/fetch";
import { startTransition, useCallback, useEffect, useMemo, useState } from "react"
import { formatDateShort } from "src/helpers/styleHelpers";
import { type Notifications } from "src/types/interfaces";
import { transformNotifications } from "src/types/transform";
import UniversalPagination from "./sharedComponents/pagnation";
import { ChevronDownIcon } from '@heroicons/react/16/solid'

type FilterNotificationProp = {
  apc_afe_id: string;
}

export default function NotificationsGrid() {
  
const [notifications, setNotifications] = useState<Notifications[] | []>([]); 
// State for paginated data
    const [rowsToShow, setRowsToShow] = useState<Notifications[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const maxRowsToShow = (6);
//Paging for the call to Supabase    
    const minRange = (0);
    const [maxRange, setMaxRange] = useState(10);
    const [totalNotificationHistoryRowCount, setTotalNotificationHistoryRowCount] = useState(0);
//Filtering variables
    const [actionList, setActionList] = useState<string [] | []>([]);
    const [userList, setUserList] = useState<string [] | []>([]);
    const [selectedAction, setSelectedAction] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [afeSearch, setAFESearch] = useState('');
    const [verSearch, setVerSearch] = useState('');
    const [descriptionSearch, setDescriptionSearch] = useState('');

    useEffect(() => {
    let isMounted = true;
    async function getNotifications() {
        try {
            const result = await fetchNotifications(minRange, maxRange, false);
        
            if(result.length > 0 ) {
                const transformedNotifications = transformNotifications(result);
                setNotifications(transformedNotifications.sort((a,b) => b.id - a.id));
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
    
},[maxRange])

useMemo(() => {
  async function getNotificationHistoryRowCount() {
    const afeHistoryRowCountResult = await fetchAFENotificationCount();
    setTotalNotificationHistoryRowCount(afeHistoryRowCountResult);
  }; getNotificationHistoryRowCount();
  
},[])

useEffect(() => {
  let isMounted = true;
  async function getList() {
    const userArray = notifications.map(notification => notification.user.name);
    const actionArray = notifications.map(notification => notification.type);
        
    if(isMounted) {
        setUserList([...new Set(userArray)]);
        setActionList([...new Set(actionArray)]);
      }
  }; getList();
  
  return () => {
    isMounted = false;
  };
},[notifications])

const handleDesriptionSearchChange = useCallback((e: any) => {
    const value = e.target.value;
    startTransition(() => {
      setDescriptionSearch(value);
    });
  }, []);

const handleAFESearchChange = useCallback((e: any) => {
    const value = e.target.value;
    startTransition(() => {
      setAFESearch(value);
    });
  }, []);

const handleAFEVerSearchChange = useCallback((e: any) => {
    const value = e.target.value;
    startTransition(() => {
      setVerSearch(value);
    });
  }, []);

function handleUserListChange(e: React.ChangeEvent<HTMLSelectElement>) {
  setSelectedUser(e.target.value);
};

function handleAcionListChange(e: React.ChangeEvent<HTMLSelectElement>) {
  setSelectedAction(e.target.value);
};

const filterNotifications = (notificationsList: Notifications[]) => {
    return notificationsList.filter(notice => {
      const matchesUser = notice.user.name === selectedUser || selectedUser === '';
      const matchesAFENumber = notice.afe_number.toUpperCase().includes(afeSearch.toUpperCase()) || afeSearch === '';
      const matchesDescription = notice.description.toUpperCase().includes(descriptionSearch.toUpperCase()) || descriptionSearch === '';
      const matchesAction = notice.type === selectedAction || selectedAction === '';
      const matchesVersion = notice.afe_version !== null && notice.afe_version.toUpperCase().includes(verSearch.toUpperCase()) || verSearch === '';

      return matchesUser && matchesDescription && matchesAction && matchesAFENumber && matchesVersion
    })
  };

const filteredNotifiations = useMemo(() => {
  return filterNotifications(notifications);
},[notifications, selectedUser, selectedAction, afeSearch, descriptionSearch, verSearch]);

const handlePageChange = (paginatedData: Notifications[], page: number) => {
        setRowsToShow(paginatedData);
        setCurrentPage(page);
    };

  return (
    <>
    <div className="px-4 py-4 sm:px-6 sm:py-6">
      <h2 className="text-lg sm:text-xl font-semibold custom-style">AFE Histories</h2>
       <p className="text-xs/6 2xl:text-sm/6 custom-style-long-text px-3">
                Cumlative history of actions taken on all AFEs.
              </p>
      {/* Filter out System History */}
      <div className="ml-2 mr-2 sm:mt-4 p-3 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70">
        <h2 className="text-sm/6 2xl:text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Filter AFE Histories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6">
            {/* Filter on the User */}
            <div>
            <h2 className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style">Filter on User</h2>
             <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 ">
          <select
              id="userMapID"
              name="userMapID"
              autoComplete="off"
              value={selectedUser}
              onChange={handleUserListChange}
              className="cursor-pointer col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
              <option></option>
              {userList.map((option) => (
                  <option key={option} value={option}>
                      {option}
                  </option>
              ))}
          </select>
          <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
          </div>
            </div>
            {/* Filter on the AFE Number */}
            <div >
            <h2 className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style">Search on the AFE Number</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 ">
                <input
                  id="afeNumberSearch"
                  name="afeNumberSearch"
                  type="text"
                  placeholder="DC2026CA"
                  autoComplete="off"
                  value={afeSearch}
                  onChange={handleAFESearchChange}
                  autoFocus={false}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--dark-teal)] placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                />
          </div>
            </div>
            {/* Filter on the AFE Version */}
            <div >
            <h2 className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style">Search on the AFE Version</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 ">
                <input
                  id="afeVerSearch"
                  name="afeVerSearch"
                  type="text"
                  placeholder="S2"
                  autoComplete="off"
                  value={verSearch}
                  onChange={handleAFEVerSearchChange}
                  autoFocus={false}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--dark-teal)] placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                />
          </div>
            </div>
            {/* Filter on the Description */}
            <div >
            <h2 className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style">Search the Description</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 ">
                <input
                  id="descriptionSearch"
                  name="descriptionSearch"
                  type="text"
                  placeholder="as approved"
                  autoComplete="off"
                  value={descriptionSearch}
                  onChange={handleDesriptionSearchChange}
                  autoFocus={false}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--dark-teal)] placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                />
          </div>
            </div>
          </div>
      </div>
      <table className="mt-6 w-full text-left whitespace-normal">
        <colgroup>
          <col className="w-4/5 lg:w-3/12" />
          <col className="w-2/5 lg:w-5/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-1/12" />
        </colgroup>
        <thead className="border-b border-[var(--darkest-teal)]/30 text-sm/6 sm:text-base/6 text-[var(--darkest-teal)] custom-style">
          <tr>
            <th scope="col" className="py-2 pr-8 pl-4 font-semibold sm:pl-6 lg:pl-8">
              User
            </th>
            <th scope="col" className="hidden px-1 py-1 pl-0 font-semibold sm:table-cell">
              Description
            </th>
            <th scope="col" className="px-1 py-1 pl-0 text-left font-semibold sm:pr-8 text-right sm:text-center lg:pr-20">
              AFE#
            </th>
            <th scope="col" className="hidden px-1 py-1 pl-0 font-semibold md:table-cell sm:text-center lg:pr-20">
             Date
            </th>
            <th scope="col" className="hidden px-1 py-1 pl-0 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8">
              <span className="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--darkest-teal)]/20">
          {rowsToShow.sort((a,b) => b.id - a.id).map((item) => (
            <tr key={item.id}>
              <td className="py-4 px-4 sm:pr-10 pl-4 sm:pl-6 text-left">
                <div className="flex items-center">
                  <img
                    alt=""
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${item.user_id}`}
                    className="size-8 sm:size-11 "
                  />
                  <div className="ml-2 sm:ml-4">
                  <div className="text-xs/6 2xl:text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                    {item.user.name}
                  </div>
                  <div className="sm:pl-4 mr-4 text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)]/60 custom-style-long-text">
                    {item.user.email}
                  </div>
                  </div>
                </div>
                <div className="sm:hidden custom-style-long-text text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)]">{item.description}</div>
              </td>
              <td className="hidden px-1 py-1 pl-0 sm:table-cell sm:pr-8 text-left">
                  <div className="custom-style-long-text text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)]">{item.description}</div>
              </td>
              <td className="px-1 py-1 pl-3 sm:pl-0 text-xs/6 2xl:text-sm/6 sm:pr-8 lg:pr-20">
                  <div className="block text-[var(--darkest-teal)] custom-style text-center sm:block">{item.afe_number} {item.afe_version}</div>
              </td>
              <td className="hidden px-1 py-1 pl-0 text-center text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style md:table-cell lg:pr-20">
                {formatDateShort(item.created_at)}
              </td>
              <td className="hidden px-1 py-1 pl-0 text-right text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] sm:table-cell sm:pr-6 lg:pr-8 whitespace-nowrap">
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
      <div className="w-full border-t border-[var(--darkest-teal)] text-xs/6 2xl:text-sm/6">
          <UniversalPagination
            data={filteredNotifiations}
            rowsPerPage={maxRowsToShow}
            listOfType="Notifications"
            onPageChange={handlePageChange}
            totalUnfilteredRows={notifications.length}
          />
       </div>
        {/* Load More Button */}
      <div
          className="mt-4 -mb-8 hidden sm:flex items-center justify-end border-t border-[var(--darkest-teal)]/30 py-4">
          <button
          disabled={notifications.length >= totalNotificationHistoryRowCount ? true : false}
            onClick={async (e: any) => {
              e.preventDefault();
              setMaxRange(maxRange+15);
            }}
            className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
            Load More
          </button>
      </div>
    </div>
    </>
  )
}

export function NotificationsGridPreFiltered({apc_afe_id}: FilterNotificationProp) {
  
    const [notifications, setNotifications] = useState<Notifications[] | []>([]); 
// State for paginated data
    const [rowsToShow, setRowsToShow] = useState<Notifications[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [maxRowsToShow, setMaxRowsToShow] = useState(
  window.innerWidth >= 640 ? 5 : 3
);
    const minRange = (0);
    const [maxRange, setMaxRange] = useState(10);
    const [totalAFEHistoryRowCount, setTotalAFEHistoryRowCount] = useState(0);
    const [actionList, setActionList] = useState<string [] | []>([]);
    const [userList, setUserList] = useState<string [] | []>([]);
    const [selectedAction, setSelectedAction] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [descriptionSearch, setDescriptionSearch] = useState('');

  
    useEffect(() => {
    let isMounted = true;
    async function getNotifications() {
        try {
            const result = await fetchNotifications(minRange, maxRange, true, apc_afe_id);
        
            if(result.length > 0 ) {
                const transformedNotifications = transformNotifications(result);
                setNotifications(transformedNotifications.sort((a,b) => b.id - a.id));
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
    
},[maxRange])

useMemo(() => {
  async function getAFEHistoryRowCount() {
    const afeHistoryRowCountResult = await fetchAFEHistoryCount(apc_afe_id);
    setTotalAFEHistoryRowCount(afeHistoryRowCountResult);
  }; getAFEHistoryRowCount();
  
},[])

useEffect(() => {
  let isMounted = true;
  async function getList() {

    const userArray = notifications.map(notification => notification.user.name);
    const actionArray = notifications.map(notification => notification.type);
        
      if(isMounted) {
        setUserList([...new Set(userArray)]);
        setActionList([...new Set(actionArray)]);
      }
  }; getList();
  
  return () => {
    isMounted = false;
  };
},[notifications])

const handleDesriptionSearchChange = useCallback((e: any) => {
    const value = e.target.value;
    startTransition(() => {
      setDescriptionSearch(value);
    });
  }, []);

function handleActionListChange(e: React.ChangeEvent<HTMLSelectElement>) {
  setSelectedAction(e.target.value);
};

function handleUserListChange(e: React.ChangeEvent<HTMLSelectElement>) {
  setSelectedUser(e.target.value);
};

const filterNotifications = (notificationsList: Notifications[]) => {
    return notificationsList.filter(notice => {
      const matchesUser = notice.user.name === selectedUser || selectedUser === '';
      const matchesAction = notice.type === selectedAction || selectedAction === '';
      const matchesDescription = notice.description.toUpperCase().includes(descriptionSearch.toUpperCase()) || descriptionSearch === '';

      return matchesUser && matchesAction && matchesDescription
    })
  };

const filteredNotifiations = useMemo(() => {
  return filterNotifications(notifications);
},[notifications, selectedUser, selectedAction, descriptionSearch]);


const handlePageChange = (paginatedData: Notifications[], page: number) => {
        setRowsToShow(paginatedData);
        setCurrentPage(page);
    };

  return (
    <>
    <div className="px-4 py-4 sm:px-6 sm:py-4 bg-white rounded-lg">
      <h2 className="text-lg sm:text-xl font-semibold custom-style">AFE History</h2>
       <p className="text-xs/6 2xl:text-sm/6 custom-style-long-text px-3">
                Complete AFE History including comments, actions attachment views and downloads.
              </p>
      {/* Filter out System History */}
      <div className="ml-2 mr-2 sm:mt-4 p-3 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70">
            <h2 className="text-sm/6 2xl:text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Filter AFE History</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6">
            <div>
            <h2 className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style">Filter on User</h2>
             <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 ">
          <select
              id="userMapID"
              name="userMapID"
              autoComplete="off"
              value={selectedUser}
              onChange={handleUserListChange}
              className="cursor-pointer col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
              <option></option>
              {userList.map((option) => (
                  <option key={option} value={option}>
                      {option}
                  </option>
              ))}
          </select>
          <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
          </div>
            </div>
            
            <div >
            <h2 className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style">Filter on the AFE Action</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 ">
              <select
              id="actionMapID"
              name="actionMapID"
              autoComplete="off"
              value={selectedAction}
              onChange={handleActionListChange}
              className="cursor-pointer col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
              <option></option>
              {actionList.map((option) => (
                  <option key={option} value={option}>
                      {option}
                  </option>
              ))}
          </select>
          <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
          </div>
          </div>
          <div >
            <h2 className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style">Search the Description</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 ">
                <input
                  id="descriptionSearch"
                  name="descriptionSearch"
                  type="text"
                  placeholder="as approved"
                  autoComplete="off"
                  value={descriptionSearch}
                  onChange={handleDesriptionSearchChange}
                  autoFocus={false}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--dark-teal)] placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                />
          </div>
          </div>
            </div>
      </div>
      <div className="sm:h-93">
      <table className="mt-6 w-full text-left whitespace-normal">
        <colgroup>
          <col className="w-4/5 lg:w-3/12" />
          <col className="w-2/5 lg:w-5/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-1/12" />
        </colgroup>
        <thead className="border-b border-[var(--darkest-teal)]/30 text-sm/6 sm:text-base/6 text-[var(--darkest-teal)] custom-style">
          <tr className="">
            <th scope="col" className="py-2 pr-8 pl-4 font-semibold sm:pl-6 lg:pl-8">
              User
            </th>
            <th scope="col" className="hidden px-1 py-1 pl-0 font-semibold sm:table-cell">
              Description
            </th>
            <th scope="col" className="px-1 py-1 pl-0 text-left font-semibold sm:pr-8 text-right sm:text-center lg:pr-20">
              AFE#
            </th>
            <th scope="col" className="hidden px-1 py-1 pl-0 font-semibold md:table-cell sm:text-center lg:pr-20">
             Type
            </th>
            <th scope="col" className="hidden px-1 py-1 pl-0 font-semibold md:table-cell sm:text-center sm:pr-6 lg:pr-8">
             Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--darkest-teal)]/20 ">
          {rowsToShow.sort((a,b) => b.id - a.id).map((item) => (
            <tr key={item.id} className="h-15" >
              <td className="py-2 px-4 sm:pr-10 pl-4 sm:pl-6 text-left">
                <div className="flex items-center ">
                  <img
                    alt=""
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${item.user_id}`}
                    className="size-8 sm:size-11 "
                  />
                  <div className="ml-2 sm:ml-4">
                  <div className="text-xs/6 2xl:text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                    {item.user.name}
                  </div>
                  <div className="sm:pl-4 mr-4 text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)]/60 custom-style-long-text">
                    {item.user.email}
                  </div>
                  </div>
                </div>
                <div className="sm:hidden custom-style-long-text text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)]">{item.description}</div>
              </td>
              <td className="hidden px-1 py-1 pl-0 sm:table-cell sm:pr-8 text-left">
                  <div className="custom-style-long-text text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)]">{item.description}</div>
              </td>
              <td className="px-1 py-1 pl-3 sm:pl-0 text-xs/6 2xl:text-sm/6 sm:pr-8 lg:pr-20">
                  <div className="block text-[var(--darkest-teal)] custom-style text-center sm:block">{item.afe_number} {item.afe_version}</div>
              </td>
              <td className="hidden px-1 py-1 pl-0 text-center text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style md:table-cell lg:pr-20">
                {item.type}
              </td>
              <td className="hidden px-1 py-1 pl-0 text-right text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] sm:table-cell sm:pr-6 lg:pr-8 whitespace-nowrap">
                {formatDateShort(item.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="w-full border-t border-[var(--darkest-teal)] text-xs/6 2xl:text-sm/6">
          <UniversalPagination
            data={filteredNotifiations}
            rowsPerPage={maxRowsToShow}
            listOfType="Notifications"
            onPageChange={handlePageChange}
            totalUnfilteredRows={notifications.length}
          />
       </div>
        {/* Load More Button */}
      <div
          className="mt-2 -mb-6 hidden sm:flex items-center justify-end border-t border-[var(--darkest-teal)]/30 py-4">
          <button
          disabled={notifications.length >= totalAFEHistoryRowCount ? true : false}
            onClick={async (e: any) => {
              e.preventDefault();
              setMaxRange(maxRange+15);
            }}
            className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
            {notifications.length >= totalAFEHistoryRowCount ? "That's Everything!" : "Load More"}
          </button>
      </div>
    </div>
    </>
  )
}