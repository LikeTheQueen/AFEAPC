import type { ApcRoleGroup, GroupedUser, RoleEntryRead, RoleEntryWrite, RoleTypeSupabaseOperator, UserPermissionFlatRow, UserProfileRecordSupabaseType } from "src/types/interfaces";
import { createNewUser, createUserRolesOperator, createUserProfile, deactivateUser, writeorUpadateUserRoles, writeSuperUserProfile, writeUserRolesforOperator, updateUserActiveStatusToInactive, createNewUserProfile, createUserRolesPartner } from "provider/write";
import { notifyFailure, notifyStandard } from "src/helpers/helpers";
import { superUserPermission, viewNonOpAFEPermission, viewOperatedAFEPermission, operatorEditUsers, nonOperatorEditUsers, approveRejectNonOpAFEs, viewOperatorBilling, editNonOpLibrary, editOperatorLibrary } from "src/constants/variables";
import { transformRoleEntryForPermissionsView, transformRoleEntrySupabase } from "src/types/transform";

export function filterOperatorRolePermissions (roles: RoleEntryWrite[], user_id:string): RoleEntryWrite[] {
        return roles.filter(item => item.role === viewOperatedAFEPermission || item.role === operatorEditUsers || item.role === viewOperatorBilling || item.role === editOperatorLibrary ).map(item => ({
        user_id: user_id,
        role: item.role,
        apc_id: item.apc_id, 
        apc_address_id: item.apc_address_id,
        active: true
    })) 
};

export function filterPartnerRolePermissions (roles: RoleEntryWrite[], user_id:string): RoleEntryWrite[] {
        return roles.filter(item => item.role === viewNonOpAFEPermission || item.role === nonOperatorEditUsers || item.role === approveRejectNonOpAFEs || item.role === editNonOpLibrary ).map(item => ({
        user_id: user_id,
        role: item.role,
        apc_id: item.apc_id, 
        apc_address_id: item.apc_address_id,
        active: true
    })) 
};
export const handleNewUser = async(
        firstName: string, 
        lastName: string, 
        email: string, 
        active:boolean, 
        roles: RoleEntryWrite[],
        pRoles: RoleEntryWrite[],
        is_super_user: boolean,
        token: string,
        apc_op_id_umbrella: string,

    ) => {
      
        try{
         const newUser = await createNewUser(email, 'topSecretPassword25!', token);

         if(!newUser.ok) {
            throw new Error((newUser as any).message ?? 'Cannot create new user');
         }
         
         if(!active) {
            await updateUserActiveStatusToInactive(newUser.data, token)
         }

         await createNewUserProfile(newUser.data, firstName, lastName, email, active, is_super_user, token, apc_op_id_umbrella);

         if(roles.length>0) {
            const opRoles = filterOperatorRolePermissions(roles, newUser.data);
            await createUserRolesOperator(opRoles, token);
         }
        if(pRoles.length>0) {
            const partnerRoles = filterPartnerRolePermissions(pRoles,newUser.data);
            await createUserRolesPartner(partnerRoles,token)
        }

        } catch(e) {
            console.error('An error was thrown', e)
            notifyFailure(`The system stalled out like a pump jack overdue for maintenance and the user didn't save.\n\n(TLDR: Error saving user: ${e}.)`)
        } finally {
            notifyStandard(`New user saved to the system.  They got saved faster than a last minute AFE approval.\n\n(TLDR: New user successfully saved.)`)
            return;
        }
    /*
    
    if(!active && newUser !== null) {
        deactivateUser(newUser?.user?.id!)
    };
    if(newUser?.user?.id !== null) {
        await createUserProfile(firstName,lastName,email,newUser?.user?.id!,active);
        const updateRoleEntry = (roles: RoleEntryWrite[]): RoleEntryWrite[] => {
        return roles.filter(item => item.role === 2 || item.role === 4 || item.role === 7).map(item => ({
        user_id: newUser?.user?.id!,
        role: item.role,
        apc_id: item.apc_id,
        apc_address_id: item.apc_address_id,
        active: true
    })) 
    };
    const updateRoleEntryPartners = (roles: RoleEntryWrite[]): RoleEntryWrite[] => {
        return roles.filter(item => item.role === 3 || item.role === 5 || item.role === 6).map(item => ({
        user_id: newUser?.user?.id!,
        role: item.role,
        apc_id: item.apc_id,
        apc_address_id: item.apc_address_id,
        active: true
    })) 
    };
        const processedRolesOp = updateRoleEntry(roles);
        const processedRolesPartner = updateRoleEntryPartners(partnerRoles);
        writeorUpadateUserRoles(processedRolesOp, 'OPERATOR_USER_PERMISSIONS');
        writeorUpadateUserRoles(processedRolesPartner, 'PARTNER_USER_PERMISSIONS');
    };
    if(newUser?.user?.id !== null && superUser === true) {
        writeSuperUserProfile(newUser?.user.id!)
    };
    */
};

export function mergeRoles(existing: RoleEntryRead[], incoming: RoleEntryRead[]): RoleEntryRead[] {
  const map = new Map<string, RoleEntryRead>();
  [...existing, ...incoming].forEach(role => {
    const key = `${role.apc_id}-${role.role}`; 
    map.set(key, role);
  });
  return Array.from(map.values());
};

export function checkedByRole(roles: RoleEntryRead[], roleVal: number) {
    const rolemapfilter = roles.filter(role => (role.role === roleVal && role.active === true));
    const isChecked = rolemapfilter.length===1 ? true : false;

    return isChecked;
};

export function checkedByRoleEntryWrite(roles: RoleEntryWrite[], roleVal: number) {
    const rolemapfilter = roles.filter(role => (role.role === roleVal && role.active === true));
    const isChecked = rolemapfilter.length===1 ? true : false;

    return isChecked;
};

export function getRoleIndex(roles: RoleEntryRead[], roleVal: number, apc_id:string, apc_address_id: number, user_id: string): number | undefined {
    
    const existingIndex = roles.find(
      entry => entry.apc_id === apc_id && entry.apc_address_id === apc_address_id && entry.user_id === user_id && entry.role === roleVal
    );

    if (!existingIndex) return undefined;
    return existingIndex.id!
};

export function getRoleIndexRoleEntryWrite(roles: RoleEntryWrite[], roleVal: number, apc_id:string, apc_address_id: number, user_id: string): number | undefined {
    
    const existingIndex = roles.find(
      entry => entry.apc_id === apc_id && entry.apc_address_id === apc_address_id && entry.user_id === user_id && entry.role === roleVal
    );

    if (!existingIndex) return undefined;
    return existingIndex.id!
};

export function buildGroupedUsers(
  rows: UserPermissionFlatRow[],
  loggedInUser: UserProfileRecordSupabaseType,
  permissionType: 'operator' | 'partner'
): { grouped: GroupedUser[], editableApcAddressIds: Set<number> } {

  const transformed = transformRoleEntryForPermissionsView(rows);
  const filteredRoles = transformed.filter(r => 
    r.role !== null && 
    r.role !== 1 && 
    (permissionType === 'operator' ? r.is_op_permission : r.is_partner_permission)
  );

  // All APCs in the org (for display)
  const allApcs = Array.from(
    new Map(filteredRoles.map(r => [r.apc_address_id, r])).values()
  );

  // Only APCs the logged-in user can edit (role 4 or 5)
  const editRoles = permissionType === 'operator' ? [4, 1] : [5, 1];
  const loggedInRoles = permissionType === 'operator'
    ? loggedInUser.operatorRoles
    : loggedInUser.partnerRoles;

  const editableApcAddressIds = new Set(
    loggedInRoles
      .filter(r => editRoles.includes(r.role ?? 0))
      .map(r => r.apc_address_id)
  );

  if (allApcs.length === 0) return { grouped: [], editableApcAddressIds };

  // Group flat rows by user
  const byUser = new Map<string, { row: UserPermissionFlatRow; allRows: UserPermissionFlatRow[] }>();
  for (const row of rows) {
    const key = row.user_id ?? row.email;
    if (!byUser.has(key)) {
      byUser.set(key, { row, allRows: [] });
    }
    if (row.role_id !== null) {
      byUser.get(key)!.allRows.push(row);
    }
  }

  const grouped = Array.from(byUser.values()).map(({ row, allRows }) => {
    const rolesByAddress = new Map<number, RoleEntryWrite[]>();
    for (const r of allRows) {
      if (!rolesByAddress.has(r.apc_address_id!)) {
        rolesByAddress.set(r.apc_address_id!, []);
      }
      rolesByAddress.get(r.apc_address_id!)!.push({
        id: r.role_id!,
        role: r.role,
        active: r.role_active ?? false,
        user_id: r.user_id!,
        apc_id: r.apc_id!,
        apc_address_id: r.apc_address_id!,
      });
    }

    const apcrole: ApcRoleGroup[] = allApcs.map(meta => ({
      apc_id: meta.apc_id,
      apc_address_id: meta.apc_address_id,
      apc_name: meta.apc_name,
      apc_street: meta.apc_address.street,
      apc_suite: meta.apc_address.suite ?? '',
      apc_city: meta.apc_address.city,
      apc_state: meta.apc_address.state,
      apc_zip: meta.apc_address.zip,
      roles: rolesByAddress.get(meta.apc_address_id) ?? [],
    }));

    return {
      user_id: row.user_id!,
      user_firstname: row.first_name,
      user_lastName: row.last_name,
      user_email: row.email,
      user_active: row.user_active,
      apcrole,
    };
  });

  return { grouped, editableApcAddressIds };
};

export function buildGroupedUsersOG(
  rows: UserPermissionFlatRow[],
  loggedInUser: UserProfileRecordSupabaseType,
  permissionType: 'operator' | 'partner'
): { grouped: GroupedUser[], editableApcAddressIds: Set<number> } {

  const transformed = transformRoleEntryForPermissionsView(rows);
  const filteredRoles = transformed.filter(r => 
    r.role !== null && 
    r.role !== 1 && 
    (permissionType === 'operator' ? r.is_op_permission : r.is_partner_permission)
  );

  // All APCs in the org (for display)
  const allApcs = Array.from(
    new Map(filteredRoles.map(r => [r.apc_address_id, r])).values()
  );

  // Only APCs the logged-in user can edit (role 4 or 5)
  const editRoles = permissionType === 'operator' ? [4, 1] : [5, 1];
  const loggedInRoles = permissionType === 'operator'
    ? loggedInUser.operatorRoles
    : loggedInUser.partnerRoles;

  const editableApcAddressIds = new Set(
    loggedInRoles
      .filter(r => editRoles.includes(r.role ?? 0))
      .map(r => r.apc_address_id)
  );

  if (allApcs.length === 0) return { grouped: [], editableApcAddressIds };

  // Group flat rows by user
  const byUser = new Map<string, { row: UserPermissionFlatRow; allRows: UserPermissionFlatRow[] }>();
  for (const row of rows) {
    const key = row.user_id ?? row.email;
    if (!byUser.has(key)) {
      byUser.set(key, { row, allRows: [] });
    }
    if (row.role_id !== null) {
      byUser.get(key)!.allRows.push(row);
    }
  }

  const grouped = Array.from(byUser.values()).map(({ row, allRows }) => {
    const rolesByAddress = new Map<number, RoleEntryWrite[]>();
    for (const r of allRows) {
      if (!rolesByAddress.has(r.apc_address_id!)) {
        rolesByAddress.set(r.apc_address_id!, []);
      }
      rolesByAddress.get(r.apc_address_id!)!.push({
        id: r.role_id!,
        role: r.role,
        active: r.role_active ?? false,
        user_id: r.user_id!,
        apc_id: r.apc_id!,
        apc_address_id: r.apc_address_id!,
      });
    }

    const apcrole: ApcRoleGroup[] = allApcs.map(meta => ({
      apc_id: meta.apc_id,
      apc_address_id: meta.apc_address_id,
      apc_name: meta.apc_name,
      apc_street: meta.apc_address.street,
      apc_suite: meta.apc_address.suite ?? '',
      apc_city: meta.apc_address.city,
      apc_state: meta.apc_address.state,
      apc_zip: meta.apc_address.zip,
      roles: rolesByAddress.get(meta.apc_address_id) ?? [],
    }));

    return {
      user_id: row.user_id!,
      user_firstname: row.first_name,
      user_lastName: row.last_name,
      user_email: row.email,
      user_active: row.user_active,
      apcrole,
    };
  });

  return { grouped, editableApcAddressIds };
}