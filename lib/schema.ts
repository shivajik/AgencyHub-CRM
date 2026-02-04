import { pgTable, text, timestamp, decimal, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("client"),
  avatar: text("avatar"),
  status: text("status").default("offline"),
  clientId: uuid("client_id").references(() => clients.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status").default("active"),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0"),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  clientId: uuid("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  status: text("status").default("active"),
  progress: decimal("progress", { precision: 5, scale: 2 }).default("0"),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  deadline: timestamp("deadline"),
  assigneeId: uuid("assignee_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  assigneeId: uuid("assignee_id").references(() => users.id),
  status: text("status").default("todo"),
  priority: text("priority").default("medium"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceNumber: text("invoice_number").notNull(),
  clientId: uuid("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").default("pending"),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  senderId: uuid("sender_id").notNull().references(() => users.id),
  channel: text("channel").default("general"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  action: text("action").notNull(),
  target: text("target"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true });
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
