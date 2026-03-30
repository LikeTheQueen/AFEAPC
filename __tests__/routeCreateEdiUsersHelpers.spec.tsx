import { filterOperatorRolePermissions, filterPartnerRolePermissions, checkedByRole, getRoleIndex } from 'src/routes/createEditUsers/routes/helpers/helpers';
import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import { loggedInUserIsSuperUser } from './test-utils/afeRecords';

import { loggedInUserRachelGreenWithUserId, limitedPermissionList, userListActiveOrInactive, updatedPermissions, updatedNonPermissions } from './test-utils/rachelGreenuser';
import * as createEditUserHelpers from '__tests__/test-utils/routeCreateEditUsersHelpersVariables';

describe('Should return the correct permissions for filtering Operated vs Non Operated permissions',() => {
     test('It should filter out the list of Operated Permissions', async () => {
        const operatedPermissions = filterOperatorRolePermissions(createEditUserHelpers.roleEntryWriteVariable, loggedInUserRachelGreenWithUserId.user_id!);
        const nonOperatedPermissions = filterPartnerRolePermissions(createEditUserHelpers.roleEntryWriteVariable, loggedInUserRachelGreenWithUserId.user_id!);

        expect(operatedPermissions).toEqual(createEditUserHelpers.expectedOpPermissions);
        expect(nonOperatedPermissions).toEqual(createEditUserHelpers.expectedNonOpPermissions);

     });

});

describe('It should return the active roles correctly',() => {
    test('Return Rachel Green active roles', async () => {
        const rachelGreenAllAActivePermissions = checkedByRole(createEditUserHelpers.rachelGreenAllRolesActive, 4);
        const reachGreenInactiveRole4 = checkedByRole(createEditUserHelpers.rachelGreenRole4Inactive, 4);

        expect(rachelGreenAllAActivePermissions).toBe(true);
        expect(reachGreenInactiveRole4).toBe(false);

    })
});

describe('Return Role Index',() => {
    test('It should return the correct role id', async () => {
        const rachelRole4 = getRoleIndex(createEditUserHelpers.rachelGreenAllRolesActive, 4, createEditUserHelpers.apc_op_id_CW,66,loggedInUserRachelGreenWithUserId.user_id!);
        expect(rachelRole4).toBe(122);
    });
    test('It should return undefined for a role that does not exist', async () => {
        const rachelRole4 = getRoleIndex(createEditUserHelpers.rachelGreenRole4Missing, 4, createEditUserHelpers.apc_op_id_CW,66,loggedInUserRachelGreenWithUserId.user_id!);
        expect(rachelRole4).toBe(undefined);
    });
})