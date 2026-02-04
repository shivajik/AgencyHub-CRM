import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { clients, projects, tasks, invoices, activities, users } from "@/lib/schema";
import { desc, eq, count, sql } from "drizzle-orm";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import {
  Users,
  FolderKanban,
  CheckSquare,
  DollarSign,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getStats() {
  const [clientCount] = await db.select({ count: count() }).from(clients);
  const [projectCount] = await db.select({ count: count() }).from(projects);
  const [taskCount] = await db.select({ count: count() }).from(tasks);
  const [invoiceCount] = await db.select({ count: count() }).from(invoices);

  const recentActivities = await db
    .select()
    .from(activities)
    .orderBy(desc(activities.createdAt))
    .limit(5);

  const userList = await db
    .select({
      id: users.id,
      name: users.name,
      avatar: users.avatar,
    })
    .from(users);

  const userMap = Object.fromEntries(userList.map((u) => [u.id, u]));

  return {
    clientCount: clientCount.count,
    projectCount: projectCount.count,
    taskCount: taskCount.count,
    invoiceCount: invoiceCount.count,
    recentActivities: recentActivities.map((a) => ({
      ...a,
      user: userMap[a.userId],
    })),
  };
}

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "client") {
    redirect("/portal");
  }

  const stats = await getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">AgencyFlow</span>
              <div className="hidden md:flex ml-10 space-x-4">
                <Link
                  href="/admin"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700"
                  data-testid="link-dashboard"
                >
                  <LayoutDashboard className="h-4 w-4 inline mr-1" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/clients"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                  data-testid="link-clients"
                >
                  <Users className="h-4 w-4 inline mr-1" />
                  Clients
                </Link>
                <Link
                  href="/admin/projects"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                  data-testid="link-projects"
                >
                  <FolderKanban className="h-4 w-4 inline mr-1" />
                  Projects
                </Link>
                <Link
                  href="/admin/tasks"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                  data-testid="link-tasks"
                >
                  <CheckSquare className="h-4 w-4 inline mr-1" />
                  Tasks
                </Link>
                <Link
                  href="/admin/invoices"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                  data-testid="link-invoices"
                >
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Invoices
                </Link>
                <Link
                  href="/admin/messages"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                  data-testid="link-messages"
                >
                  <MessageSquare className="h-4 w-4 inline mr-1" />
                  Messages
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="stat-clients">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Clients
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clientCount}</div>
            </CardContent>
          </Card>

          <Card data-testid="stat-projects">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Projects
              </CardTitle>
              <FolderKanban className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projectCount}</div>
            </CardContent>
          </Card>

          <Card data-testid="stat-tasks">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Tasks
              </CardTitle>
              <CheckSquare className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.taskCount}</div>
            </CardContent>
          </Card>

          <Card data-testid="stat-invoices">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Invoices
              </CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.invoiceCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentActivities.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {stats.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-3"
                    data-testid={`activity-${activity.id}`}
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {activity.user?.name?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user?.name}</span>{" "}
                        {activity.action}
                        {activity.target && (
                          <span className="font-medium"> {activity.target}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.createdAt
                          ? new Date(activity.createdAt).toLocaleString()
                          : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
