import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, tasks, invoices, clients } from "@/lib/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, CheckSquare, DollarSign } from "lucide-react";

export default async function ClientPortal() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "client") {
    redirect("/admin");
  }

  if (!user.clientId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-gray-600">
              Your account is not linked to a client. Please contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [client] = await db.select().from(clients).where(eq(clients.id, user.clientId));
  const projectList = await db.select().from(projects).where(eq(projects.clientId, user.clientId)).orderBy(desc(projects.createdAt));
  const projectIds = projectList.map((p) => p.id);
  
  const taskList = projectIds.length > 0
    ? await db.select().from(tasks).where(inArray(tasks.projectId, projectIds)).orderBy(desc(tasks.createdAt))
    : [];
  
  const invoiceList = await db.select().from(invoices).where(eq(invoices.clientId, user.clientId)).orderBy(desc(invoices.createdAt));

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">AgencyFlow</span>
              <span className="ml-4 text-sm text-gray-500">Client Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.name}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {client?.name || "Client"}
          </h1>
          <p className="text-gray-500">View your projects, tasks, and invoices</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="stat-projects">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Projects
              </CardTitle>
              <FolderKanban className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectList.length}</div>
            </CardContent>
          </Card>

          <Card data-testid="stat-tasks">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Tasks
              </CardTitle>
              <CheckSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskList.length}</div>
            </CardContent>
          </Card>

          <Card data-testid="stat-invoices">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Invoices
              </CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoiceList.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projectList.length === 0 ? (
                <p className="text-gray-500 text-sm">No projects yet</p>
              ) : (
                <div className="space-y-3">
                  {projectList.map((project) => (
                    <div
                      key={project.id}
                      className="p-3 bg-gray-50 rounded-lg"
                      data-testid={`project-${project.id}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{project.title}</h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {project.status}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-gray-600">
                            Progress: {project.progress || 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {invoiceList.length === 0 ? (
                <p className="text-gray-500 text-sm">No invoices yet</p>
              ) : (
                <div className="space-y-3">
                  {invoiceList.slice(0, 5).map((invoice) => (
                    <div
                      key={invoice.id}
                      className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
                      data-testid={`invoice-${invoice.id}`}
                    >
                      <div>
                        <h3 className="font-medium">{invoice.invoiceNumber}</h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {invoice.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${parseFloat(invoice.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
