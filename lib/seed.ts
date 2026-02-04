import { db } from "./db";
import { users, clients, projects, tasks, invoices, messages, activities } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Starting database seed...");

  const hashedPassword = await bcrypt.hash("demo123", 10);

  const [adminUser] = await db.insert(users).values({
    email: "admin@agencyflow.com",
    password: hashedPassword,
    name: "Sarah Johnson",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "online",
  }).returning();

  const [managerUser] = await db.insert(users).values({
    email: "alex@agencyflow.com",
    password: hashedPassword,
    name: "Alex Thompson",
    role: "manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    status: "online",
  }).returning();

  const [clientUser] = await db.insert(users).values({
    email: "client@techstartup.com",
    password: hashedPassword,
    name: "Michael Roberts",
    role: "client",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    status: "offline",
  }).returning();

  console.log("✅ Created demo users");

  const [client1] = await db.insert(clients).values({
    name: "TechStartup Inc",
    contactPerson: "Michael Roberts",
    email: "contact@techstartup.com",
    phone: "+1 555-0123",
    status: "active",
    totalRevenue: "45000.00",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=Tech",
  }).returning();

  const [client2] = await db.insert(clients).values({
    name: "Creative Agency Co",
    contactPerson: "Emma Wilson",
    email: "emma@creativeagency.com",
    phone: "+1 555-0456",
    status: "active",
    totalRevenue: "32000.00",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=Creative",
  }).returning();

  const [client3] = await db.insert(clients).values({
    name: "Finance Plus",
    contactPerson: "David Brown",
    email: "david@financeplus.com",
    phone: "+1 555-0789",
    status: "pending",
    totalRevenue: "0.00",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=Finance",
  }).returning();

  console.log("✅ Created demo clients");

  const { eq } = await import("drizzle-orm");
  await db.update(users).set({ clientId: client1.id }).where(eq(users.id, clientUser.id));
  console.log("✅ Linked client user to TechStartup");

  const [project1] = await db.insert(projects).values({
    title: "Website Redesign",
    clientId: client1.id,
    status: "in-progress",
    progress: "65.00",
    budget: "15000.00",
    deadline: new Date("2026-03-15"),
    assigneeId: managerUser.id,
  }).returning();

  const [project2] = await db.insert(projects).values({
    title: "SEO Campaign",
    clientId: client1.id,
    status: "active",
    progress: "30.00",
    budget: "8000.00",
    deadline: new Date("2026-04-01"),
    assigneeId: managerUser.id,
  }).returning();

  const [project3] = await db.insert(projects).values({
    title: "Social Media Strategy",
    clientId: client2.id,
    status: "planning",
    progress: "10.00",
    budget: "5000.00",
    deadline: new Date("2026-03-30"),
    assigneeId: adminUser.id,
  }).returning();

  console.log("✅ Created demo projects");

  await db.insert(tasks).values([
    {
      title: "Design homepage mockup",
      description: "Create new homepage design with modern aesthetics",
      projectId: project1.id,
      assigneeId: managerUser.id,
      status: "completed",
      priority: "high",
      dueDate: new Date("2026-02-10"),
    },
    {
      title: "Develop responsive layouts",
      description: "Implement mobile-first responsive design",
      projectId: project1.id,
      assigneeId: managerUser.id,
      status: "in-progress",
      priority: "high",
      dueDate: new Date("2026-02-20"),
    },
    {
      title: "Keyword research",
      description: "Research target keywords for SEO campaign",
      projectId: project2.id,
      assigneeId: adminUser.id,
      status: "todo",
      priority: "medium",
      dueDate: new Date("2026-02-25"),
    },
    {
      title: "Content strategy plan",
      description: "Develop social media content calendar",
      projectId: project3.id,
      assigneeId: adminUser.id,
      status: "todo",
      priority: "low",
      dueDate: new Date("2026-03-01"),
    },
  ]);

  console.log("✅ Created demo tasks");

  await db.insert(invoices).values([
    {
      invoiceNumber: "INV-001",
      clientId: client1.id,
      amount: "5000.00",
      status: "paid",
      dueDate: new Date("2026-01-15"),
      paidDate: new Date("2026-01-12"),
    },
    {
      invoiceNumber: "INV-002",
      clientId: client1.id,
      amount: "7500.00",
      status: "pending",
      dueDate: new Date("2026-02-28"),
    },
    {
      invoiceNumber: "INV-003",
      clientId: client2.id,
      amount: "3200.00",
      status: "pending",
      dueDate: new Date("2026-02-20"),
    },
  ]);

  console.log("✅ Created demo invoices");

  await db.insert(messages).values([
    {
      content: "Welcome to the team chat! Let's coordinate on our projects here.",
      senderId: adminUser.id,
      channel: "general",
    },
    {
      content: "Thanks Sarah! I'll update everyone on the TechStartup progress.",
      senderId: managerUser.id,
      channel: "general",
    },
  ]);

  console.log("✅ Created demo messages");

  await db.insert(activities).values([
    {
      userId: adminUser.id,
      action: "created a new project",
      target: "Website Redesign",
    },
    {
      userId: managerUser.id,
      action: "completed task",
      target: "Design homepage mockup",
    },
    {
      userId: adminUser.id,
      action: "sent invoice",
      target: "INV-001",
    },
  ]);

  console.log("✅ Created demo activities");
  console.log("🎉 Database seeded successfully!");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
