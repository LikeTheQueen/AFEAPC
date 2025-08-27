'use server'
import { transformOperator, 
  transformOperatorasPartnerAddress, 
  transformOperatorPartnerAddress, 
  transformOperatorPartnerAddressSuperUser, 
  transformRolesGeneric, 
  transformRoleEntrySupabase, 
  transformUserProfileRecordSupabase, 
  transformUserProfileSupabaseSingle, 
  transformRoleEntryPartnerSupabase,
  transformOperatorPartnerAddressWithOpName,
  transformPartnerSourceSystemAddress} from 'src/types/transform';
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

export const fetchUserFromSupabase = async (table: string, select: string, session: string) => {
    const { data, error } = await supabase.from(table).select(select).eq('id', session).maybeSingle();
    if (error || !data) {
      console.error(`Error fetching ${table}:`, error);
      return null;
    }
    return transformUserProfileSupabaseSingle(data);
  };

export const fetchUserProfileRecordFromSupabase = async(session: string) => {
  const { data, error } = await supabase.from("USER_PROFILE").select('*, OPERATOR_USER_CROSSWALK:OPERATOR_USER_PERMISSIONS!id(*,apc_id(id,name),apc_address_id(id, street, suite, city, state, zip, country)), PARTNER_USER_CROSSWALK:PARTNER_USER_PERMISSIONS!id(*,apc_id(id,name), apc_address_id(id, street, suite, city, state, zip, country)) ')
  .eq('id', session)
  .limit(1).single();

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

export const updatePartnerArchiveStatus = async (id: string, status: boolean) => {
    const { data, error } = await supabase.from('AFE_PROCESSED').update({partner_archived: status}).eq('id',id);
    if (error) {
        console.error(`Error Updating Partner AFE Archive Status`, error);
        return [];
      }
      console.log('made it here too')
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

export const fetchOperatorsForLoggedInUser = async(loggedinUserId: string, superUser: boolean, table: string, addressTable: string, defaulTable: string) => {
    if(superUser === true) {
      const { data, error } = await supabase.from(defaulTable).select(`apc_id:id,name,address:${addressTable}!apc_id(id,street, suite, city, state, zip, country)`);
      if (error || !data) {
      console.error(`Error fetching Operators and Partners:`, error);
      return [];
    }
    return transformOperatorPartnerAddressSuperUser(data);
    } else {
      const { data, error } = await supabase.from(table).select(`apc_id(id,name), address:${addressTable}!apc_address_id(id,street, suite, city, state, zip, country)`)
      .eq('user_id',loggedinUserId).in('role',[5,4]);
      if (error || !data) {
      console.error(`Error fetching Operators and Partners:`, error);
      return [];
    } 
    //console.log(data,'IN THE CALL NOT SUPER',table)
    return transformOperatorPartnerAddress(data);
    }
  };

export const fetchIsUserSuperUser = async(loggedInUserID: string | null | undefined) => {
    if(loggedInUserID === null || loggedInUserID === undefined) {
      return false;
    }
    const { data, error } = await supabase.from('USER_ROLES').select('role_id').eq('user_id',loggedInUserID).eq('role_id',1);
    if(error) {
      return false;
    } else if(data.length>0) {
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
  };

export const fetchOpUsersForEdit = async(table: string, addressTable: string, apc_id?: string[], user_id?: string ) => {
  let query = supabase.from(table)
    .select(`
      user_id(id, first_name, last_name, email, active),
      apc_id(id, name),
      address:${addressTable}!apc_address_id(id, street, suite, city, state, zip, country),
      role,
      id,
      active
    `);
  if (apc_id && apc_id.length > 0) {
    query = query.in('apc_id', apc_id);
  }
  if (user_id) {
    query = query.eq('user_id', user_id);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error(`Error fetching Operators:`, error);
    return [];
  }
console.log(data,'THE PERMISSION RETURN')
  const formattedRoles = transformRoleEntrySupabase(data);
  return formattedRoles;
  };

export const fetchPartnersLinkedOrUnlinkedToOperator = async() => {
  const { data, error } = await supabase.from("PARTNERS").select('apc_id:id,name, apc_op_id(name, id), address:PARTNER_ADDRESS!apc_id(id,street, suite, city, state, zip, country)');
      if (error || !data) {
      console.error(`Error fetching Partners:`, error);
      return [];
    }
    const dataTransformed = transformOperatorPartnerAddressWithOpName(data);
    const apcPartListSorted = dataTransformed.sort((a,b) => {
                        if (a.name === undefined && b.name === undefined) {
                            return 0;
                        }
                        if (a.name === undefined) {
                            return 1;
                        }
                        if (b.name === undefined) {
                            return -1;
                        }
                        return (a.name.localeCompare(b.name, undefined, { sensitivity: "base", numeric: true }));
                    });
    return apcPartListSorted;
};

export const fetchPartnersFromSourceSystemInSupabase = async() => {
  const { data, error } = await supabase.from("AFE_PARTNERS_PROCESSED").select('source_id, street, suite, city, state, zip, country, active, name')
  .eq('mapped',false);
  if (error || !data) {
      console.error(`Error fetching Partners:`, error);
      return [];
    }
    const dataTransformed = transformPartnerSourceSystemAddress(data);
    const sourcePartListSorted = dataTransformed.sort((a,b) => {
                        if (a.name === undefined && b.name === undefined) {
                            return 0;
                        }
                        if (a.name === undefined) {
                            return 1;
                        }
                        if (b.name === undefined) {
                            return -1;
                        }
                        return (a.name.localeCompare(b.name, undefined, { sensitivity: "base", numeric: true }));
                    });
    return sourcePartListSorted;
};

export const fetchPartnersFromPartnersCrosswalk = async() => {
  const { data, error } = await supabase.from("PARTNERS_CROSSWALK").select('apc_id:operator(name, id), source_system_id:op_partner_id, partner_id(address:PARTNER_ADDRESS!apc_id(id,street, suite, city, state, zip, country))')
  
  if (error || !data) {
      console.error(`Error fetching Partners:`, error);
      return [];
    }
    console.log(data,'THE MAPPED PARTERN')
    return data;
}

