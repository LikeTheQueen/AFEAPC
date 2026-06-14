import * as writeProvider from "provider/write";
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import supabase from 'provider/supabase';
import type { AddressType, ParentCompanyWrite, PartnerRecordToUpdate, RoleEntryWrite } from "src/types/interfaces";

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
];

const accountcodesToUpload = [
    {
        "account_number": "303.201",
        "account_group": "1. DRILLING",
        "account_description": "LICENCE, FEES, TAXES, & PERMITS",
        "apc_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
    },
    {
        "account_number": "303.202",
        "account_group": "1. DRILLING",
        "account_description": "SURFACE LEASE ACQUISITION",
        "apc_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
    },
    {
        "account_number": "303.203",
        "account_group": "1. DRILLING",
        "account_description": "SURVEYING",
        "apc_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
    },
    {
        "account_number": "303.207",
        "account_group": "1. DRILLING",
        "account_description": "ROAD & SITE COSTS",
        "apc_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
    },
    {
        "account_number": "303.208",
        "account_group": "1. DRILLING",
        "account_description": "ROAD USE",
        "apc_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
    },
    {
        "account_number": "303.209",
        "account_group": "1. DRILLING",
        "account_description": "RIG MOVE IN / MOVE OUT",
        "apc_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
    },
    {
        "account_number": "303.21",
        "account_group": "1. DRILLING",
        "account_description": "CONDUCTOR & RATHOLE",
        "apc_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
    },
    {
        "account_number": "303.212",
        "account_group": "1. DRILLING",
        "account_description": "DRILLING RIG",
        "apc_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
    }
];

const opRolesWrite = [
    {
        "user_id": "13e69340-d14c-45a9-96a8-142795925487",
        "role": 8,
        "apc_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
        "apc_address_id": 66,
        "active": false,
        "id": 380
    },
    {
        "user_id": "13e69340-d14c-45a9-96a8-142795925487",
        "role": 4,
        "apc_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
        "apc_address_id": 66,
        "active": true,
        "id": null
    }
];



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
       console.log(result);
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

describe('insertGLAccount', () => {
  let token: string
  let success = false;
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

  it('It fails to insert the gl codes records without JWT', async () => {
    
    try{
       const result = await writeProvider.insertGLAccount(accountcodesToUpload, 'GL_CODES_OP','1234');
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

  it('RLS Issue to gl code mapping', async () => {
    
    try{
       const result = await writeProvider.insertGLAccount(accountcodesToUpload, 'GL_CODES_OP', token);
       console.log(result)
       if(!result.ok) {
      console.log(result.message);
    }
    
    if (result.ok) {
        success = true;
    }
    } catch (error) {
      console.log(error)
      const err = error as Error
      console.log(err)
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }

  });
});

describe('updatePartnerMap', () => {
  let token: string
  let success = false;
  const active_status = false;
  const crosswalk_id = 36;
  const crosswalk_id_invalid = 50;
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
    await writeProvider.updatePartnerMap(crosswalk_id, !active_status, token);
  }
  })

  it('It fails to update the partner mapping without a token', async () => {
    
    try{
       const result = await writeProvider.updatePartnerMap(crosswalk_id, active_status, '1234');
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

  it('It fails to find a relevant record', async () => {
    
    try{
       const result = await writeProvider.updatePartnerMap(crosswalk_id_invalid, active_status, token);
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
       const result = await writeProvider.updatePartnerMap(crosswalk_id, active_status, token);
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

describe('insertOrUpdatePermissions', () => {
  let token: string
  let success = false;
  const active_status = false;
  const crosswalk_id = 36;
  const crosswalk_id_invalid = 50;
  const rachel_green_id = '13e69340-d14c-45a9-96a8-142795925487';
  const rachel_green_id_invalid = '13e69340-d14c-45a9-96a8-142795925488';

  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'support@afepartners.com',
      password: 'Ilovemy3boys!'
    })
    token = data.session?.access_token ?? ''
  })

  

  it('It fails to update the permissions without a token', async () => {
    
    try{
       const result = await writeProvider.insertOrUpdatePermissions(opRolesWrite, 'OPERATOR_USER_PERMISSIONS', '1234');
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

  it('It should insert a record and update a record', async () => {
    
    try{
       const result = await writeProvider.insertOrUpdatePermissions(opRolesWrite, 'OPERATOR_USER_PERMISSIONS', token);
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
    const { data } = await supabase.auth.signInWithPassword({
          email: 'eandv38.51@gmail.com',
          //email: 'support@afepartners.com',
          password: 'Ilovemy3boys!'
        })
        token = data.session?.access_token ?? ''
    try{
       const result = await writeProvider.insertOrUpdatePermissions(opRolesWrite, 'OPERATOR_USER_PERMISSIONS', token);
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

describe('updatePartnerWithOpId', () => {
  let token: string
  let success = false;
  const active_status = false;
  const crosswalk_id = 36;
  const crosswalk_id_invalid = 50;
  const rachel_green_id = '13e69340-d14c-45a9-96a8-142795925487';
  const rachel_green_id_invalid = '13e69340-d14c-45a9-96a8-142795925488';
  const partnerRecUpdate: PartnerRecordToUpdate[] = [
    {
        "id": "9b463346-5759-4708-8008-071070fa3d4c",
        "apc_op_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
    }
]; 
  const partnerRecUpdateReset: PartnerRecordToUpdate[] = [
    {
        "id": "9b463346-5759-4708-8008-071070fa3d4c",
        "apc_op_id": null
    }
]; 

  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'support@afepartners.com',
      password: 'Ilovemy3boys!'
    })
    token = data.session?.access_token ?? ''
  })

  afterEach(async () => {
  if (success) {
    await writeProvider.updatePartnerWithOpId(partnerRecUpdateReset, token);
  }
  })
  

  it('It fails to update the partner apc_op_id without a token', async () => {
    
    try{
       const result = await writeProvider.updatePartnerWithOpId(partnerRecUpdate, '1234');
       if(!result.ok) {
      console.log(result.message);
      console.log('The result was not okay')
    }
    
    if (result.ok) {
      console.log('The result was successful')
        success = true;
    }
    } catch (error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }
  });

  it('It should update a record with partner apc_op_id', async () => {
    
    try{
       const result = await writeProvider.updatePartnerWithOpId(partnerRecUpdate, token);
       if(!result.ok) {
      console.log(result.message);
    }
    
    if (result.ok) {
      console.log('The result was successful')
        success = true;
    }
    } catch (error) {
      const err = error as Error
      const parsed = JSON.parse(err.message)
      expect(parsed.message).toBe('Invalid JWT')
    }

  });

  it('RLS Issue partner apc_op_id', async () => {
    const { data } = await supabase.auth.signInWithPassword({
          email: 'eandv38.51@gmail.com',
          //email: 'support@afepartners.com',
          password: 'Ilovemy3boys!'
        })
        token = data.session?.access_token ?? ''
    try{
       const result = await writeProvider.updatePartnerWithOpId(partnerRecUpdate, token);
       if(!result.ok) {
        console.log('The result was not okay')
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

describe('updateSupportTicketResolution', () => {
  let token: string
  let userId: string = '879287f3-acdf-4038-88bd-73e32ee48658'
  let createdIdNumber = 0
  const table_name: string = 'SUPPORT_HISTORY'
  let success = false;

  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'support@afepartners.com',
      password: 'Ilovemy3boys!'
    })
    token = data.session?.access_token ?? ''
  })

  afterEach(async () => {
  if (success) {
    await writeProvider.updateSupportTicketResolution(10, success, userId, '', token)
    success = false
  }
  })

  it('Successfulley resolves Support History', async () => {
    try{
      const result = await writeProvider.updateSupportTicketResolution(10, !success, userId, 'This is resolved', token);

      if (result.ok) {
      expect(result.data.id).toBeDefined()
      console.log(result)
      expect(result.data.created_by_email).toBe('elizabeth.rider.shaw@gmail.com')
      expect(result.data.subject).toBe('You can delte this')
      expect(result.data.resolution).toBe('This is resolved')
      success = true
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    
    } catch(error){
      console.log(error)
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally{
      console.log('This is a finally block')
    }
  });

  it('It returns an error with the incorrect token', async () => {
    try{
    const result = await writeProvider.updateSupportTicketResolution(10, !success, userId, 'This is resolved', '1234');
    
    if (result.ok) {
      expect(result.data.id).toBeDefined()
      console.log(result)
      expect(result.data.related_ticket.created_by_email).toBe('elizabeth.rider.shaw@gmail.com')
      createdIdNumber = result.data.id  // captured for cleanup
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    } catch(error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally {
      console.log('This is a finally block')
    }

  });

});

describe('updateExecuteFilterFields', () => {
  let token: string
  let filterId: string = 'ae43661c-a8b9-4ac6-9002-9136099c0b84'
  let apc_op_id = '1beb7989-c65e-4c71-b68c-1a01b5e5850b'
  const well_columnsOG = ["$ISPRIMARY","CUSTOM/WELL_NAME","$DESCRIPTION","$CUSTOM/WELL_NUM"]
  const well_columns = ["$ISPRIMARY","CUSTOM/WELL_NAMEISUPDATED","$DESCRIPTION","$CUSTOM/WELL_NUM"]
  const afe_filterOG = [{"Value":"No Status","Column":"$STATUS","Operator":"=","LeftParenthesis":"("},{"Join":"OR","Value":"Force approved by system administrator.","Column":"$NOTE","Operator":"CONTAINS","RightParenthesis":")"},{"Value":"FAPP","Column":"STATUS","Operator":"=","LeftParenthesis":"("},{"Join":"OR","Value":"IAPP","Column":"STATUS","Operator":"=","RightParenthesis":")"},{"Join":"AND","Value":"Operated","Column":"CUSTOM/OPERATOR_STATUS","Operator":"="},{"Join":"AND","Value":"100","Column":"OUR_WI","Operator":"<"},{"Join":"AND","Value":"401d09bc-655f-4272-a462-02921dcfbfcb","Column":"OPERATING_COMPANY","Operator":"="}]
  const afe_filter = [{"Value":"IAPP","Column":"$STATUS","Operator":"=","LeftParenthesis":"("},{"Join":"OR","Value":"Force approved by system administrator.","Column":"$NOTE","Operator":"CONTAINS","RightParenthesis":")"},{"Value":"FAPP","Column":"STATUS","Operator":"=","LeftParenthesis":"("},{"Join":"OR","Value":"IAPP","Column":"STATUS","Operator":"=","RightParenthesis":")"},{"Join":"AND","Value":"Operated","Column":"CUSTOM/OPERATOR_STATUS","Operator":"="},{"Join":"AND","Value":"100","Column":"OUR_WI","Operator":"<"},{"Join":"AND","Value":"401d09bc-655f-4272-a462-02921dcfbfcb","Column":"OPERATING_COMPANY","Operator":"="}]
  let createdIdNumber = 0
  const table_name: string = 'SUPPORT_HISTORY'
  let success = false;

  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'support@afepartners.com',
      password: 'Ilovemy3boys!'
    })
    token = data.session?.access_token ?? ''
  })

  afterEach(async () => {
  if (success) {
    await writeProvider.updateExecuteFilterFields(apc_op_id, well_columnsOG, afe_filterOG, token)
    success = false
  }
  })

  it('Successfulley updateExecuteFilterFields', async () => {
    try{
      const result = await writeProvider.updateExecuteFilterFields(apc_op_id, well_columns, afe_filter, token);

      if (result.ok) {
      console.log(result)
      expect(result.data.id).toBeDefined()
      
      expect(result.data.afe_filter).toStrictEqual(afe_filter)
      expect(result.data.well_columns).toStrictEqual(well_columns)
      expect(result.data.apc_op_id).toBe(apc_op_id)
      success = true
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    
    } catch(error){
      console.log(error)
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally{
      console.log('This is a finally block')
    }
  });

  it('It returns an error updateExecuteFilterFields with the incorrect token', async () => {
    try{
    const result = await writeProvider.updateExecuteFilterFields(apc_op_id, well_columns, afe_filter, '1234');
    
    if (result.ok) {
      expect(result.data.id).toBeDefined()
      console.log(result)
      expect(result.data.related_ticket.created_by_email).toBe('elizabeth.rider.shaw@gmail.com')
      createdIdNumber = result.data.id  // captured for cleanup
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    } catch(error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally {
      console.log('This is a finally block')
    }

  });

});

describe('insertAFEHistory', () => {
  let token: string
  let afeId: string = '18eb0a11-7dad-462a-ab8d-def810d3cf07'
  const afeIDWrong: string = '18eb0a11-7dad-462a-ab8d-def810d3cf88';
  const description: string = 'This comment can be deleted'
  const type: string = 'action'
  const purpose: string = 'to test if this works'
  let createdIdNumber = 0
  let createdId = ''
  const table_name: string = 'AFE_HISTORY'
  let success = false;

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

  it('Successfulley insertAFEHistory', async () => {
    try{
      const result = await writeProvider.insertAFEHistory(afeId, description, type, purpose, token);

      if (result.ok) {
        console.log(result)
      expect(result.data.id).toBeDefined()
      
      expect(result.data.description).toBe(description)
      expect(result.data.type).toBe(type)
      createdIdNumber = result.data.id
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    
    } catch(error){
      console.log(error)
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally{
      console.log('This is a finally block')
    }
  });

  it('Error insertAFEHistory', async () => {
    try{
      const result = await writeProvider.insertAFEHistory(afeIDWrong, description, type, purpose, token);

      if (result.ok) {
        console.log(result)
      expect(result.data.id).toBeDefined()
      
      expect(result.data.description).toBe(description)
      expect(result.data.type).toBe(type)
      createdIdNumber = result.data.id
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    
    } catch(error){
      console.log(error)
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally{
      console.log('This is a finally block')
    }
  });

  it('It returns an error with the incorrect token insertAFEHistory', async () => {
    try{
    const result = await writeProvider.insertAFEHistory(afeId, description, type, purpose, '1234');
    
    if (result.ok) {
      expect(result.data.id).toBeDefined()
      console.log(result)
      expect(result.data.description).toBe(description)
      expect(result.data.type).toBe(type)
      createdIdNumber = result.data.id
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    } catch(error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally {
      console.log('This is a finally block')
    }

  });

});

describe('createNewUserProfile', () => {
  let token: string
  let userId: string = '0519f4d8-d94f-4017-8f08-c693e1662e8f'
  const userIDWrong: string = '11b3c839-8be8-4de2-b61b-8a0f9f564477';
  const email: string = 'rider.va.cay@gmail.com'
  const type: string = 'action'
  const purpose: string = 'to test if this works'
  let createdIdNumber = 0
  let createdId = ''
  const table_name: string = 'USER_PROFILE'
  let success = false;

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

  it('Successfulley createNewUserProfile', async () => {
    try{
      const result = await writeProvider.createNewUserProfile(userId,'S','L',email,true, false, token, 'd975f19f-7efa-4956-92a2-25a78080b6be', false );

      if (result.ok) {
        console.log(result)
      createdId = result.data[0].id
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    
    } catch(error){
      console.log(error)
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally{
      console.log('This is a finally block')
    }
  });

  it('Error createNewUserProfile', async () => {
    try{
      const result = await writeProvider.createNewUserProfile(userId,'S','L',email,true, false, '12334', '', false );

      if (result.ok) {
        console.log(result)
      expect(result.data[0].id).toBeDefined()
      createdId = result.data[0].id
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    
    } catch(error){
      console.log(error)
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally{
      console.log('This is a finally block')
    }
  });

  it('It returns an error with the incorrect token createNewUserProfile', async () => {
    try{
    const result = await writeProvider.createNewUserProfile(userIDWrong,'S','L',email,true, false, token, '', false );
    
    if (result.ok) {
      
      console.log(result)
      createdId = result.data[0].id
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    } catch(error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally {
      console.log('This is a finally block')
    }

  });

});

describe('createUserRolesOperator', () => {
  let token: string
  let userId: string = '2bdd72e2-7064-46aa-91e5-6f8ed1dc8191'
  const userIDWrong: string = '11b3c839-8be8-4de2-b61b-8a0f9f564477';
  const email: string = 'rider.va.cay@gmail.com'
  const type: string = 'action'
  const purpose: string = 'to test if this works'
  let createdIdNumber = 0
  let createdId = ''
  const table_name: string = 'USER_PROFILE'
  let success = false;
  const roleToWrite:RoleEntryWrite[] = [
    {
      role: 2,
      active: false,
      user_id: userId,
      apc_id: '3b34a78a-13ad-40b5-aecd-268d56dd5e0d',
      apc_address_id: 66
    }
  ];
  const roleToWriteError:RoleEntryWrite[] = [
    {
      role: 2,
      active: false,
      user_id: userIDWrong,
      apc_id: '3b34a78a-13ad-40b5-aecd-268d56dd5e0d',
      apc_address_id: 66
    }
  ]

  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'elizabeth.rider.shaw@gmail.com',
      password: 'topSecretPassword25!'
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

  it('Successfulley createUserRolesOperator', async () => {
    try{
      const result = await writeProvider.createUserRolesOperator(roleToWrite, token );

      if (result.ok) {
        console.log(result)
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    
    } catch(error){
      console.log(error)
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally{
      console.log('This is a finally block')
    }
  });

  it('Error createUserRolesOperator', async () => {
    try{
      const result = await writeProvider.createUserRolesOperator(roleToWriteError, token );

      if (result.ok) {
        console.log(result)
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    
    } catch(error){
      console.log(error)
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally{
      console.log('This is a finally block')
    }
  });

  it('It returns an error with the incorrect token createUserRolesOperator', async () => {
    try{
    const result = await writeProvider.createUserRolesOperator(roleToWrite, '1234' );
    
    if (result.ok) {
      
      console.log(result)
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    } catch(error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally {
      console.log('This is a finally block')
    }

  });

});

describe('createUserRolesPartner', () => {
  let token: string
  let userId: string = '2bdd72e2-7064-46aa-91e5-6f8ed1dc8191'
  const userIDWrong: string = '11b3c839-8be8-4de2-b61b-8a0f9f564477';
  const email: string = 'rider.va.cay@gmail.com'
  const type: string = 'action'
  const purpose: string = 'to test if this works'
  let createdIdNumber = 0
  let createdId = ''
  const table_name: string = 'USER_PROFILE'
  let success = false;
  const roleToWrite:RoleEntryWrite[] = [
    {
      role: 3,
      active: false,
      user_id: userId,
      apc_id: '626390b5-6f63-4caa-a0aa-b333a15eaf59',
      apc_address_id: 7
    }
  ];
  const roleToWriteError:RoleEntryWrite[] = [
    {
      role: 3,
      active: false,
      user_id: userIDWrong,
      apc_id: '626390b5-6f63-4caa-a0aa-b333a15eaf59',
      apc_address_id: 7
    }
  ]

  beforeAll(async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'elizabeth.rider.shaw@gmail.com',
      password: 'topSecretPassword25!'
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

  it('Successfulley createUserRolesPartner', async () => {
    try{
      const result = await writeProvider.createUserRolesPartner(roleToWrite, token );

      if (result.ok) {
        console.log(result)
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    
    } catch(error){
      console.log(error)
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally{
      console.log('This is a finally block')
    }
  });

  it('Error createUserRolesPartner', async () => {
    try{
      const result = await writeProvider.createUserRolesPartner(roleToWriteError, token );

      if (result.ok) {
        console.log(result)
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    
    } catch(error){
      console.log(error)
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally{
      console.log('This is a finally block')
    }
  });

  it('It returns an error with the incorrect token createUserRolesPartner', async () => {
    try{
    const result = await writeProvider.createUserRolesPartner(roleToWrite, '1234' );
    
    if (result.ok) {
      
      console.log(result)
    }
    if(!result.ok) {
      console.log('The result was not okay', result.message)
    }
    } catch(error) {
      console.log('There was an error to catch')
      const err = error as Error
      const parsed = JSON.parse(err.message)
      console.log(parsed.message, 'the parsed error message')
    } finally {
      console.log('This is a finally block')
    }

  });

});