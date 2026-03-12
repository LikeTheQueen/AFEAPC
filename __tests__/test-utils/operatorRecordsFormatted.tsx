import { type AddressType, type OperatorPartnerAddressType, type OperatorPartnerRecord, type OperatorRecordWithNonOpAddresses } from "../../src/types/interfaces";

export const operatorRecordNullValues: OperatorRecordWithNonOpAddresses = {
    active: false,
    partners:[],
    address_active: false,
    name: 'Empty Operator'
}