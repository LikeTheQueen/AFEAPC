import { vi } from 'vitest';
import * as fetchProvider from '../provider/fetch';
import { setAFEHistoryMaxID, groupByAccountGroup, calcPartnerNet, toggleStatusButtonDisable } from '../src/helpers/helpers'
import { handlePartnerStatusChange } from "src/routes/afeDashboard/routes/helpers/helpers";
import type { AFEHistorySupabaseType, AFEType, EstimatesSupabaseType } from 'src/types/interfaces';
import { singleAFE, twoAFErecords, singleEstimateRecord, parterNewStatus, parterApprovedStatus, parterRejectedStatus, parterViewStatus } from './test-utils/afeRecords';

describe('Determining the max HistoryID', () => {
    afterEach(() => {
        vi.resetAllMocks()
    })
    test('It should set the maxID to 0 when afeHistories is empty', () => {
        const afehistories: AFEHistorySupabaseType[] = [];

        const result = setAFEHistoryMaxID(afehistories);

        expect(result).toBe(afehistories.length);
    });
    
    test('It should set the maxID to 0 when afeHistories is 1', () => {
        const afehistories: AFEHistorySupabaseType[] =
            [{
                id: 1,
                afe_id: '234',
                created_at: new Date(),
                user: 'You',
                description: 'Desription',
                type: 'action',
            }
            ];

        const result = setAFEHistoryMaxID(afehistories);

        expect(result).toBe(1);
    });
    test('It should set the maxID to 0 when afeHistories is 3', () => {
        const afehistories: AFEHistorySupabaseType[] =
            [{
                id: 1,
                afe_id: '234',
                created_at: new Date(),
                user: 'You',
                description: 'Desription',
                type: 'action',
            },
            {
                id: 1,
                afe_id: '234',
                created_at: new Date(),
                user: 'You',
                description: 'Desription',
                type: 'action',
            },
            {
                id: 1,
                afe_id: '234',
                created_at: new Date(),
                user: 'You',
                description: 'Desription',
                type: 'action',
            }
            ];

        const result = setAFEHistoryMaxID(afehistories);

        expect(result).toBe(3);
    });
})

vi.mock('../provider/fetch', () => ({
  updateAFEPartnerStatusSupabase: vi.fn(),
  addAFEHistorySupabase: vi.fn(),
}));

describe('handlePartnerStatusChange', () => {
  afterEach(() => {
    vi.resetAllMocks()
})
  it('calls updateAFEPartnerStatusSupabase and addAFEHistorySupabase when partnerStatus is "New"', () => {
    const mockId = '123';
    const mockPartnerStatus = 'New';
    const mockNewPartnerStatus = 'Viewed';
    const mockDescription = 'The Partner Status on the AFE changed from New to Viewed';
    const mockType = 'action'

    handlePartnerStatusChange(mockId, mockPartnerStatus, mockNewPartnerStatus, mockDescription, mockType);

    expect(fetchProvider.updateAFEPartnerStatusSupabase).toHaveBeenCalledWith(mockId, mockNewPartnerStatus);
    expect(fetchProvider.addAFEHistorySupabase).toHaveBeenCalledWith(
      mockId,
      mockDescription,
      mockType
    );
  });

  it('calls updateAFEPartnerStatusSupabase and addAFEHistorySupabase when partnerStatus is "New"', () => {
    const mockId = '123';
    const mockPartnerStatus = '';
    const mockNewPartnerStatus = 'Viewed';
    const mockDescription = 'The Partner Status on the AFE changed from New to Viewed';
    const mockType = 'action'

    handlePartnerStatusChange(mockId, mockPartnerStatus, mockNewPartnerStatus, mockDescription, mockType);

    expect(fetchProvider.updateAFEPartnerStatusSupabase).toHaveBeenCalledWith(mockId, mockNewPartnerStatus);
    expect(fetchProvider.addAFEHistorySupabase).toHaveBeenCalledWith(
      mockId,
      mockDescription,
      mockType
    );
  });

  it('calls updateAFEPartnerStatusSupabase and addAFEHistorySupabase when partnerStatus is "Approved"', () => {
    const mockId = '456';
    const mockPartnerStatus = 'Approved';
    const mockNewPartnerStatus = 'Approved';
    const mockDescription = 'The AFE has been marked as Approved by the Partner';
    const mockType = 'action'

    handlePartnerStatusChange(mockId, mockPartnerStatus, mockNewPartnerStatus, mockDescription, mockType);

    expect(fetchProvider.updateAFEPartnerStatusSupabase).not.toHaveBeenCalled;
    expect(fetchProvider.addAFEHistorySupabase).not.toHaveBeenCalled;
  });
});

describe('It should group the accounts by the account group', () => {
    afterEach(() => {
    vi.resetAllMocks()
})
    test('It should return null if account is null', () => {

        const account: EstimatesSupabaseType[] | null = null;
        const result = groupByAccountGroup(account);

        expect(result).toBe(null);

    });

    test('It should return a map if account is not null', () => {

        const account: EstimatesSupabaseType[] | null = singleEstimateRecord;
        const result = groupByAccountGroup(account);

        console.log(typeof(result));
        expect(result).toBeInstanceOf(Map)

    });

});

describe('It should calculate the partners WI', () => {
    afterEach(() => {
    vi.resetAllMocks()
})

test('It should return an amount when the gross amount and wi are present', () => {
    const gross: number | undefined = 100.00;
    const wi: number | undefined = 20.00;

    const result = calcPartnerNet(gross, wi);
    expect(result).toBe('$20.00');
});

test('It should return an error when WI is undefiend', () => {
    const gross: number | undefined = 100.00;
    const wi: number | undefined = undefined;

    const result = calcPartnerNet(gross, wi);
    expect(result).toBe('Missing working interest');
});

test('It should return an error when gross is undefiend', () => {
    const gross: number | undefined = undefined;
    const wi: number | undefined = 20.00;

    const result = calcPartnerNet(gross, wi);
    expect(result).toBe('Missing gross amount');
});

test('It should return an error when WI and gross is undefiend', () => {
    const gross: number | undefined = undefined;
    const wi: number | undefined = undefined;

    const result = calcPartnerNet(gross, wi);
    expect(result).toBe('Missing WI and gross amount');
});

});

describe('The Approve and Reject buttons disabled should toggle',() => {
    afterEach(() => {
    vi.resetAllMocks()
})
test('If the partner status is null or undefined it should return false', () => {
    const mockAFE: AFEType | undefined | null = null;
    const result = toggleStatusButtonDisable(mockAFE);

    expect(result).toBe(true);
});

test('If the partner status is Approved it should return true (it is disabled)', () => {
    const mockAFE: AFEType | undefined | null = parterApprovedStatus;
    const result = toggleStatusButtonDisable(mockAFE);

    expect(result).toBe(true);
});

test('If the partner status is Rejected it should return true (it is disabled)', () => {
    const mockAFE: AFEType | undefined | null = parterRejectedStatus;
    const result = toggleStatusButtonDisable(mockAFE);

    expect(result).toBe(true);
});

test('If the partner status is New it should return false (it is NOT disabled)', () => {
    const mockAFE: AFEType | undefined | null = parterNewStatus;
    const result = toggleStatusButtonDisable(mockAFE);

    expect(result).toBe(false);
});

test('If the partner status is Viewed it should return false (it is NOT disabled)', () => {
    const mockAFE: AFEType | undefined | null = parterViewStatus;
    const result = toggleStatusButtonDisable(mockAFE);

    expect(result).toBe(false);
});
})