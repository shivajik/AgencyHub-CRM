import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertClientSchema,
  insertProjectSchema,
  insertTaskSchema,
  insertInvoiceSchema,
  insertMessageSchema,
  insertActivitySchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcrypt";
import session from "express-session";
import  connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const PgSession = connectPgSimple(session);

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session middleware
  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "user_sessions",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "agency-flow-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  // Auth middleware - adds user to request
  const requireAuth = async (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    (req as any).user = user;
    next();
  };

  // Role-based middleware
  const requireRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: Function) => {
      const user = (req as any).user;
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    };
  };

  // ============= AUTH ROUTES =============
  
  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      req.session.userId = user.id;
      return res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update status to online
      await storage.updateUserStatus(user.id, "online");

      req.session.userId = user.id;
      return res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Logout
  app.post("/api/auth/logout", requireAuth, async (req, res) => {
    const userId = req.session.userId;
    if (userId) {
      await storage.updateUserStatus(userId, "offline");
    }
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie("connect.sid");
      return res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============= CLIENT ROUTES =============

  app.get("/api/clients", requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      
      if (user.role === "client") {
        if (!user.clientId) {
          return res.json({ clients: [] });
        }
        const client = await storage.getClient(user.clientId);
        return res.json({ clients: client ? [client] : [] });
      }
      
      const clients = await storage.getAllClients();
      return res.json({ clients });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/clients/:id", requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const clientId = String(req.params.id);
      
      if (user.role === "client" && user.clientId !== clientId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const client = await storage.getClient(clientId);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      return res.json({ client });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/clients", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      
      const user = (req as any).user;
      await storage.createActivity({
        userId: user.id,
        action: "created a new client",
        target: client.name,
      });

      return res.json({ client });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/clients/:id", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      await storage.updateClient(String(req.params.id), req.body);
      const client = await storage.getClient(String(req.params.id));
      return res.json({ client });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/clients/:id", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      await storage.deleteClient(String(req.params.id));
      return res.json({ message: "Client deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============= PROJECT ROUTES =============

  app.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      
      if (user.role === "client") {
        if (!user.clientId) {
          return res.json({ projects: [] });
        }
        const projects = await storage.getProjectsByClient(user.clientId);
        return res.json({ projects });
      }
      
      const projects = await storage.getAllProjects();
      return res.json({ projects });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const project = await storage.getProject(String(req.params.id));
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      if (user.role === "client" && project.clientId !== user.clientId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      return res.json({ project });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/projects", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      
      // Create activity
      const user = await storage.getUser(req.session.userId!);
      if (user) {
        await storage.createActivity({
          userId: user.id,
          action: "created a new project",
          target: project.title,
        });
      }

      return res.json({ project });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/projects/:id", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      await storage.updateProject(String(req.params.id), req.body);
      const project = await storage.getProject(String(req.params.id));
      return res.json({ project });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/projects/:id", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      await storage.deleteProject(String(req.params.id));
      return res.json({ message: "Project deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============= TASK ROUTES =============

  app.get("/api/tasks", requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      
      if (user.role === "client") {
        if (!user.clientId) {
          return res.json({ tasks: [] });
        }
        // Get projects for client, then tasks for those projects
        const projects = await storage.getProjectsByClient(user.clientId);
        const projectIds = projects.map(p => p.id);
        const allTasks = await storage.getAllTasks();
        const tasks = allTasks.filter(t => projectIds.includes(t.projectId));
        return res.json({ tasks });
      }
      
      const tasks = await storage.getAllTasks();
      return res.json({ tasks });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/tasks/my", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      const tasks = await storage.getTasksByAssignee(req.session.userId!);
      return res.json({ tasks });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/tasks", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      return res.json({ task });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/tasks/:id", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      await storage.updateTask(String(req.params.id), req.body);
      const task = await storage.getTask(String(req.params.id));
      return res.json({ task });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/tasks/:id", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      await storage.deleteTask(String(req.params.id));
      return res.json({ message: "Task deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============= INVOICE ROUTES =============

  app.get("/api/invoices", requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      
      if (user.role === "client") {
        if (!user.clientId) {
          return res.json({ invoices: [] });
        }
        const invoices = await storage.getInvoicesByClient(user.clientId);
        return res.json({ invoices });
      }
      
      const invoices = await storage.getAllInvoices();
      return res.json({ invoices });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/invoices", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      const validatedData = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(validatedData);
      return res.json({ invoice });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/invoices/:id", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      await storage.updateInvoice(String(req.params.id), req.body);
      const invoice = await storage.getInvoice(String(req.params.id));
      return res.json({ invoice });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============= MESSAGE ROUTES =============

  app.get("/api/messages", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      const channel = req.query.channel as string;
      const messages = channel 
        ? await storage.getMessagesByChannel(channel)
        : await storage.getAllMessages();
      return res.json({ messages });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/messages", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.session.userId,
      });
      const message = await storage.createMessage(validatedData);
      return res.json({ message });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============= ACTIVITY ROUTES =============

  app.get("/api/activities", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await storage.getRecentActivities(limit);
      return res.json({ activities });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============= USERS ROUTES =============

  app.get("/api/users", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const sanitizedUsers = users.map(u => ({ ...u, password: undefined }));
      return res.json({ users: sanitizedUsers });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}