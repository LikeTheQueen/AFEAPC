'use server'
import { transformAddressSupabase, transformOperatorSingle, transformPartnerSingle } from 'src/types/transform';
import  supabase  from './supabase';
import type { UUID } from 'crypto';
import type { GLCodeRowData, GLMappingRecord, PartnerMappingRecord, PartnerRecordToUpdate, PartnerRowData, RoleEntryWrite, RoleTypeSupabaseOperator } from 'src/types/interfaces';
import { callEdge } from 'src/edge';
import { useSupabaseData } from 'src/types/SupabaseContext';

  export const addOperatorSupabase = async (name: string, source_system:number) => {
    const { data, error } = await supabase.from('OPERATORS').insert({name: name, source_system: source_system, active:true}).select();
    if (error) {
        console.error(`Error adding Operator`, error);
        return null;
      }
      const transformedOperator = transformOperatorSingle(data[0]);
      return transformedOperator;
  };

  export const addPartnerSupabase = async (name: string, apc_op_id:string) => {
    const { data, error } = await supabase.from('PARTNERS').insert({name: name, active:true, apc_op_id:apc_op_id}).select();
    if (error) {
        console.error(`Error adding Operator as a Partner`, error);
        return null;
      }
      const transformedPartner = transformPartnerSingle(data[0]);
      return transformedPartner;
  };

  export const addOperatorAdressSupabase = async (apc_id: string, street: string, suite: string, city: string, state: string, zip: string, country: string ) => {
    const { data, error } = await supabase.from('OPERATOR_ADDRESS').insert({apc_id: apc_id, street: street, suite: suite, city: city, state: state, zip: zip, country: country }).select();
    if (error) {
        console.error(`Error adding Operator`, error);
        return null;
      }
      const trasnformedAddress = transformAddressSupabase(data);
      return trasnformedAddress[0];
  };

  export const addOperatorPartnerAddressSupabase = async (apc_id: UUID, street: string, suite: string, city: string, state: string, zip: string, country: string ) => {
    const { data, error } = await supabase.from('PARTNER_ADDRESS').insert({apc_id: apc_id, street: street, suite: suite, city: city, state: state, zip: zip, country: country }).select();
    if (error) {
        console.error(`Error adding Partner Address`, error);
        return null;
      }
      const trasnformedAddress = transformAddressSupabase(data);
      return trasnformedAddress[0];
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
      console.log(data);
      return (data);
  };

  export const deactivateUser = async(userID: string) => {
    const { data: user, error } = await supabase.rpc('deactivateUser',{user_id: userID});
    if (error) {
        console.error(`Error Deactivating User`, error);
        return null;
      }
      console.log(user);
      const { data } = await supabase.from('USER_PROFILE').update({'active': false}).eq('id',userID);
      return (user);
  };

  export const reactivateUser = async(userID: string) => {
    const { data: user, error } = await supabase.rpc('reactivateUser',{user_id: userID});
    if (error) {
        console.error(`Error Reactivating User`, error);
        return null;
      }
      const { data } = await supabase.from('USER_PROFILE').update({'active': true}).eq('id',userID);
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
    const {data, error} = await supabase.from('PARTNERS').upsert(partnerRecordID);
    if (error) {
        console.error(`Error updating Partner with Operator ID`, error);
        return null;
      }
      console.log('I made the change')
      return;
  };

  export const writePartnerlistFromSourceToDB = async(partnerRecords: PartnerRowData[]) => {
    const { data, error } = await supabase.from('AFE_PARTNERS_EXECUTE').insert(partnerRecords).select();
    if (error) {
        console.error(`Error adding the Operator's Partners`, error);
        return null;
      }
      return data;
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
      console.log('no error', data)
      return data;
  };

  export const updatePartnerMapping = async(partnerSourceID: string[], mapValue: boolean) => {
   const {data, error} = await supabase.from('PARTNERS_CROSSWALK').update({'active': mapValue}).eq('id',partnerSourceID).select();
    
    if (error) {
        console.error(`Error updating the Partner Mapping Record`, error, data);
        return null;
      }
      console.log('no error', data)
      return data;
  };

  export const writeGLAccountlistFromSourceToDB = async(accountRecords: GLCodeRowData[]) => {
    const { data, error } = await supabase.from('GL_CODES').insert(accountRecords).select();
    if (error) {
        console.error(`Error adding the Operator's GL Codes`, error);
        return null;
      }
      return data;
  };

  export const writeGLCodeMapping = async(glMappings: GLMappingRecord[]) => {
    const { data, error } = await supabase.from('GL_CODE_CROSSWALK').insert(glMappings).select();
    if (error) {
        console.error(`Error adding the GL CodeMappings`, error);
        return null;
      }
      return data;
  };

  export async function writeGLCodeMappingUpdate(id: number, active: boolean, token: string) {
    
    type TogglePayload = { id: number; active: boolean };
    type ToggleResult  = { ok: true; data: { id: number; active: boolean } } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("gl-crosswalk-set-active", { id, active }, token);
  };

  

  