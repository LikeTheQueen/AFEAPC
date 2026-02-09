import { isAddressValid, isOperatorValid } from '../src/helpers/helpers'
import type { AddressType, OperatorType } from "src/types/interfaces";

describe('Should toggle the disabled button to create the Operator correctly',() => {
    afterEach(() => {
    vi.resetAllMocks()
})
test('It should return true (to disable save button) when Operator and Address is not valid and there is NOT error message', () => {
    const mockOp: OperatorType | null = {
      name:'',
      source_system:0,
      id: undefined
    };
    const mockAddress: AddressType | null = {
        id:0,
        street: '',
        suite: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        address_active: true,
    };
    const operatorWriteMessage = null;
    const isOperatorValidResult = isOperatorValid(mockOp);
    const isAddressValidResult = isAddressValid(mockAddress);

    expect(isOperatorValidResult).toBe(false);
    expect(isAddressValidResult).toBe(false);
    expect(!isOperatorValidResult || !isAddressValidResult || operatorWriteMessage !== null).toBe(true);
});

test('It should return true (to disable save button) when Operator is not valid and Address is valid and there is NOT error message', () => {
    const mockOp: OperatorType | null = {
      name:'',
      source_system:0,
      id: undefined
    };
    const mockAddress: AddressType | null = {
        id:0,
        street: '1234 Main',
        suite: '',
        city: 'Denver',
        state: 'CO',
        zip: '80202',
        country: 'United States',
        address_active: true,
    };
    const operatorWriteMessage = null;
    const isOperatorValidResult = isOperatorValid(mockOp);
    const isAddressValidResult = isAddressValid(mockAddress);

    expect(isOperatorValidResult).toBe(false);
    expect(isAddressValidResult).toBe(true);
    expect(!isOperatorValidResult || !isAddressValidResult || operatorWriteMessage !== null).toBe(true);
});

test('It should return true (to disable save button) when Operator is valid and Address is Not valid and there is NOT error message', () => {
    const mockOp: OperatorType | null = {
      name:'Whit and Corr',
      source_system:1,
      id: undefined
    };
    const mockAddress: AddressType | null = {
        id:0,
        street: '',
        suite: '',
        city: 'Denver',
        state: 'CO',
        zip: '80202',
        country: 'United States',
        address_active: true,
    };
    const operatorWriteMessage = null;
    const isOperatorValidResult = isOperatorValid(mockOp);
    const isAddressValidResult = isAddressValid(mockAddress);

    expect(isOperatorValidResult).toBe(true);
    expect(isAddressValidResult).toBe(false);
    expect(!isOperatorValidResult || !isAddressValidResult || operatorWriteMessage !== null).toBe(true);
});

test('It should return true (to disable save button) when Operator is valid and Address is valid and there is an error message', () => {
    const mockOp: OperatorType | null = {
      name:'Whit and Corr',
      source_system:1,
      id: undefined
    };
    const mockAddress: AddressType | null = {
        id:0,
        street: '12345 Main Ave',
        suite: '',
        city: 'Denver',
        state: 'CO',
        zip: '80202',
        country: 'United States',
        address_active: true,
    };
    const operatorWriteMessage = 'Error Message';
    const isOperatorValidResult = isOperatorValid(mockOp);
    const isAddressValidResult = isAddressValid(mockAddress);

    expect(isOperatorValidResult).toBe(true);
    expect(isAddressValidResult).toBe(true);
    expect(!isOperatorValidResult || !isAddressValidResult || operatorWriteMessage !== null).toBe(true);
});

test('It should return true (to disable save button) when Operator is valid but has an ID and Address is valid and there is NOT error message', () => {
    const mockOp: OperatorType | null = {
      name:'Whit and Corr',
      source_system:1,
      id: '23213'
    };
    const mockAddress: AddressType | null = {
        id:0,
        street: '12345 Main Ave',
        suite: '',
        city: 'Denver',
        state: 'CO',
        zip: '80202',
        country: 'United States',
        address_active: true,
    };
    const operatorWriteMessage = null;
    const isOperatorValidResult = isOperatorValid(mockOp);
    const isAddressValidResult = isAddressValid(mockAddress);

    expect(isOperatorValidResult).toBe(false);
    expect(isAddressValidResult).toBe(true);
    expect(!isOperatorValidResult || !isAddressValidResult || operatorWriteMessage !== null).toBe(true);
});

test('It should return false (to disable save button) when Operator is valid and Address is valid and there is NOT error message', () => {
    const mockOp: OperatorType | null = {
      name:'Whit and Corr',
      source_system:1,
      id: undefined
    };
    const mockAddress: AddressType | null = {
        id:0,
        street: '12345 Main Ave',
        suite: '',
        city: 'Denver',
        state: 'CO',
        zip: '80202',
        country: 'United States',
        address_active: true,
    };
    const operatorWriteMessage = null;
    const isOperatorValidResult = isOperatorValid(mockOp);
    const isAddressValidResult = isAddressValid(mockAddress);

    expect(isOperatorValidResult).toBe(true);
    expect(isAddressValidResult).toBe(true);
    expect(!isOperatorValidResult || !isAddressValidResult || operatorWriteMessage !== null).toBe(false);
});

});

describe('Should toggle the disabled button to create the Operator Non Op record correctly',() => {
    afterEach(() => {
    vi.resetAllMocks()
})

test('It should return true (to disable button) when there is not an operator ID and the address is not valid', () => {
    const mockOp: OperatorType | null = {
      name:'Whit and Corr',
      source_system:1,
      id: undefined
    };
    const mockAddress: AddressType | null = {
        id:0,
        street: '',
        suite: '',
        city: 'Denver',
        state: 'CO',
        zip: '80202',
        country: 'United States',
        address_active: true,
    };
    
    const isAddressValidResult = isAddressValid(mockAddress);

    expect(isAddressValidResult).toBe(false);
    expect(!mockOp.id || !isAddressValidResult).toBe(true);
});

test('It should return true (to disable button) when there is not an operator ID and the address is not valid', () => {
    const mockOp: OperatorType | null = {
      name:'Whit and Corr',
      source_system:1,
      id: undefined
    };
    const mockAddress: AddressType | null = {
        id:0,
        street: '12345 Main Ave',
        suite: '',
        city: 'Denver',
        state: 'CO',
        zip: '80202',
        country: 'United States',
        address_active: true,
    };
    
    const isAddressValidResult = isAddressValid(mockAddress);

    expect(isAddressValidResult).toBe(true);
    expect(!mockOp.id || !isAddressValidResult).toBe(true);
});

test('It should return false (to disable button) when there is an operator ID and the address is valid', () => {
    const mockOp: OperatorType | null = {
      name:'Whit and Corr',
      source_system:1,
      id: '2323'
    };
    const mockAddress: AddressType | null = {
        id:0,
        street: '12345 Main Ave',
        suite: '',
        city: 'Denver',
        state: 'CO',
        zip: '80202',
        country: 'United States',
        address_active: true,
    };
    
    const isAddressValidResult = isAddressValid(mockAddress);

    expect(isAddressValidResult).toBe(true);
    expect(!mockOp.id || !isAddressValidResult).toBe(false);
});

});