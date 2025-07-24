import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, signOut } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-background border-b z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/29063f06-8447-4719-96af-dddba4e78f67.png" 
                alt="AvtoMed Logo" 
                className="h-8 w-auto"
              />
              <span className="font-bold text-primary">AvtoMed Admin</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {user?.user_metadata?.full_name || user?.email}
            </span>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Back to Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 pt-14 p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};