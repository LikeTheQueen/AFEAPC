import { useEffect, useState } from "react";
import { fetchOpUsersForEdit } from "provider/fetch";
import { useSupabaseData } from "src/types/SupabaseContext";
import type { RoleEntryRead } from "src/types/interfaces";
import { apcIdsOfUserWithEditUserPriv } from "./helpers/helpers";
import PermissionDashboard from "../../../routes/permissionGrid";

export default function UserPermissionDashboard() {
  const { loggedInUser, isSuperUser } = useSupabaseData();
  const [opUserRoleList, setOpUserRoleList] = useState<RoleEntryRead[] | []>([]);
  const [partnerUserRoleList, setPartnerUserRoleList] = useState<RoleEntryRead[] | []>([]);

  useEffect(() => {
    if (!loggedInUser?.operatorRoles || loggedInUser.operatorRoles.length < 1) return;
    async function getUsersForEdit() {
      if(isSuperUser) {
      const returnedOpUsers = await fetchOpUsersForEdit('OPERATOR_USER_PERMISSIONS','OPERATOR_ADDRESS');
      const returnedPartnerUsers = await fetchOpUsersForEdit('PARTNER_USER_PERMISSIONS','PARTNER_ADDRESS');
      setOpUserRoleList(returnedOpUsers);
      setPartnerUserRoleList(returnedPartnerUsers);
      } else {
      const operatorIDs = apcIdsOfUserWithEditUserPriv(loggedInUser!.operatorRoles,4);
      const partnerIDs = apcIdsOfUserWithEditUserPriv(loggedInUser!.partnerRoles,5)
      const returnedOpUsers = await fetchOpUsersForEdit('OPERATOR_USER_PERMISSIONS','OPERATOR_ADDRESS',operatorIDs);
      const returnedPartnerUsers = await fetchOpUsersForEdit('PARTNER_USER_PERMISSIONS','PARTNER_ADDRESS',partnerIDs);
      setOpUserRoleList(returnedOpUsers);
      setPartnerUserRoleList(returnedPartnerUsers);
      }
    } getUsersForEdit();
  }, [loggedInUser, isSuperUser]);


  return (
    <>
    
    <div className="py-16 px-4 sm:px-32 divide-y divide-gray-900/20 ">
    <PermissionDashboard 
    readOnly={false}
    operatorRoles={opUserRoleList}
    partnerRoles={partnerUserRoleList}
    ></PermissionDashboard>
    </div>
      
    </>
  )
}
