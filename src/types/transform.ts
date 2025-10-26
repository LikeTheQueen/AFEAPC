import type { Session } from "@supabase/supabase-js";
import type {
    AFEType,
    OperatorType,
    ExecuteAFEDocIDType,
    ExecuteAFEDataType,
    ExecuteAFEEstimatesType,
    UserProfileSupabaseType,
    UserRolesSupabaseType,
    EstimatesSupabaseType,
    AFEHistorySupabaseType,
    AFESourceSystemType,
    AddressType,
    PartnerType,
    UserProfileRecordSupabaseType,
    RoleEntryRead,
    APCIDwithRole,
    RoleTypesGeneric,
    OperatorPartnerAddressType,
    OperatorPartnerAddressWithOpNameType,
    PartnerRowData,
    PartnerMappingDisplayRecord,
    OperatorOrPartnerList,
    GLCodeType,
    GLMappingRecord,
    GLMappedRecord,
    AFEDocuments,
    UserFullNameAndEmail
} from "./interfaces";

export const transformAFEs = (data: any[]): AFEType[] => {
    return data.map(item => ({
        id: item.id,
        operator: item.apc_op_id.name,
        created_at: new Date(item.created_at),
        afe_type: item.afe_type.toLowerCase() as Lowercase<string>,
        afe_number: item.afe_number,
        description: item.description,
        total_gross_estimate: item.total_gross_estimate,
        version_string: item.version_string,
        supp_gross_estimate: item.supp_gross_estimate,
        operator_wi: item.operator_wi,
        partnerID: item.apc_partner_id,
        partner_name: item.apc_partner_name,
        partner_wi: item.partner_wi,
        partner_status: item.partner_status,
        op_status: item.op_status,
        iapp_date: new Date(item.iapp_date).toLocaleDateString(),
        last_mod_date: new Date(item.last_mod_date).toLocaleDateString(),
        legacy_chainID: item.legacy_chainID,
        legacy_afeid: item.legacy_afeid,
        chain_version: item.chain_version,
        source_system_id: item.source_system_id,
        sortID: item.sortID,
        partner_status_date: item.partner_status_date,
        apc_op_id: item.apc_op_id.id,
        archived: item.archived,
        partner_archived: item.partner_archived,
        apc_partner_id: item.apc_partner_id,
    }));
};

export const transformSingleAFE = (item: any): AFEType => {
    return {
        id: item.id,
        operator: item.apc_op_id.name,
        created_at: new Date(item.created_at),
        afe_type: item.afe_type,
        afe_number: item.afe_number,
        description: item.description,
        total_gross_estimate: item.total_gross_estimate,
        version_string: item.version_string,
        supp_gross_estimate: item.supp_gross_estimate,
        operator_wi: item.operator_wi,
        partnerID: item.apc_partner_id,
        partner_name: item.apc_partner_name,
        partner_wi: item.partner_wi,
        partner_status: item.partner_status,
        op_status: item.op_status,
        iapp_date: new Date(item.iapp_date).toLocaleDateString(),
        last_mod_date: new Date(item.last_mod_date).toLocaleDateString(),
        legacy_chainID: item.legacy_chainID,
        legacy_afeid: item.legacy_afeid,
        chain_version: item.chain_version,
        source_system_id: item.source_system_id,
        sortID: item.sortID,
        partner_status_date: item.partner_status_date,
        apc_op_id: item.apc_op_id.id,
        archived: item.archived,
        partner_archived: item.partner_archived,
        apc_partner_id:item.apc_partner_id,
    };
};

export const transformExecuteAFEsID = (data: any[]): ExecuteAFEDocIDType[] => {
    return data.map(item => ({
        docID: item.DocumentId,
        docHandle: item.DocumentHandle
    }));
};

export const transformOperator = (data: any[]): OperatorType[] => {
    return data.map(item => ({
        id: item.id || item.apc_op_id.id,
        created_at: item.created_at,
        name: item.name || item.apc_op_id.name,
        base_url: item.base_url,
        key: item.key,
        docID: item.docID,
        source_system: item.source_system,
        active: item.active,
    }));
};

export const transformOperatorfromRole = (data: any[]): OperatorType[] => {
    return data.map(item => ({
        id: item.apc_op_id,
        created_at: item.created_at,
        name: item.name,
        base_url: item.base_url,
        key: item.key,
        docID: item.docID,
        source_system: item.source_system,
        active: item.active,
    }));
};

export const transformExecuteAFEData = (data: any[], operator: string): ExecuteAFEDataType[] => {

    return data.map(item => ({
        docID: item.DocumentId,
        afe_type: item.RawData[3],
        afe_number: item.RawData[1],
        operator: operator,
        description: item.RawData[2],
        total_gross_estimate: item.RawData[4],
        version_string: item.RawData[5],
        supp_gross_estimate: item.RawData[6],
        operator_wi: item.RawData[8],
        partnerID: item.RawData[9],
        partner_name: item.RawData[10],
        partner_wi: item.RawData[11],
        partner_status: item.RawData[12],
        op_status: item.RawData[13],
        iapp_date: new Date(item.Data[14]),
        last_mod_date: new Date(item.Data[15]),
        legacy_chainID: item.RawData[16],
        legacy_afeid: item.RawData[17],
        chain_version: item.RawData[18]
    }))
};

export const transformExecuteAFEEstimates = (data: any[], docID: string): ExecuteAFEEstimatesType[] => {
    return data.map(item => {
        const lastAmount = item.Amounts[item.Amounts.length - 1];
        const chainID = item.Amounts.length;

        return {
            afe: docID,
            account_number: item.Account.AccountNumber,
            account_description: item.Account.AccountDescription,
            account_group: item.Account.AccountGroup,
            amount_gross: lastAmount?.Gross,
            chainID: chainID,
        }

    })
};

export const transformUserProfileSupabaseSingle = (item: any): UserProfileSupabaseType => (
    {
    firstName: item.first_name,
    lastName: item.last_name,
    opCompany: 'should be op name',
    email: item.email,
    partnerCompany: 'should be partner name',
    apc_operator_id: 'sould be op id',
    apc_partner_id: 'should pe =part id',
    user_id: item.user_id
});

export const transformUserProfileRecordSupabase = (item: any): UserProfileRecordSupabaseType => {
    const crosswalkOperator = item.OPERATOR_USER_CROSSWALK || [];
    const crosswalkPartner = item.PARTNER_USER_CROSSWALK || [];
    return {
    firstName: item.first_name,
    lastName: item.last_name,
    email: item.email,
    active: item.active,
    operatorRoles: crosswalkOperator.map((c: any) => ({
        id: c.id, 
        role:c.role, 
        apc_id: c.apc_id.id, 
        apc_name:c.apc_id.name, 
        apc_address_id:c.apc_address_id.id,
        apc_address:c.apc_address_id,
        active: c.active,
        user_id: item.id,
        user_firstname: item.first_name, 
        user_lastName: item.last_name, 
        user_email: item.email, 
        user_active: item.active 
    })),
    partnerRoles: crosswalkPartner.map((c: any) => ({
        id: c.id, 
        role:c.role, 
        apc_id: c.apc_id.id, 
        apc_name:c.apc_id.name, 
        apc_address_id:c.apc_address_id.id,
        apc_address:c.apc_address_id,
        active: c.active,
        user_id: item.id,
        user_firstname: item.first_name, 
        user_lastName: item.last_name, 
        user_email: item.email, 
        user_active: item.active
    })),
    //operators: crosswalkOperator.map((c: any) => c.apc_id),
    //partners: crosswalkPartner.map((c: any) => c.apc_id),
    user_id:item.id,
    is_super_user: item.is_super_user,
    };
};

export const transformUserRolesSupabase = (data: any[]): UserRolesSupabaseType[] => {
    
    return data.map(item => ({
        name: item.role_id.name,
        description: item.role_id.description,
        title: item.role_id.title,
        
    }))
};

export const transformEstimatesSupabase = (data: any[]): EstimatesSupabaseType[] => {
    return data.map(item => ({
        id: item.id,
        amount_gross: item.amount_gross,
        partner_wi: item.partner_wi,
        partner_net_amount: item.partner_net_amount,
        operator_account_number: item.operator_account_number,
        operator_account_description: item.operator_account_description,
        operator_account_group: item.operator_account_group,
        partner_account_number: item.partner_account_number,
        partner_account_description: item.partner_account_description,
        partner_account_group: item.partner_account_group,
        
    }))
};

export const transformAFEHistorySupabase = (data: any[]): AFEHistorySupabaseType[] => {
    return data.map(item => ({
        id: item.id,
        afe_id: item.afe_id,
        created_at: item.created_at,
        description: item.description,
        type: item.type,
        user:item.user_id.first_name+' '+item.user_id.last_name,
        
    }))
};

export const transformSourceSystemSupabase = (data: any[]): AFESourceSystemType[] => {
    return data.map(item => ({
        id: item.id,
        system: item.system
    }))
    
};

export const transformOperatorSingle = (item: any): OperatorType => ({
        id: item.id,
        created_at: item.created_at,
        name: item.name,
        base_url: item.base_url,
        key: item.key,
        docID: item.docID,
        source_system: item.source_system,
        active: item.active,
    });

export const transformPartnerSingle = (item: any): PartnerType => ({
        id: item.id,
        created_at: item.created_at,
        name: item.name,
        active: item.active,
    });

export const transformAddressSupabase = (data: any[]): AddressType[] => {
    return data.map(item => ({
        id: item.id,
        street: item.street,
        suite: (item.suite === null ? '' : item.suite),
        city: item.city,
        state: item.state,
        zip: item.zip,
        country: item.country
    }))
};

export const transformRolesGeneric = (data: any[]): RoleTypesGeneric[] => {
    return data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        title: item.title,
        }))
};

export const transformOperatorPartnerAddress = (data: any[]): OperatorPartnerAddressType[] => {
    return data
    .filter(item => item.address !==null && item.apc_id !== null && item.apc_id !== undefined )
    .map(item => ({
        apc_id: item.apc_id.id,
        name: item.apc_id.name,
        apc_address_id:item.address.id,
        street: item.address.street,
        suite: (item.address.suite === null ? '' : item.address.suite),
        city: item.address.city,
        state: item.address.state,
        zip: item.address.zip,
        country: item.address.country
        
    }));
};

export const transformOperatorasPartnerAddress = (data: any[]): OperatorPartnerAddressType[] => {
    return data
    .filter(item => item.address !==null && item.apc_partner_id.id !== null && item.apc_partner_id.id !== undefined )
    .map(item => ({
        id: item.apc_partner_id.id || item.id,
        name: item.apc_partner_id.partner_name || item.name,
        addressID:item.address.id,
        street: item.address.street,
        suite: (item.address.suite === null ? '' : item.address.suite),
        city: item.address.city,
        state: item.address.state,
        zip: item.address.zip,
        country: item.address.country
        
    }));
};

export const transformOperatorPartnerAddressSuperUser = (data: any[]): OperatorPartnerAddressType[] => {
    
    return data
    .filter(item => item.address !==null && item.apc_id !== null && item.apc_id !== undefined )
    .map(item => ({
        apc_id: item.apc_id,
        name: item.name,
        apc_address_id:item.address.id,
        street: item.address.street,
        suite: (item.address.suite === null ? '' : item.address.suite),
        city: item.address.city,
        state: item.address.state,
        zip: item.address.zip,
        country: item.address.country
        
    })); 
};

export const transformRoleEntrySupabase = (data: any[]): RoleEntryRead[] => {
    return data 
    .map(item => ({
    id: item.role_id, 
    role: item.role, 
    active: item.role_active,

    apc_id: item.apc_id, 
    apc_name: item.apc_name, 
    apc_address_id: item.apc_address_id, 
    
    apc_address:  {
            street: item.street,
            suite: item.suite,
            city: item.city,
            state: item.state,
            zip: item.zip,
            country: item.country,
            id: item.apc_address_id
        }, 

    user_id: item.user_id, 
    user_firstname: item.first_name, 
    user_lastName: item.last_name, 
    user_email: item.email,
    user_active: item.user_active,

    is_op_permission: item.is_op_permission,
    is_partner_permission: item.is_partner_permission,
    }));
};

export const transformRoleEntryPartnerSupabase = (data: any[]): RoleEntryRead[] => {
    return data 
    .map(item => ({
    id: item.role_id, 
    role: item.role, 
    active: item.role_active,

    apc_id: item.apc_id, 
    apc_name: item.apc_name, 
    apc_address_id: item.apc_address_id, 
    
    apc_address: null, 

    user_id: item.user_id, 
    user_firstname: item.first_name, 
    user_lastName: item.last_name, 
    user_email: item.email,
    user_active: item.user_active,

    is_op_permission: item.is_op_permission,
    is_partner_permission: item.is_partner_permission,
    }));
};

export const transformOperatorPartnerAddressWithOpName = (data: any[]): OperatorPartnerAddressWithOpNameType[] => {
    return data
    .filter(item => item.address !==null && item.apc_id !== null && item.apc_id !== undefined )
    .map(item => ({
        apc_id: item.apc_id,
        name: item.name,
        apc_address_id:item.address.id,
        street: item.address.street,
        suite: (item.address.suite === null ? '' : item.address.suite),
        city: item.address.city,
        state: item.address.state,
        zip: item.address.zip,
        country: item.address.country,
        apc_op_id: (item.apc_op_id === null ? '' : item.apc_op_id.id),
        apc_op_name: (item.apc_op_id === null ? '' : item.apc_op_id.name),
        
    }));
};

export const transformPartnerSourceSystemAddress = (data: any[]) : PartnerRowData[] => {
    return data.map(item => ({
        id: item.id,
        source_id: item.source_id,
        apc_op_id: item.apc_op_id,
        name: item.name,
        street: item.street,
        suite: item.suite,
        city: item.city,
        state: item.state,
        zip: item.zip,
        country: item.country,
        active: item.active
    }))
};

export const transformPartnerMapRecordForDisplay = (data: any[]) : PartnerMappingDisplayRecord[] => {
    return data.map(item => ({
        id: item.id,
        apc_partner: {
        apc_id: item.apc_partner.apc_id,
        name: item.apc_partner.name,
        apc_address_id: item.apc_partner.address.id,
        street: item.apc_partner.address.street,
        suite: (item.apc_partner.address.suite === null ? '' : item.apc_partner.address.suite),
        city: item.apc_partner.address.city,
        state: item.apc_partner.address.state,
        zip: item.apc_partner.address.zip,
        country: item.apc_partner.address.country
        },
        source_partner: {
        apc_op_id: item.source_partner.apc_op_id,
        name: item.source_partner.name,
        source_id:item.source_partner.source_id,
        street: item.source_partner.street,
        suite: (item.source_partner.suite === null ? '' : item.source_partner.suite),
        city: item.source_partner.city,
        state: item.source_partner.state,
        zip: item.source_partner.zip,
        country: item.source_partner.country,
        active: true,
        }
    }))
};

export const transformOperatorForDropDown = (data: any[]) : OperatorOrPartnerList[] => {
    return data.map(item => ({
        apc_id: item.apc_id.id,
        apc_name:item.apc_id.name
    }))
};

export const transformGLCodes = (data: any[]) : GLCodeType[] => {
    return data.map(item => ({
        account_number: item.account_number,
        account_description: item.account_description,
        account_group: item.account_group,
        id: item.id,
        apc_op_id:'',
        apc_part_id:''
    }))
};

export const transformGLCodeCrosswalk = (data: any[]) : GLMappedRecord[] => {
    return data.map(item => ({
        apc_operator_id: item.apc_operator_id,
        apc_op_account_id:item.apc_op_account_id,
        operator_account_group: item.operator_account_group,
        operator_account_description: item.operator_account_description,
        operator_account_number: item.operator_account_number,
        apc_partner_id: item.apc_partner_id,
        partner_account_group: item.partner_account_group,
        partner_account_description: item.partner_account_description,
        partner_account_number: item.partner_account_number,
        apc_partner_account_id: item.apc_partner_account_id,
        id: item.id,
    }))
};

export const transformAFEDocumentList = (data: any[]) : AFEDocuments[] => {
    return data.map(item => ({
        storage_path: item.storage_path,
        filename_display: item.filename_display,
        id: item.id,
        mimeype: item.mimetype
    }))
};

export const transformUserNameAndEmail = (data: any[]) : UserFullNameAndEmail[] => {
    return data.map(item => ({
        id: item.user_id,
        firstname: item.first_name,
        lastName: item.last_name,
        email: item.email,
        active: item.active
    }))
}
