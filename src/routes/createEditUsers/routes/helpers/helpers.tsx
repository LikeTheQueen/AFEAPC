import type { RoleEntryRead, RoleEntryWrite, RoleTypeSupabaseOperator } from "src/types/interfaces";
import { createNewUser, createUserRolesOperator, createUserProfile, deactivateUser, writeorUpadateUserRoles, writeSuperUserProfile, writeUserRolesforOperator, updateUserActiveStatusToInactive, createNewUserProfile, createUserRolesPartner } from "provider/write";
import { notifyFailure, notifyStandard } from "src/helpers/helpers";
import { superUserPermission, viewNonOpAFEPermission, viewOperatedAFEPermission, operatorEditUsers,nonOperatorEditUsers, approveRejectNonOpAFEs, viewOperatorBilling, editNonOpLibrary, editOperatorLibrary } from "src/helpers/helpers";

export function filterOperatorRolePermissions (roles: RoleEntryWrite[], user_id:string): RoleEntryWrite[] {
        return roles.filter(item => item.role === viewOperatedAFEPermission || item.role === operatorEditUsers || item.role === viewOperatorBilling || item.role === editOperatorLibrary ).map(item => ({
        user_id: user_id,
        role: item.role,
        apc_id: item.apc_id, 
        apc_address_id: item.apc_address_id,
        active: true
    })) 
}

export function filterPartnerRolePermissions (roles: RoleEntryWrite[], user_id:string): RoleEntryWrite[] {
        return roles.filter(item => item.role === viewNonOpAFEPermission || item.role === nonOperatorEditUsers || item.role === approveRejectNonOpAFEs || item.role === editNonOpLibrary ).map(item => ({
        user_id: user_id,
        role: item.role,
        apc_id: item.apc_id, 
        apc_address_id: item.apc_address_id,
        active: true
    })) 
}
export const handleNewUser = async(
        firstName: string, 
        lastName: string, 
        email: string, 
        active:boolean, 
        roles: RoleEntryWrite[],
        pRoles: RoleEntryWrite[],
        is_super_user: boolean,
        token: string,
    ) => {
        try{
         const newUser = await createNewUser(email, 'topSecretPassword25!', token);

         if(!newUser.ok) {
            throw new Error((newUser as any).message ?? 'Cannot create new user');
         }
         
         if(!active) {
            await updateUserActiveStatusToInactive(newUser.data, token)
         }

         await createNewUserProfile(newUser.data, firstName, lastName, email, active, is_super_user, token);

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
}

export function getRoleIndex(roles: RoleEntryRead[], roleVal: number, apc_id:string, apc_address_id: number, user_id: string): number | undefined {
    
    const existingIndex = roles.find(
      entry => entry.apc_id === apc_id && entry.apc_address_id === apc_address_id && entry.user_id === user_id && entry.role === roleVal
    );

    if (!existingIndex) return undefined;
    return existingIndex.id!
}