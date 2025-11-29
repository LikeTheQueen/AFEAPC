
import { transformOperator, 
  transformOperatorasPartnerAddress, 
  transformOperatorPartnerAddress, 
  transformOperatorPartnerAddressSuperUser, 
  transformRolesGeneric, 
  transformRoleEntrySupabase, 
  transformUserProfileRecordSupabase, 
  transformUserProfileSupabaseSingle, 
  transformRoleEntryPartnerSupabase,
  transformPartnerMapRecordForDisplay,
  transformOperatorPartnerAddressWithOpName,
  transformPartnerSourceSystemAddress,
  transformOperatorForDropDown,
  transformGLCodes,
  transformGLCodeCrosswalk,
  transformSupportHistory} from 'src/types/transform';
import  supabase  from './supabase';
import type { OperatorOrPartnerList } from 'src/types/interfaces';
import { callEdge } from 'src/edge';



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
  const { data, error } = await supabase.from("USER_PROFILE").select('*, OPERATOR_USER_CROSSWALK:OPERATOR_USER_PERMISSIONS!id(*,apc_id(id,name),apc_address_id(id, street, suite, city, state, zip, country)), PARTNER_USER_CROSSWALK:PARTNER_USER_PERMISSIONS!id(*,apc_id(id,name), apc_address_id(id, street, suite, city, state, zip, country)),is_super_user ')
  .eq('id', session)
  .eq('PARTNER_USER_PERMISSIONS.active', true)
  .eq('OPERATOR_USER_PERMISSIONS.active', true)
  .limit(1).single();

  if (error || !data) {
      console.error(`Error fetching user profile:`, error);
      return null;
    }
    return transformUserProfileRecordSupabase(data);
  };
/*Delete NOT Used
export const fetchUserOperatorListFromSupabase = async (equal: UUID) => {
    const { data, error } = await supabase.from("OPERATOR_USER_CROSSWALK").select('apc_op_id(id,name)').eq('user_id',equal).eq('role_id',[2,4]);
    if (error || !data) {
      console.error(`Error fetching Operators:`, error);
      return [];
    }
    return transformOperator(data);
  };
  */
/* Delete After Tests
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
*/
/* Delete (no tests exist)
export const updatePartnerArchiveStatus = async (id: string, status: boolean) => {
    const { data, error } = await supabase.from('AFE_PROCESSED').update({partner_archived: status}).eq('id',id);
    if (error) {
        console.error(`Error Updating Partner AFE Archive Status`, error);
        return [];
      }
      
  return 'success';
  };
*/
/* Delete After Tests
  export const addAFEHistorySupabase = async (afe_id:string, description:string, type: string) => {
    const { error } = await supabase.from('AFE_HISTORY').insert({afe_id: afe_id, description: description, type:type});
    if (error) {
        console.error(`Error Updating AFE History`, error);
        return [];
      }
      return 'success'
  };
*/
export const fetchFromSupabaseMatchOnString = async (table: string, select: string, col:string, equal:string) => {
    const { data, error } = await supabase.from(table).select(select).eq(col,equal);
    if (error) {
      console.error(`Error fetching ${table}:`, error);
      return [];
    }
    return data;
  };
/*Delete After Test
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
  */
/*
DELETE
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
*/
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
    
    return [];
  }

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

 export const fetchPartnersFromSourceSystemInSupabase = async(apc_op_id:string) => {
  if(apc_op_id==='') return;
  const { data, error } = await supabase.from("AFE_PARTNERS_PROCESSED").select('id, source_id, street, suite, city, state, zip, country, active, name')
  .eq('apc_op_id',apc_op_id);
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

 export const fetchPartnersFromPartnersCrosswalk = async(apc_op_id: string) => {
  const { data, error } = await supabase.from("PARTNERS_CROSSWALK").select('id,apc_partner:partner_id(name,apc_id:id, address:PARTNER_ADDRESS!apc_id(id,street, suite, city, state, zip, country)), source_partner:AFE_PARTNERS_PROCESSED!mapped_partners_fk_partner_library(apc_op_id,source_id,name,street, suite, city, state, zip, country)')
  .eq('operator',apc_op_id)
  .eq('active', true);
  
  if (error || !data) {
      console.error(`Error fetching Partners from Crosswalk:`, error);
      return [];
    }
    const mappedData = transformPartnerMapRecordForDisplay(data);
    return mappedData;
};

 export const fetchAllOperators = async() => {
  const emptyArray: OperatorOrPartnerList[] = []
  const { data, error } = await supabase.from('OPERATOR_ADDRESS').select(`*,apc_id(id,name)`)
      if (error || !data) {
      console.error(`Error fetching Operators and Partners:`, error);
      return emptyArray;
      }
    const dataFormatted: OperatorOrPartnerList[] = transformOperatorForDropDown(data);
    const operatorListSorted = dataFormatted.sort((a,b) => {
      if (a.apc_name === undefined && b.apc_name === undefined) {
        return 0;
      }
      if (a.apc_name === undefined) {
        return 1;
      }
      if (b.apc_name === undefined) {
        return -1;
      }
      return (a.apc_name.localeCompare(b.apc_name, undefined, { sensitivity: "base", numeric: true }));
    });
    return operatorListSorted; 
};

 export const fetchAllPartners = async() => {
  const emptyArray: OperatorOrPartnerList[] = []
  const { data, error } = await supabase.from('PARTNER_ADDRESS').select(`apc_id(id,name)`)
      if (error || !data) {
      console.error(`Error fetching Operators and Partners:`, error);
      return emptyArray;
      }
    const dataFormatted: OperatorOrPartnerList[] = transformOperatorForDropDown(data);
    const partnerListSorted = dataFormatted.sort((a,b) => {
      if (a.apc_name === undefined && b.apc_name === undefined) {
        return 0;
      }
      if (a.apc_name === undefined) {
        return 1;
      }
      if (b.apc_name === undefined) {
        return -1;
      }
      return (a.apc_name.localeCompare(b.apc_name, undefined, { sensitivity: "base", numeric: true }));
    });
    return partnerListSorted; 
};

export const fetchAccountCodesForOperatorOrPartner = async(apc_op_id: string, apc_part_id:string) => {
  if(apc_op_id !==''){
  const { data, error } = await supabase.from('GL_CODES_PROCESSED').select(`id,account_number, account_group, account_description, active`)
  .eq('apc_op_id',apc_op_id);
      if (error || !data) {
      console.error(`Error fetching GL Codes:`, error);
      return [];
      } 
      
      return transformGLCodes(data);
    } else if(apc_part_id !==''){
      const { data, error } = await supabase.from('GL_CODES_PROCESSED').select(`id,account_number, account_group, account_description, active`)
  .eq('apc_part_id',apc_part_id);
      if (error || !data) {
      console.error(`Error fetching GL Codes:`, error);
      return [];
      } 
      console.log('the data', data)
      return transformGLCodes(data);

    }
};

export const fetchAccountCodesforOperatorToMap = async(apc_op_id: string, apc_part_id:string, getOpCodes: boolean, getPartnerCodes: boolean) => {
  if(apc_op_id !=='' && apc_part_id !=='') {
    if(getOpCodes) {
    const { data, error } = await supabase.rpc('retrieve_unmapped_gl_codes_operators', {
    opapcid: apc_op_id, 
    partnerapcid: apc_part_id
  });
  if (error || !data) {
      console.error(`Error fetching GL Codes:`, error);
      return [];
      } 
      return transformGLCodes(data);

    } if(getPartnerCodes) {
      const { data, error } = await supabase.rpc('retrieve_unmapped_gl_codes_partners', {
    opapcid: apc_op_id, 
    partnerapcid: apc_part_id
  });
  if (error || !data) {
      console.error(`Error fetching GL Codes:`, error);
      return [];
      } 
      return transformGLCodes(data);

    }
  }
};

export const fetchMappedGLAccountCodes = async(apc_op_id: string, apc_part_id:string) => {
  if(apc_op_id !=='' && apc_part_id !=='') {
    const { data, error } = await supabase.from('GL_CODE_CROSSWALK').select('*').eq('apc_operator_id',apc_op_id).eq('apc_partner_id',apc_part_id).eq('active', true);
  if (error || !data) {
      console.error(`Error fetching GL Codes:`, error);
      return [];
      } 
      return transformGLCodeCrosswalk(data);
  } return [];
};

export const fetchSupportHistory = async(user_id: string) => {
  const { data, error } = await supabase.from('SUPPORT_HISTORY').select('*,created_by(id,first_name, last_name),SUPPORT_HISTORY_THREAD!id(*,created_by(id,first_name, last_name))').eq('created_by',user_id);
  if(error) {
    console.error('Unable to get Support History');
    return [];
  }
  console.log(data);
  const transformedSupportHistory = transformSupportHistory(data);
  console.log(transformedSupportHistory);
  return transformedSupportHistory;
}
//Edge Functions
export async function fetchMappedGLAccountCode(apc_op_id: string, apc_part_id:string, token: string) {
    
    type TogglePayload = { apc_op_id: string; apc_part_id:string };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("fetch_mapped_gl_codes", { apc_op_id, apc_part_id }, token);
    
  };

export async function fetchAFEDetails(afeID: string, token: string) {
    
    type TogglePayload = { afeID: string; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_AFE_base_details", { afeID }, token);
    
  };

export async function fetchAFEHistory(afeID: string, token: string) {
    
    type TogglePayload = { afeID: string; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_AFE_history", { afeID }, token);
    
  };

export async function fetchAFEEstimates(afeID: string, partnerID: string, apc_op_id: string, token: string) {
    
    type TogglePayload = { afeID: string; partnerID: string; apc_op_id:string; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_AFE_estimates", { afeID, partnerID, apc_op_id }, token);
    
  };

export async function fetchAFEs(token: string) {
    
    type TogglePayload = { };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_AFEs", { }, token);
    
  };

export async function fetchRelatedDocuments(url: string, token: string) {
    type RelatedDoc = { uri: string; fileName?: string };
    type TogglePayload = { url: string; };
    type ToggleResult  = { ok: true; data: RelatedDoc[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_related_documents", {url }, token);
    
  };

export async function fetchAFEDocs(afeID: string, apc_op_id:string, apc_partner_id:string, token: string) {
    
    type TogglePayload = { afeID: string; apc_op_id:string; apc_partner_id:string; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_AFE_Docs", { afeID, apc_op_id, apc_partner_id }, token);
    
  };

export async function fetchAFEAttachments(afeID: string, apc_op_id:string, token: string) {
    
    type TogglePayload = { afeID: string; apc_op_id:string; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_AFE_attachments", { afeID, apc_op_id }, token);
  };

export async function fetchListOfOperatorsOrPartnersForUser(loggedinUserId: string, table: string, addressTable: string, roles: number[], token: string) {
    
    type TogglePayload = { loggedinUserId: string; table: string; addressTable: string; roles: number[]; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_List_Operators_Or_Partners", { loggedinUserId, table, addressTable, roles }, token);
  };

export async function fetchUsersForOperator(is_super_user: boolean, readOnly: boolean, token: string) {
    
    type TogglePayload = { is_super_user: boolean; readOnly: boolean;};
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_users_for_operator", { is_super_user, readOnly }, token);
  };

export async function fetchUserPermissions(is_super_user: boolean, token: string) {
    
    type TogglePayload = { is_super_user: boolean; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_user_permissions", { is_super_user }, token);
  };

export async function fetchAFEWells(source_system_id: string, apc_op_id:string, token: string) {
    
    type TogglePayload = { source_system_id: string; apc_op_id:string; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_AFE_wells", { source_system_id, apc_op_id }, token);
  };

export async function fetchOperatorsOrPartnersToEdit(loggedinUserId: string, table: string, addressTable: string, roles: number[], token: string) {
    
    type TogglePayload = { loggedinUserId: string; table: string; addressTable: string; roles: number[]; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_Operators_And_Partners", { loggedinUserId, table, addressTable, roles }, token);
  };

export async function testExecuteConnection(apc_op_id: string) {
    
  const { data, error } = await supabase.functions.invoke('execute_test_connection', {
    body: { apc_op_id: apc_op_id},
  })
  
  if(!data || error) {
    return {ok: false, message: error}
  }
  return {ok: true, message: 'Success'}
  };


//transformOperatorPartnerAddress(data)
