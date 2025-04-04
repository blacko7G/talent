import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
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
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").$type<UserRole>().notNull(),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Player profiles
export const playerProfiles = pgTable("player_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  position: text("position"),
  age: integer("age"),
  location: text("location"),
  bio: text("bio"),
  achievements: text("achievements"),
  overallRating: integer("overall_rating"),
  appearances: integer("appearances"),
  goals: integer("goals"),
  isEliteProspect: boolean("is_elite_prospect").default(false),
  isVerified: boolean("is_verified").default(false),
  stats: json("stats").$type<PlayerStats>(),
});

export const insertPlayerProfileSchema = createInsertSchema(playerProfiles).omit({
  id: true,
});

// Scout profiles
export const scoutProfiles = pgTable("scout_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  organization: text("organization"),
  position: text("position"),
  bio: text("bio"),
  yearsOfExperience: integer("years_of_experience"),
  isVerified: boolean("is_verified").default(false),
});

export const insertScoutProfileSchema = createInsertSchema(scoutProfiles).omit({
  id: true,
});

// Academy profiles
export const academyProfiles = pgTable("academy_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  location: text("location"),
  description: text("description"),
  foundedYear: integer("founded_year"),
  website: text("website"),
  isVerified: boolean("is_verified").default(false),
});

export const insertAcademyProfileSchema = createInsertSchema(academyProfiles).omit({
  id: true,
});

// Videos/Highlights
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  thumbnail: text("thumbnail"),
  duration: integer("duration"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  views: true,
  likes: true,
  createdAt: true,
});

// Trials
export const trials = pgTable("trials", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  position: text("position"),
  ageGroup: text("age_group"),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  requirements: text("requirements"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTrialSchema = createInsertSchema(trials).omit({
  id: true,
  createdAt: true,
});

// Trial applications
export const trialApplications = pgTable("trial_applications", {
  id: serial("id").primaryKey(),
  trialId: integer("trial_id").notNull().references(() => trials.id),
  playerId: integer("player_id").notNull().references(() => users.id),
  status: text("status").default("pending"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTrialApplicationSchema = createInsertSchema(trialApplications).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

// Scout Interests
export const scoutInterests = pgTable("scout_interests", {
  id: serial("id").primaryKey(),
  scoutId: integer("scout_id").notNull().references(() => users.id),
  playerId: integer("player_id").notNull().references(() => users.id),
  type: text("type").notNull(), // viewed_profile, watched_video, added_to_watchlist, etc.
  resourceId: integer("resource_id"), // can reference a video ID or other resource
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScoutInterestSchema = createInsertSchema(scoutInterests).omit({
  id: true,
  createdAt: true,
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

// Registration schema with role validation
export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterData = z.infer<typeof registerSchema>;
