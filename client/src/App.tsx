import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import Login from "@/pages/auth/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import Contacts from "@/pages/crm/Contacts";
import Board from "@/pages/projects/Board";
import ClientDashboard from "@/pages/portal/ClientDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/login" />} />
      <Route path="/login" component={Login} />
      
      {/* Admin Routes */}
      <ProtectedRoute path="/admin" component={AdminDashboard} roles={["admin", "manager"]} />
      <ProtectedRoute path="/crm" component={Contacts} roles={["admin", "manager"]} />
      <ProtectedRoute path="/projects" component={Board} roles={["admin", "manager"]} />
      
      {/* Client Routes */}
      <ProtectedRoute path="/portal" component={ClientDashboard} roles={["client"]} />
      <ProtectedRoute path="/portal/projects" component={ClientDashboard} roles={["client"]} />
      <ProtectedRoute path="/portal/invoices" component={ClientDashboard} roles={["client"]} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;