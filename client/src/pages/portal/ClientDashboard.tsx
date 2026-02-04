import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProjects, mockInvoices } from "@/lib/mockData";
import { Briefcase, FileText, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ClientDashboard() {
  const activeProjects = mockProjects.filter(p => p.status === "in-progress" && p.client === "Acme Corp").length;
  const pendingInvoices = mockInvoices.filter(i => i.status === "pending" && i.client === "Acme Corp").length;
  const completedProjects = mockProjects.filter(p => p.status === "completed" && p.client === "Acme Corp").length;
  
  const clientProjects = mockProjects.filter(p => p.client === "Acme Corp");
  const clientInvoices = mockInvoices.filter(i => i.client === "Acme Corp");

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold font-heading tracking-tight">Client Portal</h1>
        <p className="text-muted-foreground">Welcome back, Acme Corp.</p>
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
                clientProjects.map(project => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{project.title}</div>
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Due: {project.dueDate}</span>
                      <span>{project.progress}% Complete</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div 
                        className="h-2 rounded-full bg-primary" 
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
                clientInvoices.map(invoice => (
                  <div key={invoice.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{invoice.id}</div>
                      <div className="text-xs text-muted-foreground">Due: {invoice.dueDate}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-bold">${invoice.amount.toLocaleString()}</div>
                      <Badge 
                        variant={invoice.status === "paid" ? "default" : "destructive"}
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