import type { UserProfileRecordSupabaseType } from "src/types/interfaces";

export function getViewRoleOperatorIds(user: UserProfileRecordSupabaseType | null) {
    if (!user) return;
    return user?.operatorRoles
      .filter(role => role.role === 2)
      .map(role => role.apc_id);
  };

