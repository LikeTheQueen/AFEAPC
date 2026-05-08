import "../../style.css";
import { Outlet } from "react-router";
import Footer from "./footer";
import NavHeader from "./navHeader";
import { useLocation } from "react-router";

export default function PublicLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-full bg-[var(--darkest-teal)] border-[var(--darkest-teal)]">
      <NavHeader />
      <Outlet />
      {pathname !== '/login' && <Footer />}
    </div>
  );
}