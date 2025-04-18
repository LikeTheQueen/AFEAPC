import  supabase  from './supabase';

export const fetchFromSupabase = async (table: string, select: string) => {
    const { data, error } = await supabase.from(table).select(select);
    if (error) {
      console.error(`Error fetching ${table}:`, error);
      return [];
    }
    return data;
  };

  export const importAFESupabase = async () => {
    const { error } = await supabase.from('AFE').insert({afe_number: '12345'});
    if (error) {
        console.error(`Error Writing AFEs`, error);
        return [];
      }
  };

  //operator_id IN (SELECT operator_id FROM USER_ROLES WHERE user_id = (SELECT auth.uid()))