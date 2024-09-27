import SidebarRoutes from "./sidebar-routes";
import Logo from "./logo";

const Sidebar = () => {
  return (
    <div className="flex flex-col overflow-auto shadow-md  bg-white h-full w-full">
      {/* this logo for mobile menu */}
      <div className="md:hidden py-[20px] flex justify-center "> <Logo /></div>
      <div className="flex flex-col "><SidebarRoutes/></div>
    </div>
  );
};

export default Sidebar;
