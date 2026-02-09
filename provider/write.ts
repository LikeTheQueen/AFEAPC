import  supabase  from './supabase';
import type { AddressType, GLCodeRowData, GLMappingRecord, OperatorPartnerRecord, OperatorType, PartnerMappingRecord, PartnerRecordToUpdate, PartnerRowData, RoleEntryWrite, RoleTypeSupabaseOperator } from 'src/types/interfaces';
import { callEdge } from 'src/edge';
import { notifyStandard } from 'src/helpers/helpers';
import type { UUID } from 'crypto';

  export const writeToFunctionLogs = async (function_name: string, message: string, details: JSON | null, level: string, triggered_from: string) => {
    
    const { data, error } = await supabase.from('FUNCTION_LOGS').insert({
      function_name: function_name,
      message: message,
      details: details,
      level: level,
      triggered_from: triggered_from
    });
    if (error) {
        console.error(`Error adding Operator`, error);
        return null;
      }
    return;
  }
  export const addOperatorSupabase = async (name: string, source_system:number) => {
    const { data, error } = await supabase.from('OPERATORS')
    .insert({name: name, source_system: source_system, active:true})
    .select()
    .single();
    if (error) {
        return {ok: false, data: null, message: error.message};
      }

      return {ok: true, data: data, message: undefined};
  };

  export const addPartnerSupabase = async (name: string, apc_op_id:string) => {
    const { data, error } = await supabase.from('PARTNERS')
    .insert({name: name, active:true, apc_op_id:apc_op_id})
    .select()
    .single();
    if (error) {
        return {ok: false, data: null, message: error.message};
      }
      return {ok: true, data: data, message: undefined};
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

  export const createUserProfile = async(firstName: string, lastName: string, email: string, id:string, active: boolean) => {
    const { data, error } = await supabase.from('USER_PROFILE').insert({id: id, first_name: firstName, last_name:lastName, email: email, active:active});
    if (error) {
        console.error(`Error adding User Profile`, error);
        return null;
      }
      return;
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
      
      return notifyStandard(`Partner address updatedaasasas. Fresh coordinates locked in and the route’s clear. No leaks detected.\n\n(TLDR: Partner Addresses ARE saved)`);;
  };

  export const writePartnerlistFromSourceToDB = async(partnerRecords: PartnerRowData[]) => {
    const { data, error } = await supabase.from('AFE_PARTNERS_EXECUTE').insert(partnerRecords).select();
    if (error) {
        console.error(`Error adding the Operator's Partners`, error, data);
        writeToFunctionLogs('writePartnerlistFromSourceToDB', error.message, null, 'ERROR', 'Upload Partners')
        return notifyStandard(`There was an error adding your partner list.\n\n(TLDR: ${error.message})`);
      }
      return notifyStandard(`Changes tucked in safely.  Now they need to be mapped.\n\n(TLDR: Partners ARE saved)`);
  };

  export const writePartnerMappingsToDB = async(partnerRecords: PartnerMappingRecord[]) => {
    const { data, error } = await supabase.from('PARTNERS_CROSSWALK').insert(partnerRecords).select();
    if (error) {
        console.error(`Error adding the Operator's Partner Maps`, error, data);
        return null;
      }
      return data;
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
   const {data, error} = await supabase.from('AFE_PARTNERS_PROCESSED').update({'mapped': mapValue}).eq('id',id).select();
    
    if (error) {
        console.error(`Error updating the Partners Processed Table`, error, data);
        return null;
      }
      return data;
  };

  export const updatePartnerProcessedStatus = async(id: number, status: boolean) => {
   const {data, error} = await supabase.from('AFE_PARTNERS_PROCESSED').update({'active': status}).eq('id',id);
    
    if (error) {
        console.error(`Error updating the Partners Processed Table`, error, data);
        return notifyStandard(`Well shut-in, no data flowed to the database\n\n(TLDR: ERROR saving the partner changes: ${error.message})`);
      }
      return notifyStandard(`Partner changes saved. Link established and the system didn’t even hiccup.\n\n(TLDR: Partner changes ARE saved)`);
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
    const { data, error } = await supabase.from('GL_CODES').insert(accountRecords).select();
    if (error) {
        console.error(`Error adding the Operator's GL Codes`, error);
        return notifyStandard(`Well shut-in, no data flowed to the database\n\n(TLDR: ERROR saving the account codes: ${error.message})`);
      }
      return notifyStandard(`Changes tucked in safely.  Now they need to be mapped.\n\n(TLDR: GL Account Codes ARE saved)`);
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

  export const createSupportTicket = async(subject: string, message: string ) => {
    const { data, error } = await supabase.from('SUPPORT_HISTORY').insert({
      subject: subject, message: message
    }).select()
    if(error) {
      return notifyStandard('There was an issue');
    }
    return data;
  };

  export const createSupportTicketThread = async(comment: string, comment_date: Date, related_ticket: number ) => {
    const { data, error } = await supabase.from('SUPPORT_HISTORY_THREAD').insert({
      comment: comment, comment_date: comment_date, related_ticket: related_ticket
    }).select()
    if(error) {
      return notifyStandard('There was an issue');
    }
    return data;
  };

  export const updateSupportTicket = async(id:number, active: boolean, user_id: string, resolution: string) => {
    const { data, error } = await supabase.from('SUPPORT_HISTORY').update({
      active: active, closed_by: user_id, closed_on: new Date(), resolution: resolution, resolution_date: new Date()
    }).eq('id',id)
    if(error) {
      return notifyStandard('There was an issue with closing the Support Ticket');
    }
    return notifyStandard('The Support Ticket has been closed');
  };

  export const insertIntoAFEDocTableNonOpAgreement = async(apc_afe_id: string, apc_op_id: string, apc_partner_id: string, storage_path: string, filename: string, filename_display: string, mimetype: string, byte_size: number, checksum: string, isNonOpSignedAFE: boolean ) => {
    const { data, error } = await supabase.from('AFE_PROCESSED_FILE').insert({
      apc_afe_id: apc_afe_id, 
      apc_op_id: apc_op_id, 
      apc_partner_id: apc_partner_id, 
      storage_path: storage_path, 
      filename: filename, 
      filename_display: filename_display, 
      mimetype: mimetype, 
      byte_size: byte_size, 
      isAttachment: false, 
      isForm: !isNonOpSignedAFE, 
      isNonOpSignedAFE: isNonOpSignedAFE, 
      documentDate: new Date(),
      checksum: checksum
    }).select()
    if(error) {
      return notifyStandard('There was an issue');
    }
    return data;
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

  export async function createNewUserProfile(id: string, first_name: string, last_name: string, email: string, active: boolean, is_super_user: boolean, token: string) {
    
    type TogglePayload = { id: string; first_name: string; last_name: string; email: string; active: boolean; is_super_user: boolean; };
    type ToggleResult  = { ok: true; data: any[]; } | { ok: false; message: string; };
    
    return callEdge<TogglePayload, ToggleResult>("create_New_User_Profile", { id, first_name, last_name, email, active, is_super_user }, token);
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
  