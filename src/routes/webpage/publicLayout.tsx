import "../../style.css";
import { Outlet } from "react-router";
import NavMenu from "./navMenu";
import Footer from "./footer";

export default function PublicLayout() {
  return (
    <>
    <div className="min-h-full bg-[var(--darkest-teal)] border-[var(--darkest-teal)]">
      <NavMenu></NavMenu>
      <Outlet />
      <Footer></Footer>
      </div>
    </>
  )
}