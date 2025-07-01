
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Bot,
  Database,
  ShoppingBag,
  Network,
  Shield,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import logo from './../../../public/logo.png'
import logoWhite from './../../../public/logo-white.png'
import { useTheme } from '@/context/ThemeContext';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
  collapsed?: boolean;
}

const NavItem = ({ icon: Icon, label, to, active, collapsed }: NavItemProps) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 font-normal",
          active ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
        )}
      >
        <Icon size={20} />
        {!collapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
};

export const Sidebar = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const toggleMobileOpen = () => setMobileOpen(!mobileOpen);

  const navItems = [
    { icon: Home, label: "Dashboard", to: "/" },
    { icon: Bot, label: "Agents", to: "/agents" },
    { icon: Database, label: "Models & DBs", to: "/models" },
    { icon: Network, label: "Integrations", to: "/integrations" },
    { icon: Shield, label: "Guardrails", to: "/guardrails" },
    { icon: ShoppingBag, label: "Marketplace", to: "/marketplace" },
    { icon: BarChart3, label: "Analytics", to: "/analytics" },
    { icon: Users, label: "Users", to: "/users" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileOpen}
          className="fixed top-4 left-4 z-50"
        >
          <Menu size={24} />
        </Button>

        <div className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-40",
          mobileOpen ? "block" : "hidden"
        )}
          onClick={toggleMobileOpen}
        />

        <div className={cn(
          "fixed top-0 left-0 h-full bg-card shadow-lg z-50 transition-transform duration-300 w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                {/* <img src={logo} alt="logo" /> */}
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleMobileOpen}>
                <ChevronLeft size={20} />
              </Button>
            </div>

            <div className="space-y-1 flex-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  to={item.to}
                  active={location.pathname === item.to}
                  collapsed={false}
                />
              ))}
            </div>

            {user && (
              <>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={logout}>
                    Logout <LogOut size={18} className="text-muted-foreground" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4">
        <Link to="/" className="flex items-center gap-2">
          {collapsed ? (
            <h1 className="text-xl font-bold">A1</h1>
          ) : (
            <img src={theme === "dark" ? logoWhite : logo} alt="logo" />
          )}
        </Link>
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={location.pathname === item.to}
              collapsed={collapsed}
            />
          ))}
        </div>
      </div>

      {user && (
        <>
          <Separator className="my-2" />
          <div className={cn(
            "p-4 flex items-center",
            collapsed ? "justify-center" : "justify-between"
          )}>
            {collapsed ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-muted-foreground">{user.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut size={18} className="text-muted-foreground" />
                </Button>
              </>
            )}
          </div>
        </>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCollapsed}
        className="mx-auto mb-4"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </Button>
    </div>
  );
};
