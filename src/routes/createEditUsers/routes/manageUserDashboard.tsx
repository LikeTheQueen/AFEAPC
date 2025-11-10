import { useEffect, useState } from "react";
import { fetchUsersForOperator } from "provider/fetch";
import { useSupabaseData } from "src/types/SupabaseContext";
import type { UserFullNameAndEmail } from "src/types/interfaces";
import UserDashboard from "../../../routes/manageUserGrid";
import { transformUserNameAndEmail } from "src/types/transform";
import LoadingPage from "src/routes/loadingPage";


export default function UserPermissionDashboard() {
  const { loggedInUser, session } = useSupabaseData();
  const token = session?.access_token ?? "";
  const [userList, setUserList] = useState<UserFullNameAndEmail[] | []>([]);
  const [userListLoading, setUserListLoading]=useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {

    if(!token || !loggedInUser) {
        setUserListLoading(false);
        return;
      }

    let isMounted = true;
    
    async function getUsersToEdit() {
      if (!loggedInUser) return;
        setUserListLoading(true);
        setIsError(false);

       try{
        const userListRaw = await fetchUsersForOperator(loggedInUser.is_super_user, token);
      
        if(!userListRaw.ok) {
        throw new Error((userListRaw as any).message ?? 'Unable to fetch users');
          
        } 
        const userListTransformed = transformUserNameAndEmail(userListRaw.data);

        if(isMounted) {
        setUserList(userListTransformed);
        }
      }
      catch(e) {
        console.error('Not able to get users ', e);
        if(isMounted) {
          setIsError(true);
        }
      }
      finally {
        if(isMounted) {
        setUserListLoading(false);
        }
      }
    }

    getUsersToEdit();

    return () => {
      isMounted = false;
    }

  }, [token, loggedInUser])

  return (
    <>
    <div className="px-4 sm:px-10 sm:py-16"> 
    {userListLoading ? (
      <LoadingPage></LoadingPage>
    ) : ( 
    <UserDashboard 
    userList={userList}
    isError={isError}>
    </UserDashboard >
    )}
    </div>
    </>
  )
}
