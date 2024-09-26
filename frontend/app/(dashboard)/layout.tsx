import Navbar from "@/components/navbar";
import Sidebar from "./_components/sidebar";
const DashnoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-80 md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      <main className="md:pl-56 h-full">{children}</main>
    </div>
  );
};

export default DashnoardLayout;
