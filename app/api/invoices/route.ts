import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { invoices, insertInvoiceSchema } from "@/lib/schema";
import { requireAuth } from "@/lib/middleware";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const auth = await requireAuth();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { user } = auth;

  if (user.role === "client") {
    if (!user.clientId) {
      return NextResponse.json({ invoices: [] });
    }
    const invoiceList = await db.select().from(invoices).where(eq(invoices.clientId, user.clientId));
    return NextResponse.json({ invoices: invoiceList });
  }

  const invoiceList = await db.select().from(invoices).orderBy(desc(invoices.createdAt));
  return NextResponse.json({ invoices: invoiceList });
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!["admin", "manager"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedData = insertInvoiceSchema.parse(body);
    const [invoice] = await db.insert(invoices).values(validatedData).returning();
    return NextResponse.json({ invoice });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
