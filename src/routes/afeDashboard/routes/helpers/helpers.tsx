import { updateAFEPartnerStatus, updateAFEPartnerArchiveStatus, updateAFEOperatorArchiveStatus } from "provider/write";
import type { UserProfileRecordSupabaseType } from "src/types/interfaces";
import { insertAFEHistory } from 'provider/write'

export async function handlePartnerStatusChange(id: string, partnerStatus: string, newPartnerStatus: string, description: string, type: string, token: string) {
  if (partnerStatus === newPartnerStatus) {
    return;
  } else {
    const partnerStatusChange = await updateAFEPartnerStatus(id, newPartnerStatus, token);
      if(partnerStatusChange.ok) {
        
      }
    insertAFEHistory(id, description, type, token);
  }
};

export function handlePartnerArchiveStatusChange(id: string, archivedStatus: boolean, description: string, type: string, token: string) {
  updateAFEPartnerArchiveStatus(id, archivedStatus, token);
  insertAFEHistory(id, description, type, token);
};

export function handleOperatorArchiveStatusChange(id: string, archivedStatus: boolean, description: string, type: string, token: string) {
  updateAFEOperatorArchiveStatus(id, archivedStatus, token);
  insertAFEHistory(id, description, type, token);
};

export function getViewRoleOperatorIds(user: UserProfileRecordSupabaseType | null) {
    if (!user) return;
    return user?.operatorRoles
      .filter(role => role.role === 2 || role.role === 1)
      .map(role => role.apc_id);
};

export function getViewRoleNonOperatorIds(user: UserProfileRecordSupabaseType | null) {
    if (!user) return;
    return user?.partnerRoles
      .filter(role => role.role === 3 || role.role === 1)
      .map(role => role.apc_id);
};


