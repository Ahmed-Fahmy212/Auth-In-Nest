import Logo from "@/app/(dashboard)/_components/logo";

import MobileMenu from "@/app/(dashboard)/_components/mobile-menu";
import { NavbarRoutes } from "@/components/navbar-routes";
import  SignInButton  from "../../../components/signsButtons";

const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      {/* 1- add logo ----- 2- add items to login  */}
      <div className="hidden md:flex">
          <Logo />
      </div>
          <NavbarRoutes />
          <SignInButton />
      <MobileMenu />
    </div>
  );
};

export default Navbar;
