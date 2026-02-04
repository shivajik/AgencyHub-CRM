import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { invoices, clients } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FolderKanban, CheckSquare, DollarSign, MessageSquare, LayoutDashboard, Calendar } from "lucide-react";

export default async function InvoicesPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role === "client") redirect("/portal");

  const invoiceList = await db.select().from(invoices).orderBy(desc(invoices.createdAt));
  const clientList = await db.select().from(clients);
  const clientMap = Object.fromEntries(clientList.map(c => [c.id, c]));

  const statusColors = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    overdue: "bg-red-100 text-red-700",
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
                <Link href="/admin/tasks" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <CheckSquare className="h-4 w-4 inline mr-1" />Tasks
                </Link>
                <Link href="/admin/invoices" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700">
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
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoiceList.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50" data-testid={`invoice-${invoice.id}`}>
                    <td className="px-4 py-4 font-medium">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-4 text-gray-600">{clientMap[invoice.clientId]?.name || "Unknown"}</td>
                    <td className="px-4 py-4 font-medium">${parseFloat(invoice.amount).toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status as keyof typeof statusColors] || statusColors.pending}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
                {invoiceList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No invoices found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
