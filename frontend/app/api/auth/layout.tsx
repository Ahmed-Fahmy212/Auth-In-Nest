import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <main className="p-6 max-w-5xl mx-auto h-full flex justify-center items-center overflow-hidden border rounded">
        {children}
      </main>
    </div>
  );
};

export default Layout;
