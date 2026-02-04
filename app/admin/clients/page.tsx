import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { clients } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, CheckSquare, DollarSign, MessageSquare, LayoutDashboard, Mail, Phone } from "lucide-react";

export default async function ClientsPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role === "client") redirect("/portal");

  const clientList = await db.select().from(clients).orderBy(desc(clients.createdAt));

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
                <Link href="/admin/clients" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700">
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
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientList.map((client) => (
            <Card key={client.id} data-testid={`client-${client.id}`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <p className="text-sm text-gray-500 capitalize">{client.status}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {client.contactPerson}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {client.email}
                  </div>
                  {client.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {client.phone}
                    </div>
                  )}
                  <div className="pt-2 border-t mt-2">
                    <p className="text-gray-500">Total Revenue</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${parseFloat(client.totalRevenue || "0").toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
