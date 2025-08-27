import { useEffect, useMemo, useState } from "react";
import { deactivateUser, reactivateUser } from 'provider/write';
import { type RoleEntryWrite, type RoleEntryRead } from "src/types/interfaces";
import { useSupabaseData } from "src/types/SupabaseContext";


type GroupedData = {
    user_id: string;
    user_firstname: string;
    user_lastName: string;
    user_email: string;
    user_active: boolean;
};

export default function UserDashboard({ readOnly = false, operatorRoles = [], partnerRoles = [] }: { readOnly?: boolean; operatorRoles: RoleEntryRead[]; partnerRoles: RoleEntryRead[]; }) {
    const [opRoles, setOpRoles] = useState(operatorRoles);
    const [partRoles, setPartnerRoles] = useState(partnerRoles);
    const { loggedInUser } = useSupabaseData();

    useEffect(() => {
        setOpRoles(operatorRoles);
    }, [operatorRoles]);

    useEffect(() => {
        setPartnerRoles(partnerRoles);
    }, [partnerRoles]);

    function handleReactivate(userID: string) {
        reactivateUser(userID);
};
function handleDeactivate(userID: string) {
  deactivateUser(userID);
};
    const groupByUserThenOperatorRole = useMemo(() => {
        const grouped = new Map<string, GroupedData>();
        const mergedArrays = opRoles.concat(partRoles);
        mergedArrays.forEach(record => {
            const userID = record.user_id;

            if (!userID) return;

            if (!grouped.has(userID)) {
                grouped.set(record.user_id, {
                    user_id: record.user_id,
                    user_firstname: record.user_firstname,
                    user_lastName: record.user_lastName,
                    user_email: record.user_email,
                    user_active: record.user_active
                });
            }
        });
        return [...grouped.values()];
    }, [opRoles])

    
    return (
        <>
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                <div>
                    <h2 className="custom-style font-semibold text-[var(--darkest-teal)]">User Profiles</h2>
                    <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">Self-deactivation? Nice try, 007. You'll need outside authorization for that stunt</p>
                    <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">Another admin for your organization will need to deactivate your profile or contact AFE Partner Connections directly.</p>
                </div>
                <div className="-mx-4 mt-8 sm:-mx-0 md:col-span-2 ">

                    <table className="min-w-full divide-y divide-gray-400">
                <thead>
                    <tr>
                        <th scope="col" 
                            className="hidden py-3.5 pr-3 pl-4 text-left font-semibold text-[var(--darkest-teal)] custom-style sm:pl-0 sm:table-cell">
                            Name
                        </th>
                        <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-center custom-style font-semibold text-[var(--darkest-teal)] sm:table-cell">
                            Email
                        </th>
                        <th scope="col" 
                            className="hidden px-3 py-3.5 text-center custom-style font-semibold text-[var(--darkest-teal)] sm:table-cell">
                            Status
                        </th>
                        <th scope="col" className="hidden py-3.5 pr-4 pl-3 sm:pr-0">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 bg-white">

                    {groupByUserThenOperatorRole.map(user => (
                        <tr key={user.user_id}>
                            <td className="text-start align-middle max-w-0 py-4 pr-3 pl-4 font-semibold text-[var(--darkest-teal)] custom-style sm:w-auto sm:max-w-none sm:pl-0 ">
                                {user.user_firstname} {user.user_lastName}
                                <dl className="font-normal lg:hidden">
                                <dt className="sr-only">Email</dt>
                                <dd className="mt-1 truncate text-gray-700">{user.user_email}</dd>
                                <dt className="sr-only sm:hidden">Status</dt>
                                <dd className="mt-1 truncate text-gray-500 flex justify-between sm:hidden">
                                    <span
                                    hidden={!user.user_active}
                                    className="inline-flex items-center rounded-md bg-[var(--bright-pink)] px-3 py-2 text-sm font-medium text-white custom-style ring-1 ring-[var(--bright-pink)] ring-inset">
                                    Active
                                </span>
                                <span
                                    hidden={user.user_active}
                                    className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-[var(--dark-teal)] custom-style ring-1 ring-gray-900/20 ring-inset">
                                    Inactive
                                </span>
                                <button
                                    type="button"
                                    hidden={user.user_active}
                                    disabled={loggedInUser?.user_id === user.user_id ? true : false}
                                    onClick={(e: any) => handleReactivate(user.user_id)}
                                    className="rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[var(--bright-pink)] custom-style disabled:bg-gray-300 disabled:text-gray-500">
                                    Activate User
                                </button>
                                <button
                                    type="button"
                                    hidden={!user.user_active}
                                    disabled={loggedInUser?.user_id === user.user_id ? true : false}
                                    onClick={(e: any) => handleDeactivate(user.user_id)}
                                    className="rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[var(--bright-pink)] custom-style disabled:bg-gray-300 disabled:text-gray-500">
                                    Deactivate User
                                </button>
                                </dd>
                            </dl>
                            </td>
                            <td className="hidden flex justify-center items-center px-3 py-4 text-[var(--darkest-teal)] custom-style lg:whitespace-nowrap lg:table-cell">
                                <input
                                    className="w-full rounded-md bg-white px-3 py-1.5 custom-style text-[var(--dark-teal)] outline outline-1 -outline-offset-1 outline-[var(--darkest-teal)] h-9 sm:text-sm"
                                    type="text"
                                    defaultValue={user.user_email}
                                    id={user.user_email}
                                />
                            </td>

                            <td className="hidden align-middle px-3 py-4 text-sm lg:whitespace-nowrap text-center sm:table-cell">
                                <span
                                    hidden={!user.user_active}
                                    className="inline-flex items-center rounded-md bg-[var(--bright-pink)] px-2 py-1 text-sm font-medium text-white custom-style ring-1 ring-[var(--bright-pink)] ring-inset">
                                    Active
                                </span>
                                <span
                                    hidden={user.user_active}
                                    className="inline-flex items-center rounded-md bg-gray-200 px-2 py-1 text-sm font-medium text-[var(--dark-teal)] custom-style ring-1 ring-gray-900/20 ring-inset">
                                    Inactive
                                </span>
                            </td>
                            <td className="hidden align-middle px-3 py-4 text-sm lg:whitespace-nowrap text-center sm:table-cell">
                                <button
                                    type="button"
                                    hidden={user.user_active}
                                    disabled={loggedInUser?.user_id === user.user_id ? true : false}
                                    onClick={(e: any) => handleReactivate(user.user_id)}
                                    className="rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[var(--bright-pink)] custom-style disabled:bg-gray-300 disabled:text-gray-500">
                                    Activate User
                                </button>
                                <button
                                    type="button"
                                    hidden={!user.user_active}
                                    disabled={loggedInUser?.user_id === user.user_id ? true : false}
                                    onClick={(e: any) => handleDeactivate(user.user_id)}
                                    className="rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[var(--bright-pink)] custom-style disabled:bg-gray-300 disabled:text-gray-500">
                                    Deactivate User
                                </button>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
                    </table>

                </div>

            </div>
            
        </>
    )
}
