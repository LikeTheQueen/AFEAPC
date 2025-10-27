import { useEffect, useMemo, useState } from "react";
import { updateUserActiveStatusToInactive, updateUserActiveStatusToActive } from 'provider/write';
import { type OperatorPartnerAddressType, type OperatorPartnerRecord, type UserFullNameAndEmail } from "src/types/interfaces";
import { useSupabaseData } from "src/types/SupabaseContext";
import { transformOperatorPartnerAddress, transformOperatorPartnerRecord } from "src/types/transform";
import { fetchListOfOperatorsOrPartnersForUser, fetchOperatorsOrPartnersToEdit } from "provider/fetch";

function addressDisplay(operatorOrPartnerRecord: OperatorPartnerAddressType) {
    const operatorOrPartnerAddress = operatorOrPartnerRecord.street!.concat(' ',
                    `${operatorOrPartnerRecord.suite === undefined || operatorOrPartnerRecord.suite === '' ? '' : '#'+operatorOrPartnerRecord.suite.concat(' ')}`,
                    `${operatorOrPartnerRecord.city === undefined ? '' : operatorOrPartnerRecord.city.concat(', ')}`,
                    `${operatorOrPartnerRecord.state === undefined ? '' : operatorOrPartnerRecord.state.concat(' ')}`,
                    `${operatorOrPartnerRecord.zip === undefined ? '' : operatorOrPartnerRecord.zip.concat(' ')}`,
                    `${operatorOrPartnerRecord.country === undefined ? '' : operatorOrPartnerRecord.country}`)
    return operatorOrPartnerAddress;
}

export default function OperatorViewAndEdit () {
    const { loggedInUser, session } = useSupabaseData();
    const token = session?.access_token ?? "";
    const [loadingOperators, setLoadingOperators] = useState(true);
    const [operatorsList, setOperatorsList] = useState<OperatorPartnerRecord[] | []>([]);
    const [partnersList, setPartnersList] = useState<OperatorPartnerRecord[] | []>([]);

    useEffect(() => {
        if (!loggedInUser || token==='') {
          setLoadingOperators(false);
          return;
        }
    
        let isMounted = true;
        async function getOperatorList() {
          if(!loggedInUser?.user_id) return;
    
          setLoadingOperators(true);
        try{
          const [opListResult, partnerListResult] = await Promise.all([
            fetchOperatorsOrPartnersToEdit(loggedInUser?.user_id!, 'OPERATOR_USER_PERMISSIONS', 'OPERATOR_ADDRESS', token),
            fetchOperatorsOrPartnersToEdit(loggedInUser?.user_id!, 'PARTNER_USER_PERMISSIONS', 'PARTNER_ADDRESS', token)
          ]);
         
          if(opListResult.ok) {
          const opListTransformed = transformOperatorPartnerRecord(opListResult.data);
          if(isMounted) {
          setOperatorsList(opListTransformed);
          }
          }
    
          if(partnerListResult.ok) {
            const partnerListTransformed = transformOperatorPartnerRecord(partnerListResult.data);
            if(isMounted) {
            setPartnersList(partnerListTransformed);
            }
          }
        } catch(e) {
          console.error('Unable to get Operators or Permissions',e);
        } finally {
          setLoadingOperators(false);
          return;
        }
        } getOperatorList();
        return () => {
          isMounted = false;
        }
      }, [loggedInUser]);

    return (
        <>
        <div className="px-4 sm:px-10 sm:py-16 divide-y divide-gray-900/20 ">
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 divide-x divide-gray-300">
                <div className="">
                    <h2 className="custom-style font-semibold text-[var(--darkest-teal)]">Operator Profiles</h2>
                    <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">Self-deactivation? Nice try, 007. You'll need outside authorization for that stunt</p>
                    <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">Another admin for your organization will need to deactivate your profile or contact AFE Partner Connections directly.</p>
                </div>
                <div className="-mx-4 mt-8 sm:-mx-0 md:col-span-2 ">
                    <table className="min-w-full divide-y divide-gray-400">
                <thead>
                    <tr>
                        <th scope="col" 
                            className="hidden py-3.5 pr-3 pl-4 text-left font-semibold text-[var(--darkest-teal)] custom-style sm:pl-0 sm:table-cell">
                            Company Name
                        </th>
                        <th scope="col" 
                            className="hidden px-3 py-3.5 text-center custom-style font-semibold text-[var(--darkest-teal)] sm:table-cell">
                            <span className="sr-only">Edit</span>
                        </th>
                        <th scope="col" className="hidden py-3.5 pr-4 pl-3 sm:pr-0">
                            <span className="sr-only">Activate or Deactivate</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 bg-white">

                    {operatorsList.map(operator => (
                        <tr key={operator.apc_id}>
                            <td className="text-start align-middle max-w-0 py-4 pr-3 pl-4 font-semibold text-[var(--darkest-teal)] custom-style sm:w-auto sm:max-w-none sm:pl-0 ">
                                {operator.name} 
                                <dl className="font-normal">
                                <dt className="sr-only">Address</dt>
                                <dd className="mt-1 truncate text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">{addressDisplay(operator)}</dd> 
                                <dt className="sr-only ">Status</dt>
                                <dd className="mt-1 truncate text-gray-500 flex justify-between">
                                    <span
                                    hidden={!operator.active}
                                    className="inline-flex items-center rounded-md bg-[var(--bright-pink)] px-3 py-2 text-sm font-semibold text-white custom-style shadow-xl">
                                    Active
                                </span>
                                <span
                                    hidden={operator.active}
                                    className="inline-flex items-center rounded-md bg-[var(--darkest-teal)]/20 px-3 py-2 text-sm font-medium text-[var(--darkest-teal)] custom-style ring-1 ring-[var(--darkest-teal)]/20 ring-inset shadow-lg">
                                    Inactive
                                </span>
                                <button
                                    type="button"
                                    hidden={operator.active}
                                    disabled={operator.active}
                                    //onClick={(e: any) => handleReactivate(user.id)}
                                    className="sm:hidden rounded-md bg-white px-3 py-2 text-sm font-semibold text-[var(--dark-teal)] outline-[var(--dark-teal)] outline-1 shadow-md hover:bg-[var(--bright-pink)] hover:text-white hover:outline-[var(--bright-pink)] transition-colors ease-in-out duration-200 custom-style disabled:bg-gray-300 disabled:text-gray-500">
                                    Activate Op125
                                </button>
                                <button
                                    type="button"
                                    hidden={!operator.active}
                                    disabled={!operator.active}
                                    //onClick={(e: any) => handleDeactivate(user.id)}
                                    className="sm:hidden rounded-md bg-white px-3 py-2 text-sm font-semibold text-[var(--dark-teal)] outline-[var(--dark-teal)] outline-1 shadow-md hover:bg-[var(--bright-pink)] hover:text-white hover:outline-[var(--bright-pink)] transition-colors ease-in-out duration-200 custom-style disabled:bg-gray-300 disabled:text-gray-500">
                                    Deactivate Op125
                                </button>
                                </dd>
                            </dl>
                            
                            </td>
                            <td className="hidden align-middle px-3 py-4 text-sm lg:whitespace-nowrap text-center sm:table-cell">
                                <button
                                    type="button"
                                    //hidden={operator.active}
                                    //disabled={operator.active}
                                    //onClick={(e: any) => handleReactivate(user.id)}
                                    className="rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[var(--bright-pink)] custom-style disabled:bg-gray-300 disabled:text-gray-500">
                                    Edit
                                </button>

                            </td>
                            <td className="hidden align-middle px-3 py-4 text-sm lg:whitespace-nowrap text-center sm:table-cell">
                                
                                <button
                                    type="button"
                                    hidden={operator.active}
                                    disabled={operator.active}
                                    //onClick={(e: any) => handleReactivate(user.id)}
                                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-[var(--dark-teal)] outline-[var(--dark-teal)] outline-1 shadow-md hover:bg-[var(--bright-pink)] hover:text-white hover:outline-[var(--bright-pink)] transition-colors ease-in-out duration-200 custom-style disabled:bg-gray-300 disabled:text-gray-500">
                                    Activate
                                </button>
                                <button
                                    type="button"
                                    hidden={!operator.active}
                                    disabled={!operator.active}
                                    //onClick={(e: any) => handleDeactivate(user.id)}
                                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-[var(--dark-teal)] outline-[var(--dark-teal)] outline-1 shadow-md hover:bg-[var(--bright-pink)] hover:text-white hover:outline-[var(--bright-pink)] transition-colors ease-in-out duration-200 custom-style disabled:bg-gray-300 disabled:text-gray-500">
                                    Deactivate
                                </button>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
                    </table>

                </div>
            </div>
        </div>
      
        </>
    )
}