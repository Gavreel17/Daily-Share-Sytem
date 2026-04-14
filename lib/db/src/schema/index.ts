import { pgTable, text, serial, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const members = pgTable("members", {
  id: text("id").primaryKey(), // Using text IDs to match React Native implementation
  name: text("name").notNull(),
  percentage: integer("percentage").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const revenueEntries = pgTable("revenue_entries", {
  id: text("id").primaryKey(),
  date: text("date").notNull(), // ISO string date
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  isShared: boolean("is_shared").default(false).notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const revenueShares = pgTable("revenue_shares", {
  id: serial("id").primaryKey(),
  entryId: text("entry_id").references(() => revenueEntries.id, { onDelete: "cascade" }).notNull(),
  memberId: text("member_id").references(() => members.id, { onDelete: "cascade" }).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  percentage: integer("percentage").notNull(),
});

// Zod schemas for validation
export const insertMemberSchema = createInsertSchema(members) as any;
export const insertRevenueEntrySchema = createInsertSchema(revenueEntries) as any;
export const insertRevenueShareSchema = createInsertSchema(revenueShares) as any;

// Types
export type Member = typeof members.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type RevenueEntry = typeof revenueEntries.$inferSelect;
export type InsertRevenueEntry = z.infer<typeof insertRevenueEntrySchema>;
export type RevenueShare = typeof revenueShares.$inferSelect;
export type InsertRevenueShare = z.infer<typeof insertRevenueShareSchema>;