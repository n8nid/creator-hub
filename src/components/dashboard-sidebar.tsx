import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Workflow, Star } from "lucide-react";

interface DashboardSidebarProps {
  isCollapsed?: boolean;
}

export function DashboardSidebar({ isCollapsed = false }: DashboardSidebarProps) {
  const pathname = usePathname();
  const menu = [
    {
      label: "Profil Saya",
      href: "/dashboard-profile/profile",
      icon: <User className="w-5 h-5" />,
    },
    {
      label: "Workflow Saya",
      href: "/dashboard-profile/workflows",
      icon: <Workflow className="w-5 h-5" />,
    },
    {
      label: "Creator Saya",
      href: "/dashboard-profile/creator",
      icon: <Star className="w-5 h-5" />,
    },
  ];
  return (
    <nav className={`
      flex flex-col gap-2 p-4 border-r bg-white min-h-screen transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-56'}
    `}>
      {menu.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-base
            ${isCollapsed ? 'justify-center' : ''}
            ${pathname === item.href
              ? "bg-gray-100 text-gray-700"
              : "text-gray-700 hover:bg-gray-100"
            }
          `}

        >
          {item.icon}
          {!isCollapsed && <span>{item.label}</span>}
        </Link>
      ))}
    </nav>
  );
}
