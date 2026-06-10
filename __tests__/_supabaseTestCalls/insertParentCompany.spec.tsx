import * as writeProvider from "provider/write";
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import supabase from 'provider/supabase';
import type { AddressType, ParentCompanyWrite } from "src/types/interfaces";

const partnerListToUpload = [{
    source_id: 'S1',
    apc_op_id: 'a4367e56-14bf-4bd1-b0f1-fecc7d97b58c',
    name: 'Acme Co',
    street: '123 Main',
    suite: '',
    city: 'Denver',
    state: 'CO',
    zip: '80201',
    country: 'US',
    active: true
},
{
    source_id: 'S1',
    apc_op_id: 'a4367e56-14bf-4bd1-b0f1-fecc7d97b58c',
    name: 'Acme Co',
    street: '123 Main',
    suite: '',
    city: 'Denver',
    state: 'CO',
    zip: '80201',
    country: 'US',
    active: true
}];

const mappedPartnerRecord = [
  {
    "op_partner_id": "d0d06a20-9469-42e1-9080-78cad31353e9",
    "partner_id": "9b463346-5759-4708-8008-071070fa3d4c",
    "operator": "a4367e56-14bf-4bd1-b0f1-fecc7d97b58c",
}
]

describe('insertParentCompany', () => {
  let token: string
  let createdId: string = ''
  let createdIdNumber = 0
  const table_name: string = 'PARENT_COMPANY'

  const mockParentCompanyAddress: AddressType = {
        id:0,
        street: '1234 Main St',
        suite: '900',
        city: 'Littleton',
        state: 'CO',
        zip: '80127',
        country: 'United States',
        address_active: true,
    }

  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'support@afepartners.com',
      password: 'Ilovemy3boys!'
    })
    token = data.session?.access_token ?? ''
  })

  afterEach(async () => {
  if (createdId !== '' || createdIdNumber !== 0) {
    await writeProvider.deletTestRecords(table_name, createdIdNumber, createdId, token)
    createdId = ''
    createdIdNumber = 0
  }
  })

  it('successfully inserts a parent company', async () => {
    const result = await writeProvider.insertParentCompany('Test Company', mockParentCompanyAddress, token)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.id).toBeDefined()
      expect(result.data.name).toBe('Test Company')
      createdId = result.data.id  // captured for cleanup
    }
  })

  it('returns ok false when name is empty', async () => {
    const result = await writeProvider.insertParentCompany('', mockParentCompanyAddress, token)
    expect(result.ok).toBe(false)
  })
});

describe('insertParentCompanyFullRecord', () => {
  let token: string
  let createdId: string = ''
  let createdIdNumber = 0
  const table_name: string = 'PARENT_COMPANY'

  const mockParentCompany: ParentCompanyWrite = {
      apc_name: 'Test Record 1',
      max_users: 5,
      license_expires: '2026-06-30',
      is_active: true
    }
  
  const mockParentCompanyWithOutName: ParentCompanyWrite = {
      apc_name: '',
      max_users: 5,
      license_expires: '2026-06-30',
      is_active: true
    }

    const mockParentCompanyAddress: AddressType = {
        id:0,
        street: '1234 Main St',
        suite: '900',
        city: 'Littleton',
        state: 'CO',
        zip: '80127',
        country: 'United States',
        address_active: true,
    }

  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'support@afepartners.com',
      password: 'Ilovemy3boys!'
    })
    token = data.session?.access_token ?? ''
  })

  afterEach(async () => {
  if (createdId !== '' || createdIdNumber !== 0) {
    await writeProvider.deletTestRecords(table_name, createdIdNumber, createdId, token)
    createdId = ''
    createdIdNumber = 0
  }
  })

  it('successfully inserts a full parent company record', async () => {
    
    const result = await writeProvider.insertParentCompanyFullRecord(mockParentCompany, mockParentCompanyAddress,token)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.id).toBeDefined()
      expect(result.data.name).toBe('Test Record 1')
      createdId = result.data.id  // captured for cleanup
    }
  })

  it('returns ok false when name is empty', async () => {
    const result = await writeProvider.insertParentCompanyFullRecord(mockParentCompanyWithOutName, mockParentCompanyAddress,token)
    expect(result.ok).toBe(false)
  })
});

describe('insertOperatingCompanyFullRecord', () => {
  let token: string
  let createdId: string = ''
  let createdIdNumber = 0
  const table_name: string = 'OPERATORS'

    const mockParentCompanyAddress: AddressType = {
        id:0,
        street: '1234567 Main Delete St',
        suite: '900',
        city: 'Littleton',
        state: 'CO',
        zip: '80127',
        country: 'United States',
        address_active: true,
    }

  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'support@afepartners.com',
      password: 'Ilovemy3boys!'
    })
    token = data.session?.access_token ?? ''
  })

  afterEach(async () => {
  if (createdId !== '' || createdIdNumber !== 0) {
    await writeProvider.deletTestRecords(table_name, createdIdNumber, createdId, token)
    createdId = ''
    createdIdNumber = 0
  }
  })

  it('successfully inserts a full operating company record', async () => {
    
    const result = await writeProvider.insertOperatorFullRecord('My Test Operator', 2, '8c2abad9-a040-4d4a-9a4a-538ae451abd5', mockParentCompanyAddress,token)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.id).toBeDefined()
      expect(result.data.name).toBe('My Test Operator')
      createdId = result.data.id  // captured for cleanup
    }
  })

  it('returns ok false when name is empty', async () => {
    const result = await writeProvider.insertOperatorFullRecord('', 2, '8c2abad9-a040-4d4a-9a4a-538ae451abd5', mockParentCompanyAddress,token)
    expect(result.ok).toBe(false)
  })
});

describe('UpdateGLAccountCodeStatus', () => {
  let token: string
  let success = false;
  const active_status = false;

  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'support@afepartners.com',
      password: 'Ilovemy3boys!'
    })
    token = data.session?.access_token ?? ''
  })

  afterEach(async () => {
  if (success) {
    await writeProvider.updateGLAccountStatus(2038, !active_status, token);
  }
  })

  it('successfully updates GL Account Status', async () => {
  try{
       const result = await writeProvider.updateGLAccountStatus(2038, active_status, token);
       if(!result.ok) {
      console.log(result.message);
      console.log('the result was not oke')
    }
    
    if (result.ok) {
      console.log('The result was good')
        success = true;
    }
    } catch (error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }
   });

  it('Gets an error with invalid JWT', async () => {
  try{
       const result = await writeProvider.updateGLAccountStatus(2038, active_status, '1234');
       if(!result.ok) {
      console.log(result.message);
      console.log('the result was not oke')
    }
    
    if (result.ok) {
      console.log('The result was good')
      success = true;
    }
    } catch (error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }
   });

  it('Gets a not okay response when the ID is not correct', async () => {
  try{
       const result = await writeProvider.updateGLAccountStatus(20381, active_status, token);
       if(!result.ok) {
      console.log(result.message);
      console.log('the result was not oke')
      expect(result.message).toBe('No GL Account Codes with the given key')
    }
    
    if (result.ok) {
      console.log('The result was good')
      success = true;
    }
    } catch (error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }
   });
});

describe('UpdateUserProfile', () => {
  let token: string
  let success = false;
  const active_status = false;
  const rachel_green_id = '13e69340-d14c-45a9-96a8-142795925487';
  const rachel_green_id_invalid = '13e69340-d14c-45a9-96a8-142795925488';

  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'support@afepartners.com',
      password: 'Ilovemy3boys!'
    })
    token = data.session?.access_token ?? ''
  })

  afterEach(async () => {
  if (success) {
    await writeProvider.updateUserRecord(rachel_green_id, !active_status, token);
  }
  })

  it('It failes to update the user profile', async () => {
    
    try{
       const result = await writeProvider.updateUserRecord(rachel_green_id, active_status, '1234');
       if(!result.ok) {
      console.log(result.message);
      console.log('the result was not oke')
    }
    
    if (result.ok) {
      console.log('The result was good')
        success = true;
    }
    } catch (error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }
  });

  it('It fails to find the right user profile', async () => {
    
    try{
       const result = await writeProvider.updateUserRecord(rachel_green_id_invalid, active_status, token);
       if(!result.ok) {
      console.log(result.message);
    }
    
    if (result.ok) {
        success = true;
    }
    } catch (error) {
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }

  });

  it('RLS Issue', async () => {
    
    try{
       const result = await writeProvider.updateUserRecord(rachel_green_id, active_status, token);
       if(!result.ok) {
      console.log(result.message);
    }
    
    if (result.ok) {
        success = true;
    }
    } catch (error) {
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }

  });
});

describe('insertOperatorPartnerList', () => {
  let token: string
  let success = false;
  const active_status = false;
  const rachel_green_id = '13e69340-d14c-45a9-96a8-142795925487';
  const rachel_green_id_invalid = '13e69340-d14c-45a9-96a8-142795925488';
  let createdId: string = ''
  let createdIdNumber = 0
  const table_name: string = 'AFE_PARTNERS_EXECUTE'

  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'support@afepartners.com',
      password: 'Ilovemy3boys!'
    })
    token = data.session?.access_token ?? ''
  })

  afterEach(async () => {
  if (createdId !== '' || createdIdNumber !== 0) {
    await writeProvider.deletTestRecords(table_name, createdIdNumber, createdId, token)
    createdId = ''
    createdIdNumber = 0
  }
  })

  it('It failes to insert the partner records without JWT', async () => {
    
    try{
       const result = await writeProvider.insertOperatorPartnerList(partnerListToUpload, '1234');
       if(!result.ok) {
      console.log(result.message);
      console.log('the result was not oke')
    }
    
    if (result.ok) {
      console.log('The result was good')
        success = true;
    }
    } catch (error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }
  });

  it('RLS Issue to insert partners', async () => {
    
    try{
       const result = await writeProvider.insertOperatorPartnerList(partnerListToUpload, token);
       if(!result.ok) {
      console.log(result.message);
    }
    
    if (result.ok) {
        success = true;
    }
    } catch (error) {
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }

  });
});

describe('insertPartnerMapping', () => {
  let token: string
  let success = false;
  const active_status = false;
  const rachel_green_id = '13e69340-d14c-45a9-96a8-142795925487';
  const rachel_green_id_invalid = '13e69340-d14c-45a9-96a8-142795925488';
  let createdId: string = ''
  let createdIdNumber = 0
  const table_name: string = 'AFE_PARTNERS_EXECUTE'

  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'support@afepartners.com',
      password: 'Ilovemy3boys!'
    })
    token = data.session?.access_token ?? ''
  })

  afterEach(async () => {
  if (createdId !== '' || createdIdNumber !== 0) {
    await writeProvider.deletTestRecords(table_name, createdIdNumber, createdId, token)
    createdId = ''
    createdIdNumber = 0
  }
  })

  it('It fails to insert the partner mapping records without JWT', async () => {
    
    try{
       const result = await writeProvider.insertPartnerMapping(mappedPartnerRecord, '1234');
       if(!result.ok) {
      console.log(result.message);
      console.log('the result was not ok')
    }
    
    if (result.ok) {
      console.log('The result was good')
        success = true;
    }
    } catch (error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }
  });

  it('RLS Issue to insert partner mapping', async () => {
    
    try{
       const result = await writeProvider.insertPartnerMapping(mappedPartnerRecord, token);
       if(!result.ok) {
      console.log(result.message);
    }
    
    if (result.ok) {
        success = true;
    }
    } catch (error) {
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }

  });
});

describe('insertNonOp', () => {
  let token: string
  let success = false;
  const active_status = false;
  const rachel_green_id = '13e69340-d14c-45a9-96a8-142795925487';
  const rachel_green_id_invalid = '13e69340-d14c-45a9-96a8-142795925488';
  let createdId: string = ''
  let createdIdNumber = 0
  const table_name: string = 'AFE_PARTNERS_EXECUTE'
  const mockParentCompanyAddress: AddressType = {
        id:0,
        street: '1234 Main St',
        suite: '900',
        city: 'Littleton',
        state: 'CO',
        zip: '80127',
        country: 'United States',
        address_active: true,
    }

  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'support@afepartners.com',
      password: 'Ilovemy3boys!'
    })
    token = data.session?.access_token ?? ''
  })

  afterEach(async () => {
  if (createdId !== '' || createdIdNumber !== 0) {
    await writeProvider.deletTestRecords(table_name, createdIdNumber, createdId, token)
    createdId = ''
    createdIdNumber = 0
  }
  })

  it('It fails to insert the non op without JWT', async () => {
    
    try{
       const result = await writeProvider.insertNonOp('Test Record 3',rachel_green_id,mockParentCompanyAddress, '1234');
       if(!result.ok) {
      console.log(result.message);
      console.log('the result was not ok')
    }
    
    if (result.ok) {
      console.log('The result was good')
        success = true;
    }
    } catch (error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }
  });

  it('RLS Issue to insert partner mapping', async () => {
    
    try{
       const result = await writeProvider.insertNonOp('Test Record 3','a4367e56-14bf-4bd1-b0f1-fecc7d97b58c',mockParentCompanyAddress, token);
       if(!result.ok) {
      console.log(result.message);
    }
    
    if (result.ok) {
        success = true;
    }
    } catch (error) {
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }

  });
});