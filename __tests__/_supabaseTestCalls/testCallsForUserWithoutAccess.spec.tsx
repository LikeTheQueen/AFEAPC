import * as writeProvider from "provider/write";
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import supabase from 'provider/supabase';
import type { AddressType } from "src/types/interfaces";

describe('updatePartnerActiveStatusView', () => {
  let token: string
  let success = false;
  const active_status = false;
  const number_id = 1364;
  const number_id_invalid = 50;
  const desc = 'Partner Active Status view rights only'
  
  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'eandv38.51@gmail.com',
      //email: 'support@afepartners.com',
      password: 'Ilovemy3boys!'
    })
    token = data.session?.access_token ?? ''
  })

  it(`It fails to update the ${desc} without a token`, async () => {
    
    try{
       const result = await writeProvider.updatePartnerActiveStatus(number_id, active_status, '1234');
       if(!result.ok) {
       console.log(result.message);
       console.log('The result was NOT Okay')
    }
    
    if (result.ok) {
      console.log('The result was good')
    }

    } catch (error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }
  });

  it(`It fails to find a relevant record for ${desc}`, async () => {
    
    try{
       const result = await writeProvider.updatePartnerActiveStatus(number_id_invalid, active_status, token);
       if(!result.ok) {
       console.log(result.message);
       console.log('The result was NOT Okay')
    }
    
    if (result.ok) {
        console.log('The result was good')
    }
    } catch (error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
      expect(parsed.message).toBe('Invalid JWT')
    }

  });

  it(`RLS Issue for ${desc}`, async () => {
    
    try{
       const result = await writeProvider.updatePartnerActiveStatus(number_id, active_status, token);
       if(!result.ok) {
       console.log(result.message);
       console.log('The result was NOT Okay')
    }
    
    if (result.ok) {
        console.log('The result was good')
    }
    } catch (error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
      expect(parsed.message).toBe('Invalid JWT')
    }

  });
});

describe('updateParentCOAddress', () => {
  let token: string
  let success = false;
  const active_status = false;
  const number_id = 1364;
  const number_id_invalid = 50;
  const desc = 'Partner Address Change view rights only';
  const mockParentCompanyAddressOG: AddressType = {
          id:2,
          street: '7889 S Main',
          suite: '88',
          city: 'Austin',
          state: 'Texas',
          zip: '90087',
          country: 'United States',
          address_active: true,
      };
  const mockParentCompanyAddressChange: AddressType = {
          id:2,
          street: '7889 S Main',
          suite: '88990A',
          city: 'Austin',
          state: 'Texas',
          zip: '90087',
          country: 'United States',
          address_active: true,
      };
      const mockParentCompanyAddressChangeInvalid: AddressType = {
          id:50,
          street: '7889 S Main',
          suite: '88990A',
          city: 'Austin',
          state: 'Texas',
          zip: '90087',
          country: 'United States',
          address_active: true,
      };
  
  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'eandv38.51@gmail.com',
      //email: 'support@afepartners.com',
      password: 'Ilovemy3boys!'
    })
    token = data.session?.access_token ?? ''
  })

  it(`It fails to update the ${desc} without a token`, async () => {
    
    try{
       const result = await writeProvider.updateParentCOAddress(mockParentCompanyAddressChange, '1234');
       if(!result.ok) {
       console.log(result.message);
       console.log('The result was NOT Okay')
    }
    
    if (result.ok) {
      console.log('The result was good')
    }

    } catch (error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }
  });

  it(`It fails to find a relevant record for ${desc}`, async () => {
    
    try{
       const result = await writeProvider.updateParentCOAddress(mockParentCompanyAddressChangeInvalid, token);
       if(!result.ok) {
       console.log(result.message);
       console.log('The result was NOT Okay')
    }
    
    if (result.ok) {
        console.log('The result was good')
    }
    } catch (error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
      expect(parsed.message).toBe('Invalid JWT')
    }

  });

  it(`RLS Issue for ${desc}`, async () => {
    
    try{
       const result = await writeProvider.updateParentCOAddress(mockParentCompanyAddressChange, token);
       if(!result.ok) {
       console.log(result.message);
       console.log('The result was NOT Okay')
    }
    
    if (result.ok) {
        console.log('The result was good')
    }
    } catch (error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
      expect(parsed.message).toBe('Invalid JWT')
    }

  });
});