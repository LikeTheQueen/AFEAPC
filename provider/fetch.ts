import { transformOperator, transformRolesGeneric, transformUserProfileRecordSupabase, transformUserProfileSupabaseSingle } from 'src/types/transform';
import  supabase  from './supabase';
import type { UUID } from 'crypto';


export const fetchFromSupabase = async (table: string, select: string) => {
    const { data, error } = await supabase.from(table).select(select);
    if (error || !data) {
      console.error(`Error fetching ${table}:`, error);
      return [];
    }
    return data;
  };

export const fetchUserFromSupabase = async (table: string, select: string) => {
    const { data, error } = await supabase.from(table).select(select).maybeSingle();
    if (error || !data) {
      console.error(`Error fetching ${table}:`, error);
      return null;
    }
    return transformUserProfileSupabaseSingle(data);
  };
export const fetchUserProfileRecordFromSupabase = async() => {
  const { data, error } = await supabase.from("USER_PROFILE").select('*,OPERATOR_USER_CROSSWALK(apc_op_id(id,name), role),PARTNER_USER_CROSSWALK(apc_partner_id(id,partner_name), role)').limit(1).single();
  if (error || !data) {
      console.error(`Error fetching user:`, error);
      return null;
    }
    return transformUserProfileRecordSupabase(data);
};
  export const fetchUserOperatorListFromSupabase = async (equal: UUID) => {
    const { data, error } = await supabase.from("OPERATOR_USER_CROSSWALK").select('apc_op_id(id,name)').eq('user_id',equal).eq('role_id',[2,4]);
    if (error || !data) {
      console.error(`Error fetching Operators:`, error);
      return [];
    }
    return transformOperator(data);
  };

  export const updateAFEPartnerStatusSupabase = async (id:string, status:string) => {
    const now = new Date();
    const timestamp = now.toISOString();
    let statusDate;
    if(status === 'Approved' || status === 'Rejected'){
      statusDate = timestamp;
    } else {
      statusDate = null;
    }
    const { data, error } = await supabase.from('AFE_PROCESSED').update({partner_status: status, partner_status_date: statusDate}).eq('id',id);
    if (error) {
        console.error(`Error Updating AFE Status`, error);
        return [];
      }
  return 'success';
  };

  export const addAFEHistorySupabase = async (afe_id:string, description:string, type: string) => {
    const { error } = await supabase.from('AFE_HISTORY').insert({afe_id: afe_id, description: description, type:type});
    if (error) {
        console.error(`Error Updating AFE History`, error);
        return [];
      }
      return 'success'
  };

  export const fetchFromSupabaseMatchOnString = async (table: string, select: string, col:string, equal:string) => {
    const { data, error } = await supabase.from(table).select(select).eq(col,equal);
    if (error) {
      console.error(`Error fetching ${table}:`, error);
      return [];
    }
    return data;
  };

  export const fetchEstimatesFromSupabaseMatchOnAFEandPartner = async (afeID: string, partnerID: string) => {
    const { data, error } = await supabase.from('AFE_ESTIMATES_PROCESSED')
    .select('id, amount_gross,partner_wi,partner_net_amount, operator_account_number,operator_account_group,operator_account_description,partner_account_number,partner_account_description,partner_account_group')
    .eq('source_system_id', afeID)
    .eq('apc_partner_id', partnerID);
    if (error) {
      console.error(`Error fetching ${afeID}:`, error);
      return [];
    }
    return data;
  };

  export const fetchOperatorsForLoggedInUser = async(loggedinUserId: string, superUser: boolean) => {
    if(superUser === true) {
      const { data, error } = await supabase.from("OPERATORS").select('id,name');
      if (error || !data) {
      console.error(`Error fetching Operators:`, error);
      return [];
    }
    return transformOperator(data);
    } else {
      const { data, error } = await supabase.from("OPERATOR_USER_CROSSWALK").select('apc_op_id(id,name)').eq('user_id',loggedinUserId).in('role',[2,4]);
      if (error || !data) {
      console.error(`Error fetching Operators:`, error);
      return [];
    } 
      return transformOperator(data);
    }
  };
  
  export const fetchIsUserSuperUser = async(loggedInUserID: string | null | undefined) => {
    if(loggedInUserID === null || loggedInUserID === undefined) {
      return false;
    }
    const { data, error } = await supabase.from('USER_ROLES').select('role_id').eq('user_id',loggedInUserID).eq('role_id',1);
    if(error) {
      return false;
    } else if(data) {
      return true;
    } else {
      return false;
    }
  };

  export const fetchRolesGeneric = async() => {
    const { data, error } = await supabase.from('ROLES').select('*').neq('id',1).order('id', { ascending: true });
    if (error || !data) {
      console.error(`Error fetching Operators:`, error);
      return [];
    } return transformRolesGeneric(data);
  }