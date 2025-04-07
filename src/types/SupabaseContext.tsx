import { createContext, useState, useEffect, useContext } from "react";
import { fetchFromSupabase } from "../../provider/fetch";
import { transformAFEs, transformOperator } from "./transform";
import type { AFEType, OperatorType } from "./index";

interface SupabaseContextType {
    afes: AFEType[] | null;
    operators: OperatorType[] | null;
    loading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: {children: React.ReactNode }) => {
    const [afes, setAFEs] = useState<AFEType[] | null>(null);
    const [operators, setOperator] = useState<OperatorType[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const rawAFEs = await fetchFromSupabase("AFE",'id,created_at,docID,afe_type,afe_number,description,total_gross_estimate,version_string,supp_gross_estimate,operator_wi,partnerID,partner_name,partner_wi,partner_status,op_status,iapp_date,last_mod_date,legacy_chainID,legacy_afeid,chain_version, operator(name)');
            const rawOperators = await fetchFromSupabase("OPERATORS","*");

            setAFEs(transformAFEs(rawAFEs));
            setOperator(transformOperator(rawOperators));

            setLoading(false);
        };

        fetchData();
    }, []);

    return (
    <SupabaseContext.Provider value={{ afes, operators, loading }}>
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
  