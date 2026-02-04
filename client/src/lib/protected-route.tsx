import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { ReactNode } from "react";

export function ProtectedRoute({ 
  path, 
  component: Component, 
  roles = [] 
}: { 
  path: string; 
  component: React.ComponentType<any>; 
  roles?: ("admin" | "manager" | "client")[];
}) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {(params) => {
        if (isLoading) {
          return (
            <div className="flex h-screen items-center justify-center bg-background">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }

        if (!user) {
          return <Redirect to="/login" />;
        }

        if (roles.length > 0 && !roles.includes(user.role)) {
          // If a client tries to access admin, send them to portal
          if (user.role === "client") return <Redirect to="/portal" />;
          // If admin tries to access generic, that's usually fine, but strict role check:
          return <Redirect to="/login" />;
        }

        return <Component {...params} />;
      }}
    </Route>
  );
}