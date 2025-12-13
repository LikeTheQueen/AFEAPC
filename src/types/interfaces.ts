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
    apc_op_id: string;
    archived: boolean;
    partner_archived: boolean;
    apc_partner_id: string;
    well_name: string;
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
    id?: string;
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
  
  export interface RoleEntryWrite{
    id?: number;
    role: number | null;
    active: boolean;
    user_id?: string;
    apc_id: string;
    apc_address_id: number;
  }
  
  export interface RoleEntryRead extends RoleEntryWrite{
    apc_name: string;
    apc_address: AddressType | null;
    user_id: string;
    user_firstname: string;
    user_lastName: string;
    user_email: string;
    user_active: boolean;
    is_op_permission: boolean;
    is_partner_permission: boolean;
  }

  export interface PartnerRoleEntryWrite{
    user_id: string;
    role: number;
    id?: number | null | undefined;
    apc_partner_id: string;
    apc_partner_id_address_id: number;
    active: boolean;
  }

  export interface RoleTypeSupabaseOperator{
    user_id: string;
    role: number;
    apc_op_id: string;
    apc_op_id_address_id: number;
  }
//Interface for User Profiles pulled from Supabase
  export interface UserProfileRecordSupabaseType {
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
    operatorRoles: RoleEntryRead[];
    partnerRoles: RoleEntryRead[];
    //operators: string[];
    //partners: string[];
    user_id?: UUID | null;
    is_super_user: boolean;
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
    address_active: boolean;
  }

//Interface for Roles and names pulled from Supabase
  export interface RoleTypesGeneric {
    id: number;
    name: string;
    description: string;
    title: string;
  }

//Interface for Operator Names, IDs and addresses  
  export interface OperatorPartnerAddressType {
    apc_id?: string;
    name: string;
    apc_address_id?: number | null;
    street?: string | undefined;
    suite?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    zip?: string | undefined;
    country?: string | undefined;
    address_active: boolean;
  }

  export interface OperatorPartnerAddressWithOpNameType extends OperatorPartnerAddressType {
    apc_op_id?: string | null;
    apc_op_name?: string;
  }

  export interface OperatorPartnerRecord extends OperatorPartnerAddressType {
    apc_op_id?: string | null;
    apc_op_name?: string;
    active: boolean;
  }

  export interface PartnerRecordToUpdate {
    id: string;
    apc_op_id: string; 
  }

//Interface for grouping roles by user and apc_id
  export interface GroupedByUserAndApc {
  userId: string;
  name: string;
  email: string | null;
  apcs: {
    apc_id: string;
    apc_name: string;
    apc_address_id: number;
    roles: RoleEntryWrite[];
  }[];
};

//Interface for Partners from the source system  
  export interface SourceSystemPartnerAddressType {
    id: number;
    apc_op_id?: string;
    source_id: string;
    name: string;
    apc_address_id?: number | null;
    street?: string | undefined;
    suite?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    zip?: string | undefined;
    country?: string | undefined;
    active: boolean;
    mapped: boolean;
  };

  export interface PartnerRowUpdate {
    id:number;
  };

  export interface PartnerRowData {
  id?: number;
  source_id: string;
  apc_op_id: string;
  name: string;
  street: string;
  suite: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  active: boolean;
  };

export interface GLCodeRowData {
  account_number: string | null;
  account_group: string | null;
  account_description: string | null;
  apc_op_id: string | null;
  apc_part_id: string | null;
  id?: number | null;
};
export interface PartnerMappingRecord {
  operator?: string | UUID;
  op_partner_id?: string;
  partner_id?: string | UUID;
};

export interface PartnerMappingDisplayRecord {
  id: string;
  apc_partner: OperatorPartnerAddressType;
  source_partner: PartnerRowData;
};

export interface OperatorOrPartnerList {
  apc_id: string;
  apc_name: string;
  apc_address: AddressType | null;
};

export interface UserNameAndEmail {
  name: string;
  email: string;
};

export interface UserFullNameAndEmail {
  id: string;
  firstname: string;
  lastName: string;
  email: string;
  active: boolean;
}

export interface OperaatorOrPartnerListAndUsers extends OperatorOrPartnerList {
  users: UserNameAndEmail[] | [];
  partnerAddresses: OperatorPartnerAddressType[] | [];
}

export interface GLCodeType extends GLCodeRowData{
  id: number;
  active: boolean;
}

export interface GLMappingRecord {
    apc_operator_id: string;
    apc_op_account_id:number | null;
    operator_account_group: string;
    operator_account_description: string;
    operator_account_number: string;
    apc_partner_id: string;
    partner_account_group: string;
    partner_account_description: string;
    partner_account_number: string;
    apc_partner_account_id: number | null;
};

export interface GLMappedRecord extends GLMappingRecord {
   id: number | null;
};

export interface AFEDocuments {
  storage_path: string;
  filename_display: string;
  id:number;
  mimeype: string;
};

export interface AFEWells {
  is_primary: boolean;
  well_name: string;
  description: string;
  well_number: string;
};

export interface SupportHistoryThread {
  created_at: Date;
  created_by: string;
  active: boolean;
  comment: string;
  comment_date: Date;
  id: number;
  user_id: string;
};

export interface SupportHistory {
  id: number;
  created_at: Date;
  created_by: string;
  active: boolean;
  subject: string;
  message: string;
  closed_by: string;
  closed_on: Date;
  resolution: string;
  resolution_date: Date;
  support_thread: SupportHistoryThread[];
  user_id: string;
};

export interface Notifications {
  id: number;
  afe_number: string;
  afe_version: string;
  afe_id: string;
  user: UserNameAndEmail;
  user_id: string;
  description: string;
  created_at: Date;
};

export interface SystemHistory {
  id: number;
  created_at: Date;
  created_by: UserNameAndEmail;
  user_id: string;
  description: string;
  action: string;
  apc_op_id: string;
}