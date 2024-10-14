import Logo from "@/app/(dashboard)/_components/logo";

import MobileMenu from "@/app/(dashboard)/_components/mobile-menu";
import { NavbarRoutes } from "@/components/navbar-routes";

const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex justify-between items-center bg-white shadow-sm">
      <div className="hidden md:flex">
          <Logo />
      </div>
          <MobileMenu />
          <NavbarRoutes />

    </div>
  );
};

export default Navbar;
