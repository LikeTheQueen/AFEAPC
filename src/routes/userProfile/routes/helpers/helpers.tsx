import type { UserProfileRecordSupabaseType } from "src/types/interfaces";

export function isOpPrivChecked(loggedInUser: UserProfileRecordSupabaseType, apc_id: number, role:number): boolean {
    const matchInOperators = loggedInUser.operatorRoles.some(
    (entry) => entry.apc_address_id === apc_id && entry.role === role
  );

  const matchInPartners = loggedInUser.partnerRoles.some(
    (entry) => entry.apc_address_id === apc_id && entry.role === role
  );

  return matchInOperators || matchInPartners;
}