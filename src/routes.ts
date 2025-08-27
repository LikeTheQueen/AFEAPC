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
    route("/mainScreen/afeArchived", "./routes/afeArchived.tsx"),
    route("/mainScreen/configurations", "./routes/configurations.tsx",[
        //route("/mainScreen/configurations/systemConfigurations", "./routes/systemConfigurations.tsx"),
        //route("/mainScreen/configurations/dataexport", "./routes/dataExport.tsx"),
        //route("/mainScreen/configurations/gllibrary", "./routes/glLibrary.tsx"),
        //route("/mainScreen/configurations/partnerlibrary", "./routes/partnerLibrary.tsx"),
        route("/mainScreen/configurations/partnermapping", "./routes/partnerConfigurations/routes/partnerMapping.tsx"),
        route("/mainScreen/configurations/partnerupload", "./routes/partnerConfigurations/routes/partnerFileUpload.tsx"),
    ]),
    route("/mainScreen/profile", "./routes/userProfile/routes/profile.tsx"),
    route("/mainScreen/afeDetail/:afeID", "./routes/afeDetail.tsx"),
    route("/mainScreen/supporthistory", "./routes/supportHistory.tsx"),
    route("/mainScreen/managePermissions", "./routes/createEditUsers/routes/editUserDashboard.tsx"),
    route("/mainScreen/manageUsers", "./routes/createEditUsers/routes/manageUserDashboard.tsx"),
    route("/mainScreen/createOperator", "./routes/createEditOperators/routes/createOperator.tsx"),
    route("/mainScreen/createUser", "./routes/createEditUsers/routes/createNewUser.tsx"),
    route("/mainScreen/notifications", "./routes/notifications.tsx"),]),
    route("/contactsupport", "./routes/contactSupport.tsx"),
    route("/missingAFEsupport", "./routes/missingAFEsupport.tsx"),
    
    
    
    //route("/mainScreen/createOperator", "./routes/createOperator.tsx"),
    route("/dashboard", "./routes/dashboard.tsx"),
    
])
] satisfies RouteConfig;
