import  supabase  from './supabase';

export const fetchFromSupabase = async (table: string, select: string) => {
    const { data, error } = await supabase.from(table).select(select);
    if (error) {
      console.error(`Error fetching ${table}:`, error);
      return [];
    }
    return data;
  };

  export const updateAFEPartnerStatusSupabase = async (id:string) => {
    const { error } = await supabase.from('AFE_PROCESSED').update({partner_status: 'Viewed'}).eq('id',id);
    if (error) {
        console.error(`Error Updating AFE Status`, error);
        return [];
      }

  return 'success';
  };

  export const addAFEHistorySupabase = async (afe_id:string, description:string) => {
    const { error } = await supabase.from('AFE_HISTORY').insert({afe_id: afe_id, description: description});
    if (error) {
        console.error(`Error Updating AFE History`, error);
        return [];
      }
      return 'success'
  };

  export const fetchFromSupabaseMatchOnString = async (table: string, select: string, col:string, equal:string) => {
    const { data, error } = await supabase.from(table).select(select).eq(col,equal);
    if (error) {
      console.error(`Error fetching ${table}:`, error);
      return [];
    }
    return data;
  };
