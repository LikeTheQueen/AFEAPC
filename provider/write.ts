import  supabase  from './supabase';
import type { AddressType, ApiResponse, GLCodeRowData, GLCodeRowDataWrite, GLMappingRecord, OperatorPartnerRecord, OperatorType, ParentCompany, ParentCompanyWrite, PartnerMappingRecord, PartnerRecordToUpdate, PartnerRowData, RoleEntryRead, RoleEntryWrite, RoleTypeSupabaseOperator } from 'src/types/interfaces';
import { callEdge, callEdgeFile } from 'src/edge';

  //INSERT FUNCTIONS API CALLS

  export const writeToFunctionLogs = async (function_name: string, message: string, details: JSON | null, level: string, triggered_from: string) => {
    
    const { data, error } = await supabase.from('FUNCTION_LOGS').insert({
      function_name: function_name,
      message: message,
      details: details,
      level: level,
      triggered_from: triggered_from
    });
    if (error) {
        return null;
      }
    return;
  };

  
  interface AFEFilterCondition {
  LeftParenthesis?: string;
  RightParenthesis?: string;
  Join?: string;
  Column?: string;
  Operator?: string;
  Value?: string;
};

  export const updateOperatorFilterFields = async(apc_op_id: string, well_colums:string[], afe_filter: AFEFilterCondition[]) => {
    const { data, error } = await supabase.from('OPERATORS_EXECUTE').update({
      afe_filter: afe_filter,
      well_columns: well_colums
    }).eq('apc_op_id', apc_op_id)
    .select()
    

    if(error) {
      console.log(error)
      return {ok: false, message: error?.message, data: []}
    }
    return {ok: true, message: null, data: data}
  };
// DELETE TEST RECORDS
  export async function deletTestRecords(table: string, idNumber: number, idString: string, token: string) {
    
    type TogglePayload = { table: string; idNumber: number; idString: string; };
    type ToggleResult  = { ok: true; } | { ok: false; };
    
    return callEdge<TogglePayload, ToggleResult>("delete_test_records", { table, idNumber, idString }, token);
  };
//UPSERT DATA
  export async function insertOrUpdatePermissions(roles: RoleEntryWrite[], table: string, token: string) {
    
    type TogglePayload = { roles: RoleEntryWrite[]; table: string; };
    type ToggleResult  = { ok: true; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("insert_or_update_permissions", { roles, table }, token);
  };
//INSERT DATA
  export async function insertAFEHistory(afe_id: string, description: string, type: string, purpose: string, token: string) {
    
    type TogglePayload = { afe_id:string; description: string; type: string; purpose: string; };
    type ToggleResult  = { ok: true; data: any} | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("insert_AFE_history", { afe_id, description, type, purpose }, token);
  };

  export async function insertSupportTicket(subject: string, message: string, created_by_email: string, token: string) {
    
    type TogglePayload = { subject: string; message: string; created_by_email: string; };
    type ToggleResult  = { ok: true; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("insert_support_ticket", { subject, message, created_by_email }, token);
  };
  
  export async function createNewUser(email: string, password: string, token: string) {
    
    type TogglePayload = { email:string; password: string; };
    type ToggleResult  = { ok: true; data: string; } | { ok: false; message: string; };
    
    return callEdge<TogglePayload, ToggleResult>("create_New_User", { email, password }, token);
  };

  export async function createNewUserProfile(id: string, first_name: string, last_name: string, email: string, active: boolean, is_super_user: boolean, token: string, apc_op_id_umbrella: string, is_org_super_user: boolean) {
    
    type TogglePayload = { id: string; first_name: string; last_name: string; email: string; active: boolean; is_super_user: boolean; apc_op_id_umbrella: string; is_org_super_user: boolean;};
    type ToggleResult  = { ok: true; data: any; } | { ok: false; message: string; };
    
    return callEdge<TogglePayload, ToggleResult>("create_New_User_Profile", { id, first_name, last_name, email, active, is_super_user, apc_op_id_umbrella, is_org_super_user }, token);
  };

  export async function createUserRolesOperator(roles: RoleEntryWrite[], token: string) {
    
    type TogglePayload = { roles: RoleEntryWrite[]; };
    type ToggleResult  = { ok: true; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("create_Roles_Op_Permission", { roles }, token);
  };

  export async function createUserRolesPartner(roles: RoleEntryWrite[], token: string) {
    
    type TogglePayload = { roles: RoleEntryWrite[]; };
    type ToggleResult  = { ok: true; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("create_Roles_Partner_Permission", { roles }, token);
  };

  export async function insertPartnerRecord(partnerRecord: OperatorPartnerRecord, token: string) {
    
    type TogglePayload = { partnerRecord: OperatorPartnerRecord; };
    type ToggleResult  = { ok: true; id: string; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("insert_Partner_Record", { partnerRecord }, token);
  };

  export async function insertGLAccount(glAccountRecord: GLCodeRowDataWrite[], table: string, token: string) {
    
    type TogglePayload = { glAccountRecord: GLCodeRowDataWrite[]; table: string; };
    type ToggleResult  = { ok: true; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("insert_gl_account", { glAccountRecord, table }, token);
  };

  export async function insertGLMap(glMapRecord: GLMappingRecord[], token: string) {
    
    type TogglePayload = { glMapRecord: GLMappingRecord[]; };
    type ToggleResult  = { ok: true; data: any[]; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("insert_gl_map", { glMapRecord }, token);
  };

  export async function insertAFEDocument(filepath: string, fileToUpload: File, token: string) {
  const formData = new FormData();
  formData.append('filepath', filepath);
  formData.append('fileToUpload', fileToUpload);

  return callEdgeFile<{ ok: boolean }>("insert_afe_document", formData, token);
  };

  export async function insertAFEDocumentRecord(apc_afe_id: string, apc_op_id: string, apc_partner_id: string, storage_path: string, filename: string, filename_display: string, mimetype: string, byte_size: number, checksum: string, isNonOpSignedAFE: boolean, token: string) {
    
    type TogglePayload = { apc_afe_id: string; apc_op_id: string; apc_partner_id: string; storage_path: string; filename: string; filename_display: string; mimetype: string; byte_size: number; checksum: string; isNonOpSignedAFE: boolean; };
    type ToggleResult  = { ok: true; } | { ok: false; };
    
    return callEdge<TogglePayload, ToggleResult>("insert_afe_doc_table", { apc_afe_id, apc_op_id, apc_partner_id, storage_path, filename, filename_display, mimetype, byte_size, checksum, isNonOpSignedAFE }, token);
  };

  export async function insertParentCompany(name: string, address: AddressType, token: string) {
    
    type TogglePayload = { name: string; address: AddressType; };
    type ToggleResult  = { ok: true; data: any; } | { ok: false; message: string; };
    
    return callEdge<TogglePayload, ToggleResult>("insert_parent_company", { name, address }, token);
  };

  export async function insertParentCompanyFullRecord(parentCompany: ParentCompanyWrite, address: AddressType, token: string) {
    
    type TogglePayload = { parentCompany: ParentCompanyWrite; address: AddressType; };
    type ToggleResult  = { ok: true; data: any; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("insert_parent_company_full_record", { parentCompany, address }, token);
  };

  export async function insertOperatorFullRecord(name: string, source_system: number, parent_company: string, address: AddressType, token: string) {
    
    type TogglePayload = { name: string; source_system: number; parent_company: string; address: AddressType; };
    type ToggleResult  = { ok: true; data: any; address: any } | { ok: false; message: string; };
    
    return callEdge<TogglePayload, ToggleResult>("insert_operator_full_record", { name, source_system, parent_company, address }, token);
  };

  export async function insertAPCPartner(name: string, address: AddressType, token: string) {
    
    type TogglePayload = { name: string; address: AddressType; };
    type ToggleResult  = { ok: true; data: any; } | { ok: false; message: string; };
    
    return callEdge<TogglePayload, ToggleResult>("insert_apc_partner", { name, address }, token);
  };

  export async function insertOperatorPartnerList(partnerRecords: PartnerRowData[], token: string) {
    
    type TogglePayload = { partnerRecords: PartnerRowData[]; };
    type ToggleResult  = { ok: true; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("insert_operator_partner_list", { partnerRecords }, token);
  };

  export async function insertPartnerMapping(partnerRecords: PartnerMappingRecord[], token: string) {
    
    type TogglePayload = { partnerRecords: PartnerMappingRecord[]; };
    type ToggleResult  = { ok: true; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("insert_partner_mapping", { partnerRecords }, token);
  };

  export async function insertNonOp(name: string, apc_op_id:string, address: AddressType, token: string) {
    
    type TogglePayload = { name: string; apc_op_id:string; address: AddressType; };
    type ToggleResult  = { ok: true; data: any} | { ok: false; message: string; };
    
    return callEdge<TogglePayload, ToggleResult>("insert_non_op", { name, apc_op_id, address }, token);
  };

  export async function insertSupportTicketThread(comment: string, related_ticket:number, token: string) {
    
    type TogglePayload = { comment: string; related_ticket:number; };
    type ToggleResult  = { ok: true; data: any} | { ok: false; message: string; };
    
    return callEdge<TogglePayload, ToggleResult>("insert_support_ticket_thread", { comment, related_ticket }, token);
  };

//UPDATE DATA
  export async function updateGLCodeMapping(id: number, active: boolean, token: string) {
    
    type TogglePayload = { id: number; active: boolean; };
    type ToggleResult  = { ok: true; data: { id: number; active: boolean } } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_GL_crosswalk_status", { id, active }, token);
  };

  export async function updatePartnerMap(id: number, mapValue: boolean, token: string) {
    
    type TogglePayload = { id: number; mapValue: boolean; };
    type ToggleResult  = { ok: true; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_partner_mapping", { id, mapValue }, token);
  };

  export async function updatePartnerActiveStatus(id: number, status: boolean, token: string) {
    
    type TogglePayload = { id: number; status: boolean; };
    type ToggleResult  = { ok: true; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_partner_active_status", { id, status }, token);
  };

  export async function updateAFEPartnerStatus(id: string, status: string, token: string) {
    
    type TogglePayload = { id: string; status: string; };
    type ToggleResult  = { ok: true; data: { id: string; status: string; } } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_partner_status_on_AFE", { id, status }, token);
  };

  export async function updateAFEPartnerArchiveStatus(id: string, status: boolean, token: string) {
    
    type TogglePayload = { id: string; status: boolean; };
    type ToggleResult  = { ok: true; data: { id: string; status: boolean; } } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_partner_archive_status_on_AFE", { id, status }, token);
  };

  export async function updateAFEOperatorArchiveStatus(id: string, status: boolean, token: string) {
    
    type TogglePayload = { id: string; status: boolean; };
    type ToggleResult  = { ok: true; data: { id: string; status: boolean; } } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_operator_archive_status_on_AFE", { id, status }, token);
  };

  export async function updateUserActiveStatusToInactive(user_id: string, token: string) {
    
    type TogglePayload = { user_id: string; };
    type ToggleResult  = { ok: true; data: { id: string; status: boolean; } } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("deactivate_user", { user_id }, token);
  };

  export async function updateUserActiveStatusToActive(user_id: string, token: string) {
    
    type TogglePayload = { user_id: string; };
    type ToggleResult  = { ok: true; data: { id: string; status: boolean; } } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("reactivate_user", { user_id }, token);
  };
 
export async function updateOperatorNameStatus(operatorName: string, activeStatus: boolean, apc_id:string, token: string) {
    
    type TogglePayload = { operatorName: string; activeStatus: boolean; apc_id:string; };
    type ToggleResult  = { ok: true; data: any[]; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_Operator_Name_and_Status", { operatorName, activeStatus, apc_id }, token);
  };
  

export async function updateParentCOAddress(parentCOAddress: AddressType, token: string) {
    
    type TogglePayload = { parentCOAddress: AddressType; };
    type ToggleResult  = { ok: true; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_parent_co_address", { parentCOAddress }, token);
  };

export async function updateOpAddress(operatorAddress: AddressType, token: string) {
    
    type TogglePayload = { operatorAddress: AddressType; };
    type ToggleResult  = { ok: true; message: string } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_Operator_Address", { operatorAddress }, token);
  };

export async function updateNonOpAddress(partnerAddress: AddressType, token: string) {
    
    type TogglePayload = { partnerAddress: AddressType; };
    type ToggleResult  = { ok: true; message: string } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_Partner_Address", { partnerAddress }, token);
  };

export async function updatePartnerNameStatus(partnerRecord: RoleEntryRead, token: string) {
    
    type TogglePayload = { partnerRecord: RoleEntryRead; };
    type ToggleResult  = { ok: true; data: any[]; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_Partner_Name_and_Status", { partnerRecord }, token);
  };

export async function updatePartnerWithOpId(partnerRecord: PartnerRecordToUpdate[], token: string) {
    
    type TogglePayload = { partnerRecord: PartnerRecordToUpdate[]; };
    type ToggleResult  = { ok: true; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_partner_with_opid", { partnerRecord }, token);
  };
 
export async function updateParentCompany(parentCompany: ParentCompany, token: string) {
    
    type TogglePayload = { parentCompany: ParentCompany; };
    type ToggleResult  = { ok: true; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_parent_company", { parentCompany }, token);
  };

export async function updateGLAccountStatus(id: number, active: boolean, token: string) {
    
    type TogglePayload = { id: number; active: boolean; };
    type ToggleResult  = { ok: true; data: any[]; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_gl_account_status", { id, active }, token);
  };

export async function updateUserRecord(id: string, is_org_super_user: boolean, token: string) {
    
    type TogglePayload = { id: string; is_org_super_user: boolean; };
    type ToggleResult  = { ok: true; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_user_profile", { id, is_org_super_user }, token);
  };

export async function updateSupportTicketResolution(id: number, active: boolean, user_id: string, resolution: string, token: string) {
    
    type TogglePayload = { id: number; active: boolean; user_id: string; resolution: string; };
    type ToggleResult  = { ok: true; data: any; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_support_ticket", { id, active, user_id, resolution }, token);
  };

export async function updateExecuteFilterFields(apc_op_id: string, well_colums:string[], afe_filter: AFEFilterCondition[], token: string) {
    
    type TogglePayload = { apc_op_id: string; well_colums:string[]; afe_filter: AFEFilterCondition[]; };
    type ToggleResult  = { ok: true; data: any } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_execute_filter_fields", { apc_op_id, well_colums, afe_filter }, token);
  };
