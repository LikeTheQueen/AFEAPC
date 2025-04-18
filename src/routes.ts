import { 
    type RouteConfig, 
    route,
    index,
    layout,
    prefix, 
    
    } from "@react-router/dev/routes";

    
export default [
    
    //route("*?", "./routes/catchall.tsx"),
    route("/", "./routes/landing.tsx"),
    route("/login", "./routes/login.tsx"),
    layout("./routes/loggedInUserSupabase.tsx",[
    route("/mainScreen", "./routes/mainScreen.tsx", [
    route("/mainScreen/afe", "./routes/afe.tsx"),
    route("/mainScreen/afeHistory", "./routes/afeHistory.tsx"),
    route("/mainScreen/configurations", "./routes/configurations.tsx",[
        route("/mainScreen/configurations/systemConfigurations", "./routes/systemConfigurations.tsx"),
        route("/mainScreen/configurations/dataexport", "./routes/dataExport.tsx"),
        route("/mainScreen/configurations/gllibrary", "./routes/glLibrary.tsx"),
        route("/mainScreen/configurations/partnerlibrary", "./routes/partnerLibrary.tsx"),
    ]),
    route("/mainScreen/profile", "./routes/profile.tsx"),
    route("/mainScreen/afeDetail/:afeID", "./routes/afeDetail.tsx"),]),
    route("/contactsupport", "./routes/contactSupport.tsx"),
    route("/missingAFEsupport", "./routes/missingAFEsupport.tsx"),
    route("/notifications", "./routes/notifications.tsx"),
    route("/supporthistory", "./routes/supportHistory.tsx"),
    
    route("/homeScreen", "./routes/homeScreen.tsx"),
    route("/dashboard", "./routes/dashboard.tsx"),
    
])
] satisfies RouteConfig;
