import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User types
export const USER_ROLES = {
  PLAYER: "player",
  SCOUT: "scout",
  ACADEMY: "academy",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").$type<UserRole>().notNull(),
  profileImage: text("profile_image"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Simplified user schema for registration
export const insertUserSchema = createInsertSchema(users, {
  id: z.number().optional(),
  createdAt: z.date().optional(),
  role: z.enum([USER_ROLES.PLAYER, USER_ROLES.SCOUT, USER_ROLES.ACADEMY]).optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

// Player profiles
export const playerProfiles = sqliteTable("player_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  position: text("position"),
  age: integer("age"),
  location: text("location"),
  bio: text("bio"),
  achievements: text("achievements"),
  overallRating: integer("overall_rating"),
  appearances: integer("appearances"),
  goals: integer("goals"),
  isEliteProspect: integer("is_elite_prospect", { mode: "boolean" }).default(false),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  stats: text("stats", { mode: "json" }).$type<PlayerStats | null>(),
});

export const insertPlayerProfileSchema = createInsertSchema(playerProfiles, {
  id: z.number().optional(),
});

// Scout profiles
export const scoutProfiles = sqliteTable("scout_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  organization: text("organization"),
  position: text("position"),
  bio: text("bio"),
  yearsOfExperience: integer("years_of_experience"),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
});

export const insertScoutProfileSchema = createInsertSchema(scoutProfiles, {
  id: z.number().optional(),
});

// Academy profiles
export const academyProfiles = sqliteTable("academy_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  location: text("location"),
  description: text("description"),
  foundedYear: integer("founded_year"),
  website: text("website"),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
});

export const insertAcademyProfileSchema = createInsertSchema(academyProfiles, {
  id: z.number().optional(),
});

// Videos/Highlights
export const videos = sqliteTable("videos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  thumbnail: text("thumbnail"),
  duration: integer("duration"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertVideoSchema = createInsertSchema(videos, {
  id: z.number().optional(),
  views: z.number().optional(),
  likes: z.number().optional(),
  createdAt: z.date().optional(),
});

// Trials
export const trials = sqliteTable("trials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  creatorId: integer("creator_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  position: text("position"),
  ageGroup: text("age_group"),
  location: text("location").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  description: text("description"),
  requirements: text("requirements"),
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertTrialSchema = createInsertSchema(trials, {
  id: z.number().optional(),
  createdAt: z.date().optional(),
});

// Trial applications
export const trialApplications = sqliteTable("trial_applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  trialId: integer("trial_id").notNull().references(() => trials.id),
  playerId: integer("player_id").notNull().references(() => users.id),
  status: text("status").default("pending"),
  message: text("message"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertTrialApplicationSchema = createInsertSchema(trialApplications, {
  id: z.number().optional(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
});

// Messages
export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertMessageSchema = createInsertSchema(messages, {
  id: z.number().optional(),
  isRead: z.boolean().optional(),
  createdAt: z.date().optional(),
});

// Scout Interests
export const scoutInterests = sqliteTable("scout_interests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  scoutId: integer("scout_id").notNull().references(() => users.id),
  playerId: integer("player_id").notNull().references(() => users.id),
  type: text("type").notNull(), // viewed_profile, watched_video, added_to_watchlist, etc.
  resourceId: integer("resource_id"), // can reference a video ID or other resource
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertScoutInterestSchema = createInsertSchema(scoutInterests, {
  id: z.number().optional(),
  createdAt: z.date().optional(),
});

// Player Stats interface (for the JSON column)
export interface PlayerStats {
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defense?: number;
  physical?: number;
  [key: string]: number | undefined;
}

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type PlayerProfile = typeof playerProfiles.$inferSelect;
export type InsertPlayerProfile = z.infer<typeof insertPlayerProfileSchema>;

export type ScoutProfile = typeof scoutProfiles.$inferSelect;
export type InsertScoutProfile = z.infer<typeof insertScoutProfileSchema>;

export type AcademyProfile = typeof academyProfiles.$inferSelect;
export type InsertAcademyProfile = z.infer<typeof insertAcademyProfileSchema>;

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export type Trial = typeof trials.$inferSelect;
export type InsertTrial = z.infer<typeof insertTrialSchema>;

export type TrialApplication = typeof trialApplications.$inferSelect;
export type InsertTrialApplication = z.infer<typeof insertTrialApplicationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type ScoutInterest = typeof scoutInterests.$inferSelect;
export type InsertScoutInterest = z.infer<typeof insertScoutInterestSchema>;

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginData = z.infer<typeof loginSchema>;

// Registration schema (simplified)
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type RegisterData = z.infer<typeof registerSchema>;
