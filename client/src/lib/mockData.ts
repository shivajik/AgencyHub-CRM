export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "client";
  avatar: string;
  company: string;
}

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  status: "active" | "lead" | "churned";
  totalRevenue: number;
  lastActive: string;
  projects: number;
  logo: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  status: "planning" | "in-progress" | "review" | "completed";
  dueDate: string;
  budget: number;
  progress: number;
  assignees: string[];
  priority: "low" | "medium" | "high";
}

export interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
}

export interface Invoice {
  id: string;
  client: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: "online" | "busy" | "offline";
  avatar: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  channel: string;
  reactions?: { emoji: string; count: number }[];
}

export const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alice Admin",
    role: "Admin",
    status: "online",
    avatar: "https://i.pravatar.cc/150?u=1"
  },
  {
    id: "2",
    name: "Bob Designer",
    role: "Designer",
    status: "busy",
    avatar: "https://i.pravatar.cc/150?u=3"
  },
  {
    id: "3",
    name: "Charlie Dev",
    role: "Developer",
    status: "offline",
    avatar: "https://i.pravatar.cc/150?u=4"
  },
  {
    id: "4",
    name: "Diana PM",
    role: "Project Manager",
    status: "online",
    avatar: "https://i.pravatar.cc/150?u=8"
  }
];

export const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "4",
    senderName: "Diana PM",
    senderAvatar: "https://i.pravatar.cc/150?u=8",
    content: "Hey team, just a reminder that the Q1 Marketing Campaign review is at 2 PM today.",
    timestamp: "10:30 AM",
    channel: "general",
    reactions: [{ emoji: "👍", count: 2 }]
  },
  {
    id: "2",
    senderId: "2",
    senderName: "Bob Designer",
    senderAvatar: "https://i.pravatar.cc/150?u=3",
    content: "I've uploaded the new assets for the Website Redesign. Can someone take a look?",
    timestamp: "11:15 AM",
    channel: "design",
    reactions: [{ emoji: "👀", count: 1 }]
  },
  {
    id: "3",
    senderId: "3",
    senderName: "Charlie Dev",
    senderAvatar: "https://i.pravatar.cc/150?u=4",
    content: "On it! Will check them out after lunch.",
    timestamp: "11:18 AM",
    channel: "design"
  }
];

export const mockClients: Client[] = [
  {
    id: "1",
    name: "Acme Corp",
    contactPerson: "John Doe",
    email: "john@acme.com",
    status: "active",
    totalRevenue: 54000,
    lastActive: "2024-03-10",
    projects: 3,
    logo: "AC"
  },
  {
    id: "2",
    name: "TechStart Inc",
    contactPerson: "Sarah Smith",
    email: "sarah@techstart.io",
    status: "active",
    totalRevenue: 28500,
    lastActive: "2024-03-12",
    projects: 1,
    logo: "TS"
  },
  {
    id: "3",
    name: "Global Retail",
    contactPerson: "Mike Brown",
    email: "m.brown@global.com",
    status: "lead",
    totalRevenue: 0,
    lastActive: "2024-03-08",
    projects: 0,
    logo: "GR"
  }
];

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Q1 Marketing Campaign",
    client: "Acme Corp",
    status: "in-progress",
    dueDate: "2024-04-15",
    budget: 15000,
    progress: 45,
    assignees: ["https://i.pravatar.cc/150?u=1", "https://i.pravatar.cc/150?u=2"],
    priority: "high"
  },
  {
    id: "2",
    title: "Website Redesign",
    client: "TechStart Inc",
    status: "planning",
    dueDate: "2024-05-01",
    budget: 25000,
    progress: 10,
    assignees: ["https://i.pravatar.cc/150?u=3"],
    priority: "medium"
  },
  {
    id: "3",
    title: "SEO Audit",
    client: "Acme Corp",
    status: "review",
    dueDate: "2024-03-20",
    budget: 5000,
    progress: 90,
    assignees: ["https://i.pravatar.cc/150?u=1"],
    priority: "low"
  }
];

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Draft social media copy",
    project: "Q1 Marketing Campaign",
    assignee: "Alice",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-03-15"
  },
  {
    id: "2",
    title: "Design homepage mockups",
    project: "Website Redesign",
    assignee: "Bob",
    status: "todo",
    priority: "medium",
    dueDate: "2024-03-25"
  },
  {
    id: "3",
    title: "Keyword research",
    project: "SEO Audit",
    assignee: "Charlie",
    status: "done",
    priority: "high",
    dueDate: "2024-03-10"
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: "INV-2024-001",
    client: "Acme Corp",
    amount: 5000,
    date: "2024-02-01",
    dueDate: "2024-02-15",
    status: "paid"
  },
  {
    id: "INV-2024-002",
    client: "TechStart Inc",
    amount: 12500,
    date: "2024-03-01",
    dueDate: "2024-03-15",
    status: "pending"
  }
];

export const recentActivity = [
  {
    id: 1,
    user: "Alice Admin",
    action: "created a new project",
    target: "Q2 Strategy",
    time: "2 hours ago",
    avatar: "https://i.pravatar.cc/150?u=1"
  },
  {
    id: 2,
    user: "Bob Designer",
    action: "uploaded new assets to",
    target: "Website Redesign",
    time: "4 hours ago",
    avatar: "https://i.pravatar.cc/150?u=3"
  },
  {
    id: 3,
    user: "Acme Corp",
    action: "paid invoice",
    target: "INV-2024-001",
    time: "Yesterday",
    avatar: "https://i.pravatar.cc/150?u=5"
  }
];