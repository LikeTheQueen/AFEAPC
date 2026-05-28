import { useEffect, useMemo, useState } from "react";
import { fetchUserPermissions } from "provider/fetch";
import { useSupabaseData } from "src/types/SupabaseContext";
import type { GroupedUser, UserPermissionFlatRow } from "src/types/interfaces";
import  PermissionDashboards  from "../../sharedComponents/permissionGrid";
import LoadingPage from "src/routes/sharedComponents/loadingPage";
import { buildGroupedUsers } from "./helpers/helpers";
import { doesUserHaveRole } from "src/helpers/helpers";
import { operatorEditUsers, nonOperatorEditUsers } from "src/constants/variables";
import NoSelectionOrEmptyArrayMessage from "src/routes/sharedComponents/noSelectionOrEmptyArrayMessage";

export default function UserPermissionDashboard() {
  const { loggedInUser, session } = useSupabaseData();
  const token = session?.access_token ?? "";
  const [permissionData, setPermissionData] = useState<UserPermissionFlatRow[] | []>([]);
  const [nonOpUserRoleList, setNonOpUserRoleList] = useState<GroupedUser[] | []>([]);
  const [operatorUserRoleList, setOperatorUserRoleList] = useState<GroupedUser[] | []>([]);
  const [userPermissionListLoading, setUserPermissionListLoading] = useState(true);
  const [doesUserHaveEditOpUserRole, setDoesUserHaveOpEditUserRole] = useState(false);
  const [doesUserHaveEditNonOpUserRole, setDoesUserHaveNonOpEditUserRole] = useState(false);

  useEffect(() => {
    if(!token || !loggedInUser) {
      setUserPermissionListLoading(true);
      return;
    }
    const editOpUserRole = doesUserHaveRole(loggedInUser, operatorEditUsers, operatorEditUsers);
    const editNonOpUserRole = doesUserHaveRole(loggedInUser, nonOperatorEditUsers, nonOperatorEditUsers);
    setDoesUserHaveOpEditUserRole(editOpUserRole);
    setDoesUserHaveNonOpEditUserRole(editNonOpUserRole);
    setUserPermissionListLoading(true);
    if(!editOpUserRole && !editNonOpUserRole && !loggedInUser.is_org_super_user) {
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

console.log(doesUserHaveEditOpUserRole, 'does user have op edit role')
  return (
    <>
    <div className="px-4 sm:px-10 sm:py-16 divide-y divide-gray-900/20 ">
    {userPermissionListLoading ? (
      <LoadingPage></LoadingPage>
    ) : (
      <>
      <div hidden={doesUserHaveEditOpUserRole || doesUserHaveEditNonOpUserRole || loggedInUser?.is_org_super_user } className="flex max-w-7xl mx-auto justify-center px-4 sm:px-24 pt-[20vh] sm:pt-[33vh] sm:py-4">
                    <NoSelectionOrEmptyArrayMessage
                    message={
                  <>
                     Oh hey there <span className="font-bold">{loggedInUser?.firstName}  {loggedInUser?.lastName}</span>! Nice to see you here.  Currently you do not have permission to view AFEs and that means you are not able to see the history either.  For that you will need to reach out to your admin.
                  </>
                    }>
                    </NoSelectionOrEmptyArrayMessage>
                </div>
      <div hidden={!doesUserHaveEditOpUserRole && !doesUserHaveEditNonOpUserRole && !loggedInUser?.is_org_super_user} className="divide-y divide-[var(--darkest-teal)]/40">
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
    </>
    )}
    </div> 
    </>
  )
}
