'use client'

import { useEffect, useState } from 'react'
import { type RoleEntryRead } from "../../../types/interfaces";
import { useSupabaseData } from "../../../types/SupabaseContext";
import PermissionDashboard from "../../../routes/permissionGrid"


export default function Profile() {
    const { loggedInUser } = useSupabaseData();
    const [opUserRoleList, setOpUserRoleList] = useState<RoleEntryRead[] | []>([]);
    const [partnerUserRoleList, setPartnerUserRoleList] = useState<RoleEntryRead[] | []>([]);

    useEffect(() => {
        if (loggedInUser === null) return;
        async function getPermissionList() {
            if(loggedInUser!.operatorRoles.length>0){
                setOpUserRoleList(loggedInUser?.operatorRoles!)
            } 
            if (loggedInUser!.partnerRoles.length>0) {
                setPartnerUserRoleList(loggedInUser?.partnerRoles!)
            }
        } getPermissionList();
    }, [loggedInUser]);

    return (
    <>
    <div className="h-full  border-l">
                <div className="xl:pl-32">
                    <h1 className="sr-only">Account Settings</h1>
                    {/* Settings forms */}
                    <div className="divide-y divide-gray-900/20 ">
                        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-0 py-16 sm:px-8 md:grid-cols-3 lg:px-8 px-4">
                            <div className="divide-y divide-gray-900/20 ">
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
                                                className="rounded-md bg-[var(--darkest-teal)] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[var(--bright-pink)] custom-style">
                                                Change avatar
                                            </button>
                                            <p className="mt-2 text-xs/5 text-[var(--darkest-teal)] custom-style-long-text">JPG, GIF or PNG. 1MB max.</p>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text">
                                            First name
                                        </label>
                                        <div className="mt-1">
                                            <span id="first-name" className="block w-full rounded-md bg-white/5 px-3 py-1.75 custom-style-long-text text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] h-9.5 sm:text-sm/6">{loggedInUser?.firstName} </span>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text">
                                            Last name
                                        </label>
                                        <div className="mt-1">
                                            <span className="block w-full rounded-md bg-white/5 px-3 py-1.75 custom-style-long-text text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] h-9.5 sm:text-sm/6">{loggedInUser?.lastName}</span>
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text">
                                            Email address
                                        </label>
                                        <div className="mt-1">
                                            <span className="block w-full rounded-md bg-white/5 px-3 py-1.75 custom-style-long-text text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] h-9.5 sm:text-sm/6">{loggedInUser?.email} </span>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>

                        <div className="max-w-7xl py-4 pl-4 sm:pl-6 lg:pl-8 divide-y divide-gray-900/20 ">
                            <PermissionDashboard 
                            readOnly={true}
                            operatorRoles={opUserRoleList}
                            partnerRoles={partnerUserRoleList}>
                            </PermissionDashboard>
                        </div>
                    </div>
                </div>
    </div>
    </>
    )
}
