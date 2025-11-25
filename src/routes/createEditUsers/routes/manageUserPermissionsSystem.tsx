import { useEffect, useState } from "react";
import { fetchUserPermissions } from "provider/fetch";
import { useSupabaseData } from "src/types/SupabaseContext";
import type { RoleEntryRead } from "src/types/interfaces";
import PermissionDashboard from "src/routes/sharedComponents/userPermissionsSystem";
import { transformRoleEntrySupabase } from "src/types/transform";
import LoadingPage from "src/routes/loadingPage";

export default function UserPermissionDashboard() {
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
        console.log(loggedInUser.is_super_user)
        const userPermissionsRaw = await fetchUserPermissions(true, token);

        if(!userPermissionsRaw.ok) {
          throw new Error((userPermissionsRaw as any).message ?? 'Unable to get user permissions');
        }
        
        const userPermissionsTransformed = transformRoleEntrySupabase(userPermissionsRaw.data); 
        const opPermissions = userPermissionsTransformed.filter(permission => permission.is_op_permission);
        const partnerPermissions = userPermissionsTransformed.filter(permission => permission.is_partner_permission);

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
    
    <div className="px-4 sm:px-10 sm:py-16 divide-y divide-gray-900/20 ">
    {userPermissionListLoading ? (
      <LoadingPage></LoadingPage>
    ) : (
    <PermissionDashboard 
    readOnly={loggedInUser?.is_super_user}
    operatorRoles={opUserRoleList}
    partnerRoles={partnerUserRoleList}>
    </PermissionDashboard>
    )}
    </div>
      
    </>
  )
}
