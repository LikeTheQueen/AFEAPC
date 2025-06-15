'use client'

import { useEffect, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { type UserRolesSupabaseType, type UserProfileSupabaseType } from "../types/interfaces";
import { useLocation } from 'react-router'
import { fetchFromSupabaseMatchOnString, fetchFromSupabase } from '../../provider/fetch';
import { transformUserRolesSupabase } from "../types/transform";
import { useSupabaseData } from "../types/SupabaseContext";



export default function Profile() {
    const { loggedInUser } = useSupabaseData();
    const { session } = useSupabaseData();
    const [roles, setRoles] = useState<UserRolesSupabaseType[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            /*
            const rawRoles = await fetchFromSupabase("USER_ROLES", 'role_id(name, description, title)');
            const transformRoles = transformUserRolesSupabase(rawRoles);
            setRoles(transformRoles);
            
            console.log(rawRoles);
            */
        };
        fetchData();
    },[])
    console.log(loggedInUser);
    return (
        
        <>
        
            <div className="h-full  border-l">
                <div className="xl:pl-32">
                    <h1 className="sr-only">Account Settings</h1>
                    {/* Settings forms */}
                    <div className="divide-y divide-[var(--darkest-teal)]">
                        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-0 py-16 sm:px-8 md:grid-cols-3 lg:px-8 px-4">
                            <div>
                                <h2 className="font-semibold text-[var(--darkest-teal)] custom-style">Personal Information</h2>
                                <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">Contact Support to change your email or associated company.</p>
                            </div>
                            <form className="md:col-span-2">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                                    <div className="col-span-full flex items-center gap-x-8">
                                        <img
                                            alt=""
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            className="size-24 flex-none rounded-lg bg-gray-800 object-cover"
                                        />
                                        <div>
                                            <button
                                                type="button"
                                                className="rounded-md bg-[var(--darkest-teal)] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[var(--bright-pink)] custom-style"
                                            >
                                                Change avatar
                                            </button>
                                            <p className="mt-2 text-xs/5 text-[var(--darkest-teal)] custom-style-long-text">JPG, GIF or PNG. 1MB max.</p>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text">
                                            First name
                                        </label>
                                        <div className="mt-1">
                                            <span className="block w-full rounded-md bg-white/5 px-3 py-1.75 custom-style-long-text text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] h-9.5 sm:text-sm/6">{loggedInUser?.firstName} </span>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="last-name" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text">
                                            Last name
                                        </label>
                                        <div className="mt-1">
                                            <span className="block w-full rounded-md bg-white/5 px-3 py-1.75 custom-style-long-text text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] h-9.5 sm:text-sm/6">{loggedInUser?.lastName}</span>
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="email" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text">
                                            Email address
                                        </label>
                                        <div className="mt-1">
                                            <span className="block w-full rounded-md bg-white/5 px-3 py-1.75 custom-style-long-text text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] h-9.5 sm:text-sm/6">{loggedInUser?.email} </span>
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="opCompany" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text">
                                            Operating Company Name
                                        </label>
                                        <div className="mt-1">
                                            <span className="block w-full rounded-md bg-white/5 px-3 py-1.75 custom-style-long-text text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] h-9.5 sm:text-sm/6">{loggedInUser?.email} </span>
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="partCompany" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text">
                                            Partner Company Name
                                        </label>
                                        <div className="mt-1">
                                            <span className="block w-full rounded-md bg-white/5 px-3 py-1.75 custom-style-long-text text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] h-9.5 sm:text-sm/6">{loggedInUser?.email} </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex">
                                    <button
                                        type="submit"
                                        className="rounded-md bg-[var(--darkest-teal)] px-3 py-2 text-sm custom-style font-semibold text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-0 py-16 sm:px-6 md:grid-cols-3 lg:px-8 px-4">
                            <div>
                                <h2 className="custom-style font-semibold text-[var(--darkest-teal)]">Change password</h2>
                                <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">Update your password associated with your account.</p>
                            </div>

                            <form className="md:col-span-2">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                                    <div className="col-span-full">
                                        <label htmlFor="current-password" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text">
                                            Current password
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="current-password"
                                                name="current_password"
                                                type="password"
                                                autoComplete="current-password"
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 custom-style-long-text text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] placeholder:text-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="new-password" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text">
                                            New password
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="new-password"
                                                name="new_password"
                                                type="password"
                                                autoComplete="new-password"
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 custom-style-long-text text-[var(--dark-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] placeholder:text-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="confirm-password" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text">
                                            Confirm password
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="confirm-password"
                                                name="confirm_password"
                                                type="password"
                                                autoComplete="new-password"
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 custom-style-long-text text-[var(--dark-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] placeholder:text-[var(--dark-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex">
                                    <button
                                        type="submit"
                                        className="rounded-md bg-[var(--darkest-teal)] px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
