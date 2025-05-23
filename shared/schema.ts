import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  storeName: text("store_name").notNull(),
  orderNumber: text("order_number").notNull(),
  customer: text("customer").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  items: text("items").notNull(), // JSON string of receipt items
  printed: boolean("printed").notNull().default(false),
});

export const printJobs = pgTable("print_jobs", {
  id: serial("id").primaryKey(),
  receiptId: integer("receipt_id").references(() => receipts.id),
  status: text("status").notNull().default("pending"), // pending, printing, completed, failed
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  errorMessage: text("error_message"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertReceiptSchema = createInsertSchema(receipts).omit({
  id: true,
  date: true,
  printed: true,
});

export const insertPrintJobSchema = createInsertSchema(printJobs).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Receipt = typeof receipts.$inferSelect;
export type InsertReceipt = z.infer<typeof insertReceiptSchema>;
export type PrintJob = typeof printJobs.$inferSelect;
export type InsertPrintJob = z.infer<typeof insertPrintJobSchema>;

// Frontend-specific types
export type ReceiptItem = {
  name: string;
  price: number;
  quantity?: number;
};

export type PrintStatus = "ready" | "printing" | "success" | "error";
