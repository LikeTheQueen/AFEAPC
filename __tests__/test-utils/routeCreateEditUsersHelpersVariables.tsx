import { type RoleEntryWrite } from "src/types/interfaces";
import { type RoleEntryRead, type AddressType } from "src/types/interfaces";

export const roleEntryWriteVariable = [
    {
    role: 2,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
    apc_address_id: 66,
    },
    {
    role: 4,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0db",
    apc_address_id: 66,
    },
    {
    role: 7,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
    apc_address_id: 66,
    },
    {
    role: 8,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
    apc_address_id: 66,
    },
    {
    role: 3,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
    apc_address_id: 10,
    },
    {
    role: 5,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
    apc_address_id: 10,
    },
    {
    role: 6,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
    apc_address_id: 10,
    },
    {
    role: 9,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
    apc_address_id: 10,
    },
];

export const expectedOpPermissions = [
    {
    role: 2,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
    apc_address_id: 66,
    },
    {
    role: 4,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0db",
    apc_address_id: 66,
    },
    {
    role: 7,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
    apc_address_id: 66,
    },
    {
    role: 8,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
    apc_address_id: 66,
    },
];

export const expectedNonOpPermissions = [
    {
    role: 3,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
    apc_address_id: 10,
    },
    {
    role: 5,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
    apc_address_id: 10,
    },
    {
    role: 6,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
    apc_address_id: 10,
    },
    {
    role: 9,
    active: true,
    user_id: "13e69340-d14c-45a9-96a8-142795925487",
    apc_id: "8ed0a285-0011-4f56-962f-c46bc0889d1b",
    apc_address_id: 10,
    },
];

// ── Rachel Green User has inactive role for Role 9 ─────────────────────────────────────────────────────────
const rachelGreenUserID = '13e69340-d14c-45a9-96a8-142795925487';
export const apc_op_id_CW = '3b34a78a-13ad-40b5-aecd-268d56dd5e0d';
const apc_part_id_John = '8ed0a285-0011-4f56-962f-c46bc0889d1b';

const cwAddress: AddressType = {
    address_active: true,
    id: 66,
    street: '6789 S Blvd',
    suite: '',
    city: 'Houston',
    state: 'Texas',
    zip: '90078',
    country: 'United States',
};

const johnAddress: AddressType = {
    address_active: true,
    id: 10,
    street: '2900 S Emerson St',
    suite: '878',
    city: 'Englewood',
    state: 'CO',
    zip: '80113',
    country: 'United States',
};

const cwBase: Omit<RoleEntryRead, 'id' | 'role' | 'active'> = {
    
    user_id: rachelGreenUserID,
    apc_id: apc_op_id_CW,
    apc_address_id: 66,
    apc_name: 'Corr and Whit Oils Company',
    apc_address: cwAddress,
    user_firstname: 'Rachel',
    user_lastName: 'Green',
    user_email: 'elizabeth.rider.shaw@gmail.com',
    user_active: true,
    is_op_permission: true,
    is_partner_permission: false,
};

const johnBase: Omit<RoleEntryRead, 'id' | 'role'> = {
    active: true,
    user_id: rachelGreenUserID,
    apc_id: apc_part_id_John,
    apc_address_id: 10,
    apc_name: 'John Ross Exploration Inc',
    apc_address: johnAddress,
    user_firstname: 'Rachel',
    user_lastName: 'Green',
    user_email: 'elizabeth.rider.shaw@gmail.com',
    user_active: true,
    is_op_permission: false,
    is_partner_permission: true,
};


export const rachelGreenAllRolesActive: RoleEntryRead[] = [
    { ...cwBase,   id: 121, active: true, role: 2 },
    { ...cwBase,   id: 122, active: true, role: 4 },
    { ...cwBase,   id: 123, active: true, role: 8 },
    { ...johnBase, id: 35,  role: 3 },
    { ...johnBase, id: 72,  role: 9 },
    { ...johnBase, id: 74,  role: 5 },
    { ...johnBase, id: 185, role: 6 },
];

export const rachelGreenRole4Inactive: RoleEntryRead[] = [
    { ...cwBase,   id: 121, active: true, role: 2 },
    { ...cwBase,   id: 122, active: false, role: 4 },
    { ...cwBase,   id: 123, active: true, role: 8 },
    { ...johnBase, id: 35,  role: 3 },
    { ...johnBase, id: 72,  role: 9 },
    { ...johnBase, id: 74,  role: 5 },
    { ...johnBase, id: 185, role: 6 },
];
export const rachelGreenRole4Missing: RoleEntryRead[] = [
    { ...cwBase,   id: 121, active: true, role: 2 },
    { ...cwBase,   id: 123, active: true, role: 8 },
    { ...johnBase, id: 35,  role: 3 },
    { ...johnBase, id: 72,  role: 9 },
    { ...johnBase, id: 74,  role: 5 },
    { ...johnBase, id: 185, role: 6 },
];

export const rachelGreenRole4InactiveExpectedResult: RoleEntryRead[] = [
    { ...cwBase,   id: 121, active: true, role: 2 },
    { ...cwBase,   id: 122, active: false, role: 4 },
    { ...cwBase,   id: 123, active: true, role: 8 },
    { ...johnBase, id: 35,  role: 3 },
    { ...johnBase, id: 72,  role: 9 },
    { ...johnBase, id: 74,  role: 5 },
    { ...johnBase, id: 185, role: 6 },
];


