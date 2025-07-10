import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Workflow, Star } from "lucide-react";

export function DashboardSidebar() {
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
    <nav className="flex flex-col gap-2 p-4 border-r bg-white min-h-screen w-56">
      {menu.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
            pathname === item.href
              ? "bg-blue-100 text-blue-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
