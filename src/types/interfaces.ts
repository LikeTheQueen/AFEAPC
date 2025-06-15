import type { UUID } from "crypto";

//Interface for AFEs pulled from the database
export interface AFEType {
    id: UUID;
    operator: string;
    created_at: Date;
    afe_type: string;
    afe_number: string;
    description: string;
    total_gross_estimate: number;
    version_string: string;
    supp_gross_estimate: number;
    operator_wi: number;
    partnerID: string;
    partner_name: string;
    partner_wi: number;
    partner_status: string;
    op_status: string;
    iapp_date: string;
    last_mod_date: string;
    legacy_chainID: number;
    legacy_afeid: number;
    chain_version: number;
    source_system_id: string;
    sortID: number;
    partner_status_date: Date;
    apc_operator_id: string;
    archived: boolean;
  }

//Interface for AFE IDs pulled from Execute
  export interface ExecuteAFEDocIDType {
    docID: string;
    docHandle: string;
  }

//Interface for AFE data pulled from Execute
  export interface ExecuteAFEDataType {
    docID: string;
    afe_type: string;
    afe_number: string;
    operator: string;
    description: string;
    total_gross_estimate: number;
    version_string: string;
    supp_gross_estimate: number;
    operator_wi: number;
    partnerID: string;
    partner_name: string;
    partner_wi: number;
    partner_status: string;
    op_status: string;
    iapp_date: Date;
    last_mod_date: Date;
    legacy_chainID: number;
    legacy_afeid: number;
    chain_version: number;


  }
//Interface for Operators pulled from the database
  export interface OperatorType {
    id?: UUID;
    created_at?: Date;
    name: string;
    base_url?: string;
    key?: string;
    docID?: string;
    source_system?: number;
    active?: boolean;
  }

//Interface for Partners pulled from the database
  export interface PartnerType {
    id?: UUID;
    created_at?: Date;
    name: string;
    active?: boolean;
  }

//Interface for Estimates pulled from Execute
  export interface ExecuteAFEEstimatesType {
    afe: string;
    account_number: string;
    account_description: string;
    account_group: string;
    amount_gross: number;
    chainID: number;
  }

//Interface for User Profiles pulled from Supabase
  export interface UserProfileSupabaseType {
    firstName: string;
    lastName: string;
    opCompany: string;
    email: string;
    partnerCompany: string;
    apc_operator_id: string;
    apc_partner_id: string;
    user_id: UUID;
  }
//Interface for Role Operator Entry pulled from Supavase via User Profile
  export interface APCIDwithRole{
    id: string;
    name: string;
  }
  export interface RoleEntry{
    role: number;
    apc_id: string;
    apc_name: string;
  }
//Interface for User Profiles pulled from Supabase
  export interface UserProfileRecordSupabaseType {
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
    operatorRoles: RoleEntry[];
    partnerRoles: RoleEntry[];
    operators: string[];
    partners: string[];
    user_id?: UUID | null;
  }

//Interface for User Roles pulled from Supabase
  export interface UserRolesSupabaseType {
    name: string;
    description: string;
    title: string;
  }

//Interface for AFE Estimates pulled from Supabase
  export interface EstimatesSupabaseType {
    id: number;
    amount_gross: number;
    partner_wi: number;
    partner_net_amount: number;
    operator_account_number: string;
    operator_account_description: string;
    operator_account_group: string;
    partner_account_number: string;
    partner_account_description: string;
    partner_account_group: string;
  }

//Interface for AFE History pulled from Supabase
  export interface AFEHistorySupabaseType {
    id: number;
    afe_id: string;
    created_at: Date;
    user: string;
    description: string;
    type: string;
  }

//Interface for Source System List pulled from Supabase
  export interface AFESourceSystemType {
    id: number;
    system: string;
  }

//Interface for Addresses pulled from Supabse
  export interface AddressType {
    id: number;
    street: string | undefined;
    suite: string | undefined;
    city: string | undefined;
    state: string | undefined;
    zip: string | undefined;
    country: string | undefined;
  }

//Interface for Roles and names pulled from Supabase
  export interface RoleTypesGeneric {
    id: number;
    name: string;
    description: string;
    title: string;
  }