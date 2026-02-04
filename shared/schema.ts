import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["admin", "manager", "client"]);
export const userStatusEnum = pgEnum("user_status", ["online", "busy", "offline"]);
export const clientStatusEnum = pgEnum("client_status", ["active", "lead", "churned"]);
export const projectStatusEnum = pgEnum("project_status", ["planning", "in-progress", "review", "completed"]);
export const taskStatusEnum = pgEnum("task_status", ["todo", "in-progress", "done"]);
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["paid", "pending", "overdue"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("manager"),
  status: userStatusEnum("status").notNull().default("offline"),
  avatar: text("avatar"),
  company: text("company"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  status: clientStatusEnum("status").notNull().default("lead"),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).notNull().default("0"),
  logo: text("logo"),
  lastActive: timestamp("last_active").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  status: projectStatusEnum("status").notNull().default("planning"),
  dueDate: timestamp("due_date").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
  progress: integer("progress").notNull().default(0),
  priority: priorityEnum("priority").notNull().default("medium"),
  assignees: jsonb("assignees").notNull().$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  assigneeId: varchar("assignee_id").references(() => users.id),
  status: taskStatusEnum("status").notNull().default("todo"),
  priority: priorityEnum("priority").notNull().default("medium"),
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoice_number").notNull().unique(),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull().defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  status: invoiceStatusEnum("status").notNull().default("pending"),
  lineItems: jsonb("line_items").$type<Array<{ description: string; quantity: number; rate: number }>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  channel: text("channel").notNull().default("general"),
  reactions: jsonb("reactions").$type<Array<{ emoji: string; count: number }>>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: text("action").notNull(),
  target: text("target").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true, lastActive: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true });
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

// Select types
export type User = typeof users.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Activity = typeof activities.$inferSelect;