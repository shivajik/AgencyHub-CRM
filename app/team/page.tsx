import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, tasks, users, messages } from "@/lib/schema";
import { desc, eq, and } from "drizzle-orm";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, CheckSquare, MessageSquare, LayoutDashboard, Calendar, Clock } from "lucide-react";

export default async function TeamDashboard() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role === "client") redirect("/portal");

  const userList = await db.select().from(users).where(
    and(
      eq(users.role, "admin"),
    )
  );
  const allUsers = await db.select().from(users);
  
  const myTasks = await db.select().from(tasks).where(eq(tasks.assigneeId, user.id)).orderBy(desc(tasks.createdAt));
  const myProjects = await db.select().from(projects).where(eq(projects.assigneeId, user.id)).orderBy(desc(projects.createdAt));
  const recentMessages = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(10);
  
  const teamMembers = await db.select().from(users).where(
    eq(users.role, "admin")
  );
  const managers = await db.select().from(users).where(
    eq(users.role, "manager")
  );
  const allTeam = [...teamMembers, ...managers];

  const userMap = Object.fromEntries(allUsers.map(u => [u.id, u]));

  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-green-100 text-green-700 border-green-200",
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
                  <LayoutDashboard className="h-4 w-4 inline mr-1" />Admin
                </Link>
                <Link href="/team" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700">
                  <Users className="h-4 w-4 inline mr-1" />Team
                </Link>
                <Link href="/admin/projects" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <FolderKanban className="h-4 w-4 inline mr-1" />Projects
                </Link>
                <Link href="/admin/tasks" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <CheckSquare className="h-4 w-4 inline mr-1" />Tasks
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Team Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CheckSquare className="h-5 w-5 mr-2 text-blue-600" />
                  My Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myTasks.length > 0 ? myTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50" data-testid={`my-task-${task.id}`}>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{task.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium}`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status as keyof typeof statusColors] || statusColors.todo}`}>
                          {task.status}
                        </span>
                        {task.dueDate && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">No tasks assigned to you</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FolderKanban className="h-5 w-5 mr-2 text-purple-600" />
                  My Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myProjects.length > 0 ? myProjects.map((project) => (
                    <div key={project.id} className="p-3 border rounded-lg hover:bg-gray-50" data-testid={`my-project-${project.id}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{project.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === "completed" ? "bg-green-100 text-green-700" :
                          project.status === "in-progress" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress || 0}%` }} />
                          </div>
                          <span>{project.progress || 0}%</span>
                        </div>
                        {project.deadline && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(project.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">No projects assigned to you</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allTeam.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3" data-testid={`team-member-${member.id}`}>
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          member.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MessageSquare className="h-5 w-5 mr-2 text-orange-600" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMessages.slice(0, 5).map((msg) => (
                    <div key={msg.id} className="flex space-x-2" data-testid={`recent-message-${msg.id}`}>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                        {userMap[msg.senderId]?.name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{userMap[msg.senderId]?.name || "Unknown"}</p>
                        <p className="text-sm text-gray-600 truncate">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {recentMessages.length === 0 && (
                    <p className="text-gray-500 text-center py-2 text-sm">No messages yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
