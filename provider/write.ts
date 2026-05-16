import  supabase  from './supabase';
import type { AddressType, ApiResponse, GLCodeRowData, GLMappingRecord, OperatorPartnerRecord, OperatorType, PartnerMappingRecord, PartnerRecordToUpdate, PartnerRowData, RoleEntryRead, RoleEntryWrite, RoleTypeSupabaseOperator } from 'src/types/interfaces';
import { callEdge } from 'src/edge';
import { notifyStandard } from 'src/helpers/helpers';
import type { UUID } from 'crypto';

  //INSERT FUNCTIONS API CALLS
  export const insertAFEHistoryRecord = async (afe_id:string, description:string, type: string) => {
    const { data, error } = await supabase
    .from('AFE_HISTORY')
    .insert({afe_id: afe_id, description: description, type:type})
    .select();
    if (error) {
        writeToFunctionLogs('insertAFEHistoryRecord', 'Cannot add history to AFE '+afe_id, { message: error.message } as unknown as JSON , 'ERROR', 'AFE Detail screen')
        return {ok: false}
      }
      return {ok: true}
  };
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
  export const insertDocument = async(filepath: string, fileToUpload: File) => {
    const { data, error } = await supabase.storage
          .from('AFE_Docs')
          .upload(filepath, fileToUpload);
  
        if (error) {
          writeToFunctionLogs('insertDocument', error.message, null, 'ERROR', 'Attach Doc to AFE in AFE Detail');
          return {ok: false};
        }
    return {ok: true};
  };
  

  export const updateOperatorNameAndStatus = async (operatorName: string, activeStatus: boolean, apc_id:string) => {
    console.log(activeStatus,apc_id,operatorName)
  const { data, error } = await supabase
    .from('OPERATORS')
    .update({name: operatorName, active: activeStatus})
    .eq('id',apc_id)
    .select();
    if (error) {
      writeToFunctionLogs('updateOperatorNameAndStatus', error.message, null, 'ERROR', 'Update Operator UI');
        return {ok: false, data: [], message: error.message};
      }
      
  return {ok:true, data: data, message: undefined};
  };

  export const updateOperatorAddress = async (operatorAddress: AddressType) => {
      const { error } = await supabase
      .from('OPERATOR_ADDRESS')
      .update({street: operatorAddress.street, suite: operatorAddress.suite, city: operatorAddress.city, state: operatorAddress.state, zip: operatorAddress.zip, country: operatorAddress.country, active: operatorAddress.address_active})
      .eq('id',operatorAddress.id)
      .select();
      if (error) {
        writeToFunctionLogs('updateOperatorAddress', error.message, null, 'ERROR', 'Update Operator Address UI');
          return {ok: false, message: error.message};
        }
        
    return {ok:true, message: undefined};
  };

  export const updatePartnerNameAndStatus = async (partnerRecord: RoleEntryRead) => {
    const { data, error } = await supabase
    .from('PARTNERS')
    .update({name: partnerRecord.apc_name, active: partnerRecord.apc_name_active})
    .eq('id',partnerRecord.apc_id)
    .select();
    if (error) {
        writeToFunctionLogs('updatePartnerNameAndStatus', error.message, null, 'ERROR', 'Update Non Op Name UI');
         return {ok: false, data: [], message: error.message};
      }
  return {ok:true, data: data, message: undefined};
  };

  export const updatePartnerAddress = async (partnerAddress: AddressType) => {
      const { data, error } = await supabase
      .from('PARTNER_ADDRESS')
      .update({street: partnerAddress.street, suite: partnerAddress.suite, city: partnerAddress.city, state: partnerAddress.state, zip: partnerAddress.zip, country: partnerAddress.country, active: partnerAddress.address_active})
      .eq('id',partnerAddress.id)
      .select();
      if (error) {
          writeToFunctionLogs('updatePartnerAddress', error.message, null, 'ERROR', 'Update Non Op Address');
          return {ok: false, data: [], message: error.message};
        }
        
    return {ok:true, data: data, message: undefined};
  };

  export const addOParentCompanySupabase = async (name: string) => {
    const { data, error } = await supabase.from('PARENT_COMPANY')
    .insert({name: name, active:true})
    .select()
    .single();
    if (error) {
        return {ok: false, data: null, message: error.message};
      }

      return {ok: true, data: data, message: undefined};
  };

  export const addOperatorSupabase = async (name: string, source_system:number, parent_company:string) => {
    const { data, error } = await supabase.from('OPERATORS')
    .insert({name: name, source_system: source_system, active:true, parent_company: parent_company})
    .select()
    .single();
    if (error) {
        return {ok: false, data: null, message: error.message};
      }

      return {ok: true, data: data, message: undefined};
  };

  export const addPartnerSupabase = async (name: string, apc_op_id:string, address: AddressType) => {
    const { data, error } = await supabase.from('PARTNERS')
    .insert({name: name, active:true, apc_op_id:apc_op_id})
    .select()
    .single();
    if (error) {
        return {ok: false, data: null, message: error.message};
      }
      const apc_id = data.id;
      const { data: dataAddress, error: errorAdress } = await supabase.from('PARTNER_ADDRESS')
    .insert({apc_id: apc_id, 
      apc_op_id: apc_op_id,
      street: address.street, 
      suite: address.suite, 
      city: address.city, 
      state: address.state, 
      zip: address.zip, 
      country: address.country })
    .select()
    .single();
    if (errorAdress) {
         return { ok: false, data:null, message: errorAdress.message};
      }
      return {ok: true, data:dataAddress, message: undefined};
  };

  export const addUnrelatedPartnerSupabase = async (name: string, address: AddressType) => {
    const { data, error } = await supabase.from('PARTNERS')
    .insert({name: name, active:true})
    .select()
    .single();
    if (error) {
        return {ok: false, data: null, message: error.message};
      }
      const apc_id = data.id;
      const { data: dataAddress, error: errorAdress } = await supabase.from('PARTNER_ADDRESS')
    .insert({apc_id: apc_id, 
      street: address.street, 
      suite: address.suite, 
      city: address.city, 
      state: address.state, 
      zip: address.zip, 
      country: address.country })
    .select()
    .single();
    if (errorAdress) {
         return { ok: false, data:null, message: errorAdress.message};
      }
      return {ok: true, data:dataAddress, message: undefined};
  };

  export const addOperatorAdressSupabase = async (apc_id: string, address: AddressType) => {
    const { data, error } = await supabase.from('OPERATOR_ADDRESS')
    .insert({apc_id: apc_id, 
      street: address.street, 
      suite: address.suite, 
      city: address.city, 
      state: address.state, 
      zip: address.zip, 
      country: address.country })
      .select()
      .single();
    if (error) {
        return { ok: false, data: null, message: error.message};
      }
      return {ok: true, data:data, message: undefined};
  };

  export const addParentCompanyAdressSupabase = async (apc_id: string, address: AddressType) => {
    const { data, error } = await supabase.from('PARENT_COMPANY_ADDRESS')
    .insert({apc_id: apc_id, 
      street: address.street, 
      suite: address.suite, 
      city: address.city, 
      state: address.state, 
      zip: address.zip, 
      country: address.country })
      .select()
      .single();
    if (error) {
        return { ok: false, data: null, message: error.message};
      }
      return {ok: true, data:data, message: undefined};
  };

  export const addOperatorPartnerAddressSupabase = async (apc_id: UUID, address: AddressType) => {
    const { data, error } = await supabase.from('PARTNER_ADDRESS')
    .insert({apc_id: apc_id, 
      street: address.street, 
      suite: address.suite, 
      city: address.city, 
      state: address.state, 
      zip: address.zip, 
      country: address.country })
    .select()
    .single();
    if (error) {
         return { ok: false, data:null, message: error.message};
      }
      return {ok: true, data:data, message: undefined};
  };

  export const addNewUser = async(email: string, password: string) => {
    'use server';
    const { data, error } = await supabase.auth.admin.createUser({
      email:email,
      password:password,
    });
    if (error) {
        console.error(`Error adding User`, error);
        return null;
      }
      
      return (data);
  };

  export const deactivateUser = async(userID: string) => {
    const { data: user, error } = await supabase.rpc('deactivateUser',{user_id: userID});
    if (error) {
        console.error(`Error Deactivating User`, error);
        return null;
      }
      const { data } = await supabase.from('USER_PROFILE').update({'active': false}).eq('id',userID);
      return (user);
  };

  export const updateUserProfile = async(id:string, is_org_super_user: boolean) => {
    const { data, error } = await supabase.from('USER_PROFILE')
    .update({is_org_super_user: is_org_super_user})
    .eq('id', id);
    if (error) {
        return {ok: false, message: error.message};
      }
      return {ok:true, message: undefined};
  };

  export const writeUserRolesforOperator = async(roles:RoleTypeSupabaseOperator[]) => {
  const { data, error } = await supabase.from('OPERATOR_USER_CROSSWALK').upsert(roles);
  if (error) {
        console.error(`Error adding roles for user`, error);
        return null;
      }
      return;
  };

  export const writeorUpadateUserRoles = async(roles:RoleEntryWrite[], table: string) => {
  const withID = roles.filter(role => !(Number.isNaN(role.id))  )
  const withoutID = roles.filter(role => (Number.isNaN(role.id)))
  
  if (withID.length>0) {
    const { data, error } = await supabase.from(table).upsert(withID).select();
    if (error) {
        console.error(`Error updating roles for user`, error);
        return null;
      }
  }
  if (withoutID.length>0) {
    const removeIDColumn: RoleEntryWrite[] = withoutID.map(item => ({
      user_id: item.user_id,
      apc_id: item.apc_id,
      apc_address_id: item.apc_address_id,
      active: item.active,
      role: item.role
    }))
  const { data, error } = await supabase.from(table).insert(removeIDColumn);
  
  if (error) {
        console.error(`Error adding roles for user`, error);
        return null;
      }
  }
      return;
  };

  export const writeSuperUserProfile = async(user_id: string) => {
    const { data, error } = await supabase.from('USER_ROLES').insert({user_id: user_id, role:1});
    if (error) {
        console.error(`Error adding Super User`, error);
        return null;
      }
      return;
  };

  export const updatePartnerWithOpID = async(partnerRecordID: PartnerRecordToUpdate[]) => {
    const ids = partnerRecordID.map(x => x.id);
    const apc_op_id = partnerRecordID[0].apc_op_id;
    console.log(apc_op_id,'opid', ids,'ids')
    const [{ error: partnersError }, { error: partnerAddressError }] = await Promise.all([
    supabase.from('PARTNERS').update({ 'apc_op_id': apc_op_id }).in('id', ids),
    supabase.from('PARTNER_ADDRESS').update({ 'apc_op_id': apc_op_id }).in('apc_id', ids)
    ]);
    
    if (partnersError || partnerAddressError) {
      if(partnersError) {
        console.error(`Error updating Partner with Operator ID`, partnersError);
        return notifyStandard(`There was an error claiming the partner address.\n\n(TLDR: ${partnersError.message})`);
      } else if(partnerAddressError) {
        console.error(`Error updating Partner Address with Operator ID`, partnerAddressError);
        return notifyStandard(`There was an error claiming the partner address.\n\n(TLDR: ${partnerAddressError.message})`);
      }
    }
      return {ok: true};
      //return notifyStandard(`Partner address updatedaasasas. Fresh coordinates locked in and the route’s clear. No leaks detected.\n\n(TLDR: Partner Addresses ARE saved)`);
  };

  export const writePartnerlistFromSourceToDB = async(partnerRecords: PartnerRowData[]) => {
    console.log(partnerRecords);
    const { data, error } = await supabase.from('AFE_PARTNERS_EXECUTE').insert(partnerRecords).select();
    if (error) {
        writeToFunctionLogs('writePartnerlistFromSourceToDB', error.message, null, 'ERROR', 'Upload Partners');
        return {ok: false, message: error.message};
      }
      return {ok: true, message: undefined};
  };

   export const writePartnerlistForAFEPartnerConnections = async(partnerRecords: OperatorType, partnerAddress: AddressType) => {
    const { data, error } = await supabase.from('PARTNERS').insert(partnerRecords).select();
    if (error) {
        writeToFunctionLogs('writePartnerlistFromSourceToDB', error.message, null, 'ERROR', 'Upload Partners');
        return {ok: false, message: error.message};
      }
      return {ok: true, message: undefined};
  };

  export const writePartnerMappingsToDB = async(partnerRecords: PartnerMappingRecord[]) => {
    const { error } = await supabase.from('PARTNERS_CROSSWALK').insert(partnerRecords);
    if (error) {
        return {ok:false, message: error.message};
      }
      return {ok:true};
  };
  
  export const updatePartnerProcessedMapping = async(partnerSourceID: string[], mapValue: boolean) => {
   const {data, error} = await supabase.from('AFE_PARTNERS_PROCESSED').update({'mapped': mapValue}).eq('source_id',partnerSourceID).select();
    
    if (error) {
        console.error(`Error adding the Operator's Partner Maps`, error, data);
        return null;
      }
      return data;
  };

  export const updatePartnerProcessedMapValue = async(id: number[], mapValue: boolean) => {
   const {error} = await supabase.from('AFE_PARTNERS_PROCESSED').update({'mapped': mapValue}).eq('id',id);
    
    if (error) {
        return {ok:false, message: error.message};
      }
      return {ok:true};
  };

  export const updatePartnerProcessedStatus = async(id: number, status: boolean) => {
   const {data, error} = await supabase.from('AFE_PARTNERS_PROCESSED').update({'active': status}).eq('id',id).select();
    
    if (error) {
        console.error(`Error updating the Partners Processed Table`, error, data);
        return {ok: false, message: error.message};
        //return notifyStandard(`Well shut-in, no data flowed to the database\n\n(TLDR: ERROR saving the partner changes: ${error.message})`);
      }
      return {ok: true, message: undefined};
      //return notifyStandard(`Partner changes saved. Link established and the system didn’t even hiccup.\n\n(TLDR: Partner changes ARE saved)`);
  };

  export const updatePartnerMapping = async(partnerSourceID: string[], mapValue: boolean) => {
   const {data, error} = await supabase.from('PARTNERS_CROSSWALK').update({'active': mapValue}).eq('id',partnerSourceID).select();
    
    if (error) {
        console.error(`Error updating the Partner Mapping Record`, error, data);
        return null;
      }
      return data;
  };

  export const writeGLAccountlistFromSourceToDB = async(accountRecords: GLCodeRowData[]) => {
    const { data, error } = await supabase.from('GL_CODES').upsert(accountRecords, { onConflict: 'account_number, apc_op_id, apc_part_id' })
    .select();
    if (error) {
        writeToFunctionLogs('writeGLAccountlistFromSourceToDB', error.message, null, 'ERROR', 'Upload Account Codes');
        return {ok: false, message: error.message};
      }
      return {ok: true, message: undefined};
  };

  export const updateGLAccountCodeStatus = async(id: number, status: boolean ) => {
    const { error } = await supabase.from('GL_CODES_PROCESSED').update({'active': status}).eq('id',id);
    if (error) {
        console.error(`Error modifying the GL Account Code`, error);
        return notifyStandard(`Well shut-in, no data flowed to the database\n\n(TLDR: ERROR changing the account code: ${error.message})`);
      }
      return notifyStandard(`GL Account Code saved. Books are balanced and the wellhead’s pressure-tight.\n\n(TLDR: GL Account Codes changes SAVED)`);
  };

  export const writeGLCodeMapping = async(glMappings: GLMappingRecord[]) => {
    const { data, error } = await supabase.from('GL_CODE_CROSSWALK').insert(glMappings).select();
    if (error) {
        console.error(`Error adding the GL CodeMappings`, error);
        return null;
      }
      return data;
  };

  export const createSupportTicket = async(subject: string, message: string, created_by_email: string ) => {
    const { data, error } = await supabase.from('SUPPORT_HISTORY').insert({
      subject: subject, message: message, created_by_email: created_by_email
    }).select();
    if(error) {
      return {ok: false, data: error.message};
    }
    return {ok: true, data: data};
  };

  export const createSupportTicketThread = async(comment: string, comment_date: Date, related_ticket: number ): Promise<ApiResponse<{ related_ticket: { created_by_email: string } }>> => {
    const { data, error } = await supabase.from('SUPPORT_HISTORY_THREAD').insert({
      comment: comment, comment_date: comment_date, related_ticket: related_ticket
    }).select('*, related_ticket(created_by_email)').single();
    if(error) {
      return {ok:false, data: null, message: error.message};
    }
    return {ok:true, data: data as any, message: null};
  };

  export const updateSupportTicket = async(id:number, active: boolean, user_id: string, resolution: string): Promise<ApiResponse<{ subject:string, resolution:string, created_by_email:string }>> => {
    const { data, error } = await supabase.from('SUPPORT_HISTORY').update({
      active: active, closed_by: user_id, closed_on: new Date(), resolution: resolution, resolution_date: new Date()
    }).eq('id',id).select().single();
    if(error) {
      return {ok:false, data: null, message: error.message};
    }
   return {ok:true, data: data as any, message: null};
  };

  export const insertIntoAFEDocTable = async(apc_afe_id: string, apc_op_id: string, apc_partner_id: string, storage_path: string, filename: string, filename_display: string, mimetype: string, byte_size: number, checksum: string, isNonOpSignedAFE: boolean ) => {
    const { data, error } = await supabase.from('AFE_PROCESSED_FILE').insert({
      apc_afe_id: apc_afe_id, 
      apc_op_id: apc_op_id, 
      apc_partner_id: apc_partner_id, 
      storage_path: storage_path, 
      filename: filename, 
      filename_display: filename_display, 
      mimetype: mimetype, 
      byte_size: byte_size, 
      isAttachment: !isNonOpSignedAFE, 
      isForm: false, 
      isNonOpSignedAFE: isNonOpSignedAFE, 
      documentDate: new Date(),
      checksum: checksum
    }).select()
    if (error) {
          writeToFunctionLogs('insertIntoAFEDocTable', error.message, null, 'ERROR', 'Attach Doc to AFE in AFE Detail could not create reference records');
          return {ok: false};
        }
    return {ok: true};
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
//INSERT DATA
  export async function insertAFEHistory(afe_id: string, description: string, type: string, token: string) {
    
    type TogglePayload = { afe_id:string; description: string; type: string; };
    type ToggleResult  = { ok: true; data: { afe_id: number; description: string; type: string; } } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("insert_AFE_history", { afe_id, description, type }, token);
  };
  
  export async function createNewUser(email: string, password: string, token: string) {
    
    type TogglePayload = { email:string; password: string; };
    type ToggleResult  = { ok: true; data: string; } | { ok: false; message: string; };
    
    return callEdge<TogglePayload, ToggleResult>("create_New_User", { email, password }, token);
  };

  export async function createNewUserProfile(id: string, first_name: string, last_name: string, email: string, active: boolean, is_super_user: boolean, token: string, apc_op_id_umbrella: string) {
    console.log('The new user', apc_op_id_umbrella); 
    type TogglePayload = { id: string; first_name: string; last_name: string; email: string; active: boolean; is_super_user: boolean; apc_op_id_umbrella: string;};
    type ToggleResult  = { ok: true; data: any[]; } | { ok: false; message: string; };
    
    return callEdge<TogglePayload, ToggleResult>("create_New_User_Profile", { id, first_name, last_name, email, active, is_super_user, apc_op_id_umbrella }, token);
  };

  export async function createUserRolesOperator(roles: RoleEntryWrite[], token: string) {
    
    type TogglePayload = { roles: RoleEntryWrite[]; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("create_Roles_Op_Permission", { roles }, token);
  };

  export async function createUserRolesPartner(roles: RoleEntryWrite[], token: string) {
    
    type TogglePayload = { roles: RoleEntryWrite[]; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("create_Roles_Partner_Permission", { roles }, token);
  };

  export async function insertPartnerRecord(partnerRecord: OperatorPartnerRecord, token: string) {
    
    type TogglePayload = { partnerRecord: OperatorPartnerRecord; };
    type ToggleResult  = { ok: true; id: string; } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("insert_Partner_Record", { partnerRecord }, token);
  };


//UPDATE DATA
  export async function updateGLCodeMapping(id: number, active: boolean, token: string) {
    
    type TogglePayload = { id: number; active: boolean; };
    type ToggleResult  = { ok: true; data: { id: number; active: boolean } } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_GL_crosswalk_status", { id, active }, token);
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
{/* 
export async function updateOperatorNameAndStatus(operator: OperatorPartnerRecord, token: string) {
    
    type TogglePayload = { operator: OperatorPartnerRecord; };
    type ToggleResult  = { ok: true; data: { id: string; active: boolean; name: string; } } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_Operator_Name_and_Status", { operator }, token);
  };
  

export async function updateOperatorAddress(operatorAddress: OperatorPartnerRecord, token: string) {
    
    type TogglePayload = { operatorAddress: OperatorPartnerRecord; };
    type ToggleResult  = { ok: true; data: { id: string; active: boolean; } } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_Operator_Address", { operatorAddress }, token);
  };
  */}
  {/* 

export async function updatePartnerAddress(partnerAddress: OperatorPartnerRecord, token: string) {
    
    type TogglePayload = { partnerAddress: OperatorPartnerRecord; };
    type ToggleResult  = { ok: true; data: { id: string; active: boolean; } } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_Partner_Address", { partnerAddress }, token);
  };

export async function updatePartnerNameAndStatus(partnerRecord: OperatorPartnerRecord, token: string) {
    
    type TogglePayload = { partnerRecord: OperatorPartnerRecord; };
    type ToggleResult  = { ok: true; data: { id: string; active: boolean; name: string;} } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("update_Partner_Name_and_Status", { partnerRecord }, token);
  };
  */}
  