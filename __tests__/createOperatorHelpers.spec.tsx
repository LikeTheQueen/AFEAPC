import { disableCreateButton } from "src/routes/createEditOperators/routes/helpers/helpers";
import type { AddressType, OperatorType } from "src/types/interfaces";

describe('Should toggle the disabled button to create the Operator correctly',() => {
    afterEach(() => {
    vi.resetAllMocks()
})
test('It should return true when the Op Name and Source ID is null', () => {
    const mockOp: OperatorType | null = {
      name:'',
      source_system:0
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
    const result = disableCreateButton(mockOp, mockAddress);

    expect(result).toBe(true);
});
test('It should return true when the Op Name and Source ID is null', () => {
    const mockOp: OperatorType | null = {
        name:'',
        source_system: undefined

    };
    const mockAddress: AddressType | null = {
        street:'123 Main Street',
        suite: undefined,
        city: undefined,
        state: undefined,
        zip: undefined,
        country: undefined,
        id: 1,
        address_active: true
    };
    const result = disableCreateButton(mockOp, mockAddress);
    expect(result).toBe(true);
});

test('It should return true when the Op Name and Street is null', () => {
    const mockOp: OperatorType | null = {
        name:'',
        source_system:1

    };
    const mockAddress: AddressType | null = {
        street:undefined,
        suite:undefined,
        city:'Dallas',
        state:'Texas',
        zip:'80220',
        country:'United States',
        id: 1,
        address_active: true
    };
    const result = disableCreateButton(mockOp, mockAddress);
    expect(result).toBe(true);
});

test('It should return false when all except suite has a value', () => {
    const mockOp: OperatorType | null = {
        name:'Nav Oil',
        source_system:1

    };
    const mockAddress: AddressType | null = {
        street:'1234 Main Street',
        suite:'',
        city:'Dallas',
        state:'Texas',
        zip:'80220',
        country:'United States',
        id: 1,
        address_active: true
    };
    const result = disableCreateButton(mockOp, mockAddress);
    expect(result).toBe(false);
});
})