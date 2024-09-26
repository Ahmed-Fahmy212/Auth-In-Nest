import { SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sheet, Sidebar } from "lucide-react";

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden hover:opacity-75 transition">
        <Menu />
        {/* size={24} */}
      </SheetTrigger>
      <SheetContent side={"left"} className="bg-white w-56 h-full">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
