import { transformAddressSupabase, transformOperatorSingle, transformPartnerSingle } from 'src/types/transform';
import  supabase  from './supabase';
import type { UUID } from 'crypto';

export const addOperatorSupabase = async (name: string, source_system:number) => {
    const { data, error } = await supabase.from('OPERATORS').insert({name: name, source_system: source_system, active:true}).select();
    if (error) {
        console.error(`Error adding Operator`, error);
        return null;
      }
      const transformedOperator = transformOperatorSingle(data[0]);
      return transformedOperator;
  };

  export const addPartnerSupabase = async (name: string, apc_op_id:UUID) => {
    const { data, error } = await supabase.from('PARTNERS').insert({partner_name: name, active:true, apc_op_id:apc_op_id}).select();
    if (error) {
        console.error(`Error adding Operator as a Partner`, error);
        return null;
      }
      const transformedPartner = transformPartnerSingle(data[0]);
      return transformedPartner;
  };

  export const addOperatorAdressSupabase = async (apc_op_id: UUID, street: string, suite: string, city: string, state: string, zip: string, country: string ) => {
    const { data, error } = await supabase.from('OPERATOR_ADDRESS').insert({apc_op_id: apc_op_id, street: street, suite: suite, city: city, state: state, zip: zip, country: country }).select();
    if (error) {
        console.error(`Error adding Operator`, error);
        return null;
      }
      const trasnformedAddress = transformAddressSupabase(data);
      return trasnformedAddress[0];
  };

  export const addOperatorPartnerAddressSupabase = async (apc_part_id: UUID, street: string, suite: string, city: string, state: string, zip: string, country: string ) => {
    const { data, error } = await supabase.from('PARTNER_ADDRESS').insert({apc_part_id: apc_part_id, street: street, suite: suite, city: city, state: state, zip: zip, country: country }).select();
    if (error) {
        console.error(`Error adding Partner Address`, error);
        return null;
      }
      const trasnformedAddress = transformAddressSupabase(data);
      return trasnformedAddress[0];
  };

  export const addNewUser = async(email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email:email,
      password:password
    });
    if (error) {
        console.error(`Error adding User`, error);
        return null;
      }
      return (data);
  }

  export const deactivateUser = async() => {
    const { data: user, error } = await supabase.rpc('deactivateUser',{user_id:'6da7777f-79ae-42b5-a674-b3089a45624c'});
    if (error) {
        console.error(`Error deleting User`, error);
        return null;
      }
      console.log(user);
      return (user);
  }
  export const reactivateUser = async() => {
    const { data: user, error } = await supabase.rpc('reactivateUser',{user_id:'6da7777f-79ae-42b5-a674-b3089a45624c'});
    if (error) {
        console.error(`Error Reactivating User`, error);
        return null;
      }
      console.log(user);
      return (user);
  }