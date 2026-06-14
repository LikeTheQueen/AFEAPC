import { updateAFEPartnerStatus, updateAFEPartnerArchiveStatus, updateAFEOperatorArchiveStatus, writeToFunctionLogs, insertAFEHistory } from "provider/write";
import type { AFEType, UserProfileRecordSupabaseType } from "src/types/interfaces";
import { notifyFailure, notifyStandard } from "src/helpers/helpers";
import { superUserPermission, supportEmail, viewNonOpAFEPermission, viewOperatedAFEPermission } from "src/constants/variables";
import { handleSendEmail, sendAFEStatusChangeEmailToOperator, sendAFEStatusChangeEmailToPartner } from "email/emailBasic";

export async function handlePartnerArchiveStatusChange(id: string, archivedStatus: boolean, description: string, type: string, token: string) {
  await updateAFEPartnerArchiveStatus(id, archivedStatus, token);
  await insertAFEHistory(id, description, type, 'Partner archiving AFE', token);
};

export function handleOperatorArchiveStatusChange(id: string, archivedStatus: boolean, description: string, type: string, token: string) {
  updateAFEOperatorArchiveStatus(id, archivedStatus, token);
  insertAFEHistory(id, description, type, 'Operator archiving AFE', token);
};

export function getViewRoleOperatorIds(user: UserProfileRecordSupabaseType | null) {
    if (!user) return;
    return user?.operatorRoles
      .filter(role => role.role === viewOperatedAFEPermission || role.role === superUserPermission)
      .map(role => role.apc_id);
};

export function getViewRoleNonOperatorIds(user: UserProfileRecordSupabaseType | null) {
    if (!user) return;
    return user?.partnerRoles
      .filter(role => role.role === viewNonOpAFEPermission || role.role === superUserPermission)
      .map(role => role.apc_id);
};

export async function handleThePartnerStatusChange(
  afeRecord: AFEType,
  newPartnerStatus: string,
  description: string,
  type: string,
  loggedInUserFirstName: string,
  loggedInUserLastName: string,
  loggedinUserEmail: string,
  token: string) {

  if (afeRecord.partner_status === newPartnerStatus) {
    return { ok: true };
  }
  const partnerStatusChange = await updateAFEPartnerStatus(afeRecord.id, newPartnerStatus, token);

  if (!partnerStatusChange.ok) {
    writeToFunctionLogs('UpdateAFEPartnerStatus', partnerStatusChange.message, null, 'ERROR', `AFE or AFE Details to change Partner status to ${newPartnerStatus} by ${loggedInUserFirstName} ${loggedInUserLastName}`);
    notifyFailure(`Unable to update the AFE status.  Contact ${supportEmail} if the problem persists`);
    return { ok: false };
  } else {
    await insertAFEHistory(afeRecord.id, description, type, 'Partner status change', token);
    
    //Send to Operator
    sendAFEStatusChangeEmailToOperator(afeRecord, newPartnerStatus, loggedInUserFirstName, loggedInUserLastName, loggedinUserEmail);
    sendAFEStatusChangeEmailToPartner(afeRecord, newPartnerStatus, loggedInUserFirstName, loggedInUserLastName, loggedinUserEmail);
    if (newPartnerStatus === 'Approved') {
      notifyStandard('AFE Approved.  Spud ahead.');
    } else if (newPartnerStatus === 'Rejected') {
      notifyStandard('AFE rejected.  This well is a no-go.');
    }
    return { ok: true };
  }
};









