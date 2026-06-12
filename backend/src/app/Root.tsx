import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  SidebarNavigation,
  SidebarButton,
  SecondaryNav,
  SecondaryNavItem,
  Avatar,
  ThemeProvider,
} from "@figma/astraui";
import {
  Home,
  Settings,
  BookOpen,
  Users,
  FileText,
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
  UserCog,
} from "lucide-react";
import { clearStoredAuth, getStoredToken } from "./auth";
import { API_BASE_URL } from "../config/api.config";

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  exact?: boolean;
  permission?: string;
}

// Define navigation items with their required permissions
const allNavItems: NavItem[] = [
  { path: "/", icon: Home, label: "Dashboard", exact: true },
  // Existing modules
  { path: "/service-management", icon: Layers, label: "Services", permission: "services.manage" },
  { path: "/blog", icon: BookOpen, label: "Blog", permission: "blog.manage" },
  { path: "/customers", icon: Users, label: "Customers" },
  { path: "/invoicing", icon: FileText, label: "Invoicing" },
  { path: "/content", icon: Layout, label: "Content", permission: "content.manage" },
  // Phase 3 — New modules
  { path: "/tools", icon: Package, label: "Tools", permission: "tools.manage" },
  { path: "/industries", icon: Building2, label: "Industries", permission: "industries.manage" },
  { path: "/entities", icon: Layers, label: "CRM / Platforms" },
  { path: "/cross-references", icon: Link2, label: "Cross-References" },
  { path: "/solutions", icon: Lightbulb, label: "Solutions", permission: "solutions.manage" },
  { path: "/comparisons", icon: BarChart2, label: "Comparisons", permission: "solutions.manage" },
  { path: "/case-studies", icon: Trophy, label: "Case Studies", permission: "case_studies.manage" },
  { path: "/ai-content", icon: Sparkles, label: "AI Content", permission: "ai.use" },
  { path: "/navigation", icon: Navigation, label: "Navigation" },
  { path: "/seo", icon: Search, label: "SEO Manager" },
  // System modules (admin only)
  { path: "/sitemap", icon: Map, label: "Sitemap" },
  { path: "/policies", icon: ShieldCheck, label: "G. Policies" },
  { path: "/settings", icon: Settings, label: "Settings", permission: "settings.manage" },
];

interface UserInfo {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  role: string;
  permissions: string[];
}

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCompactNav, setIsCompactNav] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  function isActive(path: string, exact?: boolean) {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  }

  // Filter nav items based on user permissions
  function getFilteredNavItems(): NavItem[] {
    if (!userInfo) return [];
    
    // Admins see everything
    if (userInfo.is_admin) {
      return allNavItems;
    }
    
    // Filter by permissions
    return allNavItems.filter(item => {
      // No permission required = visible to all authenticated users
      if (!item.permission) return true;
      // Check if user has the permission
      return userInfo.permissions.includes(item.permission);
    });
  }

  useEffect(() => {
    async function checkAuth() {
      if (location.pathname === "/login") {
        setIsAuthLoading(false);
        return;
      }

      const token = getStoredToken();
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          headers,
          credentials: "include",
        });
        if (!response.ok) {
          clearStoredAuth();
          navigate("/login", { replace: true });
          return;
        }
        
        const data = await response.json();
        if (data.success && data.data?.user) {
          setUserInfo(data.data.user);
        }
      } catch {
        clearStoredAuth();
        navigate("/login", { replace: true });
        return;
      }
      setIsAuthLoading(false);
    }

    void checkAuth();
  }, [location.pathname, navigate]);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }
    setIsLoggingOut(true);
    const token = getStoredToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers,
        credentials: "include",
      });
    } finally {
      clearStoredAuth();
      document.cookie = "XSRF-TOKEN=; Max-Age=0; path=/";
      document.cookie = "laravel_session=; Max-Age=0; path=/";
      navigate("/login", { replace: true });
      setIsLoggingOut(false);
    }
  }

  if (isAuthLoading) {
    return (
      <ThemeProvider>
        <div className="h-screen w-full flex items-center justify-center bg-brand-tertiary">
          <p className="text-label text-text-secondary">Checking authentication...</p>
        </div>
      </ThemeProvider>
    );
  }

  const filteredNavItems = getFilteredNavItems();
  const initials = userInfo?.name 
    ? userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'WN';
  const userRole = userInfo?.is_admin ? 'Admin' : (userInfo?.role || 'User');

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden">
        {isCompactNav ? (
          <SidebarNavigation
            footer={
              <>
                <SidebarButton icon={<LogOut className="size-full" strokeWidth={1.5} />} onClick={handleLogout} />
                <div className="flex flex-col items-center gap-xs">
                  <Avatar type="initial" initials={initials} size="medium" shape="circle" />
                  <span className="text-label-xs text-text-secondary">{userRole}</span>
                </div>
              </>
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
        ) : (
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
            <SecondaryNavItem icon={<LogOut className="size-full" strokeWidth={1.5} />} label={isLoggingOut ? "Logging out..." : "Logout"} onClick={handleLogout} />
            <div className="mt-auto pt-md px-md border-t border-border-primary">
              <div className="flex items-center gap-sm">
                <Avatar type="initial" initials={initials} size="small" shape="circle" />
                <div className="flex flex-col">
                  <span className="text-label-sm text-text-primary truncate max-w-[120px]">{userInfo?.name || 'User'}</span>
                  <span className="text-label-xs text-text-secondary">{userRole}</span>
                </div>
              </div>
            </div>
          </SecondaryNav>
        )}

        <main className="flex-1 bg-brand-tertiary overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}
