import { useEffect, useMemo, useState } from "react";
import { updateUserActiveStatusToInactive, updateUserActiveStatusToActive } from 'provider/write';
import { type UserFullNameAndEmail } from "src/types/interfaces";
import { useSupabaseData } from "src/types/SupabaseContext";


export default function UserDashboard({ userList =[], isError=false }: {  userList: UserFullNameAndEmail[]; isError:boolean;}) {
    
    const { loggedInUser, session } = useSupabaseData();
    const token = session?.access_token ?? "";
    const [users, setUsers] = useState(userList);

    useEffect(() => {
        setUsers(userList);
    }, [userList]);

    function handleReactivate(userID: string) {
        if(!token) return;

        setUsers(prevUsers => 
            prevUsers.map(user => 
                user.id === userID ? { ...user, active: true } : user
            )
        );

        try {
            updateUserActiveStatusToActive(userID, token);
        } catch(error) {

            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userID ? { ...user, active: false } : user
                )
            );

            console.error('Failed to reactivate user:', error);
        }
    };
    
    function handleDeactivate(userID: string) {
        if(!token) return;
        setUsers(prevUsers => 
            prevUsers.map(user => 
                user.id === userID ? { ...user, active: false } : user
            )
        );

        try {
            updateUserActiveStatusToInactive(userID, token);
        } catch(error) {

            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userID ? { ...user, active: true } : user
                )
            );

            console.error('Failed to deactivate user:', error);
        }
    };
   
    return (
        <>
        <div className="py-4 sm:py-0">
            <div className="grid max-w-full grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-7 ">
                <div className="md:col-span-2">
                    <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">User Profiles</h2>
                    <p className="mt-1 text-md/6 text-[var(--darkest-teal)] custom-style-long-text">Self-deactivation? Nice try, 007. You'll need outside authorization for that stunt</p>
                    <p className="mt-1 text-md/6 text-[var(--darkest-teal)] custom-style-long-text">Another admin for your organization will need to deactivate your profile or contact AFE Partner Connections directly.</p>
                </div>
                <div className="md:col-span-5 ">

                <table className="min-w-full divide-y divide-[var(--darkest-teal)]/30 mb-4 shadow-2xl">
                <thead>
                    <tr className="bg-white text-white ">
                        <th scope="col" 
                            className="hidden rounded-tl-xl w-1/5 px-2 py-3.5 text-center text-pretty text-base/7 font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                            Name
                        </th>
                        <th
                            scope="col"
                            className="hidden w-2/5 px-2 py-3.5 text-center text-pretty text-base/7 font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                            Email
                        </th>
                        <th scope="col" 
                            className="hidden w-1/5 px-2 py-3.5 text-center text-pretty text-base/7 font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                            Status
                        </th>
                        <th scope="col" className="hidden rounded-tr-lg w-1/5 px-2 py-3.5 text-center text-pretty text-base/7 font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--darkest-teal)]/20 bg-white">

                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="text-start align-middle max-w-0 py-4 pr-1 pl-2 font-semibold text-[var(--darkest-teal)] custom-style sm:w-auto sm:max-w-none ">
                                {user.firstname} {user.lastName}
                                <dl className="font-normal lg:hidden">
                                <dt className="sr-only">Email</dt>
                                <dd className="mt-1 truncate text-gray-700">{user.email}</dd>
                                <dt className="sr-only sm:hidden">Status</dt>
                                <dd className="mt-1 truncate text-gray-500 flex justify-between sm:hidden">
                                    <span
                                    hidden={!user.active}
                                    className="inline-flex items-center rounded-md bg-[var(--bright-pink)] px-3 py-2 text-sm font-medium text-white custom-style ring-1 ring-[var(--bright-pink)] ring-inset">
                                    Active
                                </span>
                                <span
                                    hidden={user.active}
                                    className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-[var(--dark-teal)] custom-style ring-1 ring-gray-900/20 ring-inset">
                                    Inactive
                                </span>
                                <button
                                    type="button"
                                    hidden={user.active}
                                    disabled={loggedInUser?.user_id === user.id ? true : false}
                                    onClick={(e: any) => handleReactivate(user.id)}
                                    className="rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[var(--bright-pink)] custom-style disabled:bg-gray-300 disabled:text-gray-500">
                                    Activate User
                                </button>
                                <button
                                    type="button"
                                    hidden={!user.active}
                                    disabled={loggedInUser?.user_id === user.id ? true : false}
                                    onClick={(e: any) => handleDeactivate(user.id)}
                                    className="rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[var(--bright-pink)] custom-style disabled:bg-gray-300 disabled:text-gray-500">
                                    Deactivate User
                                </button>
                                </dd>
                            </dl>
                            </td>
                            <td className="hidden text-center px-3 py-4 text-[var(--darkest-teal)] custom-style-long-text lg:whitespace-nowrap lg:table-cell">
                                {user.email}
                            </td>

                            <td className="hidden align-middle px-3 py-4 text-sm lg:whitespace-nowrap text-center sm:table-cell">
                                <span
                                    hidden={!user.active}
                                    className="inline-flex items-center rounded-md bg-[var(--bright-pink)] px-2 py-1 text-sm font-medium text-white custom-style ring-1 ring-[var(--bright-pink)] ring-inset">
                                    Active
                                </span>
                                <span
                                    hidden={user.active}
                                    className="inline-flex items-center rounded-md bg-gray-200 px-2 py-1 text-sm font-medium text-[var(--dark-teal)] custom-style ring-1 ring-gray-900/20 ring-inset">
                                    Inactive
                                </span>
                            </td>
                            <td className="hidden align-middle px-3 py-4 text-sm lg:whitespace-nowrap text-center sm:table-cell">
                                <button
                                    type="button"
                                    hidden={user.active}
                                    disabled={loggedInUser?.user_id === user.id ? true : false}
                                    onClick={(e: any) => handleReactivate(user.id)}
                                    className="rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[var(--bright-pink)] custom-style disabled:bg-gray-300 disabled:text-gray-500">
                                    Activate User
                                </button>
                                <button
                                    type="button"
                                    hidden={!user.active}
                                    disabled={loggedInUser?.user_id === user.id ? true : false}
                                    onClick={(e: any) => handleDeactivate(user.id)}
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
        </div>
        </>
    )
}
