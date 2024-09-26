"use client";

import { Layout, Compass } from "lucide-react";
import SidebarItem from "./sidebar-item";
const SidebarRoutes = () => {
  const routes = [
    { label: "Dashboard", href: "/", icon: Layout },
    { label: "Browse", href: "/search", icon: Compass },
  ];
  return (
    <div className="flex flex-col">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
export default SidebarRoutes;
