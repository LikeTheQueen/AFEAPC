import { createContext, useState, useEffect, useContext } from "react";
import { fetchFromSupabase, fetchUserProfileRecordFromSupabase } from "../../provider/fetch";
import { transformAFEs } from "./transform";
import type { AFEType, UserProfileRecordSupabaseType } from "./interfaces";
import  supabase  from '../../provider/supabase';
import type { Session } from "@supabase/supabase-js";


export interface SupabaseContextType {
    afes: AFEType[] | undefined;
    loading: boolean;
    session: Session | null;
    loggedInUser: UserProfileRecordSupabaseType | null;
    isSuperUser: boolean;
    refreshData: () => Promise<void>;
}

export const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);
export const SupabaseProvider = ({ children }: {children: React.ReactNode }) => {
    const [afes, setAFEs] = useState<AFEType[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const [loggedInUser, setLoggedInUser] = useState<UserProfileRecordSupabaseType | null>(null);
    const [isSuperUser, setIsSuperUser] = useState(false);

    const fetchData = async () => {
            const rawAFEs = await fetchFromSupabase("AFE_PROCESSED",'id,created_at,afe_type,afe_number,description,total_gross_estimate,version_string,supp_gross_estimate,operator_wi,apc_partner_id,apc_partner_name,partner_wi,partner_status,op_status,iapp_date,last_mod_date,legacy_chainID,legacy_afeid,chain_version, apc_op_id(name, id), source_system_id, sortID, partner_status_date, archived, partner_archived');
            const authUserFormatted = await fetchUserProfileRecordFromSupabase(session?.user.id!);
            setAFEs(transformAFEs(rawAFEs));
            setLoggedInUser(authUserFormatted);
            setLoading(false);
            
        };
    const fetchSuperUserStatus = async () => {
        const isSuperUserCheck = loggedInUser?.is_super_user? loggedInUser.is_super_user : false;
        setIsSuperUser(isSuperUserCheck);
    }

    useEffect(() => {
      if (!session) return;
        fetchData();
    }, [session]);

    useEffect(() => {
        fetchSuperUserStatus();
    }, [loggedInUser]);

    useEffect(() => {
        const {data: {subscription}} = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_OUT') {
              setSession(null)
            } else if (session) {
              setSession(session)
            }
          }
        )
        return () => {
          subscription?.unsubscribe()
        }
      }, []);
    return (
    <SupabaseContext.Provider value={{ afes, loading, session, loggedInUser, isSuperUser, refreshData: fetchData}}>
      {children}
    </SupabaseContext.Provider>
    );
};

export const useSupabaseData = (): SupabaseContextType => {
    const context = useContext(SupabaseContext);
    if (!context) {
      throw new Error("useSupabaseData must be used within a SupabaseProviders");
    }
    return context;
  };
  