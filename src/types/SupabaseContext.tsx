import { createContext, useState, useEffect, useContext } from "react";
import { fetchFromSupabase } from "../../provider/fetch";
import { transformAFEs, transformOperator, transformUserProfileSupabase } from "./transform";
import type { AFEType, OperatorType, UserProfileSupabaseType } from "./interfaces";
import  supabase  from '../../provider/supabase';
import type { Session } from "@supabase/supabase-js";


export interface SupabaseContextType {
    afes: AFEType[] | undefined;
    operators: OperatorType[] | null;
    loading: boolean;
    session: Session | null;
}

export const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);
export const SupabaseProvider = ({ children }: {children: React.ReactNode }) => {
    const [afes, setAFEs] = useState<AFEType[] | undefined>(undefined);
    const [operators, setOperator] = useState<OperatorType[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    

    useEffect(() => {
        const fetchData = async () => {
            const rawAFEs = await fetchFromSupabase("AFE_PROCESSED",'id,created_at,afe_type,afe_number,description,total_gross_estimate,version_string,supp_gross_estimate,operator_wi,apc_partner_id,apc_partner_name,partner_wi,partner_status,op_status,iapp_date,last_mod_date,legacy_chainID,legacy_afeid,chain_version, apc_operator_id(name), source_system_id');
            const rawOperators = await fetchFromSupabase("OPERATORS","*");

            setAFEs(transformAFEs(rawAFEs));
            setOperator(transformOperator(rawOperators));

            setLoading(false);
        };

        fetchData();
    }, []);

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
    <SupabaseContext.Provider value={{ afes, operators, loading, session}}>
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
  