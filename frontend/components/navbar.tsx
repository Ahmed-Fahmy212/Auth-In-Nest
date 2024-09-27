import MobileMenu from "@/app/(dashboard)/_components/mobile-menu";

const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      {/* 1- add logo ----- 2- add items to login  */}
      
      <MobileMenu />
    </div>
  );
};

export default Navbar;
