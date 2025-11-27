import { useEffect, useState } from 'react';
import { useSupabaseData } from "../../../types/SupabaseContext";
import { addNewUser, deactivateUser, createNewUser } from 'provider/write';
import { fetchRolesGeneric, fetchListOfOperatorsOrPartnersForUser } from 'provider/fetch';
import { type UserProfileRecordSupabaseType, type OperatorType, type RoleEntryWrite, type RoleTypesGeneric, type OperatorPartnerAddressType } from 'src/types/interfaces';
import { transformOperatorPartnerAddress } from '../../../types/transform';
import { Field, Label, Switch } from '@headlessui/react';
import { handleNewUser } from './helpers/helpers';
import LoadingPage from 'src/routes/loadingPage';
import { buildAppEmailHTML, sendEmail, handleSendEmail } from 'email/emailBasic';
import { ToastContainer } from 'react-toastify';


export default function CreateNewUser() {

  let userBlank: UserProfileRecordSupabaseType = {
    firstName: '',
    lastName: '',
    email: '',
    active: false,
    is_super_user: false,
    operatorRoles: [],
    partnerRoles: [],
    user_id: "00000000-0000-0000-0000-000000000000",
  };

  const { loggedInUser, session } = useSupabaseData();
  const token = session?.access_token ?? '';
  const [newUser, setNewUser] = useState<UserProfileRecordSupabaseType>(userBlank);
  const [makeSuperUser, setMakeSuperUser] = useState(false);
  const [operatorsList, setOperatorsList] = useState<OperatorPartnerAddressType[] | []>([]);
  const [partnersList, setPartnersList] = useState<OperatorPartnerAddressType[] | []>([]);
  const [roles, setRoles] = useState<RoleEntryWrite[] | []>([]);
  const [partnerRoles, setPartnerRoles] = useState<RoleEntryWrite[] | []>([]);
  const [rolesGeneric, setRolesGeneric] = useState<RoleTypesGeneric[] | []>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  useEffect(() => {
    if (!loggedInUser || token === '') {
      setLoadingPermissions(false);
      return;
    }

    let isMounted = true;
    async function getOperatorList() {
      if (!loggedInUser?.user_id) return;

      setLoadingPermissions(true);
      try {
        const [opListResult, partnerListResult] = await Promise.all([
          fetchListOfOperatorsOrPartnersForUser(loggedInUser?.user_id!, 'OPERATOR_USER_PERMISSIONS', 'OPERATOR_ADDRESS', [1, 4, 5], token),
          fetchListOfOperatorsOrPartnersForUser(loggedInUser?.user_id!, 'PARTNER_USER_PERMISSIONS', 'PARTNER_ADDRESS', [1, 4, 5], token)
        ]);

        if (opListResult.ok) {
          const opListTransformed = transformOperatorPartnerAddress(opListResult.data);
          if (isMounted) {
            setOperatorsList(opListTransformed.sort((a, b) => a.name.localeCompare(b.name)));
          }
        }
        if (partnerListResult.ok) {
          const partnerListTransformed = transformOperatorPartnerAddress(partnerListResult.data);
          if (isMounted) {
            setPartnersList(partnerListTransformed.sort((a, b) => a.name.localeCompare(b.name)));
          }
        }
      } catch (e) {
        console.error('Unable to get permissions', e);
      } finally {
        setLoadingPermissions(false);
        
        return;
      }
    } getOperatorList();
    return () => {
      isMounted = false;
    }
  }, [loggedInUser]);

  useEffect(() => {
    async function getGenericRoles() {
      const roleList = await fetchRolesGeneric();
      setRolesGeneric(roleList);
    } getGenericRoles();
  }, []);

  useEffect(() => {
    console.count("CreateNewUser render");
  }, [loggedInUser]);

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
    setNewUser({
      ...newUser,
      is_super_user: makeSuper
    })
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
  const handleTestEmailSending = async () => {
    handleSendEmail(
      `Test Email From ${loggedInUser?.firstName}`,
      loggedInUser?.firstName!,
      'This message is a test to let you know that we say hi',
      "Operator for Support",
      "AFE Partner Connections",
      loggedInUser?.email!,
    );
  };
  const handleSaveNewUser = async () => {
    handleNewUser(newUser.firstName, newUser.lastName, newUser.email, newUser.active, roles, partnerRoles, newUser.is_super_user, token);
  }

  return (
    <>
      <div className="px-4 sm:px-10 sm:py-4 divide-y divide-[var(--darkest-teal)]/40 ">
        <div className="divide-y divide-[var(--darkest-teal)]/40">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-4 ">
            <div className="px-4 sm:px-0 md:col-span-1">
              <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">User Information</h2>
              <p className="text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">Create a user and assign privileges to that user for <span className="font-bold italic">each Operator or Non-Op address.</span></p>
              <br></br><p className="text-sm/6 text-[var(--darkest-teal)] custom-style-long-text"> You are <span className="font-bold italic">NOT</span> giving privileges to your Partners.  You are giving privileges to a user in your organization for AFEs associated to your Non-Op AFEs via the address.</p>
              <br></br><p className="text-sm/6 font-semibold text-[var(--darkest-teal)] custom-style">Active users with a valid email will be to login with a magic link sent to their email each time they sign-on.</p>
              <br></br><p className="text-sm/6 text-[var(--darkest-teal)] custom-style-long-text"><span className="font-medium italic">Definitions for privileges are below.</span>
              </p>

              <ol role="list" className="flex flex-1 flex-col gap-y-7 mt-3 border-t border-[var(--darkest-teal)]/40">
                <li>
                  <ul role="list" className="mx-1 space-y-8 mt-5">
                    {rolesGeneric.map((role) => (
                      <li key={role.id}>
                        <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">
                          {role.title}
                        </h2>
                        <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text">
                          {role.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </li>
              </ol>
            </div>
            <form className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 md:col-span-3">
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-7xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-11">
                  <div className="sm:col-span-4">
                    <label htmlFor="firstName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                      First name
                    </label>
                    <div className="mt-2">
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          autoComplete="off"
                          placeholder="Mary"
                          onChange={handleUserChange}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                        />
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <label htmlFor="lastName" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                      Last name
                    </label>
                    <div className="mt-2 ">
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          autoComplete="off"
                          placeholder="Jane"
                          onChange={handleUserChange}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                        />
                      
                    </div>
                  </div>
                  <div className="sm:col-span-4">

                    <label htmlFor="email" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                      Email address
                    </label>
                    <div className="mt-2">
              
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="off"
                          placeholder="user@yourcompany.com"
                          onChange={handleUserChange}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                        />
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <Field className={`flex items-end justify-start sm:col-span-4 mt-2 ${!loggedInUser?.is_super_user ? 'invisible pointer-events-none' : ''
                      }`}>
                      <Switch
                        checked={newUser.is_super_user}
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
                {loadingPermissions ? (
                  <LoadingPage></LoadingPage>
                ) : (<>
                  <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-2 border-t border-t-[var(--darkest-teal)] mt-10 pt-5"
                    hidden={(operatorsList.length > 0 && !makeSuperUser) ? false : true}
                  >
                    <div>
                      <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Permissions for Operated AFEs</h2>
                      <p className="mt-1 text-base/6 text-[var(--darkest-teal)] custom-style-long-text">The permissions associated to the user being created.</p>

                    </div>
                    <div className="">
                      <div className="divide-y divide-[var(--darkest-teal)]/40">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-1 md:grid-cols-1 ">
                          <table className="min-w-full divide-y divide-[var(--darkest-teal)]/50">
                            <thead>
                              <tr>
                                <th scope="col" className="w-1/4 py-3.5 pr-1 pl-1 text-left sm:pl-0">
                                </th>
                                <th
                                  scope="col"
                                  className="w-1/5 px-3 py-3.5 text-center text-pretty text-sm/6 font-semibold text-[var(--dark-teal)] custom-style sm:table-cell">
                                  View Operated AFEs
                                </th>
                                <th scope="col"
                                  className="w-1/5 px-3 py-3.5 text-center text-pretty text-sm/6 font-semibold text-[var(--dark-teal)] custom-style sm:table-cell">
                                  Edit Operator Users
                                </th>
                                <th scope="col"
                                  className="w-1/5 px-3 py-3.5 text-center text-pretty text-sm/6 font-semibold text-[var(--dark-teal)] custom-style sm:table-cell">
                                  Operator Library Manager
                                </th>
                                <th scope="col" className="w-1/5 py-3.5 text-center text-pretty text-sm/6 font-semibold text-[var(--dark-teal)] custom-style pr-4 pl-3 sm:pr-0">
                                  View Billing Details
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--darkest-teal)]/30 bg-white">
                              {operatorsList.map((role) => (
                                <tr key={role.apc_id}>
                                  <td className="w-full max-w-0 py-2 pr-1 text-sm/6 font-semibold text-[var(--dark-teal)] custom-style sm:w-auto sm:max-w-none sm:pl-0 text-start">
                                    {role.name}
                                    <p className="font-normal justify-end text-end mt-1 w-full text-xs">{role.street} {role.suite}
                                      <br></br>{role.city}, {role.state}
                                      <br></br>{role.zip}</p>
                                  </td>
                                  {[2, 4, 8, 7].map(roleVal => (
                                    <td key={roleVal} className="px-3 py-1 text-sm/6 text-[var(--dark-teal)] lg:table-cell">
                                      <div className="flex h-6 shrink-0 items-center justify-center">
                                        <div className="group grid size-4 grid-cols-1">
                                          <input
                                            type="checkbox"
                                            onChange={(e) => handleCheckboxChange(role.apc_id!, role.apc_address_id!, roleVal, e.target.checked)}
                                            aria-describedby="comments-description"
                                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] group-has-disabled:checked:bg-gray-300 group-has-disabled:checked:border-gray-500 ..." />
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
                  <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-2 border-t border-t-[var(--darkest-teal)] pb-5 pt-5 border-b border-b-[var(--dark-teal)]"
                    hidden={(partnersList.length > 0 && !makeSuperUser) ? false : true}>
                    <div>
                      <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Permissions for Non-Operated AFEs</h2>
                      <p className="mt-1 text-base/6 text-[var(--darkest-teal)] custom-style-long-text">The permissions associated to the user being created.</p>

                    </div>
                    <div className="">
                      <div className="divide-y divide-[var(--darkest-teal)]/40">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-1 md:grid-cols-1 ">
                          <table className="min-w-full divide-y divide-[var(--darkest-teal)]/50 ">
                            <thead>
                              <tr>
                                <th scope="col" className="w-1/4 py-3.5 text-left sm:pl-0">
                                </th>
                                <th
                                  scope="col"
                                  className="w-1/5 px-3 py-3.5 text-center text-pretty text-sm/6 font-semibold text-[var(--dark-teal)] custom-style sm:table-cell">
                                  View Non-Op AFEs
                                </th>
                                <th scope="col"
                                  className="w-1/5 px-3 py-3.5 text-center text-pretty text-sm/6 font-semibold text-[var(--dark-teal)] custom-style sm:table-cell">
                                  Edit Non-Op Users
                                </th>
                                <th scope="col"
                                  className="w-1/5 px-3 py-3.5 text-center text-pretty text-sm/6 font-semibold text-[var(--dark-teal)] custom-style sm:table-cell">
                                  Partner Library Manager
                                </th>
                                <th scope="col" className="w-1/5 py-3.5 text-center text-pretty text-sm/6 font-semibold text-[var(--dark-teal)] custom-style pr-4 sm:pr-0">
                                  Approve or Reject Non-Op AFEs
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--darkest-teal)]/30 bg-white">
                              {partnersList?.map((role) => (
                                <tr key={role.apc_id}>
                                  <td className="w-full max-w-0 py-2 pr-3 pl-4 text-sm/6 font-semibold text-[var(--dark-teal)] custom-style sm:w-auto sm:max-w-none sm:pl-0 text-start">
                                    {role.name}
                                    <p className="font-normal justify-end text-end mt-1 w-full text-xs">{role.street} {role.suite}
                                      <br></br>{role.city}, {role.state}
                                      <br></br>{role.zip}</p>
                                  </td>
                                  {[3, 5, 9, 6].map(roleVal => (
                                    <td key={roleVal} className="px-3 py-1 text-sm/6 text-[var(--dark-teal)] lg:table-cell">
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
                </>)}
              </div>
              <div className="flex items-center justify-end px-4 py-4 sm:px-8">
                <button type="button"
                  disabled={(newUser.firstName !== '' && newUser.lastName !== '' && newUser.email !== '') ? false : true}
                  onClick={(e: any) => {
                    e.preventDefault();
                    handleSaveNewUser();
                  }}
                  className="rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 px-3 py-2 text-sm/6 font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] justify-end cursor-pointer disabled:cursor-not-allowed">
                  Add New User
                </button>
                <button type="button"
                  hidden={loggedInUser?.is_super_user ? false : true}
                  onClick={(e: any) => {
                    e.preventDefault();
                    handleTestEmailSending();
                    //handleNewUser('Rachel', 'Green', 'elizabeh.rider.shaw@gmail.com', 'topSecretPassword25!', false, roles, partnerRoles, false, token);
                  }}
                  className="rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 px-3 py-2 text-sm/6 font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] justify-end">
                  SEND Test EMAIL
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}