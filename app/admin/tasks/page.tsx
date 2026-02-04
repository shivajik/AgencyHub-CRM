import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasks, projects, users } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, CheckSquare, DollarSign, MessageSquare, LayoutDashboard, Calendar } from "lucide-react";

export default async function TasksPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role === "client") redirect("/portal");

  const taskList = await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  const projectList = await db.select().from(projects);
  const userList = await db.select({ id: users.id, name: users.name }).from(users);

  const projectMap = Object.fromEntries(projectList.map(p => [p.id, p]));
  const userMap = Object.fromEntries(userList.map(u => [u.id, u]));

  const priorityColors = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };

  const statusColors = {
    completed: "bg-green-100 text-green-700",
    "in-progress": "bg-blue-100 text-blue-700",
    todo: "bg-gray-100 text-gray-700",
  };

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
                <Link href="/admin/projects" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <FolderKanban className="h-4 w-4 inline mr-1" />Projects
                </Link>
                <Link href="/admin/tasks" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700">
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
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {taskList.map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50" data-testid={`task-${task.id}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{task.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status as keyof typeof statusColors] || statusColors.todo}`}>
                          {task.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Project: {projectMap[task.projectId]?.title || "Unknown"}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {task.assigneeId && (
                        <p>{userMap[task.assigneeId]?.name || "Unassigned"}</p>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center justify-end mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {taskList.length === 0 && (
                <div className="p-8 text-center text-gray-500">No tasks found</div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
