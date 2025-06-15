import { setStatusBackgroundColor, setStatusRingColor, setStatusTextColor } from "src/routes/afeDashboard/routes/helpers/styleHelpers";
import { activeTab, formatDate, isLoggedInUserOperator } from "src/helpers/styleHelpers";
import { setIsHidden } from "src/routes/afeDashboard/routes/helpers/styleHelpers";
import type { AFEType } from 'src/types/interfaces';
import { vi } from 'vitest';
import { singleAFE, twoAFErecords } from './test-utils/afeRecords';

describe('Determine values when partner status is null', () => {
    afterEach(() => {
        vi.resetAllMocks()
    })

    test('It should return white when the status does NOT match anything', () => {
        const mockPartnerStatus: string | null | undefined = 'jibberish';

        const textResult = setStatusTextColor(mockPartnerStatus);
        const backgroundResult = setStatusBackgroundColor(mockPartnerStatus);
        const ringResult = setStatusRingColor(mockPartnerStatus);

        expect(textResult).toBe('white');
        expect(backgroundResult).toBe('white');
        expect(ringResult).toBe('white');
    });

    test('It should return white when the status is null', () => {
        const mockPartnerStatus: string | null | undefined = null;

        const textResult = setStatusTextColor(mockPartnerStatus);
        const backgroundResult = setStatusBackgroundColor(mockPartnerStatus);
        const ringResult = setStatusRingColor(mockPartnerStatus);

        expect(textResult).toBe('white');
        expect(backgroundResult).toBe('white');
        expect(ringResult).toBe('white');
    });

    test('It should return white when the status is undefined', () => {
        const mockPartnerStatus: string | null | undefined = undefined;

        const textResult = setStatusTextColor(mockPartnerStatus);
        const backgroundResult = setStatusBackgroundColor(mockPartnerStatus);
        const ringResult = setStatusRingColor(mockPartnerStatus);

        expect(textResult).toBe('white');
        expect(backgroundResult).toBe('white');
        expect(ringResult).toBe('white');
    });

    test('It should return dark teal colors when status is New', () => {
        const mockPartnerStatus: string | null | undefined = 'New';

        const textResult = setStatusTextColor(mockPartnerStatus);
        const backgroundResult = setStatusBackgroundColor(mockPartnerStatus);
        const ringResult = setStatusRingColor(mockPartnerStatus);

        expect(textResult).toBe('[var(--darkest-teal)]');
        expect(backgroundResult).toBe('white');
        expect(ringResult).toBe('[var(--darkest-teal)]');
    });

    test('It should return dark teal colors when status is Viewed', () => {
        const mockPartnerStatus: string | null | undefined = 'Viewed';

        const textResult = setStatusTextColor(mockPartnerStatus);
        const backgroundResult = setStatusBackgroundColor(mockPartnerStatus);
        const ringResult = setStatusRingColor(mockPartnerStatus);

        expect(textResult).toBe('[var(--dark-teal)]');
        expect(backgroundResult).toBe('[var(--dark-teal)]/30');
        expect(ringResult).toBe('[var(--darkest-teal)]/20');
    });

    test('It should return bright pink colors when status is Approved', () => {
        const mockPartnerStatus: string | null | undefined = 'Approved';

        const textResult = setStatusTextColor(mockPartnerStatus);
        const backgroundResult = setStatusBackgroundColor(mockPartnerStatus);
        const ringResult = setStatusRingColor(mockPartnerStatus);

        expect(textResult).toBe('white');
        expect(backgroundResult).toBe('[var(--bright-pink)]');
        expect(ringResult).toBe('[var(--bright-pink)]/20');
    });

    test('It should return red colors when status is Rejected', () => {
        const mockPartnerStatus: string | null | undefined = 'Rejected';

        const textResult = setStatusTextColor(mockPartnerStatus);
        const backgroundResult = setStatusBackgroundColor(mockPartnerStatus);
        const ringResult = setStatusRingColor(mockPartnerStatus);

        expect(textResult).toBe('white');
        expect(backgroundResult).toBe('red-900');
        expect(ringResult).toBe('red-900');
    });
});

describe('It should toggle the hidden value', () => {
    afterEach(() => {
    vi.resetAllMocks()
})
 test('It should return true (it is hidden) if the afes are undefined or length is 0', () => {

    const mockAFEs:AFEType[] | undefined = undefined;
    const result = setIsHidden(mockAFEs);

    expect(result).toBe(true);
 });

 test('It should return true (it is hidden) if the afes are undefined or length is 0', () => {

    const mockAFEs:AFEType[] | undefined = [];
    const result = setIsHidden(mockAFEs);

    expect(result).toBe(true);
 });

 test('It should return false (it is NOT hidden) if there are AFEs', () => {

    const mockAFEs:AFEType[] | undefined = singleAFE;
    const result = setIsHidden(mockAFEs);

    expect(result).toBe(false);
 });

 test('It should return false (it is NOT hidden) if there are AFEs', () => {

    const mockAFEs:AFEType[] | undefined = twoAFErecords;
    const result = setIsHidden(mockAFEs);

    expect(result).toBe(false);
 });

});

describe('it should change the current tab based on id', () => {
    afterEach(() => {
        vi.resetAllMocks()
    })
    test('The tabs should return with the same value when there is no selected ID passed', () => {
        const selected = 2;
        const selectedTabId = 1;
        const tabs = [
            { id: 1, name: "Non-Operated AFEs", current: true },
            { id: 2, name: "Operated AFEs", current: false },
            { id: 3, name: "All AFEs", current: false },
        ];
        const updatedTabs = [
            { id: 1, name: "Non-Operated AFEs", current: true },
            { id: 2, name: "Operated AFEs", current: false },
            { id: 3, name: "All AFEs", current: false },
        ];
        const result = activeTab(tabs, null);
        expect(result).toEqual({ updatedTabs, selectedTabId })
    });

    test('The tabs should return an updated value with current being id 2 and not id 1', () => {
        const selected = 2;
        const selectedTabId = 2;
        const tabs = [
            { id: 1, name: "Non-Operated AFEs", current: true },
            { id: 2, name: "Operated AFEs", current: false },
            { id: 3, name: "All AFEs", current: false },
        ];
        const updatedTabs = [
            { id: 1, name: "Non-Operated AFEs", current: false },
            { id: 2, name: "Operated AFEs", current: true },
            { id: 3, name: "All AFEs", current: false },
        ];
        const result = activeTab(tabs, selected);
        expect(result).toEqual({ updatedTabs, selectedTabId })
    });
});

 describe('it should format the date', () => {
    afterEach(() => {
        vi.resetAllMocks()
    })
    test('it should return an empty string if the date is null', () => {
        const date = null;
        const result = formatDate(date);

        expect(result).toBe('');
    });
    test('it should return a formatted date', () => {
        const date = new Date(2022, 4, 5);
        const result = formatDate(date);

        expect(result).toBe('May 5, 2022 at 12:00 AM');
    });

    test('it should return a formatted date with a given string', () => {
        const date = '2022-05-06';
        const result = formatDate(date);

        expect(result).toBe('May 5, 2022');
    });

    test('it should return a formatted date with a given string', () => {
        const date = '2025-04-04 17:01:55.902079+00';
        const result = formatDate(date);

        expect(result).toBe('April 4, 2025 at 11:01 AM');
    });

 });

 describe('it should determine if the logged in user is associated to the Operator of the AFE', () => {
    afterEach(() => {
        vi.resetAllMocks()
    })
    test('It should return true if the logged in user is associated to the operator on the AFE', () => {
        const operator = 'a4367e56-14bf-4bd1-b0f1-fecc7d97b58c';
        const loggedInUserOperator = 'a4367e56-14bf-4bd1-b0f1-fecc7d97b58c';

        const result = isLoggedInUserOperator(operator, loggedInUserOperator)

        expect(result).toBe(true);
    });

    test('It should return true if there is an undefined op value', () => {
        const operator = 'a4367e56-14bf-4bd1-b0f1-fecc7d97b58c';
        const loggedInUserOperator = 'a4367e56-14bf-4bd1-b0f1-fecc7d97b58c';

        const result = isLoggedInUserOperator(undefined, loggedInUserOperator)

        expect(result).toBe(true);
    });

    test('It should return true if there is an undefined partner op value', () => {
        const operator = 'a4367e56-14bf-4bd1-b0f1-fecc7d97b58c';
        const loggedInUserOperator = 'a4367e56-14bf-4bd1-b0f1-fecc7d97b58c';

        const result = isLoggedInUserOperator(operator, undefined)

        expect(result).toBe(true);
    });

    test('It should return false if the logged in user is NOT associated to the operator', () => {
        const operator = 'a4367e56-14bf-4bd1-b0f1-fecc7d97b58c';
        const loggedInUserOperator = 'a4367e56-14bf-4bd1-b0f1-fecc7d97b58';

        const result = isLoggedInUserOperator(operator, loggedInUserOperator)

        expect(result).toBe(false);
    });

    
    
 });