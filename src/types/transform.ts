import type { Session } from "@supabase/supabase-js";
import type {
    AFEType,
    OperatorType,
    ExecuteAFEDocIDType,
    ExecuteAFEDataType,
    ExecuteAFEEstimatesType,
    UserProfileSupabaseType,
    UserRolesSupabaseType
} from "./interfaces";

export const transformAFEs = (data: any[]): AFEType[] => {
    return data.map(item => ({
        id: item.id,
        operator: item.apc_operator_id.name,
        created_at: new Date(item.created_at).toLocaleDateString(),
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
        source_system_id: item.source_system_id

    }));
};

export const transformExecuteAFEsID = (data: any[]): ExecuteAFEDocIDType[] => {
    return data.map(item => ({
        docID: item.DocumentId,
        docHandle: item.DocumentHandle
    }));
};

export const transformOperator = (data: any[]): OperatorType[] => {
    return data.map(item => ({
        id: item.id,
        created_at: new Date(item.created_at).toLocaleDateString(),
        name: item.name,
        base_url: item.base_url,
        key: item.key,
        docID: item.docID,
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

export const transformUserProfileSupabase = (data: any[]): UserProfileSupabaseType[] => {
    return data.map(item => ({
        firstName: item.first_name,
        lastName: item.last_name,
        opCompany: item.op_company.name,
        email: item.email,
        partnerCompany: item.partner_company.partner_name,

    }))
};

export const transformUserRolesSupabase = (data: any[]): UserRolesSupabaseType[] => {
    console.log('i will transformer', data)
    return data.map(item => ({
        name: item.role_id.name,
        description: item.role_id.description,
        title: item.role_id.title,
        
    }))
};