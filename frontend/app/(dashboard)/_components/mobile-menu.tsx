import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";
const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden hover:opacity-75 transition">
        <Menu />
        {/* size={24} */}
      </SheetTrigger>
      <SheetContent side={"left"} className="bg-white p-0 h-full">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
