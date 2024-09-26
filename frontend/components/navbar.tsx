import MobileMenu from "@/app/(dashboard)/_components/mobile-menu";

const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-md">
      <MobileMenu />
    </div>
  );
};

export default Navbar;
