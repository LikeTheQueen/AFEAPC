import  supabase  from './supabase';
import type { ExecuteAFEDataType } from "../src/types/index";
import type { ExecuteAFEEstimatesType } from "../src/types/index";

  export const importAFESupabase = async (resource: string, variables:ExecuteAFEDataType[]) => {
    const query = supabase.from(resource).upsert(variables, {
        onConflict: 'docID, partnerID, chain_version'
    });
    const {error} = await query;

    if (error) {
        console.error(`Error Writing AFEs`, error);
        return [];
      }
      return [];
  };

  export const writeExecuteAFEEstimatesSupabase = async (resource: string, variables:ExecuteAFEEstimatesType[]) => {
    const query = supabase.from(resource).upsert(variables, {
        onConflict: 'afe, partner, account_number'
    });
    const {error} = await query;

    if (error) {
        console.error(`Error Writing AFE Estimates`, error);
        return [];
      }
      return [];
  };