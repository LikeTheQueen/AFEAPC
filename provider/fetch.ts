
import { transformRolesGeneric} from 'src/types/transform';
import  supabase  from './supabase';
import { callEdge } from 'src/edge';


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

export async function fetchClaimProof(apc_op_id: string, token: string) {
    console.log()
    type TogglePayload = { apc_op_id: string; };
    type ToggleResult  = { ok: true; data: any } | { ok: false; message: string };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_claim_proof", { apc_op_id }, token);
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

export async function fetchEmailsOperator(apc_id: string, token: string) {
    
    type TogglePayload = { apc_id:string; };
    type ToggleResult  = { ok: true; message: string; data: any[]; } | { ok: false; message: string; data: any[]; };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_emails_operator_users", { apc_id }, token);
    
  };

export async function fetchEmailsNonOperator(apc_id: string, token: string) {
    
    type TogglePayload = { apc_id:string; };
    type ToggleResult  = { ok: true; message: string; data: any[]; } | { ok: false; message: string; data: any[]; };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_emails_nonoperator_users", { apc_id }, token);
    
  };

export async function fetchUserProfile(session: string, token: string) {
    
    type TogglePayload = { session:string; };
    type ToggleResult  = { ok: true; data: any; } | { ok: false; message: string; };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_user_profile", { session }, token);
    
  };

export async function fetchUnmappedGLCodes(apc_op_id: string, apc_part_id:string, getOpCodes: boolean, getPartnerCodes: boolean, token: string) {
    
    type TogglePayload = { apc_op_id: string; apc_part_id:string; getOpCodes: boolean; getPartnerCodes: boolean; };
    type ToggleResult  = { ok: true; data: any[]; } | { ok: false; message: string; };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_unmapped_gl_codes", { apc_op_id, apc_part_id, getOpCodes, getPartnerCodes }, token);
    
  };

export async function fetchSupportHistories(user_id: string, is_super_user: boolean, token: string) {
    
    type TogglePayload = { user_id: string; is_super_user: boolean; };
    type ToggleResult  = { ok: true; data: any[]; } | { ok: false; message: string; };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_support_history", { user_id, is_super_user }, token);
    
  };

export async function fetchAFENotifications(minRange: number, maxRange: number, afeSpecificHistory: boolean, apc_afe_id: string, token: string) {
    
    type TogglePayload = { minRange: number; maxRange: number; afeSpecificHistory: boolean; apc_afe_id:string; };
    type ToggleResult  = { ok: true; data: any[]; count: number; } | { ok: false; message: string; };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_afe_notifications", { minRange, maxRange, afeSpecificHistory, apc_afe_id }, token); 
    
  };

export async function fetchSystemHistories(minRange: number, maxRange: number, token: string) {
    
    type TogglePayload = { minRange: number; maxRange: number; };
    type ToggleResult  = { ok: true; data: any[]; count: number; } | { ok: false; message: string; };
   
    return callEdge<TogglePayload, ToggleResult>("fetch_system_history", { minRange, maxRange }, token); 
    
  };
