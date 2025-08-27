import type { RoleEntryRead, RoleEntryWrite, RoleTypeSupabaseOperator, UserProfileRecordSupabaseType } from "src/types/interfaces";
import { fetchIsUserSuperUser } from 'provider/fetch';
import { addNewUser, createUserProfile, deactivateUser, writeorUpadateUserRoles, writeSuperUserProfile, writeUserRolesforOperator } from "provider/write";

export async function isUserSuperUser(loggedInUser: UserProfileRecordSupabaseType){
    const result = await fetchIsUserSuperUser(loggedInUser.user_id);
    if(result === true) {
        return true;
    } else {
        return false;
    }
};

export async function handleNewUser(
        firstName: string, 
        lastName: string, 
        email: string, 
        password: string, 
        active:boolean, 
        roles: RoleEntryWrite[],
        partnerRoles: RoleEntryWrite[],
        superUser: boolean,
    ){
    const newUser = await addNewUser(email, password);
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
};

export function apcIdsOfUserWithEditUserPriv(role_entry: RoleEntryRead[], targetRole: number):string[] {
    const listOFIDs = role_entry.reduce((id: Set<string>, item: RoleEntryRead) => {
    if (item.role === targetRole) {
      id.add(item.apc_id);
    }
    return id;
  }, new Set<string>());

  return Array.from(listOFIDs);
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