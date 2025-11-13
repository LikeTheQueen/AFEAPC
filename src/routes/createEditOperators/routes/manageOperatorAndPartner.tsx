import { useEffect, useMemo, useState } from "react";
import { type OperatorPartnerAddressType, type OperatorPartnerRecord } from "src/types/interfaces";
import { useSupabaseData } from "src/types/SupabaseContext";
import { transformOperatorPartnerRecord } from "src/types/transform";
import { fetchOperatorsOrPartnersToEdit } from "provider/fetch";
import EditOperator from "./editOperator";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { updateOperatorAddress, updateOperatorNameAndStatus } from "provider/write";
import { ToastContainer } from "react-toastify";
import { notifyStandard } from "src/helpers/helpers";


function addressDisplay(operatorOrPartnerRecord: OperatorPartnerAddressType) {
    const operatorOrPartnerAddress = operatorOrPartnerRecord.street!.concat(' ',
                    `${operatorOrPartnerRecord.suite === undefined || operatorOrPartnerRecord.suite === '' ? '' : '#'+operatorOrPartnerRecord.suite.concat(' ')}`,
                    `${operatorOrPartnerRecord.city === undefined ? '' : operatorOrPartnerRecord.city.concat(', ')}`,
                    `${operatorOrPartnerRecord.state === undefined ? '' : operatorOrPartnerRecord.state.concat(' ')}`,
                    `${operatorOrPartnerRecord.zip === undefined ? '' : operatorOrPartnerRecord.zip.concat(' ')}`,
                    `${operatorOrPartnerRecord.country === undefined ? '' : operatorOrPartnerRecord.country}`)
    return operatorOrPartnerAddress;
};

export default function OperatorViewAndEdit () {
    const { loggedInUser, session } = useSupabaseData();
    const token = session?.access_token ?? "";
    const [loadingOperators, setLoadingOperators] = useState(true);
    const [operatorsList, setOperatorsList] = useState<OperatorPartnerRecord[] | []>([]);
    const [partnersList, setPartnersList] = useState<OperatorPartnerRecord[] | []>([]);
    const [operatorToEdit, setOperatorToEdit] = useState<OperatorPartnerRecord | null>(null);
    const [open, setOpen] = useState(false)

    const [rowsLimit] = useState(5);
    const [rowsToShow, setRowsToShow] = useState<OperatorPartnerRecord[]>([]);
    const [customPagination, setCustomPagination] = useState<number[] | []>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const nextPage = () => {
        const startIndex = rowsLimit * (currentPage + 1);
        const endIndex = startIndex + rowsLimit;
        const newArray = operatorsList.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(currentPage + 1);
    };
    const changePage = (value: number) => {
        const startIndex = value * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = operatorsList.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(value);
    };
    const previousPage = () => {
        const startIndex = (currentPage - 1) * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = operatorsList.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else {
            setCurrentPage(0);
        }
    };

    useMemo(() => {
            setCustomPagination(
                Array(Math.ceil(operatorsList.length / rowsLimit)).fill(null)
            );
            setTotalPage(
                Math.ceil(operatorsList.length / rowsLimit)
            )
        }, [operatorsList]);

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
            fetchOperatorsOrPartnersToEdit(loggedInUser?.user_id!, 'OPERATOR_USER_PERMISSIONS', 'OPERATOR_ADDRESS', [1,4,5], token),
            fetchOperatorsOrPartnersToEdit(loggedInUser?.user_id!, 'PARTNER_USER_PERMISSIONS', 'PARTNER_ADDRESS', [1,4,5], token)
          ]);
         
          if(opListResult.ok) {
          const opListTransformed = transformOperatorPartnerRecord(opListResult.data);
          if(isMounted) {
          setOperatorsList(opListTransformed.sort((a,b) => a.name.localeCompare(b.name)));
          setRowsToShow(opListTransformed ? opListTransformed.sort((a,b) => a.name.localeCompare(b.name)).slice(0,rowsLimit) : []);
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
      }, [loggedInUser, open]);
    async function handleClickActivateOrDeactivateOperator(operatorIdx: number) {

    const operatorToUpdate = operatorsList[operatorIdx];

    if(!operatorToUpdate.apc_id || !operatorToUpdate.apc_address_id) return;

    const updatedOperator = {
        ...operatorToUpdate,
        active: !operatorToUpdate.active,
        address_active: !operatorToUpdate.address_active
    }
    setOperatorsList(prevOperatorsList => 
        prevOperatorsList.map((operator, index) =>  
        index === operatorIdx 
            ? updatedOperator
            : operator
        )
    );

    try {
        const [operatorStatusChange, operatorAddressStatusChange] = await Promise.all([
            updateOperatorNameAndStatus(updatedOperator, token),
            updateOperatorAddress(updatedOperator, token)
        ])

      if(!operatorStatusChange.ok) {
        throw new Error(operatorStatusChange.message as any).message
      }
      if(!operatorAddressStatusChange.ok) {
        throw new Error(operatorAddressStatusChange.message as any).message
      }
      
    } catch (error) {
      console.error("Failed to change Operator status:", error);
    }
    }
    return (
        <>
        <div className="px-4 sm:px-10 sm:py-16">
        <div className="py-4 sm:py-0"> 
            <div className="grid max-w-full grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-7">
                <div className="md:col-span-2">
                    <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Operator Profiles</h2>
                    <p className="mt-1 text-md/6 text-[var(--darkest-teal)] custom-style-long-text">Manage the addresses for your AFEs.  The main address is the billing address for your organization with associated addresses for Non-Op AFEs.</p>
                    <p className="mt-1 text-md/6 text-[var(--darkest-teal)] custom-style-long-text">The address will be used by other Operators to send Non-Op AFEs for your review.  Sorta like the USPS, but better.</p>
                    <p className="mt-1 text-md/6 text-[var(--darkest-teal)] custom-style-long-text">User permissions to view, approve, reject or archive AFEs are associated by address.</p>
                </div>
                <div className="md:col-span-5 ">
                    <table className="min-w-full divide-y divide-[var(--darkest-teal)]/30 mb-4 shadow-xl">
                <thead>
                    <tr className="bg-white text-white ">
                        <th scope="col" 
                            className="hidden rounded-tl-xl w-3/5 px-4 py-3.5 text-left text-pretty text-base/7 font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                            Company Name
                        </th>
                        <th
                            scope="col"
                            className="hidden w-1/5 px-2 py-3.5 text-center text-pretty text-base/7 font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                            <span className="sr-only">Edit</span>
                        </th>
                        <th scope="col" className="hidden rounded-tr-lg w-1/5 px-2 py-3.5 text-center text-pretty text-base/7 font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                            <span className="sr-only">Activate or Deactivate</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--darkest-teal)]/30 bg-white">

                    {rowsToShow.map((operator, operatorIdx) => (
                        <tr key={operator.apc_id}>
                            <td className="text-base/7 text-start align-middle max-w-0 py-4 pr-3 pl-4 font-semibold text-[var(--darkest-teal)] custom-style sm:w-auto sm:max-w-none">
                                {operator.name} 
                                <dl className="font-normal">
                                <dt className="sr-only">Address</dt>
                                <dd className="mt-1 truncate text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">{addressDisplay(operator)}</dd> 
                                <dt className="sr-only ">Status</dt>
                                <dd className="mt-1 flex justify-between">
                                    <span
                                    hidden={!operator.active}
                                    className="inline-flex items-center rounded-full bg-[var(--bright-pink)] px-3 py-2 text-sm/6 font-semibold text-white custom-style">
                                    Active
                                </span>
                                <span
                                    hidden={operator.active}
                                    className="inline-flex items-center rounded-full bg-[var(--darkest-teal)]/20 px-3 py-2 text-sm/6 font-medium text-[var(--darkest-teal)] custom-style ring-1 ring-[var(--darkest-teal)]/20 ring-inset shadow-lg">
                                    Inactive
                                </span>
                                <button
                                    disabled={(!operator.apc_id && !operator.apc_address_id) ? true : false}
                                    onClick={async (e: any) => {
                                        e.preventDefault();
                                        handleClickActivateOrDeactivateOperator(operatorIdx);
                                        notifyStandard(`Operator name and billing address have been ${operator.active ? 'deactivated' : 'activated'}.  Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE ${operator.active ? 'deactivated' : 'activated'}.)`);
                                    }}
                                    className={
                                        `sm:hidden cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] 
                                                        ${!operator.active
                                            ? 'bg-[var(--darkest-teal)] text-white outline-[var(--darkest-teal)] outline-1'
                                            : 'bg-white text-[var(--darkest-teal)] outline-[var(--darkest-teal)] outline-1 -outline-offset-1'}`
                                    }>
                                    {operator.active ? 'Deactivate' : 'Activate'}
                                </button>
                                </dd>
                            </dl>
                            
                            </td>
                            <td className="hidden px-3 py-4 text-sm/6 lg:whitespace-nowrap text-center align-middle sm:table-cell">
                                <button
                                    type="button"
                                    onClick={(e: any) => {setOperatorToEdit(operator), setOpen(true)}}
                                    className="cursor-pointer rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm/6 font-semibold text-white shadow-lg hover:bg-[var(--bright-pink)] custom-style disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]">
                                    Edit
                                </button>
                            </td>
                            <td className="hidden align-middle px-3 py-4 text-sm/6 lg:whitespace-nowrap text-center sm:table-cell">
                                <button
                                    disabled={(!operator.apc_id && !operator.apc_address_id) ? true : false}
                                    onClick={async (e: any) => {
                                        e.preventDefault();
                                        handleClickActivateOrDeactivateOperator(operatorIdx);
                                        notifyStandard(`Operator name and billing address have been ${operator.active ? 'deactivated' : 'activated'}.  Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE ${operator.active ? 'deactivated' : 'activated'}.)`);
                                    }}
                                    className={
                                        `cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]
                                                        ${!operator.active
                                            ? 'bg-[var(--darkest-teal)] text-white outline-[var(--darkest-teal)] outline-1'
                                            : 'bg-white text-[var(--darkest-teal)] outline-[var(--darkest-teal)] outline-1'}`
                                    }>
                                    {operator.active ? 'Deactivate' : 'Activate'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                    </table>
                    <div className="w-full flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-2 px-1 items-center">
                                                        <div className="text-sm/6 text-[var(--darkest-teal)] custom-style font-medium">
                                                            Showing {currentPage == 0 ? 1 : currentPage * rowsLimit + 1} to{" "}
                                                            {currentPage == totalPage - 1
                                                                ? operatorsList?.length
                                                                : (currentPage + 1) * rowsLimit}{" "}
                                                            of {operatorsList?.length} Operator
                                                        </div>
                                                        <div className="flex">
                                                            <ul
                                                                className="flex justify-center items-center align-center gap-x-2 z-30"
                                                                role="navigation"
                                                                aria-label="Pagination">
                                                                <li
                                                                    className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid disabled] ${currentPage == 0
                                                                            ? "bg-white border-[var(--darkest-teal)]/10 text-[var(--darkest-teal)]/20 pointer-events-none"
                                                                            : "bg-white cursor-pointer border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                                                                        }`}
                                                                    onClick={previousPage}>
                                                                    <ChevronLeftIcon></ChevronLeftIcon>
                                                                </li>
                                                                {customPagination?.map((data, index) => (
                                                                    <li
                                                                        className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid bg-white cursor-pointer ${currentPage == index
                                                                                ? "bg-white border-[var(--bright-pink)] pointer-events-none"
                                                                                : "bg-white border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                                                                            }`}
                                                                        onClick={() => changePage(index)}
                                                                        key={index}
                                                                    >
                                                                        {index + 1}
                                                                    </li>
                                                                ))}
                                                                <li
                                                                    className={`flex items-center justify-center w-8 rounded-md h-8 border-2 border-solid disabled] ${currentPage == totalPage - 1
                                                                            ? "bg-white border-[var(--darkest-teal)]/10 text-[var(--darkest-teal)]/20 pointer-events-none"
                                                                            : "bg-white cursor-pointer border-[var(--darkest-teal)]/40 hover:border-[var(--bright-pink)] hover:border-2"
                                                                        }`}
                                                                    onClick={nextPage}>
                                                                    <ChevronRightIcon></ChevronRightIcon>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>

                </div>
            </div>
            <Dialog open={open} onClose={() => {setOpen(false); setOperatorToEdit(null);}} className="relative z-50">
                <DialogBackdrop
                transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0 dark:bg-gray-900/50"/>
        <div className="fixed inset-0"/>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-5xl transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700">
                <div className="relative flex h-full flex-col overflow-y-auto bg-white py-1 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="mt-6">
                        <p className="custom-style font-semibold text-[var(--darkest-teal)]">Edit the Operator Billing Address</p>
                      </DialogTitle>
                      <div className="ml-3 mt-4 flex items-center">
                        <button
                          type="button"
                          onClick={() => {setOpen(false), setOperatorToEdit(null)}}
                          className="relative rounded-md text-[var(--darkest-teal)]/70 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]">
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-2 flex-1 px-4 sm:px-6">
                    <EditOperator
                        operatorToEdit={operatorToEdit!}
                        partnerRecords={partnersList}
                        token={token}
                        ></EditOperator>
                    </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
        </div>
        </div>
         <ToastContainer />
        </>
    )
}