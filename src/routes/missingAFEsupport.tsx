import { fetchNotifications, fetchSystemHistory, fetchSystemHistoryCount } from "provider/fetch";
import { startTransition, useCallback, useEffect, useMemo, useState } from "react"
import { formatDateShort } from "src/helpers/styleHelpers";
import { type Notifications, type SystemHistory } from "src/types/interfaces";
import { transformSystemHistory } from "src/types/transform";
import UniversalPagination from "./sharedComponents/pagnation";
import { OperatorDropdown } from 'src/routes/sharedComponents/operatorDropdown';
import { ChevronDownIcon } from '@heroicons/react/16/solid'

export default function SystemHistories() {
const [systemHistory, setSystemHistory] = useState<SystemHistory[] | []>([]); 
// State for paginated data
    const [rowsToShow, setRowsToShow] = useState<SystemHistory[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const maxRowsToShow = (8);
    const minRange = (0);
    const [maxRange, setMaxRange] = useState(23);
    const [totalSystemHistoryRowCount, setTotalSystemHistoryRowCount] = useState(0);
    const [selectedOperator, setSelectedOperator] = useState('');
    const [actionList, setActionList] = useState<string [] | []>([]);
    const [userList, setUserList] = useState<string [] | []>([]);
    const [selectedAction, setSelectedAction] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [descriptionSearch, setDescriptionSearch] = useState('');

useEffect(() => {
    let isMounted = true;
    async function getSystemHistory() {
        try {
            const result = await fetchSystemHistory(minRange,maxRange);
        
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
},[maxRange])

useEffect(() => {
  let isMounted = true;
  async function getList() {
    const actionArray = systemHistory.map(history => history.action);
        setActionList([...new Set(actionArray)]);
    const userArray = systemHistory.map(users => users.created_by.name);
        setUserList([...new Set(userArray)]);
  }; getList();
  
  return () => {
    isMounted = false;
  };
},[systemHistory])

useMemo(() => {
  async function getSystemHistoryRowCount() {
    const systemHistoryRowCountResult = await fetchSystemHistoryCount();
    setTotalSystemHistoryRowCount(systemHistoryRowCountResult);
  }; getSystemHistoryRowCount();
  
},[])

function handleActionListChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedAction(e.target.value);
};

function handleUserListChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedUser(e.target.value);
};

const handleDesriptionSearchChange = useCallback((e: any) => {
    const value = e.target.value;
    startTransition(() => {
      setDescriptionSearch(value);
    });
  }, []);

const filterSystemHistory = (systemHistories: SystemHistory[]) => {
  return systemHistories.filter(sysHistory => {
    const matchesOperator = sysHistory.apc_op_id === selectedOperator || selectedOperator === '';
    const matchesActionItem = sysHistory.action === selectedAction || selectedAction === '';
    const matchesUser = sysHistory.created_by.name === selectedUser || selectedUser === '';
    const matchesDescription = sysHistory.description.toUpperCase().includes(descriptionSearch.toUpperCase()) || descriptionSearch === '';

    return matchesOperator && matchesActionItem && matchesUser && matchesDescription;
  });
};

const filteredSystemHistory = useMemo(() => {
  return filterSystemHistory(systemHistory);
}, [systemHistory, selectedOperator, selectedAction, selectedUser, descriptionSearch]);

const handlePageChange = (paginatedData: SystemHistory[], page: number) => {
        setRowsToShow(paginatedData);
        setCurrentPage(page);
    };

  return (
    <>
    <div className="px-4 sm:px-16 sm:py-16">
      <h2 className="text-xl font-semibold custom-style">System Changes</h2>
       <p className="text-base/6 custom-style-long-text px-3">
                Who's doing what and when are they're doing it.
              </p>
      <div className="mt-4 p-3 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70">
            <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Filter System History</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6">
            <div>
            <h2 className="text-sm/6 sm:text-base/7 text-[var(--darkest-teal)] custom-style">Filter on User</h2>
             <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 ">
          <select
              id="userMapID"
              name="userMapID"
              autoComplete="off"
              value={selectedUser}
              onChange={handleUserListChange}
              className="cursor-pointer col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
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
            <div>
            <h2 className="text-sm/6 sm:text-base/7 text-[var(--darkest-teal)] custom-style">Filter on Action Type</h2>
             <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 ">
          <select
              id="actionMapID"
              name="actionMapID"
              autoComplete="off"
              value={selectedAction}
              onChange={handleActionListChange}
              className="cursor-pointer col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-[var(--darkest-teal)] custom-style outline-1 -outline-offset-1 outline-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6">
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
            <div>
            <h2 className="text-sm/6 sm:text-base/7 text-[var(--darkest-teal)] custom-style">Filter on Operator Name</h2>
              <OperatorDropdown
                value={selectedOperator}
                onChange={setSelectedOperator}
                limitedList={true} />
          </div>
          <div >
            <h2 className="text-sm/6 sm:text-base/7 text-[var(--darkest-teal)] custom-style">Search the Description</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-0 py-0 ">
                <input
                  id="descriptionSearch"
                  name="descriptionSearch"
                  type="text"
                  placeholder="GL Number 9230.001"
                  autoComplete="off"
                  value={descriptionSearch}
                  onChange={handleDesriptionSearchChange}
                  autoFocus={true}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--dark-teal)] placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                />
          </div>
          </div>
            </div>
            </div>

      <table className="mt-6 sm:w-full text-left">
        <colgroup>
          <col className="w-full sm:w-4/12" />
          <col className="lg:w-5/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-2/12" />
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
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full border-t border-[var(--darkest-teal)]">
          <UniversalPagination
            data={filteredSystemHistory}
            rowsPerPage={maxRowsToShow}
            listOfType="System Changes"
            onPageChange={handlePageChange}
            totalUnfilteredRows={systemHistory.length}
          />
    </div>
        <div
          className="mt-4 -mb-8 hidden sm:flex items-center justify-end border-t border-[var(--darkest-teal)]/30 py-4">
          <button
          disabled={systemHistory.length >= totalSystemHistoryRowCount ? true : false}
            onClick={async (e: any) => {
              e.preventDefault();
              setMaxRange(maxRange+24);
            }}
            className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
            Load More
          </button>
        </div>
    </div>
    </>
  )
}
