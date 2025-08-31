import { useEffect, useState } from 'react';
import { useSupabaseData } from "../../../types/SupabaseContext";
import { addNewUser, deactivateUser, reactivateUser } from 'provider/write';
import { fetchOperatorsForLoggedInUser, fetchRolesGeneric } from 'provider/fetch';
import { type UserProfileRecordSupabaseType, type OperatorType, type RoleEntryWrite, type RoleTypesGeneric, type OperatorPartnerAddressType } from 'src/types/interfaces';
import { Field, Label, Switch } from '@headlessui/react';
import { handleNewUser } from './helpers/helpers';
import type { index } from '@react-router/dev/routes';


export default function CreateNewUser() {

  let userBlank: UserProfileRecordSupabaseType = {
    firstName: '',
    lastName: '',
    email: '',
    active: false,
    operatorRoles: [],
    partnerRoles: [],
    operators: [],
    partners: [],
    user_id: "00000000-0000-0000-0000-000000000000",
  };

  const { loggedInUser, isSuperUser } = useSupabaseData();
  const [newUser, setNewUser] = useState<UserProfileRecordSupabaseType>(userBlank);
  const [makeSuperUser, setMakeSuperUser] = useState(false);
  const [operatorsList, setOperatorsList] = useState<OperatorPartnerAddressType[] | []>([]);
  const [partnersList, setPartnersList] = useState<OperatorPartnerAddressType[] | []>([]);
  const [roles, setRoles] = useState<RoleEntryWrite[] | []>([]);
  const [partnerRoles, setPartnerRoles] = useState<RoleEntryWrite[] | []>([]);
  const [rolesGeneric, setRolesGeneric] = useState<RoleTypesGeneric[] | []>([]);

  useEffect(() => {
    if (loggedInUser === null || isSuperUser === null) return;
    async function getOperatorList() {
      const opList = await fetchOperatorsForLoggedInUser(loggedInUser?.user_id!, isSuperUser, 'OPERATOR_USER_PERMISSIONS', 'OPERATOR_ADDRESS','OPERATORS');
      setOperatorsList(opList);
      const partnerList = await fetchOperatorsForLoggedInUser(loggedInUser?.user_id!, isSuperUser, 'PARTNER_USER_PERMISSIONS', 'PARTNER_ADDRESS','PARTNERS');
      setPartnersList(partnerList);
    } getOperatorList();
  }, [loggedInUser, isSuperUser]);


  useEffect(() => {
    async function getGenericRoles() {
      const roleList = await fetchRolesGeneric();
      setRolesGeneric(roleList);
    } getGenericRoles();
  }, []);

  useEffect(() => {
    console.count("CreateNewUser render");
  });

  function handleUserChange(e: { target: { name: any; value: any; }; }) {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    })
  };
  const handleActiveToggle = (isChecked: boolean) => {
    setNewUser({
      ...newUser,
      active: isChecked
    })
  };

  const handleSuperToggle = (makeSuper: boolean) => {
    setMakeSuperUser(makeSuper)
  };

  const handleCheckboxChange = (
    apc_id: string,
    apc_address_id: number,
    roleValue: number,
    isChecked: boolean
  ) => {
    setRoles(prevRoles => {
      const updatedRoles = [...prevRoles];
      const existingIndex = updatedRoles.findIndex(
        entry => entry.apc_id === apc_id && entry.apc_address_id === apc_address_id && entry.role === roleValue
      );
      if (existingIndex > -1) {
        updatedRoles.splice(existingIndex, 1);
      } else {
        updatedRoles.push({
          role: roleValue,
          apc_id: apc_id,
          apc_address_id: apc_address_id,
          active: isChecked,
        });
      }
      return updatedRoles;
    });
  };
  const handleCheckboxChangeNonOp = (
    apc_id: string,
    apc_address_id: number,
    roleValue: number,
    isChecked: boolean
  ) => {
    setPartnerRoles(prevRoles => {
      const updatedRoles = [...prevRoles];
      const existingIndex = updatedRoles.findIndex(
        entry => entry.apc_id === apc_id && entry.apc_address_id === apc_address_id && entry.role === roleValue
      );
      if (existingIndex > -1) {
        updatedRoles.splice(existingIndex, 1);
      } else {
        updatedRoles.push({
          role: roleValue,
          apc_id: apc_id,
          apc_address_id: apc_address_id,
          active: isChecked,
        });
      }
      return updatedRoles;
    });
  };

  return (
    <>
      <div className="px-4 sm:px-10 sm:py-4 divide-y divide-gray-900/30 ">
        <div className="divide-y divide-gray-900/30">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-4 ">
            <div className="px-4 sm:px-0 md:col-span-1">
              <h2 className="font-semibold text-[var(--darkest-teal)] custom-style">User Information</h2>
              <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">Create a user and assign privileges to that user for <span className="font-bold italic">each Operator or Non-Op address.</span>
                <br></br>
                <br></br>You are <span className="font-bold italic">NOT</span> giving privileges to your Partners.  You are giving privileges to a user in your organization for AFEs associated to your Non-Op AFEs via the address.
                <br></br>
                <br></br><span className="font-semibold text-[var(--darkest-teal)] custom-style">Active users with a valid email will be to login with a magic link sent to their email each time they sign-on.</span>
                <br></br>
                <br></br><span className="font-medium italic text-[var(--darkest-teal)] custom-style">Definitions for privileges are below.</span>
              </p>

              <ol role="list" className="flex flex-1 flex-col gap-y-7 mt-3 border-t border-gray-900/30">
                <li>
                  <ul role="list" className="mx-1 space-y-8 mt-5">
                    {rolesGeneric.map((role) => (
                      <li key={role.id}>
                        <h2 className="font-medium text-[var(--darkest-teal)] custom-style">
                          {role.title}
                        </h2>
                        <p className="text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">
                          {role.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </li>
              </ol>
            </div>
            <form className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl md:col-span-3">
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-7xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-11">
                  <div className="sm:col-span-4">
                    <label htmlFor="firstName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                      First name
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-[var(--darkest-teal)] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--bright-pink)]">
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          autoComplete="off"
                          placeholder="Mary"
                          onChange={handleUserChange}
                          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <label htmlFor="lastName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                      Last name
                    </label>
                    <div className="mt-2 ">
                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-[var(--darkest-teal)] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--bright-pink)]">
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          autoComplete="off"
                          placeholder="Jane"
                          onChange={handleUserChange}
                          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    
                    <label htmlFor="email" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                      Email address
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-[var(--darkest-teal)] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--bright-pink)]">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="off"
                          placeholder="user@yourcompany.com"
                          onChange={handleUserChange}
                          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <Field className={`flex items-end justify-start sm:col-span-4 mt-2 ${
                            !isSuperUser ? 'invisible pointer-events-none' : ''
                            }`}>
                    <Switch
                      checked={makeSuperUser}
                      onChange={handleSuperToggle}
                      className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-0 focus:ring-[var(--bright-pink)] focus:ring-offset-2 focus:outline-hidden data-checked:bg-[var(--bright-pink)]">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
                      />
                    </Switch>
                    <Label as="span" className="ml-3 text-sm">
                      <span className="font-medium text-[var(--darkest-teal)] custom-style">Super User</span>{' '}
                      <span className="text-gray-500 custom-style-long-text">(User has full application access)</span>
                    </Label>
                  </Field>
                    <Field className="flex items-end justify-start sm:col-span-4 mt-2">
                    <Switch
                      checked={newUser.active}
                      onChange={handleActiveToggle}
                      className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-0 focus:ring-[var(--bright-pink)] focus:ring-offset-2 focus:outline-hidden data-checked:bg-[var(--bright-pink)]">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
                      />
                    </Switch>
                    <Label as="span" className="ml-3 text-sm">
                      <span className="font-medium text-[var(--darkest-teal)] custom-style">Active</span>{' '}
                      <span className="text-gray-500 custom-style-long-text">(User will be able to sign-on)</span>
                    </Label>
                  </Field>
                  
                  </div>
                </div>
                <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-2 border-t border-t-[var(--dark-teal)] mt-10 pt-5">
                  <div>
                    <h2 className="custom-style font-semibold text-[var(--darkest-teal)]">Permissions for Operated AFEs</h2>
                    <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">The permissions associated to the user being created.</p>

                  </div>
                  <div className="">
                    <div className="divide-y divide-gray-900/10">
                      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-1 md:grid-cols-1 ">
                        <table className="min-w-full divide-y divide-gray-400">
                          <thead>
                            <tr>
                              <th scope="col" className="w-1/4 py-3.5 pr-1 pl-1 text-left sm:pl-0">
                              </th>
                              <th
                                scope="col"
                                className="w-1/4 px-3 py-3.5 text-center text-pretty text-sm font-semibold text-[var(--dark-teal)] custom-style sm:table-cell">
                                View Operated AFEs
                              </th>
                              <th scope="col"
                                className="w-1/4 px-3 py-3.5 text-center text-pretty text-sm font-semibold text-[var(--dark-teal)] custom-style sm:table-cell">
                                Edit Operator Users
                              </th>
                              <th scope="col" className="w-1/4 py-3.5 text-center text-pretty text-sm font-semibold text-[var(--dark-teal)] custom-style pr-4 pl-3 sm:pr-0">
                                View Billing Details
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {operatorsList.map((role) => (
                              <tr key={role.apc_id}>
                                <td className="w-full max-w-0 py-2 pr-1 text-sm font-semibold text-[var(--dark-teal)] custom-style sm:w-auto sm:max-w-none sm:pl-0 text-start">
                                  {role.name}
                                  <p className="font-normal justify-end text-end mt-1 w-full text-xs">{role.street} {role.suite}
                                    <br></br>{role.city}, {role.state}
                                    <br></br>{role.zip}</p>
                                </td>
                                {[2, 4, 7].map(roleVal => (
                                  <td key={roleVal} className="px-3 py-1 text-sm text-[var(--dark-teal)] lg:table-cell">
                                    <div className="flex h-6 shrink-0 items-center justify-center">
                                      <div className="group grid size-4 grid-cols-1">
                                        <input
                                          type="checkbox"
                                          onChange={(e) => handleCheckboxChange(role.apc_id!, role.apc_address_id!, roleVal, e.target.checked)}
                                          aria-describedby="comments-description"
                                          className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] group-has-disabled:checked:bg-gray-300 group-has-disabled:checked:border-gray-500 ..."/>
                                        <svg
                                          fill="none"
                                          viewBox="0 0 14 14"
                                          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                        >
                                          <path
                                            d="M3 8L6 11L11 3.5"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-0 group-has-checked:opacity-100"
                                          />
                                          <path
                                            d="M3 7H11"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-0 group-has-indeterminate:opacity-100"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </td>
                                ))}

                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                </div>
                <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-2 border-t border-t-gray-900/30 pb-5 pt-5 border-b border-b-[var(--dark-teal)]">
                  <div>
                    <h2 className="custom-style font-semibold text-[var(--darkest-teal)]">Permissions for Non-Operated AFEs</h2>
                    <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">The permissions associated to the user being created.</p>

                  </div>
                  <div className="">
                    <div className="divide-y divide-gray-900/10">
                      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-1 md:grid-cols-1 ">
                        <table className="min-w-full divide-y divide-gray-400 ">
                          <thead>
                            <tr>
                              <th scope="col" className="w-1/4 py-3.5 text-left sm:pl-0">
                              </th>
                              <th
                                scope="col"
                                className="w-1/4 px-3 py-3.5 text-center text-pretty text-sm font-semibold text-[var(--dark-teal)] custom-style sm:table-cell">
                                View Non-Op AFEs
                              </th>
                              <th scope="col"
                                className="w-1/4 px-3 py-3.5 text-center text-pretty text-sm font-semibold text-[var(--dark-teal)] custom-style sm:table-cell">
                                Edit Non-Op Users
                              </th>
                              <th scope="col" className="w-1/4 py-3.5 text-center text-pretty text-sm font-semibold text-[var(--dark-teal)] custom-style pr-4 sm:pr-0">
                                Approve or Reject Non-Op AFEs
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {partnersList?.map((role) => (
                              <tr key={role.apc_id}>
                                <td className="w-full max-w-0 py-2 pr-3 pl-4 text-sm font-semibold text-[var(--dark-teal)] custom-style sm:w-auto sm:max-w-none sm:pl-0 text-start">
                                  {role.name}
                                  <p className="font-normal justify-end text-end mt-1 w-full text-xs">{role.street} {role.suite}
                                    <br></br>{role.city}, {role.state}
                                    <br></br>{role.zip}</p>
                                </td>
                                {[3, 5, 6].map(roleVal => (
                                  <td key={roleVal} className="px-3 py-1 text-sm text-[var(--dark-teal)] lg:table-cell">
                                    <div className="flex h-6 shrink-0 items-center justify-center">
                                      <div className="group grid size-4 grid-cols-1">
                                        <input
                                          type="checkbox"
                                          onChange={(e) => handleCheckboxChangeNonOp(role.apc_id!, role.apc_address_id!, roleVal, e.target.checked)}
                                          aria-describedby="comments-description"
                                          className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] group-has-disabled:checked:bg-gray-300 group-has-disabled:checked:border-gray-500 ..."
                                        />
                                        <svg
                                          fill="none"
                                          viewBox="0 0 14 14"
                                          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                        >
                                          <path
                                            d="M3 8L6 11L11 3.5"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-0 group-has-checked:opacity-100"
                                          />
                                          <path
                                            d="M3 7H11"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-0 group-has-indeterminate:opacity-100"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end px-4 py-4 sm:px-8">
                <button type="button"
                disabled={false}
                  onClick={(e: any) => {
                    e.preventDefault();
                    handleNewUser(newUser.firstName, newUser.lastName, newUser.email, 'topSecretPassword25!', newUser.active, roles, partnerRoles, makeSuperUser);
                  }}
                  className="rounded-md bg-[var(--dark-teal)] disabled:bg-gray-300 disabled:text-gray-500 px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] justify-end">
                  Add New User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}