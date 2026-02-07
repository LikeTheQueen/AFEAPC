import { useEffect, useState } from "react";
import { type OperatorPartnerAddressType, type OperatorPartnerRecord, type OperatorRecordWithNonOpAddresses } from "src/types/interfaces";
import { useSupabaseData } from "src/types/SupabaseContext";
import { transformOperatorPartnerAddressRecord } from "src/types/transform";
import { fetchOperatorsOrPartnersToEdit } from "provider/fetch";
import EditOperator from "./editOperator";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { updateOperatorAddress, updateOperatorNameAndStatus } from "provider/write";
import { ToastContainer } from "react-toastify";
import { notifyStandard } from "src/helpers/helpers";
import UniversalPagination from "../../sharedComponents/pagnation";
import NoSelectionOrEmptyArrayMessage from "src/routes/sharedComponents/noSelectionOrEmptyArrayMessage";

function addressDisplay(operatorOrPartnerRecord: OperatorPartnerAddressType) {
    const operatorOrPartnerAddress = operatorOrPartnerRecord.street!.concat(' ',
        `${operatorOrPartnerRecord.suite === undefined || operatorOrPartnerRecord.suite === '' ? '' : '#'+operatorOrPartnerRecord.suite.concat(' ')}`,
        `${operatorOrPartnerRecord.city === undefined ? '' : operatorOrPartnerRecord.city.concat(', ')}`,
        `${operatorOrPartnerRecord.state === undefined ? '' : operatorOrPartnerRecord.state.concat(' ')}`,
        `${operatorOrPartnerRecord.zip === undefined ? '' : operatorOrPartnerRecord.zip.concat(' ')}`,
        `${operatorOrPartnerRecord.country === undefined ? '' : operatorOrPartnerRecord.country}`);
    return operatorOrPartnerAddress;
}

export default function OperatorViewAndEdit() {
    const { loggedInUser, session } = useSupabaseData();
    const token = session?.access_token ?? "";
    const [loadingOperators, setLoadingOperators] = useState(false);
    const [operatorsList, setOperatorsList] = useState<OperatorRecordWithNonOpAddresses[]>([]);
    const [operatorToEdit, setOperatorToEdit] = useState<OperatorRecordWithNonOpAddresses | null>(null);
    const [operatorResultErrorMessage, setOperatorResultErrorMessage] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    
    // State for paginated data
    const [rowsToShow, setRowsToShow] = useState<OperatorRecordWithNonOpAddresses[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const maxRowsToShow = (5);

    useEffect(() => {
        if (!loggedInUser || token === '') {
            return;
        }

        let isMounted = true;

        async function getOperatorList() {
            if (isMounted) {
            setLoadingOperators(true);
            }

            try {
                const opListResult = await fetchOperatorsOrPartnersToEdit(
                    loggedInUser!.user_id!, 
                    'OPERATOR_USER_PERMISSIONS', 
                    'OPERATOR_ADDRESS', 
                    [1, 8, 9], 
                    token
                );

                if (!opListResult.ok) {
                   throw new Error(opListResult.message); 
                }
                
            const opListTransformed = transformOperatorPartnerAddressRecord(opListResult.data);
                    
            if (isMounted) {
                        setOperatorsList(opListTransformed.sort((a, b) => a.name.localeCompare(b.name)));
                    } 

            } catch (e) {
                console.error('Unable to get Operators or Permissions', e);
                setOperatorResultErrorMessage(e as string);
            } finally {
                if (isMounted) {
                setLoadingOperators(false);
            }
            }
        }
        getOperatorList();
        return () => {
            isMounted = false;
        }
    }, [loggedInUser]);

    async function handleClickActivateOrDeactivateOperator(operatorIdx: number) {
        // Calculate the actual index in the full list based on current page
        const actualIndex = currentPage * maxRowsToShow + operatorIdx;
        const operatorToUpdate = operatorsList[actualIndex];

        if (!operatorToUpdate.apc_id || !operatorToUpdate.apc_address_id) return;

        const updatedOperator = {
            ...operatorToUpdate,
            active: !operatorToUpdate.active,
            address_active: !operatorToUpdate.address_active
        };

        setOperatorsList(prevOperatorsList =>
            prevOperatorsList.map((operator, index) =>
                index === actualIndex
                    ? updatedOperator
                    : operator
            )
        );

        try {
            const [operatorStatusChange, operatorAddressStatusChange] = await Promise.all([
                updateOperatorNameAndStatus(updatedOperator, token),
                updateOperatorAddress(updatedOperator, token)
            ]);

            if (!operatorStatusChange.ok) {
                throw new Error(operatorStatusChange.message as any).message;
            }
            if (!operatorAddressStatusChange.ok) {
                throw new Error(operatorAddressStatusChange.message as any).message;
            }

        } catch (error) {
            console.error("Failed to change Operator status:", error);
        }
    }

    const handlePageChange = (paginatedData: OperatorRecordWithNonOpAddresses[], page: number) => {
        setRowsToShow(paginatedData);
        setCurrentPage(page);
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
                                    {rowsToShow.map((operator, operatorIdx) => (
                                        <tr key={operator.apc_id}>
                                            <td className="text-base leading-7 text-start align-middle py-4 pr-3 pl-4 font-semibold text-[var(--darkest-teal)] custom-style">
                                                {operator.name}
                                                <dl className="font-normal">
                                                    <dt className="sr-only">Address</dt>
                                                    <dd className="mt-1 truncate text-sm leading-6 text-[var(--darkest-teal)] custom-style-long-text">
                                                        {addressDisplay(operator)}
                                                    </dd>
                                                    <dt className="sr-only">Status</dt>
                                                    <dd className="mt-1 flex justify-between items-center gap-2">
                                                        <span
                                                            hidden={!operator.active}
                                                            className="inline-flex items-center rounded-full bg-[var(--bright-pink)] px-3 py-2 text-sm leading-6 font-semibold text-white custom-style">
                                                            Active
                                                        </span>
                                                        <span
                                                            hidden={operator.active}
                                                            className="inline-flex items-center rounded-full bg-[var(--darkest-teal)]/20 px-3 py-2 text-sm leading-6 font-medium text-[var(--darkest-teal)] custom-style ring-1 ring-[var(--darkest-teal)]/20 ring-inset shadow-lg">
                                                            Inactive
                                                        </span>
                                                        <button
                                                            disabled={(!operator.apc_id && !operator.apc_address_id)}
                                                            onClick={async (e) => {
                                                                e.preventDefault();
                                                                handleClickActivateOrDeactivateOperator(operatorIdx);
                                                                notifyStandard(`Operator name and billing address have been ${operator.active ? 'deactivated' : 'activated'}. Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE ${operator.active ? 'deactivated' : 'activated'}.)`);
                                                            }}
                                                            className={`sm:hidden cursor-pointer disabled:cursor-not-allowed rounded-md px-3 py-2 text-sm leading-6 font-semibold custom-style transition-colors min-w-24
                                    ${!operator.active
                                                                    ? 'bg-[var(--darkest-teal)] text-white hover:bg-[var(--bright-pink)]'
                                                                    : 'bg-white text-[var(--darkest-teal)] border border-[var(--darkest-teal)] hover:bg-[var(--bright-pink)] hover:text-white hover:border-[var(--bright-pink)]'
                                                                }
                                    disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:border-0
                                `}>
                                                            {operator.active ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                    </dd>
                                                </dl>
                                            </td>

                                            <td className="hidden px-3 py-4 text-center align-middle sm:table-cell">
                                                <button
                                                    type="button"
                                                    disabled={operator.apc_id === null || operator.apc_id === ''}
                                                    onClick={(e) => { setOperatorToEdit(operator); setOpen(true); }}
                                                    className="cursor-pointer rounded-md bg-[var(--dark-teal)] px-4 py-2 text-sm leading-6 font-semibold text-white shadow-lg hover:bg-[var(--bright-pink)] custom-style transition-colors w-full max-w-28">
                                                    Edit
                                                </button>
                                            </td>

                                            <td className="hidden align-middle px-3 py-4 text-center sm:table-cell">
                                                <button
                                                    disabled={(!operator.apc_id && !operator.apc_address_id)}
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        handleClickActivateOrDeactivateOperator(operatorIdx);
                                                        notifyStandard(`Operator name and billing address have been ${operator.active ? 'deactivated' : 'activated'}. Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE ${operator.active ? 'deactivated' : 'activated'}.)`);
                                                    }}
                                                    className={`cursor-pointer disabled:cursor-not-allowed rounded-md px-4 py-2 text-sm leading-6 font-semibold custom-style transition-colors w-full max-w-28
                            ${!operator.active
                                                            ? 'bg-[var(--darkest-teal)] text-white hover:bg-[var(--bright-pink)]'
                                                            : 'bg-white text-[var(--darkest-teal)] border border-[var(--darkest-teal)] hover:bg-[var(--bright-pink)] hover:text-white hover:border-[var(--bright-pink)]'
                                                        }
                            disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:border-0
                        `}>
                                                    {operator.active ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                                <div hidden={operatorsList.length < 1} className="w-full sm:w-7/8">
                            <UniversalPagination
                                data={operatorsList}
                                rowsPerPage={maxRowsToShow}
                                listOfType="Operators"
                                onPageChange={handlePageChange}
                            />
                            </div>
                            <div hidden={(operatorsList.length === 0 && operatorResultErrorMessage === null) ? false : true } className="w-full sm:w-7/8">
                                <NoSelectionOrEmptyArrayMessage
                                    message={'There are no Operators you have access to manage'}
                                ></NoSelectionOrEmptyArrayMessage>
                            </div>
                            <div hidden={(operatorsList.length === 0 && operatorResultErrorMessage !== null) ? false : true } className="w-full sm:w-7/8">
                                <NoSelectionOrEmptyArrayMessage
                                    message={'Unable to get Operators. Please contact AFE Partners Support '+operatorResultErrorMessage}
                                ></NoSelectionOrEmptyArrayMessage>
                            </div>
                        </div>
                    </div>
                    <Dialog open={open} onClose={() => { setOpen(false); setOperatorToEdit(null); }} className="relative z-50">
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
                                                            onClick={() => { setOpen(false), setOperatorToEdit(null) }}
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
                                                    operatorToEdit={operatorToEdit!}
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
    );
}