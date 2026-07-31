import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  SidebarNavigation,
  SidebarButton,
  SecondaryNav,
  SecondaryNavItem,
  Avatar,
} from "@figma/astraui";
import {
  Home,
  Settings,
  BookOpen,
  Users,
  File,
  ReceiptText,
  Map,
  ShieldCheck,
  Layout,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Package,
  Building2,
  Link2,
  Lightbulb,
  BarChart2,
  Sparkles,
  Navigation,
  Search,
  Trophy,
  Gift,
} from "lucide-react";

import { Button } from "./blocks";

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  role: string;
  permissions: string[];
}

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  exact?: boolean;
  permission?: string;
}

const allNavItems: NavItem[] = [
  { path: "/", icon: Home, label: "Dashboard", exact: true },
  { path: "/service", icon: Layers, label: "Services", permission: "services.manage" },
  // { path: "/service-management", icon: Layers, label: "Service Management", permission: "services.manage" },
  { path: "/articles", icon: BookOpen, label: "Article", permission: "articles.manage" },
  { path: "/customers", icon: Users, label: "Customers" },
  { path: "/invoicing", icon: ReceiptText, label: "Invoicing" },
  { path: "/content", icon: Layout, label: "Content", permission: "content.manage" },
  { path: "/datahub", icon: Package, label: "DataHub", permission: "datahub.manage" },
  { path: "/single-page", icon: File, label: "Single Page Directory", permission: "single_page.manage" },
  { path: "/entities", icon: Layers, label: "CRM / Platforms" },
  { path: "/cross-references", icon: Link2, label: "Cross-References" },
  { path: "/ai-content", icon: Sparkles, label: "AI Content", permission: "ai.use" },
  { path: "/navigation", icon: Navigation, label: "Navigation" },
  { path: "/seo", icon: Search, label: "SEO Manager" },
  { path: "/sitemap", icon: Map, label: "Sitemap" },
  { path: "/policies", icon: ShieldCheck, label: "G. Policies" },
  { path: "/settings", icon: Settings, label: "Settings", permission: "settings.manage" },
];

interface SidebarProps {
  userInfo: UserInfo | null;
  isLoggingOut: boolean;
  handleLogout: () => void;
}

export function Sidebar({ userInfo, isLoggingOut, handleLogout }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCompactNav, setIsCompactNav] = useState(false);

  function isActive(path: string, exact?: boolean) {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  }

  function getFilteredNavItems(): NavItem[] {
    if (!userInfo) return [];
    if (userInfo.is_admin) {
      return allNavItems;
    }
    return allNavItems.filter(item => {
      if (!item.permission) return true;
      return userInfo.permissions.includes(item.permission);
    });
  }

  const filteredNavItems = getFilteredNavItems();
  const initials = userInfo?.name 
    ? userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'WN';
  const userRole = userInfo?.is_admin ? 'Admin' : (userInfo?.role || 'User');

  if (isCompactNav) {
    return (
      <SidebarNavigation
        footer={
          <div className="flex flex-col items-center gap-sm">
            <div className="flex flex-col items-center gap-xs">
              <Avatar type="initial" initials={initials} size="medium" shape="circle" />
              <span className="text-label-xs text-text-secondary">{userRole}</span>
            </div>
            <Button
              variant="danger"
              size="small"
              isLoading={isLoggingOut}
              onClick={handleLogout}
              iconStart={<LogOut size={14} />}
              className="p-1.5"
            />
          </div>
        }
      >
        <SidebarButton
          icon={<PanelLeftOpen className="size-full" strokeWidth={1.5} />}
          onClick={() => setIsCompactNav(false)}
        />
        {filteredNavItems.map((item) => (
          <SidebarButton
            key={item.path}
            icon={<item.icon className="size-full" strokeWidth={1.5} />}
            active={isActive(item.path, item.exact)}
            onClick={() => navigate(item.path)}
          />
        ))}
      </SidebarNavigation>
    );
  }

  return (
    <SecondaryNav className="h-screen overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth" title="WebNDevs CMS">
      <SecondaryNavItem icon={<PanelLeftClose className="size-full" strokeWidth={1.5} />} label="Collapse Menu" onClick={() => setIsCompactNav(true)} />
      {filteredNavItems.map((item) => (
        <SecondaryNavItem
          key={item.path}
          icon={<item.icon className="size-full" strokeWidth={1.5} />}
          label={item.label}
          active={isActive(item.path, item.exact)}
          onClick={() => navigate(item.path)}
        />
      ))}
      <div className="mt-auto pt-md pb-md px-md border-t border-border-primary flex flex-col gap-sm">
        <div className="flex items-center gap-sm">
          <Avatar type="initial" initials={initials} size="small" shape="circle" />
          <div className="flex flex-col">
            <span className="text-label-sm text-text-primary truncate max-w-[120px]">{userInfo?.name || 'User'}</span>
            <span className="text-label-xs text-text-secondary">{userRole}</span>
          </div>
        </div>
        <Button
          variant="danger"
          size="small"
          isLoading={isLoggingOut}
          onClick={handleLogout}
          iconStart={<LogOut size={14} />}
          className="w-full flex items-center justify-center gap-1.5 text-xs py-1"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </SecondaryNav>
  );
}
