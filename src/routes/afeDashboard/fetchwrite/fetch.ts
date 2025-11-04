import  supabase  from '../../../../provider/supabase';

//FETCH DATA
export async function fetchAFEs() {
  const { data, error } = await supabase.from('AFE_PROCESSED').select('*, apc_op_id(name, id)');
  if (error || !data) {
      console.error(`Error fetching AFEs`, error);
      return [];
      } 
  return data;
};