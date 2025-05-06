import  supabase  from './supabase';
import type { ExecuteAFEDataType } from "../src/types/interfaces";
import type { ExecuteAFEEstimatesType } from "../src/types/interfaces";

  export const writeExecuteAFEtoSupabase = async (resource: string, variables:ExecuteAFEDataType[]) => {
    const query = supabase.from(resource).upsert(variables, {
        onConflict: 'docID, partnerID, chain_version'
    });
    const {error} = await query;

    if (error) {
        console.error(`Error Writing AFEs`, error);
        return error;
      }
      return 'Success';
  };

  export const writeExecuteAFEEstimatesSupabase = async (resource: string, variables:ExecuteAFEEstimatesType[]) => {
    const query = supabase.from(resource).upsert(variables, {
        onConflict: 'afe, account_number, chainID'
    });
    const {error} = await query;

    if (error) {
        console.error(`Error Writing AFE Estimates`, error);
        return error;
      }
      return 'Success';
  };