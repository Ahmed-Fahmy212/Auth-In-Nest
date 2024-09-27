import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}
const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClicky = () => {
    router.push(href);
  };
  return (
    <button
      onClick={onClicky}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500px] pl-6 transition-all duration-200 hover:text-slate-600 hover:bg-slate-300/20 ",
        isActive && "text-slate-800 bg-sky-800/10  hover:text-slate-800 hover:bg-sky-800/10 transition-all"
      )}
    >
      <div className="flex items-center gap-x-2 py-4 ">
        <Icon
          size={20}
          className={cn("text-slate-500 ", isActive && "text-slate-800")}
        />
      </div>

      {label}

      <div
        className={cn(
          "ml-auto opacity-0 border-2 h-full transition-all",
          isActive && "opacity-1 border-sky-900"
        )}
      ></div>
    </button>
  );
};

export default SidebarItem;
