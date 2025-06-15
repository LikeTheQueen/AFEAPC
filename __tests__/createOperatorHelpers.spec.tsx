import { disableCreateButton } from "src/routes/createEditOperators/routes/helpers/helpers";
import type { AddressType, OperatorType } from "src/types/interfaces";

describe('Should toggle the disabled button to create the Operator correctly',() => {
    afterEach(() => {
    vi.resetAllMocks()
})
test('It should return true when the Op Name and Source ID is null', () => {
    const mockOp: OperatorType | null = null;
    const mockAddress: AddressType | null = null;
    const result = disableCreateButton(mockOp, mockAddress);

    expect(result).toBe(true);
});
test('It should return true when the Op Name and Source ID is null', () => {
    const mockOp: OperatorType | null = {
        name:null,
        source_system:null

    };
    const mockAddress: AddressType | null = {
        street:'123 Main Street',
        suite:null,
        city:null,
        state:null,
        zip:null,
        country:null
    };
    const result = disableCreateButton(mockOp, mockAddress);
    expect(result).toBe(true);
});

test('It should return true when the Op Name and Street is null', () => {
    const mockOp: OperatorType | null = {
        name:null,
        source_system:1

    };
    const mockAddress: AddressType | null = {
        street:null,
        suite:null,
        city:'Dallas',
        state:'Texas',
        zip:'80220',
        country:'United States'
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
        suite:null,
        city:'Dallas',
        state:'Texas',
        zip:'80220',
        country:'United States'
    };
    const result = disableCreateButton(mockOp, mockAddress);
    expect(result).toBe(false);
});
})