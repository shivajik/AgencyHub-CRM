import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, clients, users } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, CheckSquare, DollarSign, MessageSquare, LayoutDashboard, Calendar } from "lucide-react";

export default async function ProjectsPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role === "client") redirect("/portal");

  const projectList = await db.select().from(projects).orderBy(desc(projects.createdAt));
  const clientList = await db.select().from(clients);
  const userList = await db.select({ id: users.id, name: users.name }).from(users);

  const clientMap = Object.fromEntries(clientList.map(c => [c.id, c]));
  const userMap = Object.fromEntries(userList.map(u => [u.id, u]));

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">AgencyFlow</span>
              <div className="hidden md:flex ml-10 space-x-4">
                <Link href="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <LayoutDashboard className="h-4 w-4 inline mr-1" />Dashboard
                </Link>
                <Link href="/admin/clients" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <Users className="h-4 w-4 inline mr-1" />Clients
                </Link>
                <Link href="/admin/projects" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700">
                  <FolderKanban className="h-4 w-4 inline mr-1" />Projects
                </Link>
                <Link href="/admin/tasks" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <CheckSquare className="h-4 w-4 inline mr-1" />Tasks
                </Link>
                <Link href="/admin/invoices" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <DollarSign className="h-4 w-4 inline mr-1" />Invoices
                </Link>
                <Link href="/admin/messages" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <MessageSquare className="h-4 w-4 inline mr-1" />Messages
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.name}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectList.map((project) => (
            <Card key={project.id} data-testid={`project-${project.id}`}>
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <p className="text-sm text-gray-500">{clientMap[project.clientId]?.name || "Unknown Client"}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === "completed" ? "bg-green-100 text-green-700" :
                      project.status === "in-progress" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span>{project.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                  {project.budget && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Budget</span>
                      <span className="font-medium">${parseFloat(project.budget).toLocaleString()}</span>
                    </div>
                  )}
                  {project.deadline && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(project.deadline).toLocaleDateString()}
                    </div>
                  )}
                  {project.assigneeId && (
                    <div className="text-sm text-gray-500">
                      Assigned to: {userMap[project.assigneeId]?.name || "Unknown"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
