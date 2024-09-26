import Sidebar from "./_components/sidebar";
const DashnoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full"> 
    {/* flex col here make me in no need t ow-full in sidebar component  */}
      <div className="hidden md:flex h-full w-56 fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 h-full">{children}</main>
    </div>
  );
};

export default DashnoardLayout;
