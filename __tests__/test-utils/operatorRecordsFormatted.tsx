import { type AddressType, type OperatorPartnerAddressType, type OperatorPartnerRecord, type OperatorRecordWithNonOpAddresses } from "../../src/types/interfaces";

export const apc_op_id_CW = '3b34a78a-13ad-40b5-aecd-268d56dd5e0d';
export const apc_part_id_CW = '8ed0a285-0011-4f56-962f-c46bc0889d1b';
export const operatorRecordNullValues: OperatorRecordWithNonOpAddresses = {
    active: false,
    partners:[],
    address_active: false,
    name: 'Empty Operator'
};

export const CorrWhitOilsOperatorRecord: OperatorRecordWithNonOpAddresses = {
    apc_id: apc_op_id_CW,
    name: 'Corr and Whit Oils',
    apc_address_id: 65,
    street: '6789 S Blvd',
    suite: '',
    city: 'Houston',
    state: 'Texas',
    zip: '90078',
    country: 'United States',
    address_active: true,
    apc_op_id: apc_op_id_CW,
    apc_op_name: 'Corr and Whit Oils',
    active: true,
    partners: []
};

export const CorrWhitOilsOperatorRecordUpdated: OperatorRecordWithNonOpAddresses = {
    apc_id: apc_op_id_CW,
    name: 'Corr Mike Oils',
    apc_address_id: 65,
    street: '6789 S Blvd',
    suite: '',
    city: 'Houston',
    state: 'Texas',
    zip: '90078',
    country: 'United States',
    address_active: true,
    apc_op_id: apc_op_id_CW,
    apc_op_name: 'Corr Mike Oils',
    active: true,
    partners: []
};

export const CorrWhitOilsWithOnePartnerOperatorRecord: OperatorRecordWithNonOpAddresses = {
    apc_id: apc_op_id_CW,
    name: 'Corr and Whit Oils',
    apc_address_id: 65,
    street: '6789 S Blvd',
    suite: '',
    city: 'Houston',
    state: 'Texas',
    zip: '90078',
    country: 'United States',
    address_active: true,
    apc_op_id: apc_op_id_CW,
    apc_op_name: 'Corr and Whit Oils',
    active: true,
    partners: [
        {
            apc_id: apc_part_id_CW,
            active: true,
            name: 'Corr Partner Name',
            address_active: true,
            apc_address_id: 66,
            street: '1234 Main Ave',
            suite: '',
            city: 'Dallas',
            state: 'Texas',
            zip: '90078',
            country: 'United States'
        }
    ]
};