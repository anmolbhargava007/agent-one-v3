
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import AgentOneLogo from "../ui/AgentOneLogo";
import ThemeSwitcher from "./ThemeSwitcher";

export const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Simulate a page load
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <AgentOneLogo size={60} />
          <h1 className="mt-4 text-2xl font-bold">Loading AgentOne</h1>
          <div className="flex gap-2 mt-4 justify-center">
            <div className="animate-pulse bg-primary/30 w-3 h-3 rounded-full"></div>
            <div className="animate-pulse bg-primary/50 w-3 h-3 rounded-full animation-delay-200"></div>
            <div className="animate-pulse bg-primary/70 w-3 h-3 rounded-full animation-delay-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
      <main className={cn(
        "flex-1 min-h-screen max-w-full", 
        isMobile ? "p-4 pt-16" : "p-6"
      )}>
        {isPageLoading ? <LoadingContent /> : <Outlet />}
      </main>
    </div>
  );
};

const LoadingContent = () => {
  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-20" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      
      <Skeleton className="h-80 w-full" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    </div>
  );
};
