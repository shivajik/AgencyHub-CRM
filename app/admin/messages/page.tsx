import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { messages, users } from "@/lib/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, CheckSquare, DollarSign, MessageSquare, LayoutDashboard } from "lucide-react";

export default async function MessagesPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role === "client") redirect("/portal");

  const messageList = await db.select().from(messages).orderBy(asc(messages.createdAt));
  const userList = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users);
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
                <Link href="/admin/projects" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <FolderKanban className="h-4 w-4 inline mr-1" />Projects
                </Link>
                <Link href="/admin/tasks" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <CheckSquare className="h-4 w-4 inline mr-1" />Tasks
                </Link>
                <Link href="/admin/invoices" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <DollarSign className="h-4 w-4 inline mr-1" />Invoices
                </Link>
                <Link href="/admin/messages" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700">
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
          <h1 className="text-2xl font-bold text-gray-900">Team Messages</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">#general</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messageList.map((message) => (
                <div key={message.id} className="flex space-x-3" data-testid={`message-${message.id}`}>
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {userMap[message.senderId]?.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{userMap[message.senderId]?.name || "Unknown"}</span>
                      <span className="text-xs text-gray-500">
                        {message.createdAt ? new Date(message.createdAt).toLocaleString() : ""}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{message.content}</p>
                  </div>
                </div>
              ))}
              {messageList.length === 0 && (
                <p className="text-center text-gray-500 py-8">No messages yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
