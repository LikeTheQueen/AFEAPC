import type { UserProfileRecordSupabaseType } from "src/types/interfaces";
import { fetchIsUserSuperUser } from 'provider/fetch';

export async function isUserSuperUser(loggedInUser: UserProfileRecordSupabaseType){
    const result = await fetchIsUserSuperUser(loggedInUser.user_id);
    if(result === true) {
        return true;
    } else {
        return false;
    }
};