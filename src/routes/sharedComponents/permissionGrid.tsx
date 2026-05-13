import { useCallback, useEffect, useMemo, useState } from "react";
import { type RoleEntryWrite, type RoleEntryRead, type GroupedUser } from "src/types/interfaces";
import { checkedByRole, checkedByRoleEntryWrite, getRoleIndex, getRoleIndexRoleEntryWrite } from "../createEditUsers/routes/helpers/helpers";
import { writeorUpadateUserRoles } from "provider/write";
import React from "react";
import { useSupabaseData } from "src/types/SupabaseContext";
import { nonOperatedPermissionHeaders, nonOperatedPermissionRoles, operatedPermissionHeaders, operatedPermissionRoles } from "src/constants/variables";
import { Field, Label, Switch } from "@headlessui/react";

type PermissionGridData = {
  profileView: boolean;
  allUserRoles: GroupedUser[];
  apcIDEditPriv: Set<Number>;
  mode: "Operated" | "Non-Operated";
};


export default function PermissionDashboards({ profileView, allUserRoles = [], apcIDEditPriv, mode }: PermissionGridData) {
  const { loggedInUser, session } = useSupabaseData();
  const [allUsersPermissions, setAllUsersPermissions] = useState(allUserRoles);
  const [permissionHeaders, setPermissionHeaders] = useState<String[] | []>([]);
  const [roleValueArray, setRoleValueArray] = useState<number[] | []>([]);

  const [opRolesWrite, setOpRolesWrite] = useState<RoleEntryWrite[] | []>([]);
  const [partnerRolesWrite, setPartnerRolesWrite] = useState<RoleEntryWrite[] | []>([]);
  const [rolesWrite, setRolesWrite] = useState<RoleEntryWrite[] | []>([]);
  const [hideRowsUserCannotEdit, setHideRowsUserCannotEdit] = useState(!profileView);

  console.log(session?.access_token)
  useEffect(() => {
  setAllUsersPermissions([...allUserRoles].sort((a, b) => a.user_firstname.localeCompare(b.user_firstname)));
  if(mode === 'Operated') {
    setPermissionHeaders(operatedPermissionHeaders);
    setRoleValueArray(operatedPermissionRoles);
  } else {
    setPermissionHeaders(nonOperatedPermissionHeaders);
    setRoleValueArray(nonOperatedPermissionRoles);
  }
  }, [allUserRoles]);

  const isRowDisabled = useCallback((apc_address_id: number) => 
  !apcIDEditPriv.has(apc_address_id), [apcIDEditPriv]);
 
  const handleCheckboxChangeOp = (
  apc_id: string,
  apc_address_id: number,
  user_id: string,
  roleValue: number,
  roleID: number | undefined,
  isChecked: boolean
) => {
  if(mode === 'Operated') {
  setOpRolesWrite(prevRoles => {
    const updatedRoles = [...prevRoles];
    const existingIndex = updatedRoles.findIndex(
      entry => entry.apc_id === apc_id && entry.apc_address_id === apc_address_id && entry.user_id === user_id && entry.role === roleValue
    );

    if (existingIndex > -1) {
        updatedRoles.splice(existingIndex,1);
      } else {
        updatedRoles.push({
          user_id: user_id,
          role: roleValue,
          apc_id: apc_id,
          apc_address_id: apc_address_id,
          active: isChecked,
          id: roleID
        });
      }
      return updatedRoles;
  });
} else {
  setPartnerRolesWrite(prevRoles => {
    const updatedRoles = [...prevRoles];
    const existingIndex = updatedRoles.findIndex(
      entry => entry.apc_id === apc_id && entry.apc_address_id === apc_address_id && entry.user_id === user_id && entry.role === roleValue
    );

    if (existingIndex > -1) {
        updatedRoles.splice(existingIndex,1);
      } else {
        updatedRoles.push({
          user_id: user_id,
          role: roleValue,
          apc_id: apc_id,
          apc_address_id: apc_address_id,
          active: isChecked,
          id: roleID
        });
      }
    return updatedRoles;
  });
}   setRolesWrite(prevRoles => {
    const updatedRoles = [...prevRoles];
    const existingIndex = updatedRoles.findIndex(
      entry => entry.apc_id === apc_id && entry.apc_address_id === apc_address_id && entry.user_id === user_id && entry.role === roleValue
    );

    if (existingIndex > -1) {
        updatedRoles.splice(existingIndex,1);
      } else {
        updatedRoles.push({
          user_id: user_id,
          role: roleValue,
          apc_id: apc_id,
          apc_address_id: apc_address_id,
          active: isChecked,
          id: roleID
        });
      }
      return updatedRoles;
  });
  };

  async function handleClickSave () {
    if(mode === 'Operated') {
      writeorUpadateUserRoles(rolesWrite,'OPERATOR_USER_PERMISSIONS');
      setOpRolesWrite([]);
      setRolesWrite([]);
    } else {
      writeorUpadateUserRoles(rolesWrite, 'PARTNER_USER_PERMISSIONS'); 
      setPartnerRolesWrite([]);
      setRolesWrite([]);
    }
    return;
  }

console.log(opRolesWrite, partnerRolesWrite, rolesWrite, mode)
  return (
    <>
    <div className="divide-y divide-[var(--darkest-teal)]/40">
    <div className="grid max-w-full grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-8 p-4 pb-6">
      <div className="md:col-span-2">
        <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Permissions for {mode} AFEs</h2>
          <p hidden ={profileView} className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text">The permissions associated to each user.</p>
          <br></br><p hidden ={profileView} className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text">Only users with edit rights get to push the buttons that matter.</p>
          <p hidden ={!profileView} className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text">The permissions associated to your user. </p>
          <br></br><p hidden ={!profileView} className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text">For changes please contact your administrator.  Only users with edit rights get to push the buttons that matter.  Changes must be made from the Manage Permissions Screen.</p>
        </div>
      <div className="md:col-span-6">
     
        <div className="">
          <div hidden={profileView} className="flex justify-start p-4">
            <Field className="flex items-end ">
                                  <Switch
                                    checked={hideRowsUserCannotEdit}
                                    onChange={(e) => setHideRowsUserCannotEdit(!hideRowsUserCannotEdit)}
                                    className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-0 focus:ring-[var(--bright-pink)] focus:ring-offset-2 focus:outline-hidden data-checked:bg-[var(--bright-pink)]">
                                    <span
                                      aria-hidden="true"
                                      className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
                                    />
                                  </Switch>
                                  <Label as="span" className="ml-3 text-sm">
                                    <span className="font-medium text-[var(--darkest-teal)] custom-style">Hide permissions you cannot edit</span>{' '}
                                  </Label>
                                </Field>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-1 md:grid-cols-1 ">
            <ul role="list" className="">
               {allUsersPermissions.map(user => (
            <li key={user.user_id}>
    <table className="min-w-full divide-y divide-[var(--darkest-teal)]/30 shadow-2xl mb-10 sm:mb-4">
          <thead>
            <tr>
              <th colSpan={5} scope="col" className="sm:hidden sm:pl-0 text-[var(--darkest-teal)] bg-[var(--darkest-teal)]/20 rounded-tl-xl rounded-tr-xl table-cell">
                 <h2 hidden={profileView} className="font-semibold custom-style text-center py-1">
                  {`${user.user_firstname} ${user.user_lastName}`}
                  </h2>
              </th>
            </tr>
            <tr className="text-white">
              <th scope="col" className="hidden sm:pl-0 text-[var(--darkest-teal)] rounded-tl-xl rounded-tr-xl ring-1 ring-[var(--darkest-teal)]/10 ring-offset-1 sm:table-cell">
                 <h2 hidden={profileView} className="font-semibold custom-style text-center py-1">
                  {`${user.user_firstname} ${user.user_lastName}`}
                  </h2>
              </th>
              <th
                scope="col"
                className="sm:rounded-tl-xl w-1/5 px-2 py-3.5 text-center text-pretty text-sm/6 font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                {permissionHeaders[0]}
              </th>
              <th scope="col" 
                  className="w-1/5 px-2 py-3.5 text-center text-pretty text-sm/6 font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                {permissionHeaders[1]}
              </th>
              <th scope="col" 
                  className="w-1/5 px-2 py-3.5 text-center text-pretty text-sm/6 font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                {permissionHeaders[2]}
              </th>
              <th scope="col" className="sm:rounded-tr-lg w-1/5 px-2 py-3.5 text-center text-pretty text-sm/6 font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                {permissionHeaders[3]}
              </th>
            </tr>
          </thead>
          <tbody className="sm:divide-y divide-[var(--darkest-teal)]/20 bg-white">
          
          {user.apcrole
          .filter(op => hideRowsUserCannotEdit && !profileView ? !isRowDisabled(op.apc_address_id) : true)
          .map(operator => (
            <React.Fragment key={operator.apc_id}>
        <tr>
          <td colSpan={5} className="sm:hidden table-cell w-full max-w-0 py-2 pr-3 pl-4 text-sm/6 font-semibold text-[var(--darkest-teal)] custom-style sm:w-auto sm:max-w-none sm:pl-2 text-start">
            {operator.apc_name} <span className="font-normal justify-end text-end mt-1 w-full text-xs">
              <br></br>{operator.apc_street} {operator.apc_suite} {operator.apc_city}, {operator.apc_state} {operator.apc_zip}</span>  
          </td>
         
        </tr>
        <tr className="border-b border-b-[var(--darkest-teal)]  sm:border-none">
          <td className="hidden sm:table-cell w-full max-w-0 py-2 pr-3 pl-4 text-sm/6 font-semibold text-[var(--darkest-teal)] custom-style sm:w-auto sm:max-w-none sm:pl-2 text-start">
            
            {operator.apc_name}
            <p className="font-normal justify-end text-end mt-1 w-full text-xs">{operator.apc_street} {operator.apc_suite}
            
            <br></br>{operator.apc_city}, {operator.apc_state}
            <br></br>{operator.apc_zip}</p>  
            
          </td>
          {roleValueArray.map((roleVal) => (
        <td key={roleVal} className="px-3 py-3 sm:py-1 text-sm/6 text-[var(--dark-teal)] lg:table-cell">
          <div className="flex shrink-0 items-center justify-center">
            <div className="group grid size-4 grid-cols-1">  
              
  <input
    type="checkbox"
    defaultChecked={checkedByRoleEntryWrite(operator.roles, roleVal)}
    disabled={isRowDisabled(operator.apc_address_id) || user.user_id === loggedInUser?.user_id!}
    value={getRoleIndexRoleEntryWrite(operator.roles,roleVal,operator.apc_id,operator.apc_address_id,user.user_id)}
    onChange={(e) => handleCheckboxChangeOp(operator.apc_id,
                                          operator.apc_address_id,
                                          user.user_id!,
                                          roleVal,
                                          Number(e.target.value),
                                          e.target.checked)}
    aria-describedby="comments-description"
    className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] 
    group-has-disabled:checked:bg-gray-300 group-has-disabled:checked:border-gray-500"/>
              <svg
                fill="none"
                viewBox="0 0 14 14"
                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25">
                <path
                  d="M3 8L6 11L11 3.5"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-0 group-has-checked:opacity-100"/>
                <path
                  d="M3 7H11"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-0 group-has-indeterminate:opacity-100"/>
              </svg>
            </div>
          </div>
        </td>
      ))}
        </tr>
        </React.Fragment>
        ))}
          </tbody>
          </table>
    
  </li>
  
))}
            </ul>
          </div>
<div className="flex justify-end mb-4">
        <button
        disabled={rolesWrite.length>0 ? false : true}
        hidden={profileView}
        className="w-60 cursor-pointer disabled:cursor-not-allowed w-35 rounded-md bg-[var(--dark-teal)] outline-[var(--dark-teal)] outline-1 -outline-offset-1 disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-sm/6 font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)] justify-end"
        onClick={handleClickSave}>
            Save {mode} Permissions
        </button>
    </div>
        </div>
        
      </div>
      </div>
      </div>
    </>
  )
}
