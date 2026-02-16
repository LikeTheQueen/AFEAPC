import { updateAFEPartnerStatus, updateAFEPartnerArchiveStatus, updateAFEOperatorArchiveStatus } from "provider/write";
import type { AFEType, UserProfileRecordSupabaseType } from "src/types/interfaces";
import { insertAFEHistory } from '../../../../../provider/write'
import { notifyStandard } from "src/helpers/helpers";
import { handleSendEmail } from "email/emailBasic";
import { useSupabaseData } from "src/types/SupabaseContext";

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
}

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

