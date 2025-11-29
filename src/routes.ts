import { 
    type RouteConfig, 
    route,
    index,
    layout,
    prefix, 
    
    } from "@react-router/dev/routes";

    
export default [
    route("/", "./routes/landing.tsx"),
    route("/login", "./routes/userLogin/routes/login.tsx"),
    layout("./routes/loggedInUserSupabase.tsx",[
    route("/mainScreen", "./routes/mainScreen.tsx", [
    route("/mainScreen/afe", "./routes/afeDashboard/routes/afe.tsx"),
    route("/mainScreen/afeArchived", "./routes/afeDashboard/routes/afeHistoricals.tsx"),
    route("/mainScreen/configurations", "./routes/parentPages/routes/configurations.tsx",[
        route("/mainScreen/configurations/systemConfigurations", "./routes/systemConfigurations.tsx"),
        route("/mainScreen/configurations/glmapping", "./routes/glConfigurations/routes/glMapping.tsx"),
        route("/mainScreen/configurations/glmappingview", "./routes/glConfigurations/routes/glMappingView.tsx"),
        route("/mainScreen/configurations/glfileupload", "./routes/glConfigurations/routes/glFileUpload.tsx"),
        route("/mainScreen/configurations/glcodesview", "./routes/libraries/routes/glLibrary.tsx"),
        
        route("/mainScreen/configurations/partnermapping", "./routes/partnerConfigurations/routes/partnerMapping.tsx"),
        route("/mainScreen/configurations/partnermappingview", "./routes/partnerConfigurations/routes/partnerMappingView.tsx"),
        route("/mainScreen/configurations/partnerupload", "./routes/partnerConfigurations/routes/partnerFileUpload.tsx"),
        route("/mainScreen/configurations/partnersview", "./routes/libraries/routes/partnerLibrary.tsx"),
    ]),
    route("/mainScreen/profile", "./routes/userProfile/routes/profile.tsx"),
    route("/mainScreen/afeDetail/:afeID", "./routes/afeDashboard/routes/afeDetail.tsx"),
    route("/mainScreen/supporthistory", "./routes/support/routes/supportHistory.tsx"),
    route("/mainScreen/managePermissions", "./routes/createEditUsers/routes/manageUserPermissions.tsx"), 
    route("/mainScreen/manageUsers", "./routes/createEditUsers/routes/manageUserDashboard.tsx"),
    route("/mainScreen/manageUsersSystem", "./routes/createEditUsers/routes/manageUsersSystem.tsx"),
    route("/mainScreen/manageUserPermissionsSystem", "./routes/createEditUsers/routes/manageUserPermissionsSystem.tsx"),
    route("/mainScreen/createOperator", "./routes/createEditOperators/routes/createOperator.tsx"),
    route("/mainScreen/editOperator", "./routes/createEditOperators/routes/manageOperatorAndPartner.tsx"),
    route("/mainScreen/createUser", "./routes/createEditUsers/routes/createNewUser.tsx"),
    route("/mainScreen/notifications", "./routes/notifications.tsx"),
    route("/mainScreen/contactsupport", "./routes/contactSupport.tsx"),
    route("/mainScreen/missingAFEsupport", "./routes/missingAFEsupport.tsx"),]),
    
])
] satisfies RouteConfig;
