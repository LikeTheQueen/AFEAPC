import { useEffect, useMemo, useState } from "react";
import { type RoleEntryWrite, type RoleEntryRead, type PartnerRoleEntryWrite } from "src/types/interfaces";
import { checkedByRole, getRoleIndex } from "../routes/createEditUsers/routes/helpers/helpers";
import { writeorUpadateUserRoles } from "provider/write";

type apcrole = {
    apc_id: string;
    apc_address_id: number,
    apc_name: string;
    apc_street: string;
    apc_suite: string | null | undefined;
    apc_city: string;
    apc_state: string;
    apc_zip: string;
    roles: RoleEntryRead[]; 
}
type GroupedData = {
  user_id: string;
  user_firstname: string;
  user_lastName: string;
  user_email: string;
  apcrole: apcrole[];
};

export default function PermissionDashboard({ readOnly = false, operatorRoles = [], partnerRoles = [] }:{ readOnly?: boolean; operatorRoles: RoleEntryRead[]; partnerRoles: RoleEntryRead[]; }) {
  const [opRoles, setOpRoles] = useState(operatorRoles);
  const [opRolesWrite, setOpRolesWrite] = useState<RoleEntryWrite[] | []>([]);
  const [partRoles, setPartnerRoles] = useState(partnerRoles);
  const [partnerRolesWrite, setPartnerRolesWrite] = useState<RoleEntryWrite[] | []>([]);
  
  useEffect(() => {
  setOpRoles(operatorRoles);
}, [operatorRoles]);

useEffect(() => {
  setPartnerRoles(partnerRoles);
}, [partnerRoles]);
 

  const groupByUserThenOperatorRole = useMemo(() => {
    const grouped = new Map<string, GroupedData>();
    const filterInactiveUser = opRoles.filter(role => role.user_active === true);
    filterInactiveUser.forEach(record => {
      const userID = record.user_id;

      if (!userID) return;

      if (!grouped.has(userID)) {
        const apcEntries = opRoles.map(item => ({
            apc_id: item.apc_id,
            apc_address_id: item.apc_address_id,
            apc_name: item.apc_name,
            apc_street: item.apc_address?.street!,
            apc_suite: item.apc_address?.suite,
            apc_city: item.apc_address?.city!,
            apc_state: item.apc_address?.state!,
            apc_zip: item.apc_address?.zip!,
            roles: [],
        }));
    const uniqueAPCEntries: apcrole[] = Array.from(
        new Map(apcEntries.map((item) => [item.apc_id, item])).values()
    );
        grouped.set(record.user_id, {
          user_id: record.user_id,
          user_firstname: record.user_firstname,
          user_lastName: record.user_lastName,
          user_email: record.user_email,
          apcrole: uniqueAPCEntries
        });
        
        const existing = grouped.get(userID);
        let apcEntry = existing?.apcrole.find(apc => (apc.apc_id === record.apc_id && existing.user_id === record.user_id)); 

        if (apcEntry && record.user_id === existing?.user_id) {
        apcEntry.roles.push(record)  
        }
      } else {
        const existing = grouped.get(userID);
        let apcEntry = existing?.apcrole.find(apc => apc.apc_id === record.apc_id && existing.user_id === record.user_id);

        if (apcEntry && record.user_id === existing?.user_id) {
        apcEntry.roles.push(record)  
        }
      }
      
    });
    return [...grouped.values()];
  }, [opRoles])

  const groupByUserThenPartnerRole = useMemo(() => {
    const grouped = new Map<string, GroupedData>();
    const filterInactiveUser = partRoles.filter(role => role.user_active === true);
    filterInactiveUser.forEach(record => {
      const userID = record.user_id;

      if (!userID) return;

      if (!grouped.has(userID)) {
        const apcEntries = partRoles.map(item => ({
            apc_id: item.apc_id,
            apc_address_id: item.apc_address_id,
            apc_name: item.apc_name,
            apc_street: item.apc_address?.street!,
            apc_suite: item.apc_address?.suite,
            apc_city: item.apc_address?.city!,
            apc_state: item.apc_address?.state!,
            apc_zip: item.apc_address?.zip!,
            roles: [],
        }));
    const uniqueAPCEntries: apcrole[] = Array.from(
        new Map(apcEntries.map((item) => [`${item.apc_address_id}-${item.apc_id}`, item])).values()
    );
        grouped.set(record.user_id, {
          user_id: record.user_id,
          user_firstname: record.user_firstname,
          user_lastName: record.user_lastName,
          user_email: record.user_email,
          apcrole: uniqueAPCEntries
        });
        
        const existing = grouped.get(userID);
        let apcEntry = existing?.apcrole.find(apc => (apc.apc_id === record.apc_id && existing.user_id === record.user_id && apc.apc_address_id === record.apc_address_id)); 

        if (apcEntry && record.user_id === existing?.user_id) {
        apcEntry.roles.push(record)  
        }
      } else {
        const existing = grouped.get(userID);
        let apcEntry = existing?.apcrole.find(apc => apc.apc_id === record.apc_id && existing.user_id === record.user_id && apc.apc_address_id === record.apc_address_id);

        if (apcEntry && record.user_id === existing?.user_id) {
        apcEntry.roles.push(record)  
        }
      }
      
    });
    return [...grouped.values()];

  },[partRoles])

  const handleCheckboxChangeOp = (
  apc_id: string,
  apc_address_id: number,
  user_id: string,
  roleValue: number,
  roleID: number | undefined,
  isChecked: boolean
) => {
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
  })
   
};
  const handleCheckboxChangeNonOp = (
  apc_id: string,
  apc_address_id: number,
  user_id: string,
  roleValue: number,
  roleID: number | undefined,
  isChecked: boolean
) => {
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
};
 
  return (
    <>
    <div className="grid max-w-full grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-7"
    hidden={groupByUserThenOperatorRole.length > 0 ? false : true}>
      <div className="md:col-span-2 ">
        <h2 className="custom-style font-semibold text-[var(--darkest-teal)]">Permissions for Operated AFEs</h2>
          <p hidden ={readOnly} className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">The permissions associated to each user.  You must have edit rights to make changes.</p>
          <p hidden ={!readOnly} className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">The permissions associated to your user.  For changes please contact your administrator.  Changes must be made from the Manage Users Screen.</p>
        </div>
      <div className="md:col-span-5">
     
        <div className="">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-1 md:grid-cols-1 ">
            <ul role="list" className="">
               {groupByUserThenOperatorRole.map(user => (
            <li key={user.user_id}>
    <table className="min-w-full divide-y divide-gray-900/30 mb-4 shadow-2xl">
          <thead>
            <tr className="bg-white text-white ">
              <th scope="col" className="sm:pl-0 text-[var(--darkest-teal)] bg-white rounded-tl-xl rounded-tr-xl">
                 <h2  className="font-semibold custom-style text-center py-1"
                 hidden={readOnly}>
                  {readOnly ? '' : `${user.user_firstname} ${user.user_lastName}`}
                  </h2>
              </th>
              <th
                scope="col"
                className="rounded-tl-xl w-1/5 px-2 py-3.5 text-center text-pretty text-sm font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                View Operated AFEs
              </th>
              <th scope="col" 
                  className="w-1/5 px-2 py-3.5 text-center text-pretty text-sm font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                Edit Operator Users
              </th>
              <th scope="col" 
                  className="w-1/5 px-2 py-3.5 text-center text-pretty text-sm font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                Manage Libraries
              </th>
              <th scope="col" className="rounded-tr-lg w-1/5 px-2 py-3.5 text-center text-pretty text-sm font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                View Billing Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
              
              {user.apcrole.map(operator => (
        <tr key={operator.apc_id}>
          <td className="w-full max-w-0 py-2 pr-3 pl-4 text-sm font-semibold text-[var(--dark-teal)] custom-style sm:w-auto sm:max-w-none sm:pl-2 text-start">
            
            {operator.apc_name}
            <p className="font-normal justify-end text-end mt-1 w-full text-xs">{operator.apc_street} {operator.apc_suite}
            
            <br></br>{operator.apc_city}, {operator.apc_state}
            <br></br>{operator.apc_zip}</p>  
            
          </td>
          {[2, 4, 8, 7].map(roleVal => (
        <td key={roleVal} className="px-3 py-1 text-sm text-[var(--dark-teal)] lg:table-cell">
          <div className="flex shrink-0 items-center justify-center">
            <div className="group grid size-4 grid-cols-1">  
              
  <input
    type="checkbox"
    defaultChecked={checkedByRole(operator.roles, roleVal)}
    disabled={readOnly}
    value={getRoleIndex(operator.roles,roleVal,operator.apc_id,operator.apc_address_id,user.user_id)}
    onChange={(e) => handleCheckboxChangeOp(operator.apc_id,
                                          operator.apc_address_id,
                                          user.user_id,
                                          roleVal,
                                          Number(e.target.value),
                                          e.target.checked)}
    aria-describedby="comments-description"
    className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] 
    group-has-disabled:checked:bg-gray-300 group-has-disabled:checked:border-gray-500 ..."/>
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
        ))}
        
          </tbody>
          </table>
    
  </li>
  
))}
            </ul>
          </div>
<div className="flex justify-end mb-4">
        <button
        disabled={opRolesWrite.length>0 ? false : true}
        hidden={readOnly}
        className="w-60 rounded-md bg-[var(--dark-teal)] disabled:bg-gray-300 disabled:text-gray-500 px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] justify-end"
        onClick={(e) => {writeorUpadateUserRoles(opRolesWrite,'OPERATOR_USER_PERMISSIONS'), setOpRolesWrite([])}}>
            Save Operated Permissions
        </button>
    </div>
        </div>
        
      </div>
      </div>
    <div className="grid max-w-10xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-7 pt-4"
    hidden={groupByUserThenPartnerRole.length >0 ? false : true }>
      <div className="md:col-span-2 ">
        <h2 className="custom-style font-semibold text-[var(--darkest-teal)]">Permissions for Non-Operated AFEs</h2>
          <p hidden ={readOnly} className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">The permissions associated to each user.  You must have edit rights to make changes.</p>
          <p hidden ={!readOnly} className="mt-1 text-sm/6 text-[var(--darkest-teal)] custom-style-long-text">The permissions associated to your user.  For changes please contact your administrator.  Changes must be made from the Manage Users Screen.</p>
        </div>
      <div className="md:col-span-5">
      
        <div className="">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-1 md:grid-cols-1 ">
            <ul role="list" className="divide-y divide-gray-100">
               {groupByUserThenPartnerRole.map(user => (
            <li key={user.user_id}>
    <table className="min-w-full divide-y divide-gray-900/30 mb-4 shadow-2xl">
          <thead>
            <tr className="bg-white text-white ">
              <th scope="col" className="sm:pl-0 text-[var(--darkest-teal)] bg-white rounded-tl-xl rounded-tr-xl">
                 <h2  className="font-semibold custom-style text-center py-1"
                 hidden={readOnly}>
                  {readOnly ? '' : `${user.user_firstname} ${user.user_lastName}`}
                  </h2>
              </th>
              <th
                scope="col"
                className="rounded-tl-xl w-1/5 px-2 py-3.5 text-center text-pretty text-sm font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                View Non-Op AFEs
              </th>
              <th scope="col" 
                  className="w-1/5 px-2 py-3.5 text-center text-pretty text-sm font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                Edit Partner Users
              </th>
              <th scope="col" 
                  className="w-1/5 px-2 py-3.5 text-center text-pretty text-sm font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                Manage Libraries
              </th>
              <th scope="col" className="rounded-tr-lg w-1/5 px-2 py-3.5 text-center text-pretty text-sm font-semibold custom-style sm:table-cell bg-[var(--darkest-teal)]">
                Accept/Reject Non-Op AFEs
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
              
              {user.apcrole.map(operator => (
        <tr key={operator.apc_id}>
          <td className="w-full max-w-0 py-4 pr-3 pl-4 text-sm font-semibold text-[var(--dark-teal)] custom-style sm:w-auto sm:max-w-none sm:pl-2 text-start">
            
            {operator.apc_name}
            <p className="font-normal justify-end text-end mt-1 w-full text-xs">{operator.apc_street} {operator.apc_suite}
            
            <br></br>{operator.apc_city}, {operator.apc_state}
            <br></br>{operator.apc_zip}</p>  
            
          </td>
          {[3, 5, 9, 6].map(roleVal => (
        <td key={roleVal} className="px-3 py-4 text-sm text-[var(--dark-teal)] lg:table-cell">
          <div className="flex h-6 shrink-0 items-center justify-center">
            <div className="group grid size-4 grid-cols-1">
            
  <input
    type="checkbox"
    defaultChecked={checkedByRole(operator.roles, roleVal)}
    disabled={readOnly}
    value={getRoleIndex(operator.roles,roleVal,operator.apc_id,operator.apc_address_id,user.user_id)}
    onChange={(e) => handleCheckboxChangeNonOp(operator.apc_id,
                                          operator.apc_address_id,
                                          user.user_id,
                                          roleVal,
                                          Number(e.target.value),
                                          e.target.checked)}
    aria-describedby="comments-description"
    className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] 
    group-has-disabled:checked:bg-gray-300 group-has-disabled:checked:border-gray-500 ..."
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
    
  </li>
))}
            </ul>
          </div>
<div className="flex justify-end mb-3 mt-1">
        <button
        disabled={partnerRolesWrite.length>0 ? false : true}
        hidden={readOnly}
        className="w-60 rounded-md bg-[var(--dark-teal)] disabled:bg-gray-300 disabled:text-gray-500 px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] justify-end"
        onClick={(e) => {writeorUpadateUserRoles(partnerRolesWrite, 'PARTNER_USER_PERMISSIONS'), setPartnerRolesWrite([])}}>
            Save Non-Op Permissions
        </button>
    </div>
        </div>
      </div>
      </div>
    </>
  )
}
