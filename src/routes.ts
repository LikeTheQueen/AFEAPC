import { 
    type RouteConfig, 
    route,
    index,
    layout,
    prefix, 
    } from "@react-router/dev/routes";

    
export default [
    
    //route("*?", "./routes/catchall.tsx"),
    route("/afe", "./routes/afe.tsx"),
    route("/afeHistory", "./routes/afeHistory.tsx"),
    route("/configurations", "./routes/configurations.tsx",[
        route("/configurations/systemConfigurations", "./routes/systemConfigurations.tsx"),
        route("/configurations/dataexport", "./routes/dataExport.tsx"),
        route("/configurations/gllibrary", "./routes/glLibrary.tsx"),
        route("/configurations/partnerlibrary", "./routes/partnerLibrary.tsx"),
    ]),
    route("/contactsupport", "./routes/contactSupport.tsx"),
    route("/missingAFEsupport", "./routes/missingAFEsupport.tsx"),
    route("/notifications", "./routes/notifications.tsx"),
    route("/supporthistory", "./routes/supportHistory.tsx"),
    route("/home", "./routes/home.tsx"),
    route("/homeScreen", "./routes/homeScreen.tsx"),
    route("/dashboard", "./routes/dashboard.tsx"),
    route("/mainScreen", "./routes/mainScreen.tsx"),
] satisfies RouteConfig;
