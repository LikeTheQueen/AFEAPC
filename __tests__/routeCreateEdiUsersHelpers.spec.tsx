import { filterOperatorRolePermissions, filterPartnerRolePermissions, checkedByRole, getRoleIndex } from 'src/routes/createEditUsers/routes/helpers/helpers';

import { RachelGreen_AllPermissions_CW_NonOpCW } from '__tests__/test-utils/afeRecords';import * as createEditUserHelpers from '__tests__/test-utils/routeCreateEditUsersHelpersVariables';

describe('Should return the correct permissions for filtering Operated vs Non Operated permissions',() => {
     test('It should filter out the list of Operated Permissions', async () => {
        const operatedPermissions = filterOperatorRolePermissions(createEditUserHelpers.roleEntryWriteVariable, RachelGreen_AllPermissions_CW_NonOpCW.user_id!);
        const nonOperatedPermissions = filterPartnerRolePermissions(createEditUserHelpers.roleEntryWriteVariable, RachelGreen_AllPermissions_CW_NonOpCW.user_id!);

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
        const rachelRole4 = getRoleIndex(createEditUserHelpers.rachelGreenAllRolesActive, 4, createEditUserHelpers.apc_op_id_CW,66,RachelGreen_AllPermissions_CW_NonOpCW.user_id!);
        expect(rachelRole4).toBe(122);
    });
    test('It should return undefined for a role that does not exist', async () => {
        const rachelRole4 = getRoleIndex(createEditUserHelpers.rachelGreenRole4Missing, 4, createEditUserHelpers.apc_op_id_CW,66,RachelGreen_AllPermissions_CW_NonOpCW.user_id!);
        expect(rachelRole4).toBe(undefined);
    });
})