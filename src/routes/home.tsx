import type { Route } from "./+types/home";
import  MainScreen  from "./mainscreen";
import  AFE  from "./afeDashboard/routes/afe";
import { Outlet } from "react-router";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "AFE Partner Connections" },
    { name: "Seamlessly exchange AFEs", content: "Welcome to AFE Partner Connections" },
  ];
}

export default function Home() {
  return (
    <><h1>This is a parent</h1><Outlet /></>
  );
}
