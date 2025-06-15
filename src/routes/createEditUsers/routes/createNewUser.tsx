import { useEffect, useState } from 'react';
import { useSupabaseData } from "../../../types/SupabaseContext";
import { addNewUser, deactivateUser, reactivateUser } from 'provider/write';
import { ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'
import { fetchOperatorsForLoggedInUser, fetchRolesGeneric } from 'provider/fetch';
import { type UserProfileRecordSupabaseType, type OperatorType, type RoleEntry, type RoleTypesGeneric } from 'src/types/interfaces';
import { Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, Switch } from '@headlessui/react';

function handleDelete() {
  deactivateUser();
}
function handleReactivate() {
  reactivateUser();
}
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
  let operatorBlank: OperatorType = {
    name: '',
    source_system: 0,
    id: "00000000-0000-0000-0000-000000000000",
  };
  
  const { loggedInUser } = useSupabaseData();
  const { isSuperUser } = useSupabaseData();
  const [newUser, setNewUser] = useState<UserProfileRecordSupabaseType>(userBlank);
  const [operatorsList, setOperatorsList] = useState<OperatorType[] | []>([]);
  const [roles, setRoles] = useState<RoleEntry[] | []>([])
  const [selectedOp, setSelectedOp] = useState<OperatorType>(operatorBlank)
  const [rolesGeneric, setRolesGeneric] = useState<RoleTypesGeneric[] | []>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (loggedInUser === null || isSuperUser === null) return;
    async function getOperatorList() {
      const opList = await fetchOperatorsForLoggedInUser(loggedInUser?.user_id!, isSuperUser);
      setOperatorsList(opList);
      console.log(opList);
    } getOperatorList();
  }, [loggedInUser, isSuperUser]);

  useEffect(() => {
    async function getGenericRoles() {
      const roleList = await fetchRolesGeneric();
      setRolesGeneric(roleList);
    } getGenericRoles();
  }, [loggedInUser]);
  useEffect(() => {
    function createOpPermissionList(){
      const opPermissionRoleList: RoleEntry[] = operatorsList.map((item) => ({
        role:0,
        apc_name: item.name,
        apc_id: item.id || '',
      }));
      setRoles(opPermissionRoleList);
    } createOpPermissionList();
  },[operatorsList])
  function handleUserChange(e: { target: { name: any; value: any; }; }) {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    })
  };
  function handleActiveToggle(e: any){
    setNewUser({
      ...newUser,
      [e.newUser.active]: e.target.value
    })
  };
  
  const handlePermissionSelect = (event: React.ChangeEvent<HTMLInputElement> ) => {
    const selectedPermission = parseInt(event.target.value, 10);
    const roleAddress: RoleEntry = {
      role: selectedPermission,
      apc_id: selectedOp.id?.toString() || '',
      apc_name: selectedOp.name
    }
    setRoles([
      ...roles,
      roleAddress
    ])
  };

  
  console.log(newUser);
  console.log(roles,'this is roles')
  
  return (
    <>
      <div className="py-4 px-4 sm:px-6 lg:px-8 divide-y divide-gray-900/20 ">
        <div className="divide-y divide-gray-900/10">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3 ">
            <div className="px-4 sm:px-0">
              <h2 className="font-semibold text-[var(--darkest-teal)] custom-style">User Information</h2>
              <p className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">Create a user and assign privileges to that user for <span className="font-bold italic">each Operator or Partner record.</span>  
              <br></br>The Partner record will be associated to Non-Operated AFEs.
              <br></br>
              <br></br>Active users with a valid email will be to login with a magic link sent to their email each time they sign-on.
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
            <form className="bg-white shadow-m ring-1 ring-gray-900/20 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8 ">
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
                  <Field className="flex items-end justify-end sm:col-span-4 mb-2">
                    <Switch
                      checked={enabled}
                      onChange={setEnabled}
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
                    <div className="mt-2">
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
                </div>
                <div className="border-t border-gray-900/30 mt-8">
              <h2 className="bg-white px-3 font-semibold text-[var(--darkest-teal)] custom-style mt-6">Permissions</h2>
                <div className="-mx-4 mt-8 sm:-mx-0">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-[var(--dark-teal)] custom-style sm:pl-0">
                
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-pretty text-sm font-semibold text-[var(--dark-teal)] custom-style sm:table-cell"
              >
                View Operated AFEs
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-pretty text-sm font-semibold text-[var(--dark-teal)] custom-style sm:table-cell"
              >
                View Non-Operated AFEs
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-pretty text-sm font-semibold text-[var(--dark-teal)] custom-style sm:table-cell">
                Edit Operator Users
              </th>
              <th scope="col" className="relative py-3.5 text-left text-pretty text-sm font-semibold text-[var(--dark-teal)] custom-style pr-4 pl-3 sm:pr-0">
                Edit Partner Users
              </th>
              <th scope="col" className="relative py-3.5 text-left text-pretty text-sm font-semibold text-[var(--dark-teal)] custom-style pr-4 pl-3 sm:pr-0">
                Accept or Reject Non-Operated AFEs
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {roles.map((role) => (
              <tr key={role.apc_id}>
                <td className="w-full max-w-0 py-4 pr-3 pl-4 text-sm font-semibold text-[var(--dark-teal)] custom-style sm:w-auto sm:max-w-none sm:pl-0">
                  {role.apc_name}
                </td>
                <td className="hidden px-3 py-4 text-sm text-[var(--dark-teal)] lg:table-cell">
                  <div className="flex h-6 shrink-0 items-center justify-center">
            <div className="group grid size-4 grid-cols-1">
              <input
                defaultChecked
                id="role2"
                name="role"
                value={2}
                type="checkbox"
                aria-describedby="comments-description"
                className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] indeterminate:border-[var(--bright-pink)] indeterminate:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
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
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{role.apc_name}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{role.apc_name}</td>
                <td className="py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-0">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    Edit<span className="sr-only">, {role.apc_name}</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <button type="button"
                  onClick={(e: any) => {
                    e.preventDefault();
                    handleReactivate();
                  }}
                  className="text-sm/6 font-semibold text-gray-900">
                  Cancel
                </button>
                <button
                  onClick={(e: any) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  delete user
                </button>
              </div>
            </form>
          </div>


        </div>
      </div>
    </>
  )
}