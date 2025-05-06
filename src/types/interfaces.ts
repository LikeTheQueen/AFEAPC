import type { UUID } from "crypto";

//Interface for AFEs pulled from the database
export interface AFEType {
    id: UUID;
    operator: string;
    created_at: string;
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
  }

//Interface for AFE IDs pulled from execute
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
    id: UUID;
    created_at: string;
    name: string;
    base_url: string;
    key: string;
    docID: string;
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
  }

//Interface for User Roles pulled from Supabase
  export interface UserRolesSupabaseType {
    name: string;
    description: string;
    title: string;
  }
