import { useEffect, useState } from "react";
import { type RoleEntryRead } from "src/types/interfaces";
import { useSupabaseData } from "src/types/SupabaseContext";
import EditOperator from "./editOperator";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { updateOperatorNameAndStatus } from "provider/write";
import { ToastContainer } from "react-toastify";
import { notifyFailure, notifyStandard } from "src/helpers/helpers";
import UniversalPagination from "../../sharedComponents/pagnation";
import NoSelectionOrEmptyArrayMessage from "src/routes/sharedComponents/noSelectionOrEmptyArrayMessage";
import { superUserPermission, editOperatorLibrary, editNonOpLibrary } from "src/helpers/helpers";

function addressDisplay(addressRecord: RoleEntryRead) {
    const addressRecordDisplay = addressRecord.apc_address?.street.concat(' ',
        `${addressRecord.apc_address?.suite === undefined || addressRecord.apc_address?.suite === '' ? '' : '#'+addressRecord.apc_address?.suite.concat(' ')}`,
        `${addressRecord.apc_address?.city.concat(', ')}`,
        `${addressRecord.apc_address?.state.concat(' ')}`,
        `${addressRecord.apc_address?.zip.concat(' ')}`,
        `${addressRecord.apc_address?.country}`);
    return addressRecordDisplay;
}

export default function OperatorViewAndEdit() {
    const { loggedInUser, session } = useSupabaseData();
    const token = session?.access_token ?? "";
    const [filteredOperators, setFilteredOperators] = useState<RoleEntryRead[] | []>([]);
    const [open, setOpen] = useState(false);
    const [opToEdit, setOpToEdit] = useState<RoleEntryRead>();
    const [relatedNonOpAddresses, setRelatedNonOpAddresses] = useState<RoleEntryRead[]>([]);
    
    // State for paginated data
    const [rowsToShow, setRowsToShow] = useState<RoleEntryRead[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const maxRowsToShow = (5);

    useEffect(() => {
        if(!loggedInUser) return;
    
        const operatorList = (loggedInUser.operatorRoles ?? [])
        .filter(operator => operator.role === superUserPermission || operator.role === editOperatorLibrary);
        setFilteredOperators(operatorList.sort((a, b) => a.apc_name.localeCompare(b.apc_name)));
    
      },[loggedInUser]);

    async function handleClickActivateOrDeactivateOperator(operator_apc_id: string) {
        // Calculate the actual index in the full list based on current page
        const actualIndex = filteredOperators.findIndex(operator => operator.apc_id === operator_apc_id);
        const operatorToUpdate = filteredOperators[actualIndex];

        if (!operatorToUpdate.apc_id) return;

        const updatedOperator = {
            ...operatorToUpdate,
            apc_name_active: !operatorToUpdate.apc_name_active,
            address_active: !operatorToUpdate.apc_address?.address_active
        };
        
        setFilteredOperators(prevOperatorsList =>
            prevOperatorsList.map((operator, index) =>
                index === actualIndex
                    ? updatedOperator
                    : operator
            )
        );

        try {

            const operatorStatusChangeResult = await updateOperatorNameAndStatus(updatedOperator.apc_name, updatedOperator.apc_name_active!, updatedOperator.apc_id);
            
            if (!operatorStatusChangeResult.ok) {
                throw new Error(operatorStatusChangeResult.message);
            }

            notifyStandard(`Operator name and billing address have been ${updatedOperator.apc_name_active ? 'activated' : 'deactivated'}. Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE ${updatedOperator.apc_name_active ? 'activated' : 'deactivated'}.)`);

        } catch (error) {
            notifyFailure(`Operator name and billing address have been ${updatedOperator.apc_name_active ? 'activated' : 'deactivated'}. Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE ${updatedOperator.apc_name_active ? 'activated' : 'deactivated'}.)`);
        }
    };

    const handlePageChange = (paginatedData: RoleEntryRead[], page: number) => {
        setRowsToShow(paginatedData);
        setCurrentPage(page);
    };

    const handleEditClick = (operator: RoleEntryRead) => {
        const nonOperatedAddresses = loggedInUser?.partnerRoles.filter(nonOp => nonOp.apc_op_id === operator.apc_id && (nonOp.role === superUserPermission || nonOp.role === editNonOpLibrary)) ?? [];
        setOpToEdit(operator);
        setRelatedNonOpAddresses(nonOperatedAddresses);
        setOpen(true);
    };

    return (
        <>
            <div className="px-4 w-full sm:px-10 sm:py-16">
                <div className="py-4 sm:py-0">
                    <div className="grid max-w-full grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-6">
                        <div className="md:col-span-2">
                            <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Operator Profiles</h2>
                            <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text">Manage the addresses for your AFEs. The main address is the billing address for your organization with associated addresses for Non-Op AFEs.</p>
                            <br></br><p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text">The address will be used by other Operators to send Non-Op AFEs for your review. Sorta like the USPS, but better.</p>
                            <br></br><p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text">User permissions to view, approve, reject or archive AFEs are associated by address.</p>
                        </div>
                        <div className="md:col-span-4">
                            <table className="w-full sm:w-7/8 divide-y divide-[var(--darkest-teal)]/30 mb-4 shadow-2xl">
                                <thead>
                                    <tr className="bg-white text-white">
                                        <th scope="col"
                                            className="rounded-tl-xl px-4 py-3.5 text-left text-pretty text-base leading-7 font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                                            Company Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="hidden w-32 px-2 py-3.5 text-center text-pretty text-base leading-7 font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                        <th scope="col"
                                            className="rounded-tr-lg w-32 px-2 py-0 text-center text-pretty text-base leading-7 font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                                            <span className="sr-only">Activate or Deactivate</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--darkest-teal)]/30 bg-white">
                                    {rowsToShow.map((operator) => (
                                        <tr key={operator.apc_id}>
                                            <td className="text-base leading-7 text-start align-middle py-4 pr-3 pl-4 font-semibold text-[var(--darkest-teal)] custom-style">
                                                {operator.apc_name}
                                                <dl className="font-normal">
                                                    <dt className="sr-only">Address</dt>
                                                    <dd className="mt-1 truncate text-sm leading-6 text-[var(--darkest-teal)] custom-style-long-text">
                                                        {addressDisplay(operator)}
                                                    </dd>
                                                    <dt className="sr-only">Status</dt>
                                                    <dd className="mt-1 flex justify-between items-center gap-2">
                                                        <span
                                                            hidden={!operator.apc_name_active}
                                                            className="inline-flex items-center rounded-full bg-[var(--bright-pink)] px-3 py-2 text-sm leading-6 font-semibold text-white custom-style">
                                                            Active
                                                        </span>
                                                        <span
                                                            hidden={operator.apc_name_active}
                                                            className="inline-flex items-center rounded-full bg-[var(--darkest-teal)]/20 px-3 py-2 text-sm leading-6 font-medium text-[var(--darkest-teal)] custom-style ring-1 ring-[var(--darkest-teal)]/20 ring-inset shadow-lg">
                                                            Inactive
                                                        </span>
                                                        <button
                                                            disabled={(!operator.apc_id && !operator.apc_address_id)}
                                                            onClick={async (e) => {
                                                                e.preventDefault();
                                                                handleClickActivateOrDeactivateOperator(operator.apc_id);
                                                                notifyStandard(`Operator name and billing address have been ${operator.apc_name_active ? 'deactivated' : 'activated'}. Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE ${operator.active ? 'deactivated' : 'activated'}.)`);
                                                            }}
                                                            className={`sm:hidden cursor-pointer disabled:cursor-not-allowed rounded-md px-3 py-2 text-sm leading-6 font-semibold custom-style transition-colors min-w-24
                                                                ${!operator.apc_name_active
                                                                    ? 'bg-[var(--dark-teal)] text-white hover:bg-[var(--bright-pink)]'
                                                                    : 'bg-white text-[var(--darkest-teal)] border border-[var(--darkest-teal)] hover:bg-[var(--bright-pink)] hover:text-white hover:border-[var(--bright-pink)]'
                                                                }
                                                                disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:border-0`}>
                                                            {operator.apc_name_active ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                    </dd>
                                                </dl>
                                            </td>

                                            <td className="hidden px-3 py-4 text-center align-middle sm:table-cell">
                                                <button
                                                    type="button"
                                                    disabled={operator.apc_id === null || operator.apc_id === ''}
                                                    onClick={(e) => { handleEditClick(operator); }}
                                                    className="cursor-pointer rounded-md bg-[var(--dark-teal)] px-4 py-2 text-sm leading-6 font-semibold text-white shadow-lg hover:bg-[var(--bright-pink)] custom-style transition-colors w-full max-w-28">
                                                    Edit
                                                </button>
                                            </td>

                                            <td className="hidden align-middle px-3 py-4 text-center sm:table-cell">
                                                <button
                                                    disabled={(!operator.apc_id && !operator.apc_address_id)}
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        handleClickActivateOrDeactivateOperator(operator.apc_id);
                                                        notifyStandard(`Operator name and billing address have been ${operator.apc_name_active ? 'deactivated' : 'activated'}. Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE ${operator.active ? 'deactivated' : 'activated'}.)`);
                                                    }}
                                                    className={`cursor-pointer disabled:cursor-not-allowed rounded-md px-4 py-2 text-sm leading-6 font-semibold custom-style transition-colors w-full max-w-28
                                                    ${!operator.apc_name_active
                                                            ? 'bg-[var(--dark-teal)] text-white hover:bg-[var(--bright-pink)]'
                                                            : 'bg-white text-[var(--darkest-teal)] border border-[var(--darkest-teal)] hover:bg-[var(--bright-pink)] hover:text-white hover:border-[var(--bright-pink)]'
                                                        }
                                                     disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:border-0
                                                    `}>
                                                    {operator.apc_name_active ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                                <div hidden={filteredOperators.length < 1} className="w-full sm:w-7/8">
                            <UniversalPagination
                                data={filteredOperators}
                                rowsPerPage={maxRowsToShow}
                                listOfType="Operators"
                                onPageChange={handlePageChange}
                            />
                            </div>
                            <div hidden={(filteredOperators.length === 0 ) ? false : true } className="w-full sm:w-7/8">
                                <NoSelectionOrEmptyArrayMessage
                                    message={'There are no Operators you have access to manage'}
                                ></NoSelectionOrEmptyArrayMessage>
                            </div>
                        </div>
                    </div>
                    <Dialog open={open} onClose={() => { setOpen(false); setOpToEdit(undefined); }} className="relative z-50">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0 dark:bg-gray-900/50" />
                        <div className="fixed inset-0" />
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
                                                            onClick={() => { setOpen(false) }}
                                                            className="relative rounded-md text-[var(--darkest-teal)]/70 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]">
                                                            <span className="absolute -inset-2.5" />
                                                            <span className="sr-only">Close panel</span>
                                                            <XMarkIcon aria-hidden="true" className="size-6 cursor-pointer" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative mt-2 flex-1 px-4 sm:px-6">
                                                <EditOperator
                                                    token={token}
                                                    opToEdit={opToEdit!}
                                                    NonOpAddress={relatedNonOpAddresses}
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
    );
}