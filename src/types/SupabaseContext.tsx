import { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";
import { fetchUserProfile } from "../../provider/fetch";
import type { UserProfileRecordSupabaseType } from "./interfaces";
import supabase from '../../provider/supabase';
import type { Session } from "@supabase/supabase-js";
import { transformUserProfileRecordSupabase } from "./transform";


export interface SupabaseContextType {
  //afes: AFEType[] | undefined;
  loading: boolean;
  session: Session | null;
  loggedInUser: UserProfileRecordSupabaseType | null;
  refreshData: () => Promise<void>;
}

export const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);
export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  //const [afes, setAFEs] = useState<AFEType[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserProfileRecordSupabaseType | null>(null);

  const fetchData = useCallback(async () => {
    if(!session?.user.id || !session.access_token) return;
    try {
      const userCall = await fetchUserProfile(session?.user.id!, session?.access_token!);
    if(userCall.ok) {
      const userFormatted = transformUserProfileRecordSupabase(userCall.data);
      setLoggedInUser(userFormatted);
    } else {
      throw new Error('Cannot locate user');
    }
    } catch(error) {
      console.error('Failed to fetch user profile', error);
      await supabase.auth.signOut();
    } finally{
      setLoading(false);
    }

  }, [session?.user.id, session?.access_token]);


  useEffect(() => {
    if (!session) return;
    fetchData();
  }, [fetchData]);



  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
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

  const contextValue = useMemo(() => ({
    loading,
    session,
    loggedInUser,
    refreshData: fetchData
  }), [loading, session, loggedInUser, fetchData]);

  return (
    <SupabaseContext.Provider value={contextValue}>
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
