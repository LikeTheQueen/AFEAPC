import { addAFEHistorySupabase, fetchFromSupabase, updateAFEPartnerStatusSupabase } from "provider/fetch";
import { addOperatorSupabase } from "provider/write";
import type { AFEHistorySupabaseType, AFEType, EstimatesSupabaseType, UserProfileRecordSupabaseType } from "src/types/interfaces";
import { transformSourceSystemSupabase, transformUserProfileSupabase } from "src/types/transform";


export function handlePartnerStatusChange(id: string, partnerStatus: string, newPartnerStatus: string, description: string, type: string) {
  if (partnerStatus === newPartnerStatus) {
    return;
  } else {
    updateAFEPartnerStatusSupabase(id, newPartnerStatus);
    addAFEHistorySupabase(id, description, type);
  }
};

export function archiveDate(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - days);
  return newDate;
};

export function getViewRoleOperatorIds(user: UserProfileRecordSupabaseType | null) {
    if (!user) return;
    return user?.operatorRoles
      .filter(role => role.role === 2)
      .map(role => role.apc_id);
  };

export function getViewRoleNonOperatorIds(user: UserProfileRecordSupabaseType | null) {
    if (!user) return;
    return user?.partnerRoles
      .filter(role => role.role === 3)
      .map(role => role.apc_id);
  }

