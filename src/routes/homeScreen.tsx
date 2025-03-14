import type { Route } from "./+types/homeScreen";
import { Welcome } from "../../app/welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!!!!!!!!!!!" },
  ];
}

export default function HomeScreen() {
  return <Welcome />;
}
