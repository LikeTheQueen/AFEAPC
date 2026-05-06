import { updateAFEPartnerStatus, updateAFEPartnerArchiveStatus, updateAFEOperatorArchiveStatus, writeToFunctionLogs } from "provider/write";
import type { AFEType, UserProfileRecordSupabaseType } from "src/types/interfaces";
import { insertAFEHistory } from 'provider/write'
import { notifyFailure, notifyStandard } from "src/helpers/helpers";
import { superUserPermission, supportEmail, viewNonOpAFEPermission, viewOperatedAFEPermission } from "src/constants/variables";
import { handleSendEmail, sendAFEStatusChangeEmailToOperator, sendAFEStatusChangeEmailToPartner } from "email/emailBasic";
import { useSupabaseData } from "src/types/SupabaseContext";

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
  }
  if (partnerStatusChange.ok) {
    const insertAFEHistoryResult = await insertAFEHistory(afeRecord.id, description, type, token);
    if (!insertAFEHistoryResult.ok) {
      writeToFunctionLogs('insertAFEHistory', insertAFEHistoryResult.message, null, 'ERROR', `AFE or AFE Details to change Partner status to ${newPartnerStatus} and cannot update AFE History`);
    }
    //Send to Operator
    sendAFEStatusChangeEmailToOperator(afeRecord, newPartnerStatus, loggedInUserFirstName, loggedInUserLastName, loggedinUserEmail);
    sendAFEStatusChangeEmailToPartner(afeRecord, newPartnerStatus, loggedInUserFirstName, loggedInUserLastName, loggedinUserEmail);
    if (newPartnerStatus === 'Approved') {
      console.log('handleStatusChanges called', newPartnerStatus);
      notifyStandard('AFE Approved.  Spud ahead.');
    } else if (newPartnerStatus === 'Rejected') {
      notifyStandard('AFE rejected.  This well is a no-go.');
    }
    return { ok: true };
  }

};



export async function handlePartnerStatuChangeLogic(
  afeRecord: AFEType,
  newPartnerStatus: string, 
  description: string, 
  type: string,  
  token: string,
  loggedInUserEmail: string,
  loggedInUserFirstName: string
) {
  if (afeRecord.partner_status === newPartnerStatus) {
    return { success: true };
  }
  const partnerStatusChange = await updateAFEPartnerStatus(afeRecord.id, newPartnerStatus, token);

  if (partnerStatusChange.ok) {
    await insertAFEHistory(afeRecord.id, description, type, token);
    //Send email to Operators
    await handleSendEmail(
                `Your AFE has been ${newPartnerStatus} by ${loggedInUserFirstName} at ${afeRecord.partner_name}`,
                `This message is to let you know that your AFE has been ${newPartnerStatus}.  The AFE Number is ${afeRecord.afe_number} (${afeRecord.version_string})`,
                loggedInUserEmail,
                "AFE Partner Connections",
                afeRecord.operator,
                afeRecord.partner_name,
                `https://www.afepartner.com/mainscreen/afeDetail/${afeRecord.id}`,
                'View AFE'
              );
    //Send email to Partners
    await handleSendEmail(
                `Your AFE has been ${newPartnerStatus} by ${loggedInUserFirstName} at ${afeRecord.partner_name}`,
                `This message is to let you know that your AFE has been ${newPartnerStatus}.  The AFE Number is ${afeRecord.afe_number} (${afeRecord.version_string})`,
                loggedInUserEmail,
                "AFE Partner Connections",
                afeRecord.operator,
                afeRecord.partner_name,
                `https://www.afepartner.com/mainscreen/afeDetail/${afeRecord.id}`,
                'View AFE'
              );
    return { success: true };
  }
  return { success: false, reason: 'Failed to update Partner Status' };
};

export function usePartnerStatusChange() {
  const { loggedInUser, session } = useSupabaseData();
  const token = session?.access_token ?? "";

  const handlePartnerStatusChange = async (
    afeRecord: AFEType,
    newPartnerStatus: string,
    description: string,
    type: string
  ) => {
    const result = await handlePartnerStatuChangeLogic(
      afeRecord,
      newPartnerStatus,
      description,
      type,
      token,
      loggedInUser?.email!,
      loggedInUser?.firstName!
    );
    if(result?.success) {
      if (newPartnerStatus === 'Approved') {
      notifyStandard('AFE Approved.  Spud ahead.');
      } else if (newPartnerStatus === 'Rejected') {
        notifyStandard('AFE rejected.  This well is a no-go.');
      }
    } else if (!result?.success) {
      notifyStandard('Update failed');
    }
    return result;
  };

  return { handlePartnerStatusChange };
};




const handleEmailPartnerStatusChangeNotification = async ( 
  afeRecord: AFEType,
  newPartnerStatus: string,
  loggedInUserFirstName: string,
  loggedInUserEmail: string,
 ) => {
  //Send email to Operator
  await handleSendEmail(
                `Your AFE has been ${newPartnerStatus} by ${loggedInUserFirstName} at ${afeRecord.partner_name}`,
                `This message is to let you know that your AFE has been ${newPartnerStatus}.  The AFE Number is ${afeRecord.afe_number} (${afeRecord.version_string})`,
                loggedInUserEmail,
                "AFE Partner Connections",
                afeRecord.operator,
                afeRecord.partner_name,
                `https://www.afepartner.com/mainscreen/afeDetail/${afeRecord.id}`,
                'View AFE'
              );
    //Send email to Partners
    await handleSendEmail(
                `Your AFE has been ${newPartnerStatus} by ${loggedInUserFirstName} at ${afeRecord.partner_name}`,
                `This message is to let you know that your AFE has been ${newPartnerStatus}.  The AFE Number is ${afeRecord.afe_number} (${afeRecord.version_string})`,
                loggedInUserEmail,
                "AFE Partner Connections",
                afeRecord.operator,
                afeRecord.partner_name,
                `https://www.afepartner.com/mainscreen/afeDetail/${afeRecord.id}`,
                'View AFE'
              );

};

