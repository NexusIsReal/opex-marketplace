"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  ShoppingBag, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { withAdminProtection } from "@/lib/adminAuthClient";

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Freelancers",
      href: "/admin/freelancers",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      name: "Applications",
      href: "/admin/applications",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Services",
      href: "/admin/services",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-gray-800 text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-800">
            <Link href="/admin/dashboard" className="flex items-center">
              <div className="bg-gradient-to-r from-[#9945FF] to-[#00a2ff] w-8 h-8 rounded-md mr-2"></div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9945FF] to-[#00a2ff]">
                OPEX Admin
              </span>
            </Link>
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-gradient-to-r from-[#9945FF]/20 to-[#00a2ff]/20 border border-[#9945FF]/30"
                    : "hover:bg-gray-800"
                )}
              >
                <span className={cn(
                  pathname === item.href 
                    ? "text-[#9945FF]" 
                    : "text-gray-400"
                )}>
                  {item.icon}
                </span>
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-800">
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/auth/login';
              }}
              className="flex items-center px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        "lg:ml-64" // Always push content on large screens
      )}>
        <main className="min-h-screen p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export default withAdminProtection(AdminLayout);
