

import { useEffect, useState } from 'react'
import { type RoleEntryRead } from "../../../types/interfaces";
import { useSupabaseData } from "../../../types/SupabaseContext";
import PermissionDashboard from "../../sharedComponents/permissionGrid"
import { fetchUserPermissions } from 'provider/fetch';
import { transformRoleEntrySupabase } from 'src/types/transform';
import LoadingPage from 'src/routes/loadingPage';


export default function Profile() {
    const { loggedInUser, session } = useSupabaseData();
    const token = session?.access_token ?? "";
    const [opUserRoleList, setOpUserRoleList] = useState<RoleEntryRead[] | []>([]);
    const [partnerUserRoleList, setPartnerUserRoleList] = useState<RoleEntryRead[] | []>([]);
    const [userPermissionListLoading, setUserPermissionListLoading] = useState(true);

    useEffect(() => {
        if(!token || !loggedInUser) {
          setUserPermissionListLoading(false);
          return;
        }
    
        let isMounted = true;
    
        async function getUserPermissions() {
          if(!loggedInUser) return;
          setUserPermissionListLoading(true);
          
          try{
            const userPermissionsRaw = await fetchUserPermissions(loggedInUser.is_super_user, token);
    
            if(!userPermissionsRaw.ok) {
              throw new Error((userPermissionsRaw as any).message ?? 'Unable to get user permissions');
            }
            console.log('thee should be',userPermissionsRaw);
            const userPermissionsTransformed = transformRoleEntrySupabase(userPermissionsRaw.data); 
            const opPermissions = userPermissionsTransformed.filter(permission => (permission.is_op_permission && permission.user_id===loggedInUser.user_id));
            const partnerPermissions = userPermissionsTransformed.filter(permission => (permission.is_partner_permission && permission.user_id===loggedInUser.user_id));
    console.log(opPermissions)
            if(isMounted) {
              setOpUserRoleList(opPermissions);
              setPartnerUserRoleList(partnerPermissions);
              setUserPermissionListLoading(false);
            }
          }
          catch(e) {
            console.error('Not able to get user permissions ',e);
          }
          finally{
            return;
          }
        }
        getUserPermissions();
        return () => {
          isMounted = false;
        }
      }, [token, loggedInUser])

    return (
    <>
    <div className="px-4 sm:px-10 sm:py-16">
                <div className="py-4 sm:py-0">
                    <h1 className="sr-only">Account Settings</h1>
                    {/* Settings forms */}
                    <div className="border-b border-b-[var(--darkest-teal)]/40">
                        <div className="pb-6 grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 md:px-6 lg:px-8">
                            <div className="divide-y divide-[var(--darkest-teal)]/40 ">
                                <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Personal Information</h2>
                                <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">Contact Support your company admin to change your email or permissions.</p>
                            </div>
                            <div className="md:col-span-2">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                                    <div className="sm:col-span-6">
                                        <img
                                            alt=""
                                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${loggedInUser?.user_id}`}
                                            className="size-24 flex-none rounded-lg bg-[var(--darkest-teal)] object-cover"
                                        />
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

                            </div>
                        </div>
                    </div>
                    {userPermissionListLoading ? (
                        <LoadingPage></LoadingPage>
                    ) : (
                        <div className="max-w-8xl px-4 py-6 pr-4">
                            <PermissionDashboard 
                            readOnly={true}
                            operatorRoles={opUserRoleList}
                            partnerRoles={partnerUserRoleList}>
                            </PermissionDashboard>
                        </div>
                        )}
                </div>
    </div>
    </>
    )
}
