import { countries } from "src/constants/variables";
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import type { RoleEntryRead } from "src/types/interfaces";

type OperatorNonOperatorAddressCard = {
    record: RoleEntryRead,
    saveButtonDisabledOp:boolean,
    onSave: () => void;
    onActivateDeactivate: () => void;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddressChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    mode: 'Operated' | 'Non-Operated' | 'New Non-Operated';
};

export function OperatorNonOperatorAddressCard({
    record,
    saveButtonDisabledOp,
    onSave,
    onActivateDeactivate,
    onNameChange,
    onAddressChange,
    mode,
}: OperatorNonOperatorAddressCard) {
    return(
        <>
        <div className="px-4 py-2">
                        <div className={`grid max-w-5xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6 ${mode === 'Non-Operated' ? 'pb-4 border-b border-[var(--darkest-teal)]/40' : ''}`}>
                          <div className="sm:col-span-3 sm:col-start-1">
                            <label htmlFor={mode !== 'New Non-Operated' ? `name-${record.apc_name}-${record.apc_address_id}` : 'apc_name'} className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                              {mode === 'Operated' ? 'Operator Name' : 'Non-Op Name'}
                            </label>
                            <div className="mt-1">
                              <input
                                id={mode !== 'New Non-Operated' ? `name-${record.apc_name}-${record.apc_address_id}` : 'apc_name'}
                                name="apc_name"
                                type="text"
                                placeholder="Nav Oil Inc."
                                autoComplete="off"
                                value={record.apc_name}
                                onChange={onNameChange}
                                autoFocus={true}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-4 sm:col-start-1">
                            <label htmlFor={mode !== 'New Non-Operated' ? `street-${record.apc_name}-${record.apc_address_id}` : 'street'} className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                              Street Address
                            </label>
                            <div className="mt-1">
                              <input
                                id={mode !== 'New Non-Operated' ? `street-${record.apc_name}-${record.apc_address_id}` : 'street'}
                                name="street"
                                type="text"
                                autoComplete="off"
                                value={record.apc_address.street}
                                onChange={onAddressChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor={mode !== 'New Non-Operated' ? `suite-${record.apc_name}-${record.apc_address_id}` : 'suite'} className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                              Suite
                            </label>
                            <div className="mt-1">
                              <input
                                id={mode !== 'New Non-Operated' ? `suite-${record.apc_name}-${record.apc_address_id}` : 'suite'}
                                name="suite"
                                type="text"
                                autoComplete="off"
                                value={record.apc_address.suite}
                                onChange={onAddressChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor={mode !== 'New Non-Operated' ? `city-${record.apc_name}-${record.apc_address_id}` : 'city'} className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                              City
                            </label>
                            <div className="mt-1">
                              <input
                                id={mode !== 'New Non-Operated' ? `city-${record.apc_name}-${record.apc_address_id}` : 'city'}
                                name="city"
                                type="text"
                                autoComplete="off"
                                value={record.apc_address.city}
                                onChange={onAddressChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor={mode !== 'New Non-Operated' ? `state-${record.apc_name}-${record.apc_address_id}` : 'state'} className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                              State / Province
                            </label>
                            <div className="mt-1">
                              <input
                                id={mode !== 'New Non-Operated' ? `state-${record.apc_name}-${record.apc_address_id}` : 'state'}
                                name="state"
                                type="text"
                                autoComplete="off"
                                value={record.apc_address.state}
                                onChange={onAddressChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor={mode !== 'New Non-Operated' ? `zip-${record.apc_name}-${record.apc_address_id}` : 'zip'} className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                              ZIP / Postal Code
                            </label>
                            <div className="mt-1">
                              <input
                                id={mode !== 'New Non-Operated' ? `zip-${record.apc_name}-${record.apc_address_id}` : 'zip'}
                                name="zip"
                                type="text"
                                autoComplete="off"
                                value={record.apc_address.zip}
                                onChange={onAddressChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-4 pb-2 sm:col-start-1">
                            <label htmlFor={mode !== 'New Non-Operated' ? `country-${record.apc_name}-${record.apc_address_id}` : 'country'} className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                              Country
                            </label>
                            <div className="mt-1 grid grid-cols-1">
                              <select
                                id={mode !== 'New Non-Operated' ? `country-${record.apc_name}-${record.apc_address_id}` : 'country'}
                                name="country"
                                autoComplete="off"
                                value={record.apc_address.country}
                                onChange={onAddressChange}
                                className="col-start-1 row-start-1 w-full appearance-none w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                              > <option></option>
                              {countries.map((country) => (
                                <option key={country}>{country}</option>
                              ))}
                              </select>
                              <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-[var(--darkest-teal)] sm:size-4"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-2 flex items-end justify-end gap-x-6 pb-2">
                            <button
                              hidden={mode === 'New Non-Operated'} 
                              disabled={(!record.apc_id && !record.apc_address_id) ? true : false}
                              onClick={async (e: any) => {
                                onActivateDeactivate();
                              }}
                              className={
                                `cursor-pointer disabled:cursor-not-allowed rounded-md disabled:bg-[var(--darkest-teal)]/20 px-3 py-2 text-sm/6 font-semibold custom-style shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] hover:bg-[var(--bright-pink)] hover:text-white hover:outline-[var(--bright-pink)]
                                ${!record.apc_name_active
                                  ? 'bg-[var(--darkest-teal)] text-white outline-[var(--darkest-teal)] outline-1'
                                  : 'bg-white text-[var(--darkest-teal outline-[var(--darkest-teal)] outline-1'}`
                              }>
                              {record.apc_name_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              name={mode !== 'New Non-Operated' ? `save-${record.apc_name}-${record.apc_address_id}` : 'save new record'}
                              disabled={
                                mode !== 'New Non-Operated' ?
                                (!record.apc_id && !record.apc_address_id) || (saveButtonDisabledOp) ? true : false
                                : (saveButtonDisabledOp)}
                              onClick={async (e: any) => {
                                e.preventDefault();
                                onSave();
                                //{ saveOpNameChange ? handleClickSaveOpName() : null };
                                //{ saveOpAddressChange ? handleClickSaveOpAddress() : null };
                                //notifyStandard(`Operator name and billing address have been saved  Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE saved)`);
                              }}
                              className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
        </>
    )
}