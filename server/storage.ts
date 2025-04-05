import {
  User, InsertUser, PlayerProfile, InsertPlayerProfile, 
  ScoutProfile, InsertScoutProfile, AcademyProfile, InsertAcademyProfile,
  Video, InsertVideo, Trial, InsertTrial, TrialApplication, InsertTrialApplication,
  Message, InsertMessage, ScoutInterest, InsertScoutInterest,
  USER_ROLES, LoginData,
  // Database tables
  users, playerProfiles, scoutProfiles, academyProfiles, videos, 
  trials, trialApplications, messages, scoutInterests
} from "@shared/schema";
import { eq, and, or } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Player Profiles
  getPlayerProfile(userId: number): Promise<PlayerProfile | undefined>;
  createPlayerProfile(profile: InsertPlayerProfile): Promise<PlayerProfile>;
  updatePlayerProfile(userId: number, profile: Partial<InsertPlayerProfile>): Promise<PlayerProfile | undefined>;

  // Scout Profiles
  getScoutProfile(userId: number): Promise<ScoutProfile | undefined>;
  createScoutProfile(profile: InsertScoutProfile): Promise<ScoutProfile>;
  updateScoutProfile(userId: number, profile: Partial<InsertScoutProfile>): Promise<ScoutProfile | undefined>;

  // Academy Profiles
  getAcademyProfile(userId: number): Promise<AcademyProfile | undefined>;
  createAcademyProfile(profile: InsertAcademyProfile): Promise<AcademyProfile>;
  updateAcademyProfile(userId: number, profile: Partial<InsertAcademyProfile>): Promise<AcademyProfile | undefined>;

  // Videos
  getVideo(id: number): Promise<Video | undefined>;
  getVideosByUser(userId: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideoStats(id: number, views?: number, likes?: number): Promise<Video | undefined>;

  // Trials
  getTrial(id: number): Promise<Trial | undefined>;
  getAllTrials(): Promise<Trial[]>;
  getTrialsByCreator(creatorId: number): Promise<Trial[]>;
  createTrial(trial: InsertTrial): Promise<Trial>;

  // Trial Applications
  getTrialApplication(id: number): Promise<TrialApplication | undefined>;
  getTrialApplicationsByPlayer(playerId: number): Promise<TrialApplication[]>;
  getTrialApplicationsByTrial(trialId: number): Promise<TrialApplication[]>;
  createTrialApplication(application: InsertTrialApplication): Promise<TrialApplication>;
  updateTrialApplicationStatus(id: number, status: string): Promise<TrialApplication | undefined>;

  // Messages
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;
  getMessagesByUser(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;

  // Scout Interests
  getScoutInterest(id: number): Promise<ScoutInterest | undefined>;
  getScoutInterestsByPlayer(playerId: number): Promise<ScoutInterest[]>;
  getScoutInterestsByScout(scoutId: number): Promise<ScoutInterest[]>;
  createScoutInterest(interest: InsertScoutInterest): Promise<ScoutInterest>;

  // Authentication
  validateCredentials(loginData: LoginData): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getPlayerProfile(userId: number): Promise<PlayerProfile | undefined> {
    const [profile] = await db.select().from(playerProfiles).where(eq(playerProfiles.userId, userId));
    return profile || undefined;
  }

  async createPlayerProfile(profile: InsertPlayerProfile): Promise<PlayerProfile> {
    const [playerProfile] = await db
      .insert(playerProfiles)
      .values(profile)
      .returning();
    return playerProfile;
  }

  async updatePlayerProfile(userId: number, profile: Partial<InsertPlayerProfile>): Promise<PlayerProfile | undefined> {
    const [existingProfile] = await db
      .select()
      .from(playerProfiles)
      .where(eq(playerProfiles.userId, userId));
    
    if (!existingProfile) return undefined;
    
    const [updatedProfile] = await db
      .update(playerProfiles)
      .set(profile)
      .where(eq(playerProfiles.userId, userId))
      .returning();
    
    return updatedProfile;
  }

  async getScoutProfile(userId: number): Promise<ScoutProfile | undefined> {
    const [profile] = await db.select().from(scoutProfiles).where(eq(scoutProfiles.userId, userId));
    return profile || undefined;
  }

  async createScoutProfile(profile: InsertScoutProfile): Promise<ScoutProfile> {
    const [scoutProfile] = await db
      .insert(scoutProfiles)
      .values(profile)
      .returning();
    return scoutProfile;
  }

  async updateScoutProfile(userId: number, profile: Partial<InsertScoutProfile>): Promise<ScoutProfile | undefined> {
    const [existingProfile] = await db
      .select()
      .from(scoutProfiles)
      .where(eq(scoutProfiles.userId, userId));
    
    if (!existingProfile) return undefined;
    
    const [updatedProfile] = await db
      .update(scoutProfiles)
      .set(profile)
      .where(eq(scoutProfiles.userId, userId))
      .returning();
    
    return updatedProfile;
  }

  async getAcademyProfile(userId: number): Promise<AcademyProfile | undefined> {
    const [profile] = await db.select().from(academyProfiles).where(eq(academyProfiles.userId, userId));
    return profile || undefined;
  }

  async createAcademyProfile(profile: InsertAcademyProfile): Promise<AcademyProfile> {
    const [academyProfile] = await db
      .insert(academyProfiles)
      .values(profile)
      .returning();
    return academyProfile;
  }

  async updateAcademyProfile(userId: number, profile: Partial<InsertAcademyProfile>): Promise<AcademyProfile | undefined> {
    const [existingProfile] = await db
      .select()
      .from(academyProfiles)
      .where(eq(academyProfiles.userId, userId));
    
    if (!existingProfile) return undefined;
    
    const [updatedProfile] = await db
      .update(academyProfiles)
      .set(profile)
      .where(eq(academyProfiles.userId, userId))
      .returning();
    
    return updatedProfile;
  }

  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async getVideosByUser(userId: number): Promise<Video[]> {
    return db.select().from(videos).where(eq(videos.userId, userId));
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db
      .insert(videos)
      .values({ ...video, views: 0, likes: 0 })
      .returning();
    return newVideo;
  }

  async updateVideoStats(id: number, views?: number, likes?: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    if (!video) return undefined;
    
    const updateData: Partial<Video> = {};
    if (views !== undefined) updateData.views = views;
    if (likes !== undefined) updateData.likes = likes;
    
    const [updatedVideo] = await db
      .update(videos)
      .set(updateData)
      .where(eq(videos.id, id))
      .returning();
    
    return updatedVideo;
  }

  async getTrial(id: number): Promise<Trial | undefined> {
    const [trial] = await db.select().from(trials).where(eq(trials.id, id));
    return trial || undefined;
  }

  async getAllTrials(): Promise<Trial[]> {
    return db.select().from(trials);
  }

  async getTrialsByCreator(creatorId: number): Promise<Trial[]> {
    return db.select().from(trials).where(eq(trials.creatorId, creatorId));
  }

  async createTrial(trial: InsertTrial): Promise<Trial> {
    const [newTrial] = await db
      .insert(trials)
      .values(trial)
      .returning();
    return newTrial;
  }

  async getTrialApplication(id: number): Promise<TrialApplication | undefined> {
    const [application] = await db.select().from(trialApplications).where(eq(trialApplications.id, id));
    return application || undefined;
  }

  async getTrialApplicationsByPlayer(playerId: number): Promise<TrialApplication[]> {
    return db.select().from(trialApplications).where(eq(trialApplications.playerId, playerId));
  }

  async getTrialApplicationsByTrial(trialId: number): Promise<TrialApplication[]> {
    return db.select().from(trialApplications).where(eq(trialApplications.trialId, trialId));
  }

  async createTrialApplication(application: InsertTrialApplication): Promise<TrialApplication> {
    const [newApplication] = await db
      .insert(trialApplications)
      .values({ ...application, status: "pending" })
      .returning();
    return newApplication;
  }

  async updateTrialApplicationStatus(id: number, status: string): Promise<TrialApplication | undefined> {
    const [application] = await db.select().from(trialApplications).where(eq(trialApplications.id, id));
    if (!application) return undefined;
    
    const [updatedApplication] = await db
      .update(trialApplications)
      .set({ status })
      .where(eq(trialApplications.id, id))
      .returning();
    
    return updatedApplication;
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || undefined;
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, user1Id), eq(messages.receiverId, user2Id)),
          and(eq(messages.senderId, user2Id), eq(messages.receiverId, user1Id))
        )
      )
      .orderBy(messages.createdAt);
  }

  async getMessagesByUser(userId: number): Promise<Message[]> {
    const sentMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.senderId, userId));
    
    const receivedMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.receiverId, userId));
    
    return [...sentMessages, ...receivedMessages].sort((a, b) => {
      // Safely handle null createdAt values
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aTime - bTime;
    });
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values({ ...message, isRead: false })
      .returning();
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    if (!message) return undefined;
    
    const [updatedMessage] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    
    return updatedMessage;
  }

  async getScoutInterest(id: number): Promise<ScoutInterest | undefined> {
    const [interest] = await db.select().from(scoutInterests).where(eq(scoutInterests.id, id));
    return interest || undefined;
  }

  async getScoutInterestsByPlayer(playerId: number): Promise<ScoutInterest[]> {
    return db.select().from(scoutInterests).where(eq(scoutInterests.playerId, playerId));
  }

  async getScoutInterestsByScout(scoutId: number): Promise<ScoutInterest[]> {
    return db.select().from(scoutInterests).where(eq(scoutInterests.scoutId, scoutId));
  }

  async createScoutInterest(interest: InsertScoutInterest): Promise<ScoutInterest> {
    const [newInterest] = await db
      .insert(scoutInterests)
      .values(interest)
      .returning();
    return newInterest;
  }

  async validateCredentials(loginData: LoginData): Promise<User | undefined> {
    const { email, password } = loginData;
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.password, password)));
    
    return user || undefined;
  }
}

export const storage = new DatabaseStorage();
