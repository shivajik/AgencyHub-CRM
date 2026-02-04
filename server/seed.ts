import { storage } from "./storage";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Create demo users
    const hashedPassword = await bcrypt.hash("demo123", 10);
    
    const adminUser = await storage.createUser({
      email: "admin@agencyflow.com",
      password: hashedPassword,
      name: "Sarah Chen",
      role: "admin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      status: "online",
    });

    const teamUser1 = await storage.createUser({
      email: "alex@agencyflow.com",
      password: hashedPassword,
      name: "Alex Morgan",
      role: "manager",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      status: "online",
    });

    const teamUser2 = await storage.createUser({
      email: "jordan@agencyflow.com",
      password: hashedPassword,
      name: "Jordan Lee",
      role: "manager",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
      status: "busy",
    });

    const clientUser = await storage.createUser({
      email: "client@techstartup.com",
      password: hashedPassword,
      name: "Michael Roberts",
      role: "client",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      status: "offline",
    });

    console.log("✅ Created demo users");

    // Create demo clients (need to create before linking to client user)
    const client1 = await storage.createClient({
      name: "TechStartup Inc",
      contactPerson: "Michael Roberts",
      email: "contact@techstartup.com",
      status: "active",
      totalRevenue: "45000.00",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=TechStartup",
    });

    const client2 = await storage.createClient({
      name: "Retail Solutions",
      contactPerson: "Emily Johnson",
      email: "hello@retailsolutions.com",
      status: "active",
      totalRevenue: "28000.00",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=Retail",
    });

    const client3 = await storage.createClient({
      name: "HealthCare Plus",
      contactPerson: "David Kim",
      email: "info@healthcareplus.com",
      status: "churned",
      totalRevenue: "15000.00",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=Healthcare",
    });

    const client4 = await storage.createClient({
      name: "Finance Group",
      contactPerson: "Lisa Anderson",
      email: "contact@financegroup.com",
      status: "lead",
      totalRevenue: "0.00",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=Finance",
    });

    console.log("✅ Created demo clients");

    // Link client user to TechStartup client
    await storage.updateUser(clientUser.id, { clientId: client1.id } as any);
    console.log("✅ Linked client user to TechStartup");

    // Create demo projects
    const project1 = await storage.createProject({
      title: "Website Redesign",
      clientId: client1.id,
      status: "in-progress",
      dueDate: new Date("2024-03-30"),
      budget: "25000.00",
      progress: 65,
      priority: "high",
      assignees: [adminUser.id, teamUser1.id],
    });

    const project2 = await storage.createProject({
      title: "Mobile App Development",
      clientId: client1.id,
      status: "planning",
      dueDate: new Date("2024-06-30"),
      budget: "50000.00",
      progress: 15,
      priority: "high",
      assignees: [teamUser1.id, teamUser2.id],
    });

    const project3 = await storage.createProject({
      title: "E-commerce Platform",
      clientId: client2.id,
      status: "in-progress",
      dueDate: new Date("2024-04-15"),
      budget: "35000.00",
      progress: 45,
      priority: "medium",
      assignees: [adminUser.id, teamUser2.id],
    });

    const project4 = await storage.createProject({
      title: "Brand Identity Package",
      clientId: client2.id,
      status: "completed",
      dueDate: new Date("2024-01-15"),
      budget: "12000.00",
      progress: 100,
      priority: "low",
      assignees: [teamUser1.id],
    });

    const project5 = await storage.createProject({
      title: "Patient Portal",
      clientId: client3.id,
      status: "review",
      dueDate: new Date("2024-05-30"),
      budget: "40000.00",
      progress: 20,
      priority: "low",
      assignees: [teamUser2.id],
    });

    console.log("✅ Created demo projects");

    // Create demo tasks
    await storage.createTask({
      title: "Design homepage mockups",
      projectId: project1.id,
      assigneeId: teamUser1.id,
      status: "done",
      priority: "high",
      dueDate: new Date("2024-02-01"),
    });

    await storage.createTask({
      title: "Implement responsive navigation",
      projectId: project1.id,
      assigneeId: teamUser1.id,
      status: "in-progress",
      priority: "high",
      dueDate: new Date("2024-02-15"),
    });

    await storage.createTask({
      title: "Content migration",
      projectId: project1.id,
      assigneeId: adminUser.id,
      status: "todo",
      priority: "medium",
      dueDate: new Date("2024-03-01"),
    });

    await storage.createTask({
      title: "App architecture planning",
      projectId: project2.id,
      assigneeId: teamUser2.id,
      status: "in-progress",
      priority: "high",
      dueDate: new Date("2024-02-20"),
    });

    await storage.createTask({
      title: "User flow diagrams",
      projectId: project2.id,
      assigneeId: teamUser1.id,
      status: "todo",
      priority: "medium",
      dueDate: new Date("2024-02-25"),
    });

    await storage.createTask({
      title: "Product catalog setup",
      projectId: project3.id,
      assigneeId: adminUser.id,
      status: "in-progress",
      priority: "high",
      dueDate: new Date("2024-02-28"),
    });

    await storage.createTask({
      title: "Payment gateway integration",
      projectId: project3.id,
      assigneeId: teamUser2.id,
      status: "todo",
      priority: "high",
      dueDate: new Date("2024-03-15"),
    });

    console.log("✅ Created demo tasks");

    // Create demo invoices
    await storage.createInvoice({
      invoiceNumber: "INV-2024-001",
      clientId: client1.id,
      amount: "12500.00",
      status: "paid",
      dueDate: new Date("2024-02-15"),
      lineItems: [
        { description: "Website Design - Phase 1", quantity: 1, rate: 12500 },
      ],
    });

    await storage.createInvoice({
      invoiceNumber: "INV-2024-002",
      clientId: client1.id,
      amount: "12500.00",
      status: "pending",
      dueDate: new Date("2024-03-15"),
      lineItems: [
        { description: "Website Development - Phase 2", quantity: 1, rate: 12500 },
      ],
    });

    await storage.createInvoice({
      invoiceNumber: "INV-2024-003",
      clientId: client2.id,
      amount: "17500.00",
      status: "paid",
      dueDate: new Date("2024-02-01"),
      lineItems: [
        { description: "E-commerce Platform - Milestone 1", quantity: 1, rate: 17500 },
      ],
    });

    await storage.createInvoice({
      invoiceNumber: "INV-2024-004",
      clientId: client2.id,
      amount: "12000.00",
      status: "paid",
      dueDate: new Date("2024-01-20"),
      lineItems: [
        { description: "Brand Identity Package", quantity: 1, rate: 12000 },
      ],
    });

    await storage.createInvoice({
      invoiceNumber: "INV-2024-005",
      clientId: client3.id,
      amount: "8000.00",
      status: "overdue",
      dueDate: new Date("2024-01-30"),
      lineItems: [
        { description: "Patient Portal - Initial Payment", quantity: 1, rate: 8000 },
      ],
    });

    console.log("✅ Created demo invoices");

    // Create demo messages
    await storage.createMessage({
      senderId: adminUser.id,
      content: "Hey team! Just wanted to check in on the TechStartup website redesign. How's the progress?",
      channel: "project-updates",
    });

    await storage.createMessage({
      senderId: teamUser1.id,
      content: "Going great! Just finished the homepage mockups. Moving to the navigation component next.",
      channel: "project-updates",
    });

    await storage.createMessage({
      senderId: teamUser2.id,
      content: "I've completed the architecture planning for the mobile app. Ready for review when you have time.",
      channel: "project-updates",
    });

    await storage.createMessage({
      senderId: adminUser.id,
      content: "Excellent work everyone! Let's sync up tomorrow at 10 AM to discuss next steps.",
      channel: "project-updates",
    });

    await storage.createMessage({
      senderId: teamUser1.id,
      content: "Quick reminder: Client demo with TechStartup is scheduled for Thursday at 2 PM.",
      channel: "general",
    });

    console.log("✅ Created demo messages");

    // Create demo activities
    await storage.createActivity({
      userId: adminUser.id,
      action: "created a new project",
      target: "Website Redesign",
    });

    await storage.createActivity({
      userId: teamUser1.id,
      action: "completed a task",
      target: "Design homepage mockups",
    });

    await storage.createActivity({
      userId: adminUser.id,
      action: "created a new client",
      target: "TechStartup Inc",
    });

    await storage.createActivity({
      userId: teamUser2.id,
      action: "updated project status",
      target: "Mobile App Development",
    });

    await storage.createActivity({
      userId: adminUser.id,
      action: "sent an invoice",
      target: "INV-2024-002",
    });

    console.log("✅ Created demo activities");

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });