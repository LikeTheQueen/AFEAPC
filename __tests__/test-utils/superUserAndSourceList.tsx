//THE SUPER USER

import type { UserProfileRecordSupabaseType } from "src/types/interfaces";

export const apc_op_id_CW = '3b34a78a-13ad-40b5-aecd-268d56dd5e0d';
export const apc_part_id_John = '8ed0a285-0011-4f56-962f-c46bc0889d1b';
const userID1 = '13e69340-d14c-45a9-96a8-142795925487'

export const loggedInUserSuperUser: UserProfileRecordSupabaseType = {
    firstName: 'Ross',
    lastName: 'Green',
    email: 'elizabeth.rider.shaw@gmail.com',
    active: true,
    is_super_user: true,
    operatorRoles: [
        {
            apc_name: 'Corr and Whit Oils Company',
            apc_address: {
                address_active: true,
                id: 66,
                street: '6789 S Blvd',
                suite: '',
                city: 'Houston',
                state: 'Texas',
                zip: '90078',
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
            role: 1,
            active: true,
            apc_id: apc_op_id_CW,
            apc_address_id: 66
        },
        
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
        role: 1,
        active: true,
        apc_id: apc_part_id_John,
        apc_address_id: 10
    },
    
    ],
};

export const sourceSystems = [
    {
        "id": 1,
        "system": "Quorum Execute"
    },
    {
        "id": 2,
        "system": "W Energy"
    }
];