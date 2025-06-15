/*
export const fetchExecuteAFEDocHandle = async (item: ExecuteAFEDocIDType, authenticationToken: string): Promise<any> => {
  
    const requestBody = {
        AuthenticationToken: authenticationToken, 
        DocumentID: item.docID,
        DocumentType: 'AFE',
    };
    try {
    const response = await fetch(baseURL+urlPath, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      },
      redirect: 'follow'
    });

    if (!response.ok) {
      console.log(`Failed to get the Document handle for ${item.docID}`);
      throw new Error(`Failed to fetch item ${item.docID}: ${response.statusText}`);
    }
    const jsonResponse = await response.json();
    console.log("Step 5 I'm wrtiting estimates to the DB after this statement", jsonResponse.DocumentHandle);
    const newResult = await fetchExecuteAFEEstimatesSingleAFE(jsonResponse.DocumentHandle, authenticationToken, item.docID);
    
    return jsonResponse;
    
  } catch (error) {
    return { item, error: (error as Error).message };
  }
};

export const fetchAFEEstimates = async (items: ExecuteAFEDocIDType[], authToken: string, batchSize: number, delayMs: number, maxRetries: number) => {
    const batches: ExecuteAFEDocIDType[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

  for (const batch of batches) {
    console.log(`Processing batch of ${batch.length} requests to get AFE Estimate...`);
    const results = await Promise.all(batch.map(item => retryWithBackoff(item.docHandle, authToken, maxRetries, item.docID)))
    //const jsonResponse = await results.json();
    console.log("thee ar estimate",results);
    
    const failedRequests = results.filter(result => result.error);
    if (failedRequests.length > 0) {
      console.error(`Giving up on ${failedRequests.length} requests. Sending email...`);
      // TODO: Implement email notification logic here
    }
    
    await delay(delayMs);
    
  }
};

import type { ExecuteAFEDocIDType } from "../types/interfaces";

const baseURL='/api';
const urlPath = "/api/Afe/AfeEstimate";

export const fetchExecuteAFEEstimates = async (item: ExecuteAFEDocIDType, authenticationToken: string): Promise<any> => {
  
    const requestBody = {
        AuthenticationToken: authenticationToken, 
        Handle: item.docHandle
    };
    try {
    const response = await fetch(baseURL+urlPath, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      },
      redirect: 'follow'
    });
    console.log(response);
    if (!response.ok) {
        console.log(`Failed to get the Estimates for ${item.docID}`);
      throw new Error(`Failed to get Estimates ${item.docID}: ${response.statusText}`);
    }
    return response;
    
  } catch (error) {
    return { item, error: (error as Error).message };
  }
};

export const fetchExecuteAFEEstimates = async (item: ExecuteAFEDocIDType, authenticationToken: string): Promise<any> => {
  
    const requestBody = {
        AuthenticationToken: authenticationToken, 
        Handle: item.docHandle
    };
    try {
    const response = await fetch(baseURL+urlPath, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      },
      redirect: 'follow'
    });
    console.log(response);
    if (!response.ok) {
        console.log(`Failed to get the Estimates for ${item.docID}`);
      throw new Error(`Failed to get Estimates ${item.docID}: ${response.statusText}`);
    }
    //const jsonResponse = await response.json();
    //const afeEstimatesForAFE : ExecuteAFEEstimatesType[] = transformExecuteAFEEstimates(jsonResponse.LineItems);
    //console.log("this are estimates",jsonResponse.LineItems);
    return response;
    
  } catch (error) {
    return { item, error: (error as Error).message };
  }
};




<table className="mt-16 w-full text-left text-sm/6 whitespace-nowrap table-auto">
              <thead className="border-b border-gray-200 text-[var(--dark-teal)]">
                  <tr>
                    <th scope="col" className="px-0 py-3 font-semibold custom-style border-r border-red-900 w-1/5">
                      
                    </th>
                    <th scope="col" className="px-0 py-3 font-semibold custom-style border-r border-red-900">
                      Operator Account
                    </th>
                    <th scope="col" className="hidden py-3 pr-0 pl-8 text-right font-semibold custom-style sm:table-cell">
                      Gross Amount
                    </th>
                    <th scope="col" className="hidden py-3 pr-0 pl-8 text-right font-semibold custom-style sm:table-cell">
                      Partner Account
                    </th>
                    <th scope="col" className="py-3 pr-0 pl-8 text-right font-semibold custom-style">
                      Net Amount
                    </th>
                  </tr>
              </thead>
              {groupedAccounts && Array.from(groupedAccounts).map(([accountGroup, accounts]) => (
              <tbody key={accountGroup}>
                <tr>
                <td colSpan={5} className="border-b border-red-900">{accountGroup}</td>
                </tr>
                {accounts.map((item) => (
                    <tr key={item.id} className="border-b border-gray-900">
                      <td className="max-w-100 px-0 py-5 align-top">
                        <div className="truncate font-medium text-[var(--dark-teal)]">{item.operator_account_number}</div>
                        <div className="truncate text-gray-500">{item.operator_account_description}</div>
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                        {item.id}
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                        {item.id}
                      </td>
                      <td className="py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums">{item.id}</td>
                    </tr>
                  ))}
              </tbody>
              ))}
              </table>
              <table className="mt-16 w-full text-left text-sm/6 whitespace-nowrap table-auto">
                <colgroup>
                  <col />
                  <col />
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead className="border-b border-gray-200 text-[var(--dark-teal)]">
                  <tr>
                    <th scope="col" className="px-0 py-3 font-semibold custom-style w-1/5">
                      
                    </th>
                    <th scope="col" className="px-0 py-3 font-semibold custom-style w-1/5">
                      Operator Account
                    </th>
                    <th scope="col" className="hidden py-3 pr-0 pl-8 text-right font-semibold custom-style sm:table-cell w-1/5">
                      Gross Amount
                    </th>
                    <th scope="col" className="hidden py-3 pr-0 pl-8 text-right font-semibold custom-style sm:table-cell w-1/5">
                      Partner Account
                    </th>
                    <th scope="col" className="py-3 pr-0 pl-8 text-right font-semibold custom-style w-1/5">
                      Net Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupedAccounts && Array.from(groupedAccounts).map(([accountGroup, accounts]) => (
                    
                    <tr key={accountGroup} className="border-b border-red-900 ">
                      
                        <td colSpan={5} className="border-b border-red-900">{accountGroup}</td>
                      <td className="max-w-0 px-0 py-5 align-top border-l">
                        <div className="font-medium text-[var(--dark-teal)] border-l border-red-900">Op account Number</div>
                        <div className="font-medium text-[var(--dark-teal)]">Op account Description</div>
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                      <div className="font-medium text-[var(--dark-teal)]">Partner Account Number</div>
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                      <div className="font-medium text-[var(--dark-teal)]">Gross Amount</div>
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                      <div className="font-medium text-[var(--dark-teal)]">Net Amount</div>
                      </td>
                      
 */                     
/* 
                      {accounts.map((item) => (
                    <tr key={item.id} className="border-b border-gray-900">
                      <td className="max-w-100 px-0 py-5 align-top">
                        <div className="truncate font-medium text-[var(--dark-teal)]">{item.operator_account_number}</div>
                        <div className="truncate text-gray-500">{item.operator_account_description}</div>
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                        {item.id}
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                        {item.id}
                      </td>
                      <td className="py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums">{item.id}</td>
                    </tr>
                  ))}
                  
                    </tr>
                  ))}

                </tbody>
                <tbody>
                  
                  {afeEstimates?.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="max-w-0 px-0 py-5 align-top">
                        <div className="truncate font-medium text-[var(--dark-teal)]">{item.id}</div>
                        <div className="truncate text-gray-500">{item.id}</div>
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                        {item.id}
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                        {item.id}
                      </td>
                      <td className="py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums">{item.id}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row" className="px-0 pt-6 pb-0 font-normal text-gray-700 sm:hidden">
                      Subtotal
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden px-0 pt-6 pb-0 text-right font-normal text-gray-700 sm:table-cell"
                    >
                      Subtotal
                    </th>
                    <td className="pt-6 pr-0 pb-0 pl-8 text-right text-[var(--dark-teal)] tabular-nums">{invoice.subTotal}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="pt-4 font-normal text-gray-700 sm:hidden">
                      Tax
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-4 text-right font-normal text-gray-700 sm:table-cell"
                    >
                      Tax
                    </th>
                    <td className="pt-4 pr-0 pb-0 pl-8 text-right text-[var(--dark-teal)] tabular-nums">{invoice.tax}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="pt-4 font-semibold custom-style text-[var(--dark-teal)] sm:hidden">
                      Total
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-4 text-right font-semibold custom-style text-[var(--dark-teal)] sm:table-cell"
                    >
                      Total
                    </th>
                    <td className="pt-4 pr-0 pb-0 pl-8 text-right font-semibold custom-style text-[var(--dark-teal)] tabular-nums">
                      {invoice.total}
                    </td>
                  </tr>
                </tfoot>
              </table>
              */

              /* 
              describe('AFEDetailURL', () => {
  afterEach(() => {
        vi.resetAllMocks()
    })

  it('shows loading when afes are not loaded', () => {
    (useSupabaseData as any).mockReturnValue({ afes: undefined });

    render(
      <MemoryRouter initialEntries={['/mainscreen/afeDetail/123e4567-e89b-12d3-a456-426614174000']}>
        <Routes>
          <Route path="/mainscreen/afeDetail/:afeID" element={<AFEDetailURL />} />
        </Routes>
      </MemoryRouter>
    );

    // You might need to add a loading indicator to your component
    // expect(screen.getByText(/loading afe data/i)).toBeInTheDocument();
  });

  it('shows not found when afeID does not match', () => {
    (useSupabaseData as any).mockReturnValue({
      afes: [{ id: '999', afe_number: 'Some Other AFE' }],
    });

    render(
      <MemoryRouter initialEntries={['/mainscreen/afeDetail/123e4567-e89b-12d3-a456-426614174000']}>
        <Routes>
          <Route path="/mainscreen/afeDetail/:afeID" element={<AFEDetailURL />} />
        </Routes>
      </MemoryRouter>
    );

    // You might need to add a not found message to your component
    // expect(screen.getByText(/afe not found/i)).toBeInTheDocument();
  });

  it('shows AFE details when matching afeID is found', async () => {
    // Mock the useSupabaseData hook to return mock AFE
 
    (useSupabaseData as any).mockReturnValue({ afes: [mockAFE]});
    //(fetchFromSupabaseMatchOnString as any).mockResolvedValue(mockHistoryData);
    (fetchEstimatesFromSupabaseMatchOnAFEandPartner as any).mockResolvedValue([mockEstimates]);
    
    

   
    render(
      
      <MemoryRouter initialEntries={['/mainscreen/afeDetail/123e4567-e89b-12d3-a456-426614174000']}>
        <Routes>
          <Route path="/mainscreen/afeDetail/:afeID" element={<AFEDetailURL />} />
        </Routes>
      </MemoryRouter>
      
    );
    
    screen.debug(undefined, 100000);
     await waitFor(() => {
    expect(screen.getByText(/TESTNum1/i)).toBeInTheDocument();
    expect(screen.getByText(/727.15/i)).toBeInTheDocument(); 
    }); 
    //const comment = await screen.findByText(/Initial comment/i);
//expect(comment).toBeInTheDocument();



   
  
  });
});
<AFEHistory {...afeRecord!} />

export const transformUserProfileSupabase = (data: any[]): UserProfileSupabaseType[] => {
        return data.map(item => ({
        firstName: item.first_name,
        lastName: item.last_name,
        opCompany: item.op_company.name,
        email: item.email,
        partnerCompany: item.partner_company.partner_name,

    }))
};

export const transformUserProfileSupabase = (data: any): UserProfileSupabaseType => {
    return data.map((item: { first_name: string; last_name: string; op_company: { name: string; }; email: string; partner_company: { partner_name: string; }; }) => ({
        firstName: item.first_name,
        lastName: item.last_name,
        opCompany: item.op_company.name,
        email: item.email,
        partnerCompany: item.partner_company.partner_name,

    }))
};



              */