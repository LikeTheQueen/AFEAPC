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
    console.log(id, 'this was the id');
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

  export const fetchEstimatesFromSupabaseMatchOnAFEandPartner = async (afeID: string, partnerID: string) => {
    const { data, error } = await supabase.from('AFE_ESTIMATES_PROCESSED')
    .select('id, amount_gross,partner_wi,partner_net_amount, operator_account_number,operator_account_group,operator_account_description,partner_account_number,partner_account_description,partner_account_group')
    .eq('source_system_id', afeID)
    .eq('apc_partner_id', partnerID);
    if (error) {
      console.error(`Error fetching ${afeID}:`, error);
      return [];
    }
    return data;
  };

  