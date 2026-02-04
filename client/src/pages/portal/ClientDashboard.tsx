import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Briefcase, FileText, CheckCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function ClientDashboard() {
  const { user } = useAuth();

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.getProjects(),
  });

  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => api.getInvoices(),
  });

  const { data: clientsData } = useQuery({
    queryKey: ["clients"],
    queryFn: () => api.getClients(),
  });

  const projects = projectsData?.projects || [];
  const invoices = invoicesData?.invoices || [];
  const clients = clientsData?.clients || [];

  const clientForUser = clients.find((c: any) => 
    c.email?.toLowerCase() === user?.email?.toLowerCase() ||
    c.contactPerson?.toLowerCase().includes(user?.name?.toLowerCase() || "")
  );

  const clientProjects = clientForUser 
    ? projects.filter((p: any) => p.clientId === clientForUser.id)
    : projects.slice(0, 3);
  
  const clientInvoices = clientForUser
    ? invoices.filter((i: any) => i.clientId === clientForUser.id)
    : invoices.slice(0, 3);

  const activeProjects = clientProjects.filter((p: any) => p.status === "in-progress").length;
  const pendingInvoices = clientInvoices.filter((i: any) => i.status === "pending").length;
  const completedProjects = clientProjects.filter((p: any) => p.status === "completed").length;

  const getClientName = (clientId: string) => {
    const client = clients.find((c: any) => c.id === clientId);
    return client?.name || "Client";
  };

  if (projectsLoading || invoicesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold font-heading tracking-tight" data-testid="text-portal-title">Client Portal</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name || "Client"}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard 
          title="Active Projects" 
          value={activeProjects} 
          icon={Briefcase}
          trend="neutral"
          trendValue="On Track"
        />
        <StatCard 
          title="Pending Invoices" 
          value={pendingInvoices} 
          icon={FileText}
          trend={pendingInvoices > 0 ? "down" : "neutral"}
          trendValue={`${pendingInvoices} Unpaid`}
        />
        <StatCard 
          title="Completed Projects" 
          value={completedProjects} 
          icon={CheckCircle}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {clientProjects.length > 0 ? (
                clientProjects.map((project: any) => (
                  <div key={project.id} className="space-y-2" data-testid={`project-item-${project.id}`}>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{project.title}</div>
                      <Badge variant="outline" className="capitalize">{project.status.replace("-", " ")}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Due: {format(new Date(project.dueDate), "MMM d, yyyy")}</span>
                      <span>{project.progress}% Complete</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div 
                        className="h-2 rounded-full bg-primary transition-all" 
                        style={{ width: `${project.progress}%` }} 
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No active projects</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientInvoices.length > 0 ? (
                clientInvoices.map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0" data-testid={`invoice-item-${invoice.id}`}>
                    <div>
                      <div className="font-medium">{invoice.invoiceNumber}</div>
                      <div className="text-xs text-muted-foreground">Due: {format(new Date(invoice.dueDate), "MMM d, yyyy")}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-bold">${parseFloat(invoice.amount || "0").toLocaleString()}</div>
                      <Badge 
                        variant={invoice.status === "paid" ? "default" : invoice.status === "overdue" ? "destructive" : "secondary"}
                        className="text-[10px] h-5 px-1.5"
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No recent invoices</div>
              )}
              {clientInvoices.length > 0 && (
                <Button className="w-full mt-4" variant="outline">View All Invoices</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}