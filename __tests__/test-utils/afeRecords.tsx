import type { AFEType, 
    EstimatesSupabaseType, 
    OperatorOrPartnerList, 
    UserProfileRecordSupabaseType,
    AddressType } from "../../src/types/interfaces";

// Postgres timestamp format
const postgresTimestamp = '2026-01-15 10:30:00';
// Or with timezone
const postgresTimestampTZ = '2026-01-15 10:30:00+00';
const postgresDate = new Date(2026, 0, 25)

const testDateTimestamp = new Date(postgresTimestamp);
const testDateTimeStampTZ = new Date(postgresTimestampTZ);

const apc_op_id = '123e4567-e89b-12d3-a456-426614174000';
const apc_op_id2 = 'a4367e56-14bf-4bd1-b0f1-fecc7d97b58c';
const apc_part_id = '';

export const apc_op_id_Navz = 'a4367e56-14bf-4bd1-b0f1-fecc7d97b58c';
export const apc_op_id_CWz = '3b34a78a-13ad-40b5-aecd-268d56dd5e0d';
export const apc_part_id_John = '8ed0a285-0011-4f56-962f-c46bc0889d1b';
export const apc_part_id_Athena = '626390b5-6f63-4caa-a0aa-b333a15eaf59';

const apc_afe_id1 = '025439e7-c970-44f0-9e50-f7b28f70199a';
const apc_afe_id2 = '34d7bd01-d43b-4e3a-a586-34f0297a8008';

const userID1 = '13e69340-d14c-45a9-96a8-142795925487'

export const singleAFE: AFEType[] = [{
    id: apc_afe_id1,
    operator: 'Gas & Oil Company',
    created_at: testDateTimeStampTZ,
    afe_type: 'Drilling',
    afe_number: 'AFE Test 1',
    description: 'Description AFE 1',
    total_gross_estimate: 1000,
    version_string: '',
    supp_gross_estimate: 0,
    operator_wi: 10,
    partnerID: '',
    partner_name: 'Partner Name AFE1',
    partner_wi: 23,
    partner_status: 'New',
    op_status: 'IAPP',
    iapp_date: 'Jan 5, 2026',
    last_mod_date: 'Jan 4, 2026',
    legacy_chainID: 427,
    legacy_afeid: 1,
    chain_version: 427,
    source_system_id: 'external source ID',
    sortID: 1,
    partner_status_date: postgresDate,
    apc_op_id: apc_op_id,
    archived: false,
    partner_archived: false,
    apc_partner_id: apc_part_id,
    well_name: 'Many'
}];

export const twoAFErecords: AFEType[] = [
    {
    id: apc_afe_id1,
    operator: 'Gas & Oil Company',
    created_at: testDateTimeStampTZ,
    afe_type: 'Drilling',
    afe_number: 'AFE Test 1',
    description: 'Description AFE 1',
    total_gross_estimate: 1000,
    version_string: '',
    supp_gross_estimate: 0,
    operator_wi: 10,
    partnerID: '',
    partner_name: 'Partner Name AFE1',
    partner_wi: 23,
    partner_status: 'New',
    op_status: 'IAPP',
    iapp_date: 'Jan 5, 2026',
    last_mod_date: 'Jan 4, 2026',
    legacy_chainID: 427,
    legacy_afeid: 1,
    chain_version: 427,
    source_system_id: 'external source ID',
    sortID: 1,
    partner_status_date: postgresDate,
    apc_op_id: apc_op_id,
    archived: false,
    partner_archived: false,
    apc_partner_id: apc_part_id,
    well_name: 'Many'
    },
    {
    id: apc_afe_id2,
    operator: 'Gas & Oil Company',
    created_at: testDateTimeStampTZ,
    afe_type: 'Drilling',
    afe_number: 'AFE Test 2',
    description: 'Description AFE 2',
    total_gross_estimate: 1000,
    version_string: 'S1',
    supp_gross_estimate: 0,
    operator_wi: 10,
    partnerID: '',
    partner_name: 'Partner Name AFE2',
    partner_wi: 23,
    partner_status: 'New',
    op_status: 'IAPP',
    iapp_date: 'Jan 5, 2026',
    last_mod_date: 'Jan 4, 2026',
    legacy_chainID: 428,
    legacy_afeid: 2,
    chain_version: 428,
    source_system_id: 'external source ID',
    sortID: 2,
    partner_status_date: postgresDate,
    apc_op_id: apc_op_id,
    archived: false,
    partner_archived: false,
    apc_partner_id: apc_part_id,
    well_name: 'Many'
    }];

export const twoOperatedAFErecords: AFEType[] = [
    {
        id: '123e4567-e89b-12d3-a456-426614174000',
        operator: 'Navigator Corporation',
        created_at: testDateTimeStampTZ,
        afe_type: 'Drilling',
        afe_number: 'Op Test 1',
        description: 'Op Test 1 Description',
        total_gross_estimate: 100,
        version_string: 'S1',
        supp_gross_estimate: 0,
        operator_wi: 10,
        partnerID: '',
        partner_name: 'Partner 1',
        partner_wi: 23,
        partner_status: 'Viewed',
        op_status: 'IAPP',
        iapp_date: 'May5',
        last_mod_date: 'Jun3',
        legacy_chainID: 1,
        legacy_afeid: 2,
        chain_version: 1,
        source_system_id: 'ex ID',
        sortID: 1,
        partner_status_date: postgresDate,
        apc_op_id: apc_op_id,
        archived: false,
        partner_archived: false,
        apc_partner_id: apc_part_id,
        well_name: 'Many'
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174000',
        operator: 'Navigator Corporation',
        created_at: testDateTimeStampTZ,
        afe_type: 'Drilling',
        afe_number: 'Op Test 2',
        description: 'Op Test 2 Description',
        total_gross_estimate: 100,
        version_string: '',
        supp_gross_estimate: 0,
        operator_wi: 10,
        partnerID: '',
        partner_name: 'Partner 1',
        partner_wi: 23,
        partner_status: 'New',
        op_status: 'IAPP',
        iapp_date: 'May5',
        last_mod_date: 'Jun3',
        legacy_chainID: 12,
        legacy_afeid: 1,
        chain_version: 12,
        source_system_id: 'ex ID',
        sortID: 1,
        partner_status_date: postgresDate,
        apc_op_id: apc_op_id,
        archived: false,
        partner_archived: false,
        apc_partner_id: apc_part_id,
        well_name: 'Many'
    }];

export const twoNonOperatedAFErecords: AFEType[] = [
    {
        id: '123e4567-e89b-12d3-a456-426614174000',
        operator: 'Other Operator',
        created_at: testDateTimeStampTZ,
        afe_type: 'Drilling',
        afe_number: 'NonOp Test 1',
        description: 'NonOp Test 1 Description',
        total_gross_estimate: 100,
        version_string: 'S1',
        supp_gross_estimate: 0,
        operator_wi: 10,
        partnerID: '',
        partner_name: 'Op as Partner',
        partner_wi: 23,
        partner_status: 'New',
        op_status: 'IAPP',
        iapp_date: 'May5',
        last_mod_date: 'Jun3',
        legacy_chainID: 1,
        legacy_afeid: 2,
        chain_version: 1,
        source_system_id: 'ex ID',
        sortID: 1,
        partner_status_date: postgresDate,
        apc_op_id: apc_op_id,
        archived: false,
        partner_archived: false,
        apc_partner_id: apc_part_id,
        well_name: 'Many'
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174000',
        operator: 'Other Operator',
        created_at: testDateTimeStampTZ,
        afe_type: 'Drilling',
        afe_number: 'NonOp Test 2',
        description: 'NonOp Test 2 Description',
        total_gross_estimate: 100,
        version_string: '',
        supp_gross_estimate: 0,
        operator_wi: 10,
        partnerID: '',
        partner_name: 'Partner 1',
        partner_wi: 23,
        partner_status: 'New',
        op_status: 'IAPP',
        iapp_date: 'May5',
        last_mod_date: 'Jun3',
        legacy_chainID: 13,
        legacy_afeid: 1,
        chain_version: 13,
        source_system_id: 'ex ID',
        sortID: 1,
        partner_status_date: postgresDate,
        apc_op_id: apc_op_id,
        archived: false,
        partner_archived: false,
        apc_partner_id: apc_part_id,
        well_name: 'Many'
    }];

export const singleEstimateRecord: EstimatesSupabaseType[] = [
    {
        id: 1,
        amount_gross: 100,
        partner_wi: 20.00,
        partner_net_amount: 20.00,
        operator_account_number: 'OP.ACCT.NUM',
        operator_account_description: 'Mock account desc',
        operator_account_group: '1. DRILLING',
        partner_account_number: 'P.ACCT.NUM',
        partner_account_description: 'P ACCT DESC',
        partner_account_group: 'P ACCT GROUP'
    },
    {
        id: 1,
        amount_gross: 100,
        partner_wi: 20.00,
        partner_net_amount: 20.00,
        operator_account_number: 'OP.ACCT.NUM',
        operator_account_description: 'Mock account desc',
        operator_account_group: '1. DRILLING',
        partner_account_number: 'P.ACCT.NUM',
        partner_account_description: 'P ACCT DESC',
        partner_account_group: 'P ACCT GROUP'
    }
];

export const parterNewStatus: AFEType = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    operator: '123e4567-e89b-12d3-a456-426614174000',
    created_at: testDateTimeStampTZ,
    afe_type: 'Drilling',
    afe_number: 'TESTNum1',
    description: 'Desc',
    total_gross_estimate: 100,
    version_string: '',
    supp_gross_estimate: 0,
    operator_wi: 10,
    partnerID: '',
    partner_name: 'PartnerNaem',
    partner_wi: 23,
    partner_status: 'New',
    op_status: 'IAPP',
    iapp_date: 'May5',
    last_mod_date: 'Jun3',
    legacy_chainID: 1,
    legacy_afeid: 2,
    chain_version: 1,
    source_system_id: 'ex ID',
    sortID: 1,
    partner_status_date: new Date(),
    apc_op_id: apc_op_id,
    archived: false,
    partner_archived: false,
    apc_partner_id: apc_part_id,
    well_name: 'Many'
};

export const parterViewStatus: AFEType = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    operator: '123e4567-e89b-12d3-a456-426614174000',
    created_at: new Date(),
    afe_type: 'Drilling',
    afe_number: 'TESTNum1',
    description: 'Desc',
    total_gross_estimate: 100,
    version_string: '',
    supp_gross_estimate: 0,
    operator_wi: 10,
    partnerID: '',
    partner_name: 'PartnerNaem',
    partner_wi: 23,
    partner_status: 'Viewed',
    op_status: 'IAPP',
    iapp_date: 'May5',
    last_mod_date: 'Jun3',
    legacy_chainID: 1,
    legacy_afeid: 2,
    chain_version: 1,
    source_system_id: 'ex ID',
    sortID: 1,
    partner_status_date: new Date(),
    apc_op_id: apc_op_id,
    archived: false,
    partner_archived: false,
    apc_partner_id: apc_part_id,
    well_name: 'Many'
};
export const parterApprovedStatus: AFEType = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    operator: '123e4567-e89b-12d3-a456-426614174000',
    created_at: testDateTimeStampTZ,
    afe_type: 'Drilling',
    afe_number: 'TESTNum1',
    description: 'Desc',
    total_gross_estimate: 100,
    version_string: '',
    supp_gross_estimate: 0,
    operator_wi: 10,
    partnerID: '',
    partner_name: 'PartnerNaem',
    partner_wi: 23,
    partner_status: 'Approved',
    op_status: 'IAPP',
    iapp_date: 'May5',
    last_mod_date: 'Jun3',
    legacy_chainID: 1,
    legacy_afeid: 2,
    chain_version: 1,
    source_system_id: 'ex ID',
    sortID: 1,
    partner_status_date: new Date(),
    apc_op_id: apc_op_id,
    archived: false,
    partner_archived: false,
    apc_partner_id: apc_part_id,
    well_name: 'Many'
};
export const parterRejectedStatus: AFEType = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    operator: '123e4567-e89b-12d3-a456-426614174000',
    created_at: testDateTimeStampTZ,
    afe_type: 'Drilling',
    afe_number: 'TESTNum1',
    description: 'Desc',
    total_gross_estimate: 100,
    version_string: '',
    supp_gross_estimate: 0,
    operator_wi: 10,
    partnerID: '',
    partner_name: 'PartnerNaem',
    partner_wi: 23,
    partner_status: 'Rejected',
    op_status: 'IAPP',
    iapp_date: 'May5',
    last_mod_date: 'Jun3',
    legacy_chainID: 1,
    legacy_afeid: 2,
    chain_version: 1,
    source_system_id: 'ex ID',
    sortID: 1,
    partner_status_date: new Date(),
    apc_op_id: apc_op_id,
    archived: false,
    partner_archived: false,
    apc_partner_id: apc_part_id,
    well_name: 'Many'
};

export const loggedInUser: UserProfileRecordSupabaseType = {
    firstName: 'User lock',
    lastName: 'Athena',
    email: 'user@email',
    active: true,
    is_super_user: false,
    operatorRoles: [
        {
        apc_name: 'Corr and Whit Oils',
        apc_address: {
            address_active: true,
            id: 66,
            street: '1234 Main',
            suite:'',
            city: 'Houston',
            state: 'Texas',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: true,
        is_partner_permission: false,
        id: 120,
        role: 2,
        active: true,
        apc_id: apc_op_id,
        apc_address_id: 66
    },
    {
        apc_name: 'Corr and Whit Oils',
        apc_address: {
            address_active: true,
            id: 66,
            street: '1234 Main',
            suite:'',
            city: 'Houston',
            state: 'Texas',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: true,
        is_partner_permission: false,
        id: 121,
        role: 4,
        active: true,
        apc_id: apc_op_id,
        apc_address_id: 66
    },
    {
        apc_name: 'Corr and Whit Oils',
        apc_address: {
            address_active: true,
            id: 66,
            street: '1234 Main',
            suite:'',
            city: 'Houston',
            state: 'Texas',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: true,
        is_partner_permission: false,
        id: 122,
        role: 8,
        active: true,
        apc_id: apc_op_id,
        apc_address_id: 66
    }
    ],
    partnerRoles: [
        {
        apc_name: 'John Ross',
        apc_address: {
            address_active: true,
            id: 10,
            street: '2900 S Emerson St',
            suite:'878',
            city: 'Englewood',
            state: 'CO',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: false,
        is_partner_permission: true,
        id: 35,
        role: 3,
        active: true,
        apc_id: '8ed0a285-0011-4f56-962f-c46bc0889d1b',
        apc_address_id: 10
    },
    {
        apc_name: 'John Ross',
        apc_address: {
            address_active: true,
            id: 10,
            street: '2900 S Emerson St',
            suite:'878',
            city: 'Englewood',
            state: 'CO',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: false,
        is_partner_permission: true,
        id: 72,
        role: 9,
        active: true,
        apc_id: '8ed0a285-0011-4f56-962f-c46bc0889d1b',
        apc_address_id: 10
    },
    {
        apc_name: 'John Ross',
        apc_address: {
            address_active: true,
            id: 10,
            street: '2900 S Emerson St',
            suite:'878',
            city: 'Englewood',
            state: 'CO',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: false,
        is_partner_permission: true,
        id: 74,
        role: 5,
        active: true,
        apc_id: '8ed0a285-0011-4f56-962f-c46bc0889d1b',
        apc_address_id: 10
    },
    {
        apc_name: 'John Ross',
        apc_address: {
            address_active: true,
            id: 10,
            street: '2900 S Emerson St',
            suite:'878',
            city: 'Englewood',
            state: 'CO',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: false,
        is_partner_permission: true,
        id: 185,
        role: 6,
        active: true,
        apc_id: '8ed0a285-0011-4f56-962f-c46bc0889d1b',
        apc_address_id: 10
    },
    {
        apc_name: 'John Ross',
        apc_address: {
            address_active: true,
            id: 7,
            street: '2900 S Emerson St',
            suite:'878',
            city: 'Englewood',
            state: 'CO',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: false,
        is_partner_permission: true,
        id: 186,
        role: 3,
        active: true,
        apc_id: '8ed0a285-0011-4f56-962f-c46bc0889d1b',
        apc_address_id: 7
    }
    
    ],
};

//User has no view rights to Operated and Non Op view rights to Athena can approve
export const loggedInUserNoOpViewRightsAthena: UserProfileRecordSupabaseType = {
    firstName: 'Jane',
    lastName: 'Athena',
    email: 'user@email',
    active: true,
    is_super_user: false,
    operatorRoles: [],
    partnerRoles: [
        {
        apc_name: 'Athena Minerals',
        apc_address: {
            address_active: true,
            id: 7,
            street: '2900 S Emerson St',
            suite:'878',
            city: 'Englewood',
            state: 'CO',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: false,
        is_partner_permission: true,
        id: 35,
        role: 3,
        active: true,
        apc_id: apc_part_id_Athena,
        apc_address_id: 7
    },
    {
        apc_name: 'Athena Minerals',
        apc_address: {
            address_active: true,
            id: 7,
            street: '2900 S Emerson St',
            suite:'878',
            city: 'Englewood',
            state: 'CO',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: false,
        is_partner_permission: true,
        id: 72,
        role: 9,
        active: true,
        apc_id: apc_part_id_Athena,
        apc_address_id: 7
    },
    {
        apc_name: 'Athena Minerals',
        apc_address: {
            address_active: true,
            id: 7,
            street: '2900 S Emerson St',
            suite:'878',
            city: 'Englewood',
            state: 'CO',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: false,
        is_partner_permission: true,
        id: 74,
        role: 5,
        active: true,
        apc_id: apc_part_id_Athena,
        apc_address_id: 7
    },
    {
        apc_name: 'Athena Minerals',
        apc_address: {
            address_active: true,
            id: 7,
            street: '2900 S Emerson St',
            suite:'878',
            city: 'Englewood',
            state: 'CO',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: false,
        is_partner_permission: true,
        id: 185,
        role: 6,
        active: true,
        apc_id: apc_part_id_Athena,
        apc_address_id: 7
    }
    
    ],
};

//User has view rights to operated AFEs for Nav Oils and Non Op view rights to John Ross and can Approve NonOp AFEs
export const loggedInUserOpNavOilsPartnerJohnRoss: UserProfileRecordSupabaseType = {
    firstName: 'Tim',
    lastName: 'Ross',
    email: 'user@email',
    active: true,
    is_super_user: false,
    operatorRoles: [
        {
        apc_name: 'Nav Oils',
        apc_address: {
            address_active: true,
            id: 51,
            street: '1234 Main',
            suite:'',
            city: 'Houston',
            state: 'Texas',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: true,
        is_partner_permission: false,
        id: 46,
        role: 2,
        active: true,
        apc_id: apc_op_id_Navz,
        apc_address_id: 51
    },
    {
        apc_name: 'Nav Oils',
        apc_address: {
            address_active: true,
            id: 51,
            street: '1234 Main',
            suite:'',
            city: 'Houston',
            state: 'Texas',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: true,
        is_partner_permission: false,
        id: 49,
        role: 4,
        active: true,
        apc_id: apc_op_id_Navz,
        apc_address_id: 51
    },
    {
        apc_name: 'Nav Oils',
        apc_address: {
            address_active: true,
            id: 51,
            street: '1234 Main',
            suite:'',
            city: 'Houston',
            state: 'Texas',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: true,
        is_partner_permission: false,
        id: 52,
        role: 8,
        active: true,
        apc_id: apc_op_id_Navz,
        apc_address_id: 51
    }
    ],
    partnerRoles: [
        {
        apc_name: 'John Ross',
        apc_address: {
            address_active: true,
            id: 10,
            street: '2900 S Emerson St',
            suite:'878',
            city: 'Englewood',
            state: 'CO',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: false,
        is_partner_permission: true,
        id: 35,
        role: 3,
        active: true,
        apc_id: apc_part_id_John,
        apc_address_id: 10
    },
    {
        apc_name: 'John Ross',
        apc_address: {
            address_active: true,
            id: 10,
            street: '2900 S Emerson St',
            suite:'878',
            city: 'Englewood',
            state: 'CO',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: false,
        is_partner_permission: true,
        id: 72,
        role: 9,
        active: true,
        apc_id: apc_part_id_John,
        apc_address_id: 10
    },
    {
        apc_name: 'John Ross',
        apc_address: {
            address_active: true,
            id: 10,
            street: '2900 S Emerson St',
            suite:'878',
            city: 'Englewood',
            state: 'CO',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: false,
        is_partner_permission: true,
        id: 74,
        role: 5,
        active: true,
        apc_id: apc_part_id_John,
        apc_address_id: 10
    },
    {
        apc_name: 'John Ross',
        apc_address: {
            address_active: true,
            id: 10,
            street: '2900 S Emerson St',
            suite:'878',
            city: 'Englewood',
            state: 'CO',
            zip: '80093',
            country: 'United States'
        },
        user_id: userID1,
        user_firstname: 'Rachel',
        user_lastName: 'Green',
        user_email: 'elizabeth.rider.shaw@gmail.com',
        user_active: true,
        is_op_permission: false,
        is_partner_permission: true,
        id: 185,
        role: 6,
        active: true,
        apc_id: apc_part_id_John,
        apc_address_id: 10
    }
    
    ],
};

export const loggedInUserIsSuperUser: UserProfileRecordSupabaseType = {
    firstName: 'Tim',
    lastName: 'Ross',
    email: 'user@email',
    active: true,
    is_super_user: true,
    user_id: '13e69340-d14c-45a9-96a8-142795925487',
    operatorRoles: [],
    partnerRoles: [],
};

export const AFEsFromSupbase: AFEType[] = [
    //Operated by Nav Oil & John Ross Partner NOT ARCHIVED
    {
        id: "025439e7-c970-44f0-9e50-f7b28f70199a",
        created_at:  new Date("2025-10-22 17:10:50.830331+00"),
        afe_type: "DRILLING",
        afe_number: "26D001",
        description: "Drill SHIELDS-CANTRELL #1",
        total_gross_estimate: 563603.25,
        version_string: '',
        supp_gross_estimate: 0,
        operator_wi: 25,
        partner_name: "John Ross Exploration Inc",
        partner_wi: 50,
        partner_status: "Approved",
        op_status: "IAPP",
        iapp_date: "2025-10-08",
        last_mod_date: "2025-10-08",
        legacy_chainID: 427,
        legacy_afeid: 427,
        chain_version: 1,
        source_system_id: "8c7a4be7-e577-499d-8c7b-266a1549a020",
        apc_partner_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        partnerID: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        partner_status_date: new Date("2025-12-17 19:42:56.678+00"),
        sortID: 156,
        archived: false,
        partner_archived: false,
        apc_op_id: "a4367e56-14bf-4bd1-b0f1-fecc7d97b58c",
        operator: 'Navigator Oil',
        well_name: "SHIELDS-CANTRELL #1",
    },
    //Operated by Corr Whit Oil & John Ross Partner NOT ARCHIVED
    {
        id: "34d7bd01-d43b-4e3a-a586-34f0297a8008",
        created_at:  new Date("2025-10-22 17:10:47.867426+00"),
        afe_type: "DRILLING",
        afe_number: "25D001",
        description: "Drill SHIELDS-CANTRELL #1",
        total_gross_estimate: 563603.25,
        version_string: "S2",
        supp_gross_estimate: 2333.1,
        operator_wi: 65,
        partner_name: "John Ross Exploration Inc",
        partner_wi: 20,
        partner_status: "New",
        op_status: "IAPP",
        iapp_date: "2025-08-12",
        last_mod_date: "2025-10-08",
        legacy_chainID: 414,
        legacy_afeid: 425,
        chain_version: 3,
        source_system_id: "e217aede-6af1-4696-8776-4d56d1ac16bf",
        apc_partner_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        partnerID: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        partner_status_date: new Date(),
        sortID: 153,
        archived: false,
        partner_archived: false,
        apc_op_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
        operator: 'Corr and Whit Oil',
        well_name: "Many"
    },
    //Operated by Nav Oil & John Ross Partner NOT ARCHIVED
    {
        id: "4b6cebbf-ca88-4e9e-8479-dd50cc13e03d",
        created_at:  new Date("2025-11-15 00:00:06.292558+00"),
        afe_type: "DRILLING",
        afe_number: "06D111",
        description: "Drill DRAKE SURVEY-MASON #1",
        total_gross_estimate: 275000,
        version_string: '',
        supp_gross_estimate: 0,
        operator_wi: 80,
        partner_name: "John Ross Exploration Inc",
        partner_wi: 20,
        partner_status: "Viewed",
        op_status: "FAPP",
        iapp_date: "2025-11-14",
        last_mod_date: "2025-11-14",
        legacy_chainID: 176,
        legacy_afeid: 176,
        chain_version: 1,
        source_system_id: "ba0c1c4f-81e5-4509-8089-6c9bc4919264",
        apc_partner_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        partnerID: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        partner_status_date: new Date(),
        sortID: 166,
        archived: false,
        partner_archived: false,
        apc_op_id: "a4367e56-14bf-4bd1-b0f1-fecc7d97b58c",
        operator: 'Navigator Oil',
        well_name: "DRAKE SURVEY-MASON #1"
    },
    //Operated by Corr Whit Oil & John Ross Partner NOT ARCHIVED
    {
        id: "88760c34-38b0-4bdd-a6d1-59376ec8c9be",
        created_at:  new Date("2025-11-15 00:00:03.139299+00"),
        afe_type: "DRILLING",
        afe_number: "06D111",
        description: "Drill DRAKE SURVEY-MASON #1",
        total_gross_estimate: 275000,
        version_string: '',
        supp_gross_estimate: 0,
        operator_wi: 80,
        partner_name: "John Ross Exploration Inc",
        partner_wi: 20,
        partner_status: "New",
        op_status: "FAPP",
        iapp_date: "2025-11-14",
        last_mod_date: "2025-11-14",
        legacy_chainID: 176,
        legacy_afeid: 176,
        chain_version: 1,
        source_system_id: "ba0c1c4f-81e5-4509-8089-6c9bc4919264",
        apc_partner_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        partnerID: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        partner_status_date: new Date("2025-12-17 18:45:49.184+00"),
        sortID: 165,
        archived: false,
        partner_archived: false,
        apc_op_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
        operator: 'Corr and Whit Oil',
        well_name: "DRAKE SURVEY-MASON #1"
    },
    //Operated by Corr Whit Oil & John Ross Partner NOT ARCHIVED
    {
        id: "9f1ab2b4-3f58-4d6e-8365-f5126c4d0b4c",
        created_at:  new Date("2025-10-22 17:10:47.867426+00"),
        afe_type: "DRILLING",
        afe_number: "26D001",
        description: "Drill SHIELDS-CANTRELL #1",
        total_gross_estimate: 563603.25,
        version_string: '',
        supp_gross_estimate: 0,
        operator_wi: 25,
        partner_name: "John Ross Exploration Inc",
        partner_wi: 50,
        partner_status: "New",
        op_status: "IAPP",
        iapp_date: "2025-10-08",
        last_mod_date: "2025-10-08",
        legacy_chainID: 427,
        legacy_afeid: 427,
        chain_version: 1,
        source_system_id: "8c7a4be7-e577-499d-8c7b-266a1549a020",
        apc_partner_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        partnerID: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        partner_status_date: new Date(),
        sortID: 154,
        archived: false,
        partner_archived: false,
        apc_op_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
        operator: 'Corr and Whit Oil',
        well_name: "SHIELDS-CANTRELL #1"
    },
    //Operated by Nav Oil & Athena Partner NOT ARCHIVED
    {
        id: "9f6dce03-0eea-484a-bcae-0b4659640daa",
        created_at:  new Date("2025-10-22 17:10:50.830331+00"),
        afe_type: "DRILLING",
        afe_number: "25D001",
        description: "Drill SHIELDS-CANTRELL #1",
        total_gross_estimate: 563603.25,
        version_string: "S2",
        supp_gross_estimate: 2333.1,
        operator_wi: 65,
        partner_name: "Athena Minerals Inc.",
        partner_wi: 15,
        partner_status: "Viewed",
        op_status: "IAPP",
        iapp_date: "2025-08-12",
        last_mod_date: "2025-10-08",
        legacy_chainID: 414,
        legacy_afeid: 425,
        chain_version: 3,
        source_system_id: "e217aede-6af1-4696-8776-4d56d1ac16bf",
        apc_partner_id: "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        partnerID: "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        partner_status_date: new Date(),
        sortID: 157,
        archived: false,
        partner_archived: false,
        apc_op_id: "a4367e56-14bf-4bd1-b0f1-fecc7d97b58c",
        operator: 'Navigator Oil',
        well_name: "Many"
    },
    //Operated by Nav Oil & Athena Partner NOT ARCHIVED
    {
        id: "d9238faa-2914-4215-8ca2-78384663102d",
        created_at:  new Date("2025-10-22 17:10:50.830331+00"),
        afe_type: "DRILLING",
        afe_number: "26D001",
        description: "Drill SHIELDS-CANTRELL #1",
        total_gross_estimate: 563603.25,
        version_string: '',
        supp_gross_estimate: 0,
        operator_wi: 25,
        partner_name: "Athena Minerals Inc.",
        partner_wi: 25,
        partner_status: "Approved",
        op_status: "IAPP",
        iapp_date: "2025-10-08",
        last_mod_date: "2025-10-08",
        legacy_chainID: 427,
        legacy_afeid: 427,
        chain_version: 1,
        source_system_id: "8c7a4be7-e577-499d-8c7b-266a1549a020",
        apc_partner_id: "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        partnerID: "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        partner_status_date: new Date("2025-12-12 21:55:38.237+00"),
        sortID: 158,
        archived: false,
        partner_archived: false,
        apc_op_id: "a4367e56-14bf-4bd1-b0f1-fecc7d97b58c",
        operator: 'Navigator Oil',
        well_name: "SHIELDS-CANTRELL #1"
    },
    //Operated by Nav Oil & John Ross Partner NOT ARCHIVED
    {
        id: "e5676564-f4f2-40ec-b115-52635ec0593b",
        created_at:  new Date("2025-10-22 17:10:50.830331+00"),
        afe_type: "DRILLING",
        afe_number: "25D001",
        description: "Drill SHIELDS-CANTRELL #1",
        total_gross_estimate: 563603.25,
        version_string: "S2",
        supp_gross_estimate: 2333.1,
        operator_wi: 65,
        partner_name: "John Ross Exploration Inc",
        partner_wi: 20,
        partner_status: "Approved",
        op_status: "IAPP",
        iapp_date: "2025-08-12",
        last_mod_date: "2025-10-08",
        legacy_chainID: 414,
        legacy_afeid: 425,
        chain_version: 3,
        source_system_id: "e217aede-6af1-4696-8776-4d56d1ac16bf",
        apc_partner_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        partnerID: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        partner_status_date: new Date("2026-01-19 01:26:45.053+00"),
        sortID: 155,
        archived: false,
        partner_archived: false,
        apc_op_id: "a4367e56-14bf-4bd1-b0f1-fecc7d97b58c",
        operator: 'Navigator Oil',
        well_name: "Many"
    },
    //Operated by Corr Whit Oil & Athena Partner NOT ARCHIVED
    {
        id: "e74130a2-d985-4179-b0ff-9cc7e077d77e",
        created_at:  new Date("2025-10-22 17:10:47.867426+00"),
        afe_type: "DRILLING",
        afe_number: "25D001",
        description: "Drill SHIELDS-CANTRELL #1",
        total_gross_estimate: 563603.25,
        version_string: "S2",
        supp_gross_estimate: 2333.1,
        operator_wi: 65,
        partner_name: "Athena Minerals Inc.",
        partner_wi: 15,
        partner_status: "Viewed",
        op_status: "IAPP",
        iapp_date: "2025-08-12",
        last_mod_date: "2025-10-08",
        legacy_chainID: 414,
        legacy_afeid: 425,
        chain_version: 3,
        source_system_id: "e217aede-6af1-4696-8776-4d56d1ac16bf",
        apc_partner_id: "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        partnerID: "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        partner_status_date: new Date(),
        sortID: 151,
        archived: false,
        partner_archived: false,
        apc_op_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
        operator: 'Corr and Whit Oil',
        well_name: "Many"
    },
    //Operated by Nav Oil & Athena Partner NOT ARCHIVED
    {
        id: "f7247f99-2094-45b7-acb8-6bbd7070e261",
        created_at: new Date("2025-10-22 17:10:47.867426+00"),
        afe_type: "DRILLING",
        afe_number: "26D001",
        description: "Drill SHIELDS-CANTRELL #1",
        total_gross_estimate: 563603.25,
        version_string: '',
        supp_gross_estimate: 0,
        operator_wi: 25,
        partner_name: "Athena Minerals Inc.",
        partner_wi: 25,
        partner_status: "Viewed",
        op_status: "IAPP",
        iapp_date: "2025-10-08",
        last_mod_date: "2025-10-08",
        legacy_chainID: 427,
        legacy_afeid: 427,
        chain_version: 1,
        source_system_id: "8c7a4be7-e577-499d-8c7b-266a1549a020",
        apc_partner_id: "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        partnerID: "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        partner_status_date: new Date(),
        sortID: 152,
        archived: false,
        partner_archived: false,
        apc_op_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
        operator: 'Corr and Whit Oil',
        well_name: "SHIELDS-CANTRELL #1"
    }
];

export const OperatorDropDown: OperatorOrPartnerList[] = [
    {
        apc_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
        apc_name: "Corr and Whit Oils",
        apc_address: {
            street: "6789 S Blvd",
            suite: "",
            city: "Houston",
            state: "Texas",
            zip: "90078",
            country: "United States",
            address_active: true,
            id: 66
        }
    },
    {
        apc_id: "da4bac27-30eb-40cf-9b33-ba93e3c3b3b5",
        apc_name: "Corr Mike oil",
        apc_address: {
            street: "123213",
            suite: "",
            city: "Houston",
            state: "Texas",
            zip: "90021",
            country: "United States",
            address_active: false,
            id: 67
        }
    },
    {
        apc_id: "e769175a-5d6c-48b7-a639-489f4a39e647",
        apc_name: "Corr Oil",
        apc_address: {
            street: "1234 Main",
            suite: "",
            city: "Austin",
            state: "Texas",
            zip: "90087",
            country: "United States",
            address_active: true,
            id: 52
        }
    },
    {
        apc_id: "1bcad1a0-9419-49da-999e-f7bf95339e90",
        apc_name: "Denver Oil",
        apc_address: {
            street: "5454 Broad Street",
            suite: "",
            city: "Denver",
            state: "CO",
            zip: "80202",
            country: "United States",
            address_active: true,
            id: 54
        }
    },
    {
        apc_id: "d0bc769a-b709-4d58-b563-acdf1d99c5a2",
        apc_name: "Denver Oil 2",
        apc_address: {
            street: "5434",
            suite: "",
            city: "Denv",
            state: "CO",
            zip: "90909",
            country: "United States",
            address_active: true,
            id: 55
        }
    },
    {
        apc_id: "f3f7d47d-bd77-41c7-8647-cb4b3761279c",
        apc_name: "Fortnite Oil",
        apc_address: {
            street: "98987",
            suite: "678",
            city: "Houston",
            state: "Texas",
            zip: "00988",
            country: "United States",
            address_active: true,
            id: 60
        }
    },
    {
        apc_id: "1beb7989-c65e-4c71-b68c-1a01b5e5850b",
        apc_name: "McKenzie Oil",
        apc_address: {
            street: "7898 Lousiana Blvd",
            suite: "",
            city: "Houston",
            state: "Texas",
            zip: "90087",
            country: "United States",
            address_active: true,
            id: 70
        }
    },
    {
        apc_id: "108ab43c-c1d6-4e6d-9305-c7ac3a622cc7",
        apc_name: "Mtn Bike Oil",
        apc_address: {
            street: "1234 Main Ave",
            suite: "",
            city: "Houston",
            state: "Texas",
            zip: "70020",
            country: "United States",
            address_active: true,
            id: 53
        }
    },
    {
        apc_id: "a4367e56-14bf-4bd1-b0f1-fecc7d97b58c",
        apc_name: "Navigator Corporation",
        apc_address: {
            street: "897 South Street",
            suite: "",
            city: "Dallas",
            state: "Texas",
            zip: "98987",
            country: "United States",
            address_active: true,
            id: 51
        }
    },
    {
        apc_id: "1c738a5b-1fd1-4eb1-8710-fb87cadac4d1",
        apc_name: "Raiders Operator Energy Co",
        apc_address: {
            street: "6768 S Marion Street",
            suite: "3232",
            city: "Dallas",
            state: "Texas",
            zip: "00987",
            country: "United States",
            address_active: true,
            id: 65
        }
    },
    {
        apc_id: "8093e89f-85f1-4e24-ab91-a9df11e092f6",
        apc_name: "Third Wheel Oil and Gas",
        apc_address: {
            street: "8787 S Ogden",
            suite: "3232",
            city: "Dallas",
            state: "Texas",
            zip: "90078",
            country: "United States",
            address_active: true,
            id: 68
        }
    },
    {
        apc_id: "4482e4ea-29ad-4f57-a30a-d67a6b3d8ec1",
        apc_name: "This Third Wheel Oil and Gas",
        apc_address: {
            street: "6546 Logan Av",
            suite: "9999",
            city: "Midland",
            state: "Texas",
            zip: "09879",
            country: "United States",
            address_active: false,
            id: 69
        }
    },
    {
        apc_id: "a45536f3-ac27-4f3b-9a70-b0bb536d9fc6",
        apc_name: "Thorton Oil and Company",
        apc_address: {
            street: "3456 LandMine Way",
            suite: "67787",
            city: "Dallas",
            state: "Texas",
            zip: "77789",
            country: "United States",
            address_active: true,
            id: 72
        }
    },
    {
        apc_id: "01b272f7-ea18-48bc-9443-ba2f0c9376ff",
        apc_name: "Whit and Corr Oil",
        apc_address: {
            street: "1234 Snake Street",
            suite: "",
            city: "Fortnite Land",
            state: "CO",
            zip: "90900",
            country: "United States",
            address_active: true,
            id: 50
        }
    },
    {
        apc_id: "509165a9-532d-41ee-a2d5-c35c6c2124f3",
        apc_name: "Whitaker's Oil Company",
        apc_address: {
            street: "343456 La Ave",
            suite: "",
            city: "Dnver",
            state: "Colorado",
            zip: "90087",
            country: "United States",
            address_active: true,
            id: 71
        }
    }
];

export const PartnerDropdown: OperatorOrPartnerList[] = [
    {
        apc_id: "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        apc_name: "Athena Minerals Inc.",
        apc_address: null
    },
    {
        apc_id: "d09da985-e6be-48cd-8f52-c639353792c2",
        apc_name: "Corr and Whit Oil",
        apc_address: null
    },
    {
        apc_id: "dcfb31dd-1f04-45b0-8b70-5512c1fd4b24",
        apc_name: "Corr and Whit Oil",
        apc_address: null
    },
    {
        apc_id: "996917a3-415a-4e9d-a7a9-c04c6050fd3f",
        apc_name: "Corr and Whit Oil Partner",
        apc_address: null
    },
    {
        apc_id: "9e96df60-9fa3-4330-8318-972504f1af66",
        apc_name: "Corr and white",
        apc_address: null
    },
    {
        apc_id: "77cea5bb-5adf-40d6-a945-9aef30dd3b69",
        apc_name: "Denver 3",
        apc_address: null
    },
    {
        apc_id: "03559b6a-a1c5-43b3-8623-78d9acf2697a",
        apc_name: "Denver Oil 2",
        apc_address: null
    },
    {
        apc_id: "3d721e36-a900-4506-a120-2be2793bb163",
        apc_name: "Denver Oil 2",
        apc_address: null
    },
    {
        apc_id: "55817490-5603-4a65-9223-24c1f078dd81",
        apc_name: "Energy Oil Company",
        apc_address: null
    },
    {
        apc_id: "2606ec4f-7849-41bc-8b3d-85d96f1c6948",
        apc_name: "Fortnite Oil",
        apc_address: null
    },
    {
        apc_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        apc_name: "John Ross Exploration Inc",
        apc_address: null
    },
    {
        apc_id: "db863d3c-606e-4fa6-b044-812d1f3cf6eb",
        apc_name: "Last Company",
        apc_address: null
    },
    {
        apc_id: "4045d710-476a-4ee0-b97b-be64933133ba",
        apc_name: "McKenzie Oil",
        apc_address: null
    },
    {
        apc_id: "e21bc803-be42-47d5-ab2d-6fe85ed15659",
        apc_name: "McKenzie Oil Energy",
        apc_address: null
    },
    {
        apc_id: "c99bacdd-8ee2-40b2-bbf2-2830a0b314d1",
        apc_name: "Third Wheel Energy Co.",
        apc_address: null
    },
    {
        apc_id: "a6606212-9c6a-44b2-9a8c-a04e48ea6f1f",
        apc_name: "Third Wheel Oil and Gas",
        apc_address: null
    },
    {
        apc_id: "74d7066b-d046-452d-8e04-ae3059e38dec",
        apc_name: "Thorton Oil and Company",
        apc_address: null
    },
    {
        apc_id: "3ab29a40-8ef0-4778-95fd-6c427b56496a",
        apc_name: "Whit and Corr Oil",
        apc_address: null
    }
];

export const afeReturnFromSupabase = [
    //Operated by Nav Oil & Athena is Partner NOT ARCHIVED 
    {
        "id": "4b6cebbf-ca88-4e9e-8479-dd50cc13e03W",
        "created_at": "2025-11-15T00:00:06.292558+00:00",
        "afe_type": "DRILLING",
        "afe_number": "DR26NAVAT",
        "description": "Drill DRAKE SURVEY-MASON #1",
        "total_gross_estimate": 275000,
        "version_string": null,
        "supp_gross_estimate": 0,
        "operator_wi": 80,
        "apc_partner_name": "Athena Minerals",
        "partner_wi": 20,
        "partner_status": "Viewed",
        "op_status": "FAPP",
        "iapp_date": "2025-11-14",
        "last_mod_date": "2025-11-14",
        "legacy_chainID": 176,
        "legacy_afeid": 176,
        "chain_version": 1,
        "source_system_id": "ba0c1c4f-81e5-4509-8089-6c9bc4919264",
        "apc_partner_id": "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        "apc_operator_id": null,
        "partner_status_date": null,
        "sortID": 166,
        "archived": false,
        "partner_archived": false,
        "source_partner_id": null,
        "doc_fetch_status": "done",
        "doc_fetch_attempts": 2,
        "doc_last_fetch_at": "2025-12-30T20:09:51.423+00:00",
        "doc_last_error": null,
        "source_system_partner_id": "603ea163-a6b2-4f32-a8c5-67678401bf54",
        "apc_op_id": {
            "id": "a4367e56-14bf-4bd1-b0f1-fecc7d97b58c",
            "name": "Navigator Corporation"
        },
        "well_name": "DRAKE SURVEY-MASON #1"
    },
    //Operated by Nav Oil & Athena is Partner OP Archived Partner NOT Archived 
    {
        "id": "4b6cebbf-ca88-4e9e-8479-dd50cc13e03E",
        "created_at": "2025-11-15T00:00:06.292558+00:00",
        "afe_type": "DRILLING",
        "afe_number": "AO06D111NA",
        "description": "Drill DRAKE SURVEY-MASON #1",
        "total_gross_estimate": 275000,
        "version_string": null,
        "supp_gross_estimate": 0,
        "operator_wi": 80,
        "apc_partner_name": "Athena Minerals",
        "partner_wi": 20,
        "partner_status": "Viewed",
        "op_status": "FAPP",
        "iapp_date": "2025-11-14",
        "last_mod_date": "2025-11-14",
        "legacy_chainID": 176,
        "legacy_afeid": 176,
        "chain_version": 1,
        "source_system_id": "ba0c1c4f-81e5-4509-8089-6c9bc4919264",
        "apc_partner_id": "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        "apc_operator_id": null,
        "partner_status_date": null,
        "sortID": 166,
        "archived": true,
        "partner_archived": false,
        "source_partner_id": null,
        "doc_fetch_status": "done",
        "doc_fetch_attempts": 2,
        "doc_last_fetch_at": "2025-12-30T20:09:51.423+00:00",
        "doc_last_error": null,
        "source_system_partner_id": "603ea163-a6b2-4f32-a8c5-67678401bf54",
        "apc_op_id": {
            "id": "a4367e56-14bf-4bd1-b0f1-fecc7d97b58c",
            "name": "Navigator Corporation"
        },
        "well_name": "DRAKE SURVEY-MASON #1"
    },
    //Operated by Nav Oil & Athena is Partner OP NOT Archived Partner IS Archived 
    {
        "id": "4b6cebbf-ca88-4e9e-8479-dd50cc13e03Q",
        "created_at": "2025-11-15T00:00:06.292558+00:00",
        "afe_type": "DRILLING",
        "afe_number": "PA07D111NA",
        "description": "Drill DRAKE SURVEY-MASON #1",
        "total_gross_estimate": 275000,
        "version_string": null,
        "supp_gross_estimate": 0,
        "operator_wi": 80,
        "apc_partner_name": "Athena Minerals",
        "partner_wi": 20,
        "partner_status": "Viewed",
        "op_status": "FAPP",
        "iapp_date": "2025-11-14",
        "last_mod_date": "2025-11-14",
        "legacy_chainID": 176,
        "legacy_afeid": 176,
        "chain_version": 1,
        "source_system_id": "ba0c1c4f-81e5-4509-8089-6c9bc4919264",
        "apc_partner_id": "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        "apc_operator_id": null,
        "partner_status_date": null,
        "sortID": 166,
        "archived": false,
        "partner_archived": true,
        "source_partner_id": null,
        "doc_fetch_status": "done",
        "doc_fetch_attempts": 2,
        "doc_last_fetch_at": "2025-12-30T20:09:51.423+00:00",
        "doc_last_error": null,
        "source_system_partner_id": "603ea163-a6b2-4f32-a8c5-67678401bf54",
        "apc_op_id": {
            "id": "a4367e56-14bf-4bd1-b0f1-fecc7d97b58c",
            "name": "Navigator Corporation"
        },
        "well_name": "DRAKE SURVEY-MASON #1"
    },
    //Operated by Corr Whit & John Ross is Partner NOT ARCHIVED 
    {
        "id": "88760c34-38b0-4bdd-a6d1-59376ec8c9be",
        "created_at": "2025-11-15T00:00:03.139299+00:00",
        "afe_type": "DRILLING",
        "afe_number": "06D111CJ",
        "description": "Drill DRAKE SURVEY-MASON #1",
        "total_gross_estimate": 275000,
        "version_string": null,
        "supp_gross_estimate": 0,
        "operator_wi": 80,
        "apc_partner_name": "John Ross Exploration Inc",
        "partner_wi": 20,
        "partner_status": "Approved",
        "op_status": "FAPP",
        "iapp_date": "2025-11-14",
        "last_mod_date": "2025-11-14",
        "legacy_chainID": 176,
        "legacy_afeid": 176,
        "chain_version": 1,
        "source_system_id": "ba0c1c4f-81e5-4509-8089-6c9bc4919264",
        "apc_partner_id": "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        "apc_operator_id": null,
        "partner_status_date": "2025-12-17T18:45:49.184+00:00",
        "sortID": 165,
        "archived": false,
        "partner_archived": false,
        "source_partner_id": null,
        "doc_fetch_status": "done",
        "doc_fetch_attempts": 2,
        "doc_last_fetch_at": "2025-12-30T20:09:48.995+00:00",
        "doc_last_error": null,
        "source_system_partner_id": "603ea163-a6b2-4f32-a8c5-67678401bf54",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils"
        },
        "well_name": "DRAKE SURVEY-MASON #1"
    },
    //Operated by Corr Whit & Athena is Partner NOT ARCHIVED 
    {
        "id": "e74130a2-d985-4179-b0ff-9cc7e077d77e",
        "created_at": "2025-10-22T17:10:47.867426+00:00",
        "afe_type": "DRILLING",
        "afe_number": "25D001CA",
        "description": "Drill SHIELDS-CANTRELL #1",
        "total_gross_estimate": 563603.25,
        "version_string": "S2",
        "supp_gross_estimate": 2333.1,
        "operator_wi": 65,
        "apc_partner_name": "Athena Minerals Inc.",
        "partner_wi": 15,
        "partner_status": "Viewed",
        "op_status": "IAPP",
        "iapp_date": "2025-08-12",
        "last_mod_date": "2025-10-08",
        "legacy_chainID": 414,
        "legacy_afeid": 425,
        "chain_version": 3,
        "source_system_id": "e217aede-6af1-4696-8776-4d56d1ac16bf",
        "apc_partner_id": "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        "apc_operator_id": null,
        "partner_status_date": null,
        "sortID": 151,
        "archived": false,
        "partner_archived": false,
        "source_partner_id": null,
        "doc_fetch_status": "pending",
        "doc_fetch_attempts": 0,
        "doc_last_fetch_at": null,
        "doc_last_error": null,
        "source_system_partner_id": "475e4d12-8a0b-4264-933d-d960936852b2",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils"
        },
        "well_name": "Many"
    },
    //Operated by Corr Whit & Athena is Partner NOT ARCHIVED 
    {
        "id": "f7247f99-2094-45b7-acb8-6bbd7070e261",
        "created_at": "2025-10-22T17:10:47.867426+00:00",
        "afe_type": "DRILLING",
        "afe_number": "26D001CA",
        "description": "Drill SHIELDS-CANTRELL #1",
        "total_gross_estimate": 563603.25,
        "version_string": null,
        "supp_gross_estimate": 0,
        "operator_wi": 25,
        "apc_partner_name": "Athena Minerals Inc.",
        "partner_wi": 25,
        "partner_status": "Viewed",
        "op_status": "IAPP",
        "iapp_date": "2025-10-08",
        "last_mod_date": "2025-10-08",
        "legacy_chainID": 427,
        "legacy_afeid": 427,
        "chain_version": 1,
        "source_system_id": "8c7a4be7-e577-499d-8c7b-266a1549a020",
        "apc_partner_id": "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        "apc_operator_id": null,
        "partner_status_date": null,
        "sortID": 152,
        "archived": false,
        "partner_archived": false,
        "source_partner_id": null,
        "doc_fetch_status": "pending",
        "doc_fetch_attempts": 0,
        "doc_last_fetch_at": null,
        "doc_last_error": null,
        "source_system_partner_id": "475e4d12-8a0b-4264-933d-d960936852b2",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils"
        },
        "well_name": "SHIELDS-CANTRELL #1"
    },
    //Operated by Corr Whit & John Ross is Partner NOT ARCHIVED 
    {
        "id": "34d7bd01-d43b-4e3a-a586-34f0297a8008",
        "created_at": "2025-10-22T17:10:47.867426+00:00",
        "afe_type": "DRILLING",
        "afe_number": "25D001CJ",
        "description": "Drill SHIELDS-CANTRELL #1",
        "total_gross_estimate": 563603.25,
        "version_string": "S2",
        "supp_gross_estimate": 2333.1,
        "operator_wi": 65,
        "apc_partner_name": "John Ross Exploration Inc",
        "partner_wi": 20,
        "partner_status": "New",
        "op_status": "IAPP",
        "iapp_date": "2025-08-12",
        "last_mod_date": "2025-10-08",
        "legacy_chainID": 414,
        "legacy_afeid": 425,
        "chain_version": 3,
        "source_system_id": "e217aede-6af1-4696-8776-4d56d1ac16bf",
        "apc_partner_id": "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        "apc_operator_id": null,
        "partner_status_date": null,
        "sortID": 153,
        "archived": false,
        "partner_archived": false,
        "source_partner_id": null,
        "doc_fetch_status": "pending",
        "doc_fetch_attempts": 0,
        "doc_last_fetch_at": null,
        "doc_last_error": null,
        "source_system_partner_id": "603ea163-a6b2-4f32-a8c5-67678401bf54",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils"
        },
        "well_name": "Many"
    },
    //Operated by Corr Whit & John Ross is Partner NOT ARCHIVED 
    {
        "id": "9f1ab2b4-3f58-4d6e-8365-f5126c4d0b4c",
        "created_at": "2025-10-22T17:10:47.867426+00:00",
        "afe_type": "DRILLING",
        "afe_number": "26D001CJ",
        "description": "Drill SHIELDS-CANTRELL #1",
        "total_gross_estimate": 563603.25,
        "version_string": null,
        "supp_gross_estimate": 0,
        "operator_wi": 25,
        "apc_partner_name": "John Ross Exploration Inc",
        "partner_wi": 50,
        "partner_status": "New",
        "op_status": "IAPP",
        "iapp_date": "2025-10-08",
        "last_mod_date": "2025-10-08",
        "legacy_chainID": 427,
        "legacy_afeid": 427,
        "chain_version": 1,
        "source_system_id": "8c7a4be7-e577-499d-8c7b-266a1549a020",
        "apc_partner_id": "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        "apc_operator_id": null,
        "partner_status_date": null,
        "sortID": 154,
        "archived": false,
        "partner_archived": false,
        "source_partner_id": null,
        "doc_fetch_status": "pending",
        "doc_fetch_attempts": 0,
        "doc_last_fetch_at": null,
        "doc_last_error": null,
        "source_system_partner_id": "603ea163-a6b2-4f32-a8c5-67678401bf54",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils"
        },
        "well_name": "SHIELDS-CANTRELL #1"
    },
    //Operated by Nav Oil & Athena is Partner IS ARCHIVED 
    {
        "id": "4b6cebbf-ca88-4e9e-8479-dd50cc13e03z",
        "created_at": "2025-11-15T00:00:06.292558+00:00",
        "afe_type": "DRILLING",
        "afe_number": "A06D111NA",
        "description": "Drill DRAKE SURVEY-MASON #1",
        "total_gross_estimate": 275000,
        "version_string": null,
        "supp_gross_estimate": 0,
        "operator_wi": 80,
        "apc_partner_name": "Athena Minerals",
        "partner_wi": 20,
        "partner_status": "Viewed",
        "op_status": "FAPP",
        "iapp_date": "2025-11-14",
        "last_mod_date": "2025-11-14",
        "legacy_chainID": 176,
        "legacy_afeid": 176,
        "chain_version": 1,
        "source_system_id": "ba0c1c4f-81e5-4509-8089-6c9bc4919264",
        "apc_partner_id": "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        "apc_operator_id": null,
        "partner_status_date": null,
        "sortID": 166,
        "archived": true,
        "partner_archived": true,
        "source_partner_id": null,
        "doc_fetch_status": "done",
        "doc_fetch_attempts": 2,
        "doc_last_fetch_at": "2025-12-30T20:09:51.423+00:00",
        "doc_last_error": null,
        "source_system_partner_id": "603ea163-a6b2-4f32-a8c5-67678401bf54",
        "apc_op_id": {
            "id": "a4367e56-14bf-4bd1-b0f1-fecc7d97b58c",
            "name": "Navigator Corporation"
        },
        "well_name": "DRAKE SURVEY-MASON #1"
    },
    //Operated by Corr Whit & John Ross is Partner IS ARCHIVED 
    {
        "id": "88760c34-38b0-4bdd-a6d1-59376ec8c9be",
        "created_at": "2025-11-15T00:00:03.139299+00:00",
        "afe_type": "DRILLING",
        "afe_number": "A06D111CJ",
        "description": "Drill DRAKE SURVEY-MASON #1",
        "total_gross_estimate": 275000,
        "version_string": null,
        "supp_gross_estimate": 0,
        "operator_wi": 80,
        "apc_partner_name": "John Ross Exploration Inc",
        "partner_wi": 20,
        "partner_status": "Approved",
        "op_status": "FAPP",
        "iapp_date": "2025-11-14",
        "last_mod_date": "2025-11-14",
        "legacy_chainID": 176,
        "legacy_afeid": 176,
        "chain_version": 1,
        "source_system_id": "ba0c1c4f-81e5-4509-8089-6c9bc4919264",
        "apc_partner_id": "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        "apc_operator_id": null,
        "partner_status_date": "2025-12-17T18:45:49.184+00:00",
        "sortID": 165,
        "archived": true,
        "partner_archived": true,
        "source_partner_id": null,
        "doc_fetch_status": "done",
        "doc_fetch_attempts": 2,
        "doc_last_fetch_at": "2025-12-30T20:09:48.995+00:00",
        "doc_last_error": null,
        "source_system_partner_id": "603ea163-a6b2-4f32-a8c5-67678401bf54",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils"
        },
        "well_name": "DRAKE SURVEY-MASON #1"
    },
    //Operated by Corr Whit & Athena is Partner IS ARCHIVED 
    {
        "id": "e74130a2-d985-4179-b0ff-9cc7e077d97e",
        "created_at": "2025-10-22T17:10:47.867426+00:00",
        "afe_type": "DRILLING",
        "afe_number": "A25D001CA",
        "description": "Drill SHIELDS-CANTRELL #1",
        "total_gross_estimate": 563603.25,
        "version_string": "S2",
        "supp_gross_estimate": 2333.1,
        "operator_wi": 65,
        "apc_partner_name": "Athena Minerals Inc.",
        "partner_wi": 15,
        "partner_status": "Viewed",
        "op_status": "IAPP",
        "iapp_date": "2025-08-12",
        "last_mod_date": "2025-10-08",
        "legacy_chainID": 414,
        "legacy_afeid": 425,
        "chain_version": 3,
        "source_system_id": "e217aede-6af1-4696-8776-4d56d1ac16bf",
        "apc_partner_id": "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        "apc_operator_id": null,
        "partner_status_date": null,
        "sortID": 151,
        "archived": true,
        "partner_archived": true,
        "source_partner_id": null,
        "doc_fetch_status": "pending",
        "doc_fetch_attempts": 0,
        "doc_last_fetch_at": null,
        "doc_last_error": null,
        "source_system_partner_id": "475e4d12-8a0b-4264-933d-d960936852b2",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils"
        },
        "well_name": "Many"
    },
    //Operated by Corr Whit & Athena is Partner IS ARCHIVED 
    {
        "id": "f7247f99-2094-45b7-acb8-2bbd7070e261",
        "created_at": "2025-10-22T17:10:47.867426+00:00",
        "afe_type": "DRILLING",
        "afe_number": "A26D001CA",
        "description": "Drill SHIELDS-CANTRELL #1",
        "total_gross_estimate": 563603.25,
        "version_string": null,
        "supp_gross_estimate": 0,
        "operator_wi": 25,
        "apc_partner_name": "Athena Minerals Inc.",
        "partner_wi": 25,
        "partner_status": "Viewed",
        "op_status": "IAPP",
        "iapp_date": "2025-10-08",
        "last_mod_date": "2025-10-08",
        "legacy_chainID": 427,
        "legacy_afeid": 427,
        "chain_version": 1,
        "source_system_id": "8c7a4be7-e577-499d-8c7b-266a1549a020",
        "apc_partner_id": "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        "apc_operator_id": null,
        "partner_status_date": null,
        "sortID": 152,
        "archived": true,
        "partner_archived": true,
        "source_partner_id": null,
        "doc_fetch_status": "pending",
        "doc_fetch_attempts": 0,
        "doc_last_fetch_at": null,
        "doc_last_error": null,
        "source_system_partner_id": "475e4d12-8a0b-4264-933d-d960936852b2",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils"
        },
        "well_name": "SHIELDS-CANTRELL #1"
    },
    //Operated by Corr Whit & John Ross is Partner IS ARCHIVED 
    {
        "id": "34d2bd01-d43b-4e3a-a586-34f0297a8008",
        "created_at": "2025-10-22T17:10:47.867426+00:00",
        "afe_type": "DRILLING",
        "afe_number": "A25D001CJ",
        "description": "Drill SHIELDS-CANTRELL #1",
        "total_gross_estimate": 563603.25,
        "version_string": "S2",
        "supp_gross_estimate": 2333.1,
        "operator_wi": 65,
        "apc_partner_name": "John Ross Exploration Inc",
        "partner_wi": 20,
        "partner_status": "New",
        "op_status": "IAPP",
        "iapp_date": "2025-08-12",
        "last_mod_date": "2025-10-08",
        "legacy_chainID": 414,
        "legacy_afeid": 425,
        "chain_version": 3,
        "source_system_id": "e217aede-6af1-4696-8776-4d56d1ac16bf",
        "apc_partner_id": "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        "apc_operator_id": null,
        "partner_status_date": null,
        "sortID": 153,
        "archived": true,
        "partner_archived": true,
        "source_partner_id": null,
        "doc_fetch_status": "pending",
        "doc_fetch_attempts": 0,
        "doc_last_fetch_at": null,
        "doc_last_error": null,
        "source_system_partner_id": "603ea163-a6b2-4f32-a8c5-67678401bf54",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils"
        },
        "well_name": "Many"
    },
    //Operated by Corr Whit & John Ross is Partner IS ARCHIVED 
    {
        "id": "9f4ab2b4-3f58-4d6e-8365-f5126c4d0b4c",
        "created_at": "2025-10-22T17:10:47.867426+00:00",
        "afe_type": "DRILLING",
        "afe_number": "A26D001CJ",
        "description": "Drill SHIELDS-CANTRELL #1",
        "total_gross_estimate": 563603.25,
        "version_string": null,
        "supp_gross_estimate": 0,
        "operator_wi": 25,
        "apc_partner_name": "John Ross Exploration Inc",
        "partner_wi": 50,
        "partner_status": "New",
        "op_status": "IAPP",
        "iapp_date": "2025-10-08",
        "last_mod_date": "2025-10-08",
        "legacy_chainID": 427,
        "legacy_afeid": 427,
        "chain_version": 1,
        "source_system_id": "8c7a4be7-e577-499d-8c7b-266a1549a020",
        "apc_partner_id": "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        "apc_operator_id": null,
        "partner_status_date": null,
        "sortID": 154,
        "archived": true,
        "partner_archived": true,
        "source_partner_id": null,
        "doc_fetch_status": "pending",
        "doc_fetch_attempts": 0,
        "doc_last_fetch_at": null,
        "doc_last_error": null,
        "source_system_partner_id": "603ea163-a6b2-4f32-a8c5-67678401bf54",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils"
        },
        "well_name": "SHIELDS-CANTRELL #1"
    }
];

// ── Operator IDs (apc_op_id.id on AFEs they generate) ─────────────────────────
export const apc_op_id_CW       = '3b34a78a-13ad-40b5-aecd-268d56dd5e0d'; // Corr and Whit Oils
export const apc_op_id_Nav      = 'a4367e56-14bf-4bd1-b0f1-fecc7d97b58c'; // Navigator Corporation
export const apc_op_id_JohnRoss = '8ed0a285-0011-4f56-962f-c46bc0889d1b'; // John Ross Exploration Inc
export const apc_op_id_Athena   = '626390b5-6f63-4caa-a0aa-b333a15eaf59'; // Athena Minerals Inc.
 
// ── Partner IDs (apc_partner_id on AFEs they receive) ─────────────────────────
export const apc_partner_id_CW       = '712abc45-def0-4321-9876-abcdef012345'; // Corr and Whit Oils (as partner)
export const apc_partner_id_Nav      = '891bcd56-ef01-4abc-8765-bcdef0123456'; // Navigator Corporation (as partner)
export const apc_partner_id_JohnRoss = '603ea163-a6b2-4f32-a8c5-67678401bf54'; // John Ross Exploration Inc (as partner)
export const apc_partner_id_Athena   = '475e4d12-8a0b-4264-933d-d960936852b2'; // Athena Minerals Inc. (as partner)
 
// ── Company Name Labels ────────────────────────────────────────────────────────
export const apc_name_CW       = 'Corr and Whit Oils';
export const apc_name_Nav      = 'Navigator Corporation';
export const apc_name_JohnRoss = 'John Ross Exploration Inc';
export const apc_name_Athena   = 'Athena Minerals Inc.';
 
// ── Address IDs ────────────────────────────────────────────────────────────────
export const apc_address_id_CW       = 66;
export const apc_address_id_partner_CW       = 76;
export const apc_address_id_Nav      = 20;
export const apc_address_id_JohnRoss = 10;
export const apc_address_id_Athena   = 30;
 
// ── Source System IDs (one per unique well chain; versions share the same one) ─
const src_Drake   = 'ba0c1c4f-81e5-4509-8089-6c9bc4919264'; // Drake Survey-Mason #1
const src_Shields = 'e217aede-6af1-4696-8776-4d56d1ac16bf'; // Shields-Cantrell #1
const src_Harmon  = '8c7a4be7-e577-499d-8c7b-266a1549a020'; // Harmon #1
const src_Tillman = 'c3e12abc-9911-4f01-b123-7d89ef012345'; // Tillman #2
const src_Garrett = 'f9b34c12-1234-4abc-8def-0987654321ab'; // Garrett #3

const todayDate = new Date();
 
// ── AFE Fixtures ───────────────────────────────────────────────────────────────
//
// Operator/Partner matrix — every company appears on both sides:
//
//   AFE#        Operator    Partner       Archived    Partner Archived     Versions        Users that Can See it
//   06D111CJ    CW          John Ross     No                               None            Rachel Green(Op) Ross Geller(Op)
//   25D001CA    CW          Athena        No                               Base, S1, S2    Rachel Green(Op) Ross Geller(Op)
//   06D111NJ    Nav         John Ross     No                               None
//   06D111NA    Nav         Athena        No                               None
//   06D111JC    John Ross   CW            No                               None            Monica Geller(Non-Op) Rachel Green(Non-Op)
//   06D111JA    John Ross   Athena        Yes                              None
//   06D111AC    Athena      CW            Yes                              None            Monica Geller(Non-Op-Archived) Rachel Green(Non-Op-Archived)
//   06D111AN    Athena      Nav           No                               None
//
// User visibility (role 2 = operator view via apc_op_id, role 4 = partner view via apc_partner_id):
//
//   CW user       op  (role 2, apc_op_id_CW):       06D111CJ, 25D001CA (base/S1/S2)
//                 nonOp(role 4, apc_partner_id_CW):   06D111JC, 06D111AC (archived)
//
//   Nav user      op  (role 2, apc_op_id_Nav):       06D111NJ, 06D111NA
//                 part(role 4, apc_partner_id_Nav):   06D111AN
//
//   John Ross     op  (role 2, apc_op_id_JohnRoss):  06D111JC, 06D111JA (archived)
//                 part(role 4, apc_partner_id_JohnRoss): 06D111CJ, 06D111NJ
//
//   Athena        op  (role 2, apc_op_id_Athena):    06D111JA (archived), 06D111AC (archived), 06D111AN
//                 part(role 4, apc_partner_id_Athena): 25D001CA (base/S1/S2), 06D111NA
 
export const afesReturnedFromSupabase = [
 
    // ── CW (Operator) → John Ross (Partner) | NOT archived ──────────────────────
    {
        id: '88760c34-38b0-4bdd-a6d1-59376ec8c9be',
        created_at: '2025-11-15T00:00:03.139299+00:00',
        afe_type: 'DRILLING',
        afe_number: '06D111CJ',
        description: 'Drill DRAKE SURVEY-MASON #1',
        total_gross_estimate: 275000,
        version_string: null,
        supp_gross_estimate: 0,
        operator_wi: 80,
        apc_partner_name: apc_name_JohnRoss,
        partner_wi: 20,
        partner_status: 'Approved',
        op_status: 'FAPP',
        iapp_date: '2025-11-14',
        last_mod_date: '2025-11-14',
        legacy_chainID: 176,
        legacy_afeid: 176,
        chain_version: 1,
        source_system_id: src_Drake,
        apc_partner_id: apc_partner_id_JohnRoss,
        apc_operator_id: null,
        partner_status_date: '2025-12-17T18:45:49.184+00:00',
        sortID: 165,
        archived: false,
        partner_archived: false,
        source_partner_id: null,
        doc_fetch_status: 'done',
        doc_fetch_attempts: 2,
        doc_last_fetch_at: '2025-12-30T20:09:48.995+00:00',
        doc_last_error: null,
        source_system_partner_id: apc_partner_id_JohnRoss,
        apc_op_id: { id: apc_op_id_CW, name: apc_name_CW },
        well_name: 'DRAKE SURVEY-MASON #1',
    },
 
    // ── CW (Operator) → Athena (Partner) | NOT archived | versioned chain ───────
    // Base version
    {
        id: 'e74130a2-d985-4179-b0ff-9cc7e077d77e',
        created_at: '2025-08-12T17:10:47.867426+00:00',
        afe_type: 'DRILLING',
        afe_number: '25D001CA',
        description: 'Drill SHIELDS-CANTRELL #1',
        total_gross_estimate: 500000,
        version_string: null,
        supp_gross_estimate: 0,
        operator_wi: 65,
        apc_partner_name: apc_name_Athena,
        partner_wi: 15,
        partner_status: 'Approved',
        op_status: 'FAPP',
        iapp_date: '2025-08-12',
        last_mod_date: '2025-08-12',
        legacy_chainID: 414,
        legacy_afeid: 414,
        chain_version: 1,
        source_system_id: src_Shields,
        apc_partner_id: apc_partner_id_Athena,
        apc_operator_id: null,
        partner_status_date: '2025-09-01T10:00:00.000+00:00',
        sortID: 150,
        archived: false,
        partner_archived: false,
        source_partner_id: null,
        doc_fetch_status: 'done',
        doc_fetch_attempts: 1,
        doc_last_fetch_at: '2025-12-30T20:09:51.423+00:00',
        doc_last_error: null,
        source_system_partner_id: apc_partner_id_Athena,
        apc_op_id: { id: apc_op_id_CW, name: apc_name_CW },
        well_name: 'SHIELDS-CANTRELL #1',
    },
    // S1 version
    {
        id: 'e74130a2-d985-4179-b0ff-9cc7e077d77f',
        created_at: '2025-09-15T17:10:47.867426+00:00',
        afe_type: 'DRILLING',
        afe_number: '25D001CA',
        description: 'Drill SHIELDS-CANTRELL #1',
        total_gross_estimate: 530000,
        version_string: 'S1',
        supp_gross_estimate: 30000,
        operator_wi: 65,
        apc_partner_name: apc_name_Athena,
        partner_wi: 15,
        partner_status: 'Approved',
        op_status: 'FAPP',
        iapp_date: '2025-08-12',
        last_mod_date: '2025-09-15',
        legacy_chainID: 414,
        legacy_afeid: 418,
        chain_version: 2,
        source_system_id: src_Shields,
        apc_partner_id: apc_partner_id_Athena,
        apc_operator_id: null,
        partner_status_date: '2025-09-20T10:00:00.000+00:00',
        sortID: 151,
        archived: false,
        partner_archived: false,
        source_partner_id: null,
        doc_fetch_status: 'done',
        doc_fetch_attempts: 1,
        doc_last_fetch_at: '2025-12-30T20:09:51.423+00:00',
        doc_last_error: null,
        source_system_partner_id: apc_partner_id_Athena,
        apc_op_id: { id: apc_op_id_CW, name: apc_name_CW },
        well_name: 'SHIELDS-CANTRELL #1',
    },
    // S2 version
    {
        id: 'e74130a2-d985-4179-b0ff-9cc7e077d780',
        created_at: '2025-10-22T17:10:47.867426+00:00',
        afe_type: 'DRILLING',
        afe_number: '25D001CA',
        description: 'Drill SHIELDS-CANTRELL #1',
        total_gross_estimate: 563603.25,
        version_string: 'S2',
        supp_gross_estimate: 2333.1,
        operator_wi: 65,
        apc_partner_name: apc_name_Athena,
        partner_wi: 15,
        partner_status: 'Viewed',
        op_status: 'IAPP',
        iapp_date: '2025-08-12',
        last_mod_date: '2025-10-08',
        legacy_chainID: 414,
        legacy_afeid: 425,
        chain_version: 3,
        source_system_id: src_Shields,
        apc_partner_id: apc_partner_id_Athena,
        apc_operator_id: null,
        partner_status_date: null,
        sortID: 152,
        archived: false,
        partner_archived: false,
        source_partner_id: null,
        doc_fetch_status: 'pending',
        doc_fetch_attempts: 0,
        doc_last_fetch_at: null,
        doc_last_error: null,
        source_system_partner_id: apc_partner_id_Athena,
        apc_op_id: { id: apc_op_id_CW, name: apc_name_CW },
        well_name: 'SHIELDS-CANTRELL #1',
    },
 
    // ── Nav (Operator) → John Ross (Partner) | NOT archived ─────────────────────
    {
        id: '1a2b3c4d-0001-4aaa-8000-aaaaaaaaaaaa',
        created_at: '2025-11-15T00:00:06.292558+00:00',
        afe_type: 'DRILLING',
        afe_number: '06D111NJ',
        description: 'Drill HARMON #1',
        total_gross_estimate: 310000,
        version_string: null,
        supp_gross_estimate: 0,
        operator_wi: 75,
        apc_partner_name: apc_name_JohnRoss,
        partner_wi: 25,
        partner_status: 'New',
        op_status: 'IAPP',
        iapp_date: '2025-11-14',
        last_mod_date: '2025-11-14',
        legacy_chainID: 200,
        legacy_afeid: 200,
        chain_version: 1,
        source_system_id: src_Harmon,
        apc_partner_id: apc_partner_id_JohnRoss,
        apc_operator_id: null,
        partner_status_date: null,
        sortID: 170,
        archived: false,
        partner_archived: false,
        source_partner_id: null,
        doc_fetch_status: 'done',
        doc_fetch_attempts: 1,
        doc_last_fetch_at: '2025-12-30T20:09:51.423+00:00',
        doc_last_error: null,
        source_system_partner_id: apc_partner_id_JohnRoss,
        apc_op_id: { id: apc_op_id_Nav, name: apc_name_Nav },
        well_name: 'HARMON #1',
    },
 
    // ── Nav (Operator) → Athena (Partner) | NOT archived ────────────────────────
    {
        id: '4b6cebbf-ca88-4e9e-8479-dd50cc13e03w',
        created_at: '2025-11-15T00:00:06.292558+00:00',
        afe_type: 'DRILLING',
        afe_number: '06D111NA',
        description: 'Drill DRAKE SURVEY-MASON #1',
        total_gross_estimate: 275000,
        version_string: null,
        supp_gross_estimate: 0,
        operator_wi: 80,
        apc_partner_name: apc_name_Athena,
        partner_wi: 20,
        partner_status: 'Viewed',
        op_status: 'FAPP',
        iapp_date: '2025-11-14',
        last_mod_date: '2025-11-14',
        legacy_chainID: 177,
        legacy_afeid: 177,
        chain_version: 1,
        source_system_id: src_Drake,
        apc_partner_id: apc_partner_id_Athena,
        apc_operator_id: null,
        partner_status_date: null,
        sortID: 166,
        archived: false,
        partner_archived: false,
        source_partner_id: null,
        doc_fetch_status: 'done',
        doc_fetch_attempts: 2,
        doc_last_fetch_at: '2025-12-30T20:09:51.423+00:00',
        doc_last_error: null,
        source_system_partner_id: apc_partner_id_Athena,
        apc_op_id: { id: apc_op_id_Nav, name: apc_name_Nav },
        well_name: 'DRAKE SURVEY-MASON #1',
    },
 
    // ── John Ross (Operator) → CW (Partner) | NOT archived ──────────────────────
    {
        id: '2b3c4d5e-0002-4bbb-9000-bbbbbbbbbbbb',
        created_at: '2025-10-01T12:00:00.000000+00:00',
        afe_type: 'DRILLING',
        afe_number: '06D111JC',
        description: 'Drill TILLMAN #2',
        total_gross_estimate: 420000,
        version_string: null,
        supp_gross_estimate: 0,
        operator_wi: 60,
        apc_partner_name: apc_name_CW,
        partner_wi: 40,
        partner_status: 'New',
        op_status: 'IAPP',
        iapp_date: '2025-09-30',
        last_mod_date: '2025-09-30',
        legacy_chainID: 300,
        legacy_afeid: 300,
        chain_version: 1,
        source_system_id: src_Tillman,
        apc_partner_id: apc_partner_id_CW,
        apc_operator_id: null,
        partner_status_date: null,
        sortID: 180,
        archived: false,
        partner_archived: false,
        source_partner_id: null,
        doc_fetch_status: 'pending',
        doc_fetch_attempts: 0,
        doc_last_fetch_at: null,
        doc_last_error: null,
        source_system_partner_id: apc_partner_id_CW,
        apc_op_id: { id: apc_op_id_JohnRoss, name: apc_name_JohnRoss },
        well_name: 'TILLMAN #2',
    },

    {
        id: '2b3c4d5e-0002-4bbb-9000-bbbbbbbbbbbb',
        created_at: '2025-10-01T12:00:00.000000+00:00',
        afe_type: 'DRILLING',
        afe_number: '099D111JC',
        description: 'Drill TILLMAN #2',
        total_gross_estimate: 420000,
        version_string: null,
        supp_gross_estimate: 0,
        operator_wi: 60,
        apc_partner_name: apc_name_CW,
        partner_wi: 40,
        partner_status: 'New',
        op_status: 'IAPP',
        iapp_date: todayDate,
        last_mod_date: '2025-09-30',
        legacy_chainID: 300,
        legacy_afeid: 300,
        chain_version: 1,
        source_system_id: src_Tillman,
        apc_partner_id: apc_partner_id_CW,
        apc_operator_id: null,
        partner_status_date: null,
        sortID: 180,
        archived: false,
        partner_archived: false,
        source_partner_id: null,
        doc_fetch_status: 'pending',
        doc_fetch_attempts: 0,
        doc_last_fetch_at: null,
        doc_last_error: null,
        source_system_partner_id: apc_partner_id_CW,
        apc_op_id: { id: apc_op_id_JohnRoss, name: apc_name_JohnRoss },
        well_name: 'TILLMAN #2',
    },

    {
        id: '2b3c4d5e-0002-4bbb-9000-bbbbbbbbbbbb',
        created_at: '2025-10-01T12:00:00.000000+00:00',
        afe_type: 'DRILLING',
        afe_number: '1199D111JC',
        description: 'Drill TILLMAN #2',
        total_gross_estimate: 420000,
        version_string: null,
        supp_gross_estimate: 0,
        operator_wi: 60,
        apc_partner_name: apc_name_CW,
        partner_wi: 40,
        partner_status: 'New',
        op_status: 'IAPP',
        iapp_date: null,
        last_mod_date: '2025-09-30',
        legacy_chainID: 300,
        legacy_afeid: 300,
        chain_version: 1,
        source_system_id: src_Tillman,
        apc_partner_id: apc_partner_id_CW,
        apc_operator_id: null,
        partner_status_date: null,
        sortID: 180,
        archived: false,
        partner_archived: false,
        source_partner_id: null,
        doc_fetch_status: 'pending',
        doc_fetch_attempts: 0,
        doc_last_fetch_at: null,
        doc_last_error: null,
        source_system_partner_id: apc_partner_id_CW,
        apc_op_id: { id: apc_op_id_JohnRoss, name: apc_name_JohnRoss },
        well_name: 'TILLMAN #2',
    },
 
    // ── John Ross (Operator) → Athena (Partner) | IS archived ───────────────────
    {
        id: '3c4d5e6f-0003-4ccc-a000-cccccccccccc',
        created_at: '2025-07-01T12:00:00.000000+00:00',
        afe_type: 'DRILLING',
        afe_number: '06D111JA',
        description: 'Drill GARRETT #3',
        total_gross_estimate: 198000,
        version_string: null,
        supp_gross_estimate: 0,
        operator_wi: 70,
        apc_partner_name: apc_name_Athena,
        partner_wi: 30,
        partner_status: 'Approved',
        op_status: 'FAPP',
        iapp_date: '2025-06-30',
        last_mod_date: '2025-06-30',
        legacy_chainID: 350,
        legacy_afeid: 350,
        chain_version: 1,
        source_system_id: src_Garrett,
        apc_partner_id: apc_partner_id_Athena,
        apc_operator_id: null,
        partner_status_date: '2025-07-15T10:00:00.000+00:00',
        sortID: 140,
        archived: true,
        partner_archived: true,
        source_partner_id: null,
        doc_fetch_status: 'done',
        doc_fetch_attempts: 2,
        doc_last_fetch_at: '2025-12-30T20:09:51.423+00:00',
        doc_last_error: null,
        source_system_partner_id: apc_partner_id_Athena,
        apc_op_id: { id: apc_op_id_JohnRoss, name: apc_name_JohnRoss },
        well_name: 'GARRETT #3',
    },
 
    // ── Athena (Operator) → CW (Partner) | IS archived ──────────────────────────
    {
        id: '4d5e6f7a-0004-4ddd-b000-dddddddddddd',
        created_at: '2025-06-01T12:00:00.000000+00:00',
        afe_type: 'DRILLING',
        afe_number: '06D111AC',
        description: 'Drill HARMON #1',
        total_gross_estimate: 350000,
        version_string: null,
        supp_gross_estimate: 0,
        operator_wi: 55,
        apc_partner_name: apc_name_CW,
        partner_wi: 45,
        partner_status: 'Viewed',
        op_status: 'FAPP',
        iapp_date: '2025-05-30',
        last_mod_date: '2025-05-30',
        legacy_chainID: 400,
        legacy_afeid: 400,
        chain_version: 1,
        source_system_id: src_Harmon,
        apc_partner_id: apc_partner_id_CW,
        apc_operator_id: null,
        partner_status_date: null,
        sortID: 130,
        archived: true,
        partner_archived: true,
        source_partner_id: null,
        doc_fetch_status: 'done',
        doc_fetch_attempts: 3,
        doc_last_fetch_at: '2025-12-30T20:09:51.423+00:00',
        doc_last_error: null,
        source_system_partner_id: apc_partner_id_CW,
        apc_op_id: { id: apc_op_id_Athena, name: apc_name_Athena },
        well_name: 'HARMON #1',
    },
 
    // ── Athena (Operator) → Nav (Partner) | NOT archived ────────────────────────
    {
        id: '5e6f7a8b-0005-4eee-c000-eeeeeeeeeeee',
        created_at: '2025-09-01T12:00:00.000000+00:00',
        afe_type: 'DRILLING',
        afe_number: '06D111AN',
        description: 'Drill TILLMAN #2',
        total_gross_estimate: 475000,
        version_string: null,
        supp_gross_estimate: 0,
        operator_wi: 50,
        apc_partner_name: apc_name_Nav,
        partner_wi: 50,
        partner_status: 'New',
        op_status: 'IAPP',
        iapp_date: '2025-08-31',
        last_mod_date: '2025-08-31',
        legacy_chainID: 450,
        legacy_afeid: 450,
        chain_version: 1,
        source_system_id: src_Tillman,
        apc_partner_id: apc_partner_id_Nav,
        apc_operator_id: null,
        partner_status_date: null,
        sortID: 160,
        archived: false,
        partner_archived: false,
        source_partner_id: null,
        doc_fetch_status: 'pending',
        doc_fetch_attempts: 0,
        doc_last_fetch_at: null,
        doc_last_error: null,
        source_system_partner_id: apc_partner_id_Nav,
        apc_op_id: { id: apc_op_id_Athena, name: apc_name_Athena },
        well_name: 'TILLMAN #2',
    },
 
];


// ── User IDs ───────────────────────────────────────────────────────────────────
export const user_id_RachelGreen    = '13e69340-d14c-45a9-96a8-142795925487';
export const user_id_JoeyGreen      = '13e69340-d14c-45a9-96a8-142795922287';
export const user_id_MonicaGeller   = '23e69340-d14c-45a9-96a8-142795925488';
export const user_id_ChandlerBing   = '23e69340-d14c-45a9-96a8-142795925777';
export const user_id_RossGeller     = '33e69340-d14c-45a9-96a8-142795925489';
export const user_id_MichaelScott   = '43e69340-d14c-45a9-96a8-142795925490';
export const user_id_JimHalpert     = '53e69340-d14c-45a9-96a8-142795925491';
export const user_id_DwightSchrute  = '63e69340-d14c-45a9-96a8-142795925492';
export const user_id_TonySoprano    = '73e69340-d14c-45a9-96a8-142795925493';
export const user_id_WalterWhite    = '83e69340-d14c-45a9-96a8-142795925494';
export const user_id_JessePinkman   = '93e69340-d14c-45a9-96a8-142795925495';
export const user_id_LeslieKnope    = 'a3e69340-d14c-45a9-96a8-142795925496';
export const user_id_RonSwanson     = 'b3e69340-d14c-45a9-96a8-142795925497';
export const user_id_AprilLudgate   = 'c3e69340-d14c-45a9-96a8-142795925498';

// ── Addresses ──────────────────────────────────────────────────────────────────
const address_CW: AddressType = {
    address_active: true,
    id: apc_address_id_CW,
    street: '6789 S Blvd',
    suite: '',
    city: 'Houston',
    state: 'TX',
    zip: '90078',
    country: 'United States',
};

const address_partner_CW: AddressType = {
    address_active: true,
    id: apc_address_id_partner_CW,
    street: '6789 S Main Ave',
    suite: '1234',
    city: 'Houston',
    state: 'TX',
    zip: '90078',
    country: 'United States',
};

const address_Nav: AddressType = {
    address_active: true,
    id: apc_address_id_Nav,
    street: '100 Navigator Way',
    suite: '500',
    city: 'Dallas',
    state: 'TX',
    zip: '75201',
    country: 'United States',
};

const address_JohnRoss: AddressType = {
    address_active: true,
    id: apc_address_id_JohnRoss,
    street: '2900 S Emerson St',
    suite: '878',
    city: 'Englewood',
    state: 'CO',
    zip: '80113',
    country: 'United States',
};

const address_Athena: AddressType = {
    address_active: true,
    id: apc_address_id_Athena,
    street: '400 Mineral Blvd',
    suite: '200',
    city: 'Denver',
    state: 'CO',
    zip: '80202',
    country: 'United States',
};

// ── Role Builders ──────────────────────────────────────────────────────────────
// Operator roles: 2 = view operated AFEs, 4 = view partner AFEs, 8 = billing
// Partner roles:  3 = view, 5 = edit, 6 = approve/reject, 9 = library

const buildOpRoles = (user_id: string, user_firstname: string, user_lastName: string, user_email: string, apc_id: string, apc_name: string, apc_address: AddressType, apc_address_id: number, startId: number) => [
    { id: startId,     role: 2, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: true,  is_partner_permission: false, user_active: true },
    { id: startId + 1, role: 4, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: true,  is_partner_permission: false, user_active: true },
    { id: startId + 2, role: 8, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: true,  is_partner_permission: false, user_active: true },
];

const buildOpRolesNoAFEViewRights = (user_id: string, user_firstname: string, user_lastName: string, user_email: string, apc_id: string, apc_name: string, apc_address: AddressType, apc_address_id: number, startId: number) => [
    { id: startId,     role: 4, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: true,  is_partner_permission: false, user_active: true },
    { id: startId + 2, role: 8, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: true,  is_partner_permission: false, user_active: true },
];

const buildOpRolesNoUserEditRights = (user_id: string, user_firstname: string, user_lastName: string, user_email: string, apc_id: string, apc_name: string, apc_address: AddressType, apc_address_id: number, startId: number) => [
    { id: startId,     role: 2, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: true,  is_partner_permission: false, user_active: true },
    { id: startId + 2, role: 8, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: true,  is_partner_permission: false, user_active: true },
];

const buildOpViewOnlyRoles = (user_id: string, user_firstname: string, user_lastName: string, user_email: string, apc_id: string, apc_name: string, apc_address: AddressType, apc_address_id: number, startId: number) => [
    { id: startId,     role: 2, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: true,  is_partner_permission: false, user_active: true },
];

const buildPartnerRoles = (user_id: string, user_firstname: string, user_lastName: string, user_email: string, apc_id: string, apc_name: string, apc_address: AddressType, apc_address_id: number, startId: number) => [
    { id: startId,     role: 3, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: false, is_partner_permission: true,  user_active: true },
    { id: startId + 1, role: 5, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: false, is_partner_permission: true,  user_active: true },
    { id: startId + 2, role: 6, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: false, is_partner_permission: true,  user_active: true },
    { id: startId + 3, role: 9, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: false, is_partner_permission: true,  user_active: true },
];

const buildPartnerRolesAFEOnlyViewRights = (user_id: string, user_firstname: string, user_lastName: string, user_email: string, apc_id: string, apc_name: string, apc_address: AddressType, apc_address_id: number, startId: number) => [
    { id: startId,     role: 3, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: false, is_partner_permission: true,  user_active: true },
];

const buildPartnerRolesNoAFEViewRights = (user_id: string, user_firstname: string, user_lastName: string, user_email: string, apc_id: string, apc_name: string, apc_address: AddressType, apc_address_id: number, startId: number) => [
    { id: startId,     role: 5, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: false, is_partner_permission: true,  user_active: true },
    { id: startId + 2, role: 6, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: false, is_partner_permission: true,  user_active: true },
    { id: startId + 3, role: 9, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: false, is_partner_permission: true,  user_active: true },
];

const buildPartnerRolesNoUserEditRights = (user_id: string, user_firstname: string, user_lastName: string, user_email: string, apc_id: string, apc_name: string, apc_address: AddressType, apc_address_id: number, startId: number) => [
    { id: startId,     role: 3, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: false, is_partner_permission: true,  user_active: true },
    { id: startId + 2, role: 6, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: false, is_partner_permission: true,  user_active: true },
    { id: startId + 3, role: 9, active: true, user_id, user_firstname, user_lastName, user_email, apc_id, apc_name, apc_address, apc_address_id, is_op_permission: false, is_partner_permission: true,  user_active: true },
];

// ── CW (Operator) / John Ross (Partner) Users ──────────────────────────────────

// All permissions: Can see Operated AFEs for CW and Non-Op AFEs.
export const RachelGreen_AllPermissions_CW_NonOpCW: UserProfileRecordSupabaseType = {
    firstName: 'Rachel',
    lastName: 'Green',
    email: 'rachel.green@corrwhitoils.com',
    active: true,
    is_super_user: false,
    user_id: user_id_RachelGreen,
    operatorRoles: buildOpRoles(user_id_RachelGreen, 'Rachel', 'Green', 'rachel.green@corrwhitoils.com', apc_op_id_CW, apc_name_CW, address_CW, apc_address_id_CW, 100),
    partnerRoles:  buildPartnerRoles(user_id_RachelGreen, 'Rachel', 'Green', 'rachel.green@corrwhitoils.com', apc_partner_id_CW, apc_name_CW, address_partner_CW, apc_address_id_partner_CW, 110),
};

//No user edit rights
export const JoeyGreen_NoUserEditRights_CW_NonOpCW: UserProfileRecordSupabaseType = {
    firstName: 'Joey',
    lastName: 'Green',
    email: 'joey.green@corrwhitoils.com',
    active: true,
    is_super_user: false,
    user_id: user_id_RachelGreen,
    operatorRoles: buildOpRolesNoUserEditRights(user_id_JoeyGreen, 'Joey', 'Green', 'rachel.green@corrwhitoils.com', apc_op_id_CW, apc_name_CW, address_CW, apc_address_id_CW, 100),
    partnerRoles:  buildPartnerRolesNoUserEditRights(user_id_JoeyGreen, 'Joey', 'Green', 'rachel.green@corrwhitoils.com', apc_partner_id_CW, apc_name_CW, address_partner_CW, apc_address_id_partner_CW, 110),
};
// No operator roles: can only see AFEs where CW is the partner
export const MonicaGeller_NoOpRoles_CW_NonOpCW: UserProfileRecordSupabaseType = {
    firstName: 'Monica',
    lastName: 'Geller',
    email: 'monica.geller@corrwhitoils.com',
    active: true,
    is_super_user: false,
    user_id: user_id_MonicaGeller,
    operatorRoles: [],
    partnerRoles:  buildPartnerRoles(user_id_MonicaGeller, 'Monica', 'Geller', 'monica.geller@corrwhitoils.com', apc_partner_id_CW, apc_name_CW, address_partner_CW, apc_address_id_partner_CW, 120),
};

//Chandler Bing does NOT have any AFE view Rights
export const ChandlerBing_NoAFEViewRights: UserProfileRecordSupabaseType = {
    firstName: 'Chandler',
    lastName: 'Binf',
    email: 'chandler.binf@corrwhitoils.com',
    active: true,
    is_super_user: false,
    user_id: user_id_MonicaGeller,
    operatorRoles: [],
    partnerRoles:  buildPartnerRolesNoAFEViewRights(user_id_ChandlerBing, 'Chandler', 'Bing', 'chandler.binf@corrwhitoils.com', apc_partner_id_CW, apc_name_CW, address_partner_CW, apc_address_id_partner_CW, 120),
};

// No partner roles: can only see AFEs where CW is the operator
export const RossGeller_Op_CW_No_NonOp: UserProfileRecordSupabaseType = {
    firstName: 'Ross',
    lastName: 'Geller',
    email: 'ross.geller@corrwhitoils.com',
    active: true,
    is_super_user: false,
    user_id: user_id_RossGeller,
    operatorRoles: buildOpViewOnlyRoles(user_id_RossGeller, 'Ross', 'Geller', 'ross.geller@corrwhitoils.com', apc_op_id_CW, apc_name_CW, address_CW, apc_address_id_CW, 130),
    partnerRoles:  [],
};

// ── Nav (Operator) / Athena (Partner) Users ────────────────────────────────────

// All permissions: operator at Nav, partner at Athena
export const MichaelScott_AllPermissions_Nav_Athena: UserProfileRecordSupabaseType = {
    firstName: 'Michael',
    lastName: 'Scott',
    email: 'michael.scott@navigatorcorp.com',
    active: true,
    is_super_user: false,
    user_id: user_id_MichaelScott,
    operatorRoles: buildOpRoles(user_id_MichaelScott, 'Michael', 'Scott', 'michael.scott@navigatorcorp.com', apc_op_id_Nav, apc_name_Nav, address_Nav, apc_address_id_Nav, 200),
    partnerRoles:  buildPartnerRoles(user_id_MichaelScott, 'Michael', 'Scott', 'michael.scott@navigatorcorp.com', apc_partner_id_Athena, apc_name_Athena, address_Athena, apc_address_id_Athena, 210),
};

// No operator roles: can only see AFEs where Nav is the partner
export const JimHalpert_NoOpRoles_Nav_Athena: UserProfileRecordSupabaseType = {
    firstName: 'Jim',
    lastName: 'Halpert',
    email: 'jim.halpert@navigatorcorp.com',
    active: true,
    is_super_user: false,
    user_id: user_id_JimHalpert,
    operatorRoles: [],
    partnerRoles:  buildPartnerRoles(user_id_JimHalpert, 'Jim', 'Halpert', 'jim.halpert@navigatorcorp.com', apc_partner_id_Athena, apc_name_Athena, address_Athena, apc_address_id_Athena, 220),
};

// No partner roles: can only see AFEs where Nav is the operator
export const DwightSchrute_NoPartnerRoles_Nav_Athena: UserProfileRecordSupabaseType = {
    firstName: 'Dwight',
    lastName: 'Schrute',
    email: 'dwight.schrute@navigatorcorp.com',
    active: true,
    is_super_user: false,
    user_id: user_id_DwightSchrute,
    operatorRoles: buildOpRoles(user_id_DwightSchrute, 'Dwight', 'Schrute', 'dwight.schrute@navigatorcorp.com', apc_op_id_Nav, apc_name_Nav, address_Nav, apc_address_id_Nav, 230),
    partnerRoles:  [],
};

// ── John Ross (Operator) / CW (Partner) Users ──────────────────────────────────

// All permissions: operator at John Ross, partner at CW
export const TonySoprano_AllPermissions_JohnRoss_CW: UserProfileRecordSupabaseType = {
    firstName: 'Tony',
    lastName: 'Soprano',
    email: 'tony.soprano@johnrossexploration.com',
    active: true,
    is_super_user: false,
    user_id: user_id_TonySoprano,
    operatorRoles: buildOpRoles(user_id_TonySoprano, 'Tony', 'Soprano', 'tony.soprano@johnrossexploration.com', apc_op_id_JohnRoss, apc_name_JohnRoss, address_JohnRoss, apc_address_id_JohnRoss, 300),
    partnerRoles:  buildPartnerRoles(user_id_TonySoprano, 'Tony', 'Soprano', 'tony.soprano@johnrossexploration.com', apc_partner_id_CW, apc_name_CW, address_CW, apc_address_id_CW, 310),
};

// No operator roles: can only see AFEs where John Ross is the partner
export const WalterWhite_NoOpRoles_JohnRoss_CW: UserProfileRecordSupabaseType = {
    firstName: 'Walter',
    lastName: 'White',
    email: 'walter.white@johnrossexploration.com',
    active: true,
    is_super_user: false,
    user_id: user_id_WalterWhite,
    operatorRoles: [],
    partnerRoles:  buildPartnerRoles(user_id_WalterWhite, 'Walter', 'White', 'walter.white@johnrossexploration.com', apc_partner_id_CW, apc_name_CW, address_CW, apc_address_id_CW, 320),
};

// No partner roles: can only see AFEs where John Ross is the operator
export const JessePinkman_NoPartnerRoles_JohnRoss_CW: UserProfileRecordSupabaseType = {
    firstName: 'Jesse',
    lastName: 'Pinkman',
    email: 'jesse.pinkman@johnrossexploration.com',
    active: true,
    is_super_user: false,
    user_id: user_id_JessePinkman,
    operatorRoles: buildOpRoles(user_id_JessePinkman, 'Jesse', 'Pinkman', 'jesse.pinkman@johnrossexploration.com', apc_op_id_JohnRoss, apc_name_JohnRoss, address_JohnRoss, apc_address_id_JohnRoss, 330),
    partnerRoles:  [],
};

// ── Athena (Operator) / Nav (Partner) Users ────────────────────────────────────

// All permissions: operator at Athena, partner at Nav
export const LeslieKnope_AllPermissions_Athena_Nav: UserProfileRecordSupabaseType = {
    firstName: 'Leslie',
    lastName: 'Knope',
    email: 'leslie.knope@athenaminerals.com',
    active: true,
    is_super_user: false,
    user_id: user_id_LeslieKnope,
    operatorRoles: buildOpRoles(user_id_LeslieKnope, 'Leslie', 'Knope', 'leslie.knope@athenaminerals.com', apc_op_id_Athena, apc_name_Athena, address_Athena, apc_address_id_Athena, 400),
    partnerRoles:  buildPartnerRoles(user_id_LeslieKnope, 'Leslie', 'Knope', 'leslie.knope@athenaminerals.com', apc_partner_id_Nav, apc_name_Nav, address_Nav, apc_address_id_Nav, 410),
};

// No operator roles: can only see AFEs where Athena is the partner
export const RonSwanson_NoOpRoles_Athena_Nav: UserProfileRecordSupabaseType = {
    firstName: 'Ron',
    lastName: 'Swanson',
    email: 'ron.swanson@athenaminerals.com',
    active: true,
    is_super_user: false,
    user_id: user_id_RonSwanson,
    operatorRoles: [],
    partnerRoles:  buildPartnerRoles(user_id_RonSwanson, 'Ron', 'Swanson', 'ron.swanson@athenaminerals.com', apc_partner_id_Nav, apc_name_Nav, address_Nav, apc_address_id_Nav, 420),
};

// No partner roles: can only see AFEs where Athena is the operator
export const AprilLudgate_NoPartnerRoles_Athena_Nav: UserProfileRecordSupabaseType = {
    firstName: 'April',
    lastName: 'Ludgate',
    email: 'april.ludgate@athenaminerals.com',
    active: true,
    is_super_user: false,
    user_id: user_id_AprilLudgate,
    operatorRoles: buildOpRoles(user_id_AprilLudgate, 'April', 'Ludgate', 'april.ludgate@athenaminerals.com', apc_op_id_Athena, apc_name_Athena, address_Athena, apc_address_id_Athena, 430),
    partnerRoles:  [],
};

export const operatorAccountCodes = [
    {
        "account_number": "9210.201",
        "account_description": "LICENCE, FEES, TAXES, & PERMITS",
        "account_group": "1. DRILLING",
        "id": 1,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.202",
        "account_description": "SURFACE LEASE ACQUISITION",
        "account_group": "1. DRILLING",
        "id": 2,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.203",
        "account_description": "SURVEYING",
        "account_group": "1. DRILLING",
        "id": 3,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.207",
        "account_description": "ROAD & SITE COSTS",
        "account_group": "1. DRILLING",
        "id": 4,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.208",
        "account_description": "ROAD USE",
        "account_group": "1. DRILLING",
        "id": 5,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.209",
        "account_description": "RIG MOVE IN / MOVE OUT",
        "account_group": "1. DRILLING",
        "id": 6,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.210",
        "account_description": "CONDUCTOR & RATHOLE",
        "account_group": "1. DRILLING",
        "id": 7,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.212",
        "account_description": "DRILLING RIG",
        "account_group": "1. DRILLING",
        "id": 8,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.217",
        "account_description": "FUEL & BOILER",
        "account_group": "1. DRILLING",
        "id": 9,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.219",
        "account_description": "CAMP EXPENSES & CREW TRAVEL",
        "account_group": "1. DRILLING",
        "id": 10,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.225",
        "account_description": "DRILL BITS",
        "account_group": "1. DRILLING",
        "id": 11,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.227",
        "account_description": "WATER/VACUUM/STEAM TRUCK",
        "account_group": "1. DRILLING",
        "id": 12,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.230",
        "account_description": "DRILLING MUD / FLUID / CHEMICAL",
        "account_group": "1. DRILLING",
        "id": 13,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.233",
        "account_description": "DRILLSTEM TEST",
        "account_group": "1. DRILLING",
        "id": 14,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.235",
        "account_description": "FISHING & SPECIAL SERVICES",
        "account_group": "1. DRILLING",
        "id": 15,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.237",
        "account_description": "EQUIPMENT RENTALS",
        "account_group": "1. DRILLING",
        "id": 16,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.239",
        "account_description": "COMMUNICATIONS",
        "account_group": "1. DRILLING",
        "id": 17,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.240",
        "account_description": "CORING & ANALYSIS",
        "account_group": "1. DRILLING",
        "id": 18,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.241",
        "account_description": "OPEN HOLE LOGGING",
        "account_group": "1. DRILLING",
        "id": 19,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.247",
        "account_description": "LABOUR",
        "account_group": "1. DRILLING",
        "id": 20,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.249",
        "account_description": "WELDING SERVICES",
        "account_group": "1. DRILLING",
        "id": 21,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.251",
        "account_description": "WELL SITE GEOLOGIST",
        "account_group": "1. DRILLING",
        "id": 22,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.253",
        "account_description": "HAULING & TRANSPORTATION",
        "account_group": "1. DRILLING",
        "id": 23,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.257",
        "account_description": "TRAVEL & ACCOMODATION",
        "account_group": "1. DRILLING",
        "id": 24,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.259",
        "account_description": "SUPPLIES & MATERIALS",
        "account_group": "1. DRILLING",
        "id": 25,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.261",
        "account_description": "SURFACE & INTERMEDIATE CASING",
        "account_group": "1. DRILLING",
        "id": 26,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.262",
        "account_description": "SURFACE & INTERMEDIATE ACCESS",
        "account_group": "1. DRILLING",
        "id": 27,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.263",
        "account_description": "SURFACE & INTERMEDIATE CEMENTNG",
        "account_group": "1. DRILLING",
        "id": 28,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.264",
        "account_description": "CASING BOWL",
        "account_group": "1. DRILLING",
        "id": 29,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.265",
        "account_description": "CASING INSTALLATION",
        "account_group": "1. DRILLING",
        "id": 30,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.269",
        "account_description": "CONTROL OF WELL INSURANCE",
        "account_group": "1. DRILLING",
        "id": 31,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.271",
        "account_description": "SAFETY & ENVIRONMENTAL SERVICES",
        "account_group": "1. DRILLING",
        "id": 32,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.273",
        "account_description": "DIRECTIONAL SERVICES",
        "account_group": "1. DRILLING",
        "id": 33,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.277",
        "account_description": "ENGINEERING CONSULT/SUPERVSION",
        "account_group": "1. DRILLING",
        "id": 34,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.279",
        "account_description": "GEOLOGICAL CONSULTING",
        "account_group": "1. DRILLING",
        "id": 35,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.281",
        "account_description": "ABANDONMENT COSTS",
        "account_group": "1. DRILLING",
        "id": 36,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.283",
        "account_description": "SITE RESTORATION",
        "account_group": "1. DRILLING",
        "id": 37,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.292",
        "account_description": "OPERATORS JOINT COSTS",
        "account_group": "1. DRILLING",
        "id": 38,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.294",
        "account_description": "CONTINGENCY",
        "account_group": "1. DRILLING",
        "id": 39,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.295",
        "account_description": "ABANDONMNT EXP'S-SITE REST. PROV'N",
        "account_group": "1. DRILLING",
        "id": 40,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.296",
        "account_description": "MISCELLANEOUS",
        "account_group": "1. DRILLING",
        "id": 41,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.299",
        "account_description": "ADMINISTRATIVE OVERHEAD",
        "account_group": "1. DRILLING",
        "id": 42,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.999",
        "account_description": "ACCRUAL",
        "account_group": "1. DRILLING",
        "id": 43,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.CLR",
        "account_description": "ACCRUAL",
        "account_group": "1. DRILLING",
        "id": 44,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.301",
        "account_description": "LICENCE, FEES, TAXES, & PERMITS",
        "account_group": "2. COMPLETION",
        "id": 45,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.302",
        "account_description": "PRODUCTION CASING & ACCESSORIES",
        "account_group": "2. COMPLETION",
        "id": 46,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.303",
        "account_description": "INSTALL PRODUCTION CASING",
        "account_group": "2. COMPLETION",
        "id": 47,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.304",
        "account_description": "TUBING",
        "account_group": "2. COMPLETION",
        "id": 48,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.305",
        "account_description": "PACKERS",
        "account_group": "2. COMPLETION",
        "id": 49,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.306",
        "account_description": "PERMANENT DOWNHOLE EQUIPMENT",
        "account_group": "2. COMPLETION",
        "id": 50,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.307",
        "account_description": "ROAD & SITE COSTS",
        "account_group": "2. COMPLETION",
        "id": 51,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.308",
        "account_description": "ROAD USE",
        "account_group": "2. COMPLETION",
        "id": 52,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.309",
        "account_description": "SERVICE RIG, POWER & FUEL",
        "account_group": "2. COMPLETION",
        "id": 53,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.313",
        "account_description": "LOAD OIL",
        "account_group": "2. COMPLETION",
        "id": 54,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.314",
        "account_description": "WASTE PROCESSING & DISPOSAL",
        "account_group": "2. COMPLETION",
        "id": 55,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.315",
        "account_description": "STIMULATION & FRACTURING",
        "account_group": "2. COMPLETION",
        "id": 56,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.317",
        "account_description": "LOGGING",
        "account_group": "2. COMPLETION",
        "id": 57,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.318",
        "account_description": "PERFORATING",
        "account_group": "2. COMPLETION",
        "id": 58,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.319",
        "account_description": "ACIDIZING",
        "account_group": "2. COMPLETION",
        "id": 59,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.321",
        "account_description": "SUB-SURFACE WIRELINE SERVICES",
        "account_group": "2. COMPLETION",
        "id": 60,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.323",
        "account_description": "CEMENTING SERVICES",
        "account_group": "2. COMPLETION",
        "id": 61,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.327",
        "account_description": "WATER/VACUUM/STEAM TRUCK",
        "account_group": "2. COMPLETION",
        "id": 62,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.333",
        "account_description": "TESTING, ANALYSIS & SURVEYS",
        "account_group": "2. COMPLETION",
        "id": 63,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.335",
        "account_description": "FISHING & SPECIAL SERVICES",
        "account_group": "2. COMPLETION",
        "id": 64,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.337",
        "account_description": "EQUIPMENT RENTALS",
        "account_group": "2. COMPLETION",
        "id": 65,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.339",
        "account_description": "COMMUNICATIONS",
        "account_group": "2. COMPLETION",
        "id": 66,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.347",
        "account_description": "LABOUR",
        "account_group": "2. COMPLETION",
        "id": 67,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.353",
        "account_description": "HAULING & TRANSPORTATION",
        "account_group": "2. COMPLETION",
        "id": 68,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.357",
        "account_description": "TRAVEL & ACCOMODATION",
        "account_group": "2. COMPLETION",
        "id": 69,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.359",
        "account_description": "SUPPLIES & MATERIALS",
        "account_group": "2. COMPLETION",
        "id": 70,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.371",
        "account_description": "SAFETY & ENVIRONMENTAL SERVICES",
        "account_group": "2. COMPLETION",
        "id": 71,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.377",
        "account_description": "ENGINEERING CONSULT/SUPERVISION",
        "account_group": "2. COMPLETION",
        "id": 72,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.381",
        "account_description": "ABANDONMENT COSTS",
        "account_group": "2. COMPLETION",
        "id": 73,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.383",
        "account_description": "SITE RESTORATION",
        "account_group": "2. COMPLETION",
        "id": 74,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.392",
        "account_description": "OPERATORS JOINT COSTS",
        "account_group": "2. COMPLETION",
        "id": 75,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.394",
        "account_description": "CONTINGENCY",
        "account_group": "2. COMPLETION",
        "id": 76,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.396",
        "account_description": "MISCELLANEOUS",
        "account_group": "2. COMPLETION",
        "id": 77,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.399",
        "account_description": "ADMINISTRATIVE OVERHEAD",
        "account_group": "2. COMPLETION",
        "id": 78,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.999",
        "account_description": "ACCRUAL",
        "account_group": "2. COMPLETION",
        "id": 79,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9250.CLR",
        "account_description": "ACCRUAL",
        "account_group": "2. COMPLETION",
        "id": 80,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    }
];

export const partnerAccountCodes = [
    {
        "account_number": "9210.203",
        "account_description": "SURVEYING",
        "account_group": "1. DRILLING",
        "id": 116,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.207",
        "account_description": "ROAD & SITE COSTS",
        "account_group": "1. DRILLING",
        "id": 118,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    },
    {
        "account_number": "9210.208",
        "account_description": "ROAD USE",
        "account_group": "1. DRILLING",
        "id": 120,
        "apc_op_id": "",
        "apc_part_id": "",
        "active": true
    }
];