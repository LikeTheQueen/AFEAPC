import { useEffect, useMemo, useState } from "react";
import { fetchUserPermissions } from "provider/fetch";
import { useSupabaseData } from "src/types/SupabaseContext";
import type { GroupedUser, UserPermissionFlatRow } from "src/types/interfaces";
import LoadingPage from "src/routes/sharedComponents/loadingPage";
import { buildGroupedUsers } from "./helpers/helpers";
import  PermissionDashboards  from "src/routes/sharedComponents/permissionGrid";
import { ToastContainer } from "react-toastify";

export default function UserPermissionDashboard() {
  const { loggedInUser, session } = useSupabaseData();
  const token = session?.access_token ?? "";
  const [permissionData, setPermissionData] = useState<UserPermissionFlatRow[] | []>([]);
  const [nonOpUserRoleList, setNonOpUserRoleList] = useState<GroupedUser[] | []>([]);
  const [operatorUserRoleList, setOperatorUserRoleList] = useState<GroupedUser[] | []>([]);
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
          if(isMounted) {
            console.log(userPermissionsRaw.data)
            setPermissionData(userPermissionsRaw.data);
            setUserPermissionListLoading(false);
          }
        }
        catch(e) {
          console.error('Not able to get user permissions ',e);
        }
        finally{
          setUserPermissionListLoading(false);
          return;
        }
      }
      getUserPermissions();
      return () => {
        isMounted = false;
      }
    }, [token, loggedInUser]);
  
    const { grouped: opRoles, editableApcAddressIds: opEditableIds } = useMemo(() => {
    if (!permissionData.length || !loggedInUser) return { grouped: [], editableApcAddressIds: new Set<number>() };
    return buildGroupedUsers(permissionData, loggedInUser, 'operator');
  }, [permissionData, loggedInUser]);
  
  const { grouped: nonOpRoles, editableApcAddressIds: nonOpEditableIds } = useMemo(() => {
    if (!permissionData.length || !loggedInUser) return { grouped: [], editableApcAddressIds: new Set<number>() };
    return buildGroupedUsers(permissionData, loggedInUser, 'partner');
  }, [permissionData, loggedInUser]);
  
  useEffect(() => {
    setNonOpUserRoleList(nonOpRoles);
  },[nonOpRoles]);
  
  useEffect(() => {
    setOperatorUserRoleList(opRoles);
  },[opRoles]);


  return (
    <>
    <div className="px-4 sm:px-10 sm:py-16 divide-y divide-gray-900/20 ">
    {userPermissionListLoading ? (
      <LoadingPage></LoadingPage>
    ) : (
      <>
    <div className="divide-y divide-[var(--darkest-teal)]/40">
    <PermissionDashboards 
    profileView={false}
    allUserRoles={operatorUserRoleList}
    apcIDEditPriv={opEditableIds}
    mode="Operated">
    </PermissionDashboards>
    <PermissionDashboards
      profileView={false}
      allUserRoles={nonOpUserRoleList}
      apcIDEditPriv={nonOpEditableIds}
      mode="Non-Operated">
    </PermissionDashboards>
    </div>
    <ToastContainer icon={false}></ToastContainer>
    </>
    )}
    </div>
    </>
  )
}
