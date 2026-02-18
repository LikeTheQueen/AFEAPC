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
    layout("./routes/loggedInUserSupabase.tsx", [
        route("/mainscreen", "./routes/mainScreen.tsx", [
            route("afe", "./routes/afeDashboard/routes/afe.tsx"),
            route("afeArchived", "./routes/afeDashboard/routes/afeHistoricals.tsx"),
            route("afeDetail/:afeID", "./routes/afeDashboard/routes/afeDetail.tsx"),
            route("configurations", "./routes/parentPages/routes/configurations.tsx", [
                route("systemConfigurations", "./routes/systemConfigurations.tsx"),
                route("glmapping", "./routes/glConfigurations/routes/glMapping.tsx"),
                route("glmappingview", "./routes/glConfigurations/routes/glMappingView.tsx"),
                route("glfileupload", "./routes/glConfigurations/routes/glFileUpload.tsx"),
                route("glcodesview", "./routes/libraries/routes/glLibrary.tsx"),
                route("partnermapping", "./routes/partnerConfigurations/routes/partnerMapping.tsx"),
                route("partnermappingview", "./routes/partnerConfigurations/routes/partnerMappingView.tsx"),
                route("partnerupload", "./routes/partnerConfigurations/routes/partnerFileUpload.tsx"),
                route("partnersview", "./routes/libraries/routes/partnerLibrary.tsx"),
            ]),
            route("missingAFEsupport", "./routes/missingAFEsupport.tsx"),
            route("systemhistory", "./routes/support/routes/systemHistory.tsx"),
            route("contactsupport", "./routes/contactSupport.tsx"),
            route("supporthistory", "./routes/support/routes/supportHistory.tsx"),

            route("profile", "./routes/userProfile/routes/profile.tsx"),

            route("manageUsers", "./routes/createEditUsers/routes/manageUserDashboard.tsx"),
            route("managePermissions", "./routes/createEditUsers/routes/manageUserPermissions.tsx"),
            route("editOperator", "./routes/createEditOperators/routes/manageOperatorAndPartner.tsx"),
            route("createOperator", "./routes/createEditOperators/routes/createOperator.tsx"),
            route("createUser", "./routes/createEditUsers/routes/createNewUser.tsx"),
            route("manageUsersSystem", "./routes/createEditUsers/routes/manageUsersSystem.tsx"),
            route("manageUserPermissionsSystem", "./routes/createEditUsers/routes/manageUserPermissionsSystem.tsx"),
            
            route("notifications", "./routes/notifications.tsx"),
            
            
        ]),
    ])
] satisfies RouteConfig;