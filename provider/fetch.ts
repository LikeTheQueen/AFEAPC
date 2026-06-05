
import { 
  transformRolesGeneric,  
  transformUserProfileRecordSupabase, 
  transformGLCodes,
  transformSupportHistory,
  transformParentCompany} from 'src/types/transform';
import  supabase  from './supabase';
import { callEdge } from 'src/edge';
import { supportEmail, viewNonOpAFEPermission, viewOperatedAFEPermission } from 'src/constants/variables';


export const fetchCompanyProfile = async() => {
  const { data, error } = await supabase.from('PARENT_COMPANY').select('name, OPERATINGCOMPANIES:OPERATORS!parent_company(name)')

};
export const fetchSourceSystems = async() => {
  const { data, error } = await supabase.from('SOURCE_SYSTEM').select('id, system');
  if (error) {
    return {ok: false, data: [], message: error.message};
  }
  return {ok: true, data: data, message: ''};
};

export const fetchRolesGeneric = async() => {
    const { data, error } = await supabase.from('ROLES').select('*').neq('id',1).order('id', { ascending: true });
    if (error || !data) {
      console.error(`Error fetching Roles:`, error);
      return [];
    } return transformRolesGeneric(data);
};

export const fetchUserProfileRecordFromSupabase = async(session: string) => {
  const { data, error } = await supabase.from("USER_PROFILE").select('*, OPERATOR_USER_CROSSWALK:OPERATOR_USER_PERMISSIONS!id(*,apc_id(id,name, active),apc_address_id(id, street, suite, city, state, zip, country,active)), PARTNER_USER_CROSSWALK:PARTNER_USER_PERMISSIONS!id(*,apc_id(id,name,active, apc_op_id), apc_address_id(id, street, suite, city, state, zip, country, active)),is_super_user ')
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

export const fetchEmailsForOperatorUsers = async(apc_op_id: string) => {
  const { data, error } = await supabase
      .from('OPERATOR_USER_PERMISSIONS')
      .select('user_id(email)')
      .eq('role', viewOperatedAFEPermission)
      .eq('active', true)
      .eq('apc_id', apc_op_id);

    if (error) {
      return { ok: false, message: error.message, data: [supportEmail] };
    }
    return {ok: true, data: data.map((row: any) => row.user_id.email) as string[]}
};

export const fetchEmailsForNonOperatorUsers = async(apc_partner_id: string) => {
  const { data, error } = await supabase
      .from('PARTNER_USER_PERMISSIONS')
      .select('user_id(email)')
      .eq('role', viewNonOpAFEPermission)
      .eq('active', true)
      .eq('apc_id', apc_partner_id);

    if (error) {
      return { ok: false, message: error.message, data: [supportEmail] };
    }
    return {ok: true, data: data.map((row: any) => row.user_id.email) as string[]}
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

export const fetchSupportHistory = async(user_id: string, is_super_user: boolean) => {
  if(is_super_user) {
    const { data, error } = await supabase.from('SUPPORT_HISTORY').select('*,created_by(id,first_name, last_name),SUPPORT_HISTORY_THREAD!id(*,created_by(id,first_name, last_name))').order('id', { ascending: false });
    if(error) {
    return {ok: false, data: [], message: error.message};
  }
  const transformedSupportHistory = transformSupportHistory(data);
  return {ok: true, data: transformedSupportHistory, message:null};
  }
  const { data, error } = await supabase.from('SUPPORT_HISTORY').select('*,created_by(id,first_name, last_name),SUPPORT_HISTORY_THREAD!id(*,created_by(id,first_name, last_name))').eq('created_by',user_id).order('id', { ascending: false });
  if(error) {
    return {ok: false, data: [], message: error.message};
  }
  const transformedSupportHistory = transformSupportHistory(data);
  return {ok: true, data: transformedSupportHistory, message:null};
};

export const fetchNotifications = async(minRange: number, maxRange: number, afeSpecificHistory: boolean, apc_afe_id?:string) => {
  if(afeSpecificHistory) {
  const { data, error } = await supabase
  .from('AFE_HISTORY')
  .select('*, afe_id(id,afe_number, version_string, apc_op_id(id, name), apc_partner_id(id, name), partner_status),user_id(id,first_name, last_name, email)')
  .eq('afe_id',apc_afe_id)
  .order('id', { ascending: false })
  .range(minRange,maxRange);

  if(error) {
    console.error('Unable to get AFE History');
    return [];
  }
  
  return data;

  }
  const { data, error } = await supabase
  .from('AFE_HISTORY')
  .select('*, afe_id(id,afe_number, version_string, apc_op_id(id, name), apc_partner_id(id, name), partner_status),user_id(id,first_name, last_name, email)')
  .eq('type','action')
  .order('id', { ascending: false })
  .range(minRange,maxRange);
  
    if(error) {
    console.error('Unable to get AFE History');
     return [];
  }
console.log(data);
  return data;
};

export const fetchSystemHistory = async( minRange: number, maxRange: number) => {
  const { data, error } = await supabase
  .from('SYSTEM_HISTORY')
  .select('*, apc_op_id(id,name),apc_partner_id(id,name),created_by(id,first_name, last_name, email)')
  .eq('visible', true)
  .not('created_by','is', null)
  .order('id', { ascending: false })
  .range(minRange,maxRange);
  if(error) {
    console.error('Unable to get Support History');
    return [];
  }
  
  return data
};
export const fetchSystemHistoryCount = async () => {
  const { count, error } = await supabase
    .from('SYSTEM_HISTORY')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Unable to get System History count', error);
    return 0;
  }

  return count ?? 0;
};
export const fetchAFEHistoryCount = async (afe_id: string) => {
  const { count, error } = await supabase
    .from('AFE_HISTORY')
    .select('*', { count: 'exact', head: true })
    .eq('afe_id',afe_id);

  if (error) {
    console.error('Unable to get AFE History count', error);
    return 0;
  }
  return count ?? 0;
};
export const fetchAFENotificationCount = async () => {
  const { count, error } = await supabase
    .from('AFE_HISTORY')
    .select('*', { count: 'exact', head: true })
    .eq('type','action');

  if (error) {
    console.error('Unable to get AFE History count', error);
    return 0;
  }
  return count ?? 0;
};
export const fetchClaimProofPrompt = async(apc_op_id: string) => {
    const { data, error } = await supabase.rpc('afeapc_get_claim_proof_record_for_verification',{v_apc_op_id: apc_op_id});
    if (error) {
        return {ok: false, data: null, message: error.message+error.hint};
      }
    if (!data || data.length === 0 || data[0].id == null) {
        return {ok: false, data: null, message: 'No recods to verify against'};
      }
      return {ok: true, data: data, message: undefined};
};

//Edge Functions
export async function fetchNonOpList( token: string) {
    type TogglePayload = {};
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };

    return callEdge<TogglePayload, ToggleResult>("fetch_linked_unlinked_partners", {}, token);
};

export async function fetchOpList( token: string) {
    type TogglePayload = {};
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };

    return callEdge<TogglePayload, ToggleResult>("fetch_operator_list", {}, token);
};

export async function fetchParentCompanyList( token: string) {
    type TogglePayload = {};
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };

    return callEdge<TogglePayload, ToggleResult>("fetch_parent_company_list", {}, token);
};

export async function fetchPartnerList( token: string) {
    type TogglePayload = {};
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };

    return callEdge<TogglePayload, ToggleResult>("fetch_partner_list", {}, token);
};

export async function fetchMappedGLAccountCode(apc_op_id: string, apc_part_id:string, token: string) {
    
    type TogglePayload = { apc_op_id: string; apc_part_id:string };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("fetch_mapped_gl_codes", { apc_op_id, apc_part_id }, token);
    
};

export async function fetchSourceSystemPartners(apc_op_id: string, token: string) {
    
    type TogglePayload = { apc_op_id: string; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("fetch_source_system_partners", { apc_op_id }, token);
    
};

export async function fetchMappedPartners(apc_op_id: string, token: string) {
    
    type TogglePayload = { apc_op_id: string; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("fetch_mapped_partners", { apc_op_id }, token);
    
};

export async function fetchAFEDetails(afeID: string, token: string, signal?: AbortSignal) {
    
    type TogglePayload = { afeID: string; };
    type ToggleResult  = { ok: true; data: any } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_AFE_base_details", { afeID }, token, signal);
    
  };

export async function fetchAFEHistory(afeID: string, token: string, signal?: AbortSignal) {
    
    type TogglePayload = { afeID: string; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_AFE_history", { afeID }, token, signal);
    
  };

export async function fetchAFEEstimates(afeID: string, partnerID: string, apc_op_id: string, token: string) {
    
    type TogglePayload = { afeID: string; partnerID: string; apc_op_id:string; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_AFE_estimates", { afeID, partnerID, apc_op_id }, token);
    
  };

export async function fetchAFEs(token: string, signal?: AbortSignal) {
    
    type TogglePayload = { };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_AFEs", { }, token, signal);
    
  };

export async function fetchRelatedDocuments(url: string, token: string) {
    type RelatedDoc = { uri: string; fileName?: string };
    type TogglePayload = { url: string; };
    type ToggleResult  = { ok: true; data: RelatedDoc[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_related_documents", {url}, token);
    
  };

export async function fetchAFEDocs(afeID: string, apc_op_id:string, apc_partner_id:string, token: string) {
    
    type TogglePayload = { afeID: string; apc_op_id:string; apc_partner_id:string; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_AFE_Docs", { afeID, apc_op_id, apc_partner_id }, token);
    
  };

  export async function fetchAFESignedNonOp(afeID: string, apc_op_id:string, apc_partner_id:string, token: string) {
    
    type TogglePayload = { afeID: string; apc_op_id:string; apc_partner_id:string; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_AFE_Signed_Non_Op", { afeID, apc_op_id, apc_partner_id }, token);
    
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

export async function fetchOperatorsOrPartnersToEdit(loggedinUserId: string, table: string, addressTable: string, roles: number[], token: string, signal?: AbortSignal) {
    
    type TogglePayload = { loggedinUserId: string; table: string; addressTable: string; roles: number[]; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_Operators_And_Partners", { loggedinUserId, table, addressTable, roles }, token, signal);
  };

export async function verifyClaimProof(afe_doc_id: string, partner_doc_id: string, id: number, token: string) {
    
    type TogglePayload = { afe_doc_id: string; partner_doc_id: string; id: number; };
    type ToggleResult  = { ok: true; data: any } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("verify_secret", { afe_doc_id, partner_doc_id, id }, token);
  };

export async function testExecuteConnection(apc_op_id: string, triggered_by: string) {
    
  const { data, error } = await supabase.functions.invoke('execute_test_connection', {
    body: { apc_op_id: apc_op_id, triggered_by: triggered_by},
  })
  
  if(!data || error) {
    return {ok: false, message: error}
  }
  return {ok: true, message: 'Success'}
  };

export async function testExecuteNewConnection(apc_op_id: string, apc_op_name: string, baseURL: string, docId: string, key: string) {
    
  const { data, error } = await supabase.functions.invoke('execute_test_new_connection', {
    body: { apc_op_id: apc_op_id,
            apc_op_name: apc_op_name,
            baseURL: baseURL,
            docId: docId,
            key: key
           },
  })
  
  if(!data || error) {
    return {ok: false, message: error}
  }
  return {ok: true, message: 'Success'}
  };

export async function fetchAFEExecuteFilters(apc_op_id: string, token: string) {
    
    type TogglePayload = { apc_op_id: string; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
    
    return callEdge<TogglePayload, ToggleResult>("fetch_afe_execute_filters", { apc_op_id }, token);
  };

export async function fetchAccountCodes(apc_op_id:string, apc_partner_id:string, token: string) {
    
    type TogglePayload = { apc_op_id:string; apc_partner_id:string; };
    type ToggleResult  = { ok: true; data: any[] } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_account_codes", { apc_op_id, apc_partner_id }, token);
    
  };



