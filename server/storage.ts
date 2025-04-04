import {
  User, InsertUser, PlayerProfile, InsertPlayerProfile, 
  ScoutProfile, InsertScoutProfile, AcademyProfile, InsertAcademyProfile,
  Video, InsertVideo, Trial, InsertTrial, TrialApplication, InsertTrialApplication,
  Message, InsertMessage, ScoutInterest, InsertScoutInterest,
  USER_ROLES, LoginData
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private playerProfiles: Map<number, PlayerProfile>;
  private scoutProfiles: Map<number, ScoutProfile>;
  private academyProfiles: Map<number, AcademyProfile>;
  private videos: Map<number, Video>;
  private trials: Map<number, Trial>;
  private trialApplications: Map<number, TrialApplication>;
  private messages: Map<number, Message>;
  private scoutInterests: Map<number, ScoutInterest>;
  
  private currentUserId: number;
  private currentPlayerProfileId: number;
  private currentScoutProfileId: number;
  private currentAcademyProfileId: number;
  private currentVideoId: number;
  private currentTrialId: number;
  private currentTrialApplicationId: number;
  private currentMessageId: number;
  private currentScoutInterestId: number;

  constructor() {
    this.users = new Map();
    this.playerProfiles = new Map();
    this.scoutProfiles = new Map();
    this.academyProfiles = new Map();
    this.videos = new Map();
    this.trials = new Map();
    this.trialApplications = new Map();
    this.messages = new Map();
    this.scoutInterests = new Map();
    
    this.currentUserId = 1;
    this.currentPlayerProfileId = 1;
    this.currentScoutProfileId = 1;
    this.currentAcademyProfileId = 1;
    this.currentVideoId = 1;
    this.currentTrialId = 1;
    this.currentTrialApplicationId = 1;
    this.currentMessageId = 1;
    this.currentScoutInterestId = 1;

    // Seed some initial data for demo purposes
    this.seedData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Player Profiles
  async getPlayerProfile(userId: number): Promise<PlayerProfile | undefined> {
    return Array.from(this.playerProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async createPlayerProfile(profile: InsertPlayerProfile): Promise<PlayerProfile> {
    const id = this.currentPlayerProfileId++;
    const playerProfile: PlayerProfile = { ...profile, id };
    this.playerProfiles.set(id, playerProfile);
    return playerProfile;
  }

  async updatePlayerProfile(userId: number, profile: Partial<InsertPlayerProfile>): Promise<PlayerProfile | undefined> {
    const existingProfile = await this.getPlayerProfile(userId);
    if (!existingProfile) return undefined;

    const updatedProfile: PlayerProfile = { ...existingProfile, ...profile };
    this.playerProfiles.set(existingProfile.id, updatedProfile);
    return updatedProfile;
  }

  // Scout Profiles
  async getScoutProfile(userId: number): Promise<ScoutProfile | undefined> {
    return Array.from(this.scoutProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async createScoutProfile(profile: InsertScoutProfile): Promise<ScoutProfile> {
    const id = this.currentScoutProfileId++;
    const scoutProfile: ScoutProfile = { ...profile, id };
    this.scoutProfiles.set(id, scoutProfile);
    return scoutProfile;
  }

  async updateScoutProfile(userId: number, profile: Partial<InsertScoutProfile>): Promise<ScoutProfile | undefined> {
    const existingProfile = await this.getScoutProfile(userId);
    if (!existingProfile) return undefined;

    const updatedProfile: ScoutProfile = { ...existingProfile, ...profile };
    this.scoutProfiles.set(existingProfile.id, updatedProfile);
    return updatedProfile;
  }

  // Academy Profiles
  async getAcademyProfile(userId: number): Promise<AcademyProfile | undefined> {
    return Array.from(this.academyProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async createAcademyProfile(profile: InsertAcademyProfile): Promise<AcademyProfile> {
    const id = this.currentAcademyProfileId++;
    const academyProfile: AcademyProfile = { ...profile, id };
    this.academyProfiles.set(id, academyProfile);
    return academyProfile;
  }

  async updateAcademyProfile(userId: number, profile: Partial<InsertAcademyProfile>): Promise<AcademyProfile | undefined> {
    const existingProfile = await this.getAcademyProfile(userId);
    if (!existingProfile) return undefined;

    const updatedProfile: AcademyProfile = { ...existingProfile, ...profile };
    this.academyProfiles.set(existingProfile.id, updatedProfile);
    return updatedProfile;
  }

  // Videos
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideosByUser(userId: number): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(
      (video) => video.userId === userId,
    );
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.currentVideoId++;
    const now = new Date();
    const video: Video = { 
      ...insertVideo, 
      id, 
      views: 0, 
      likes: 0, 
      createdAt: now 
    };
    this.videos.set(id, video);
    return video;
  }

  async updateVideoStats(id: number, views?: number, likes?: number): Promise<Video | undefined> {
    const video = await this.getVideo(id);
    if (!video) return undefined;

    const updatedVideo: Video = { 
      ...video,
      views: views !== undefined ? views : video.views,
      likes: likes !== undefined ? likes : video.likes,
    };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  // Trials
  async getTrial(id: number): Promise<Trial | undefined> {
    return this.trials.get(id);
  }

  async getAllTrials(): Promise<Trial[]> {
    return Array.from(this.trials.values());
  }

  async getTrialsByCreator(creatorId: number): Promise<Trial[]> {
    return Array.from(this.trials.values()).filter(
      (trial) => trial.creatorId === creatorId,
    );
  }

  async createTrial(insertTrial: InsertTrial): Promise<Trial> {
    const id = this.currentTrialId++;
    const now = new Date();
    const trial: Trial = { ...insertTrial, id, createdAt: now };
    this.trials.set(id, trial);
    return trial;
  }

  // Trial Applications
  async getTrialApplication(id: number): Promise<TrialApplication | undefined> {
    return this.trialApplications.get(id);
  }

  async getTrialApplicationsByPlayer(playerId: number): Promise<TrialApplication[]> {
    return Array.from(this.trialApplications.values()).filter(
      (application) => application.playerId === playerId,
    );
  }

  async getTrialApplicationsByTrial(trialId: number): Promise<TrialApplication[]> {
    return Array.from(this.trialApplications.values()).filter(
      (application) => application.trialId === trialId,
    );
  }

  async createTrialApplication(insertApplication: InsertTrialApplication): Promise<TrialApplication> {
    const id = this.currentTrialApplicationId++;
    const now = new Date();
    const application: TrialApplication = { 
      ...insertApplication, 
      id, 
      status: "pending", 
      createdAt: now 
    };
    this.trialApplications.set(id, application);
    return application;
  }

  async updateTrialApplicationStatus(id: number, status: string): Promise<TrialApplication | undefined> {
    const application = await this.getTrialApplication(id);
    if (!application) return undefined;

    const updatedApplication: TrialApplication = { ...application, status };
    this.trialApplications.set(id, updatedApplication);
    return updatedApplication;
  }

  // Messages
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => 
        (message.senderId === user1Id && message.receiverId === user2Id) ||
        (message.senderId === user2Id && message.receiverId === user1Id),
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getMessagesByUser(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.senderId === userId || message.receiverId === userId,
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      isRead: false, 
      createdAt: now 
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = await this.getMessage(id);
    if (!message) return undefined;

    const updatedMessage: Message = { ...message, isRead: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  // Scout Interests
  async getScoutInterest(id: number): Promise<ScoutInterest | undefined> {
    return this.scoutInterests.get(id);
  }

  async getScoutInterestsByPlayer(playerId: number): Promise<ScoutInterest[]> {
    return Array.from(this.scoutInterests.values()).filter(
      (interest) => interest.playerId === playerId,
    );
  }

  async getScoutInterestsByScout(scoutId: number): Promise<ScoutInterest[]> {
    return Array.from(this.scoutInterests.values()).filter(
      (interest) => interest.scoutId === scoutId,
    );
  }

  async createScoutInterest(insertInterest: InsertScoutInterest): Promise<ScoutInterest> {
    const id = this.currentScoutInterestId++;
    const now = new Date();
    const interest: ScoutInterest = { ...insertInterest, id, createdAt: now };
    this.scoutInterests.set(id, interest);
    return interest;
  }

  // Authentication
  async validateCredentials(loginData: LoginData): Promise<User | undefined> {
    const user = await this.getUserByEmail(loginData.email);
    if (!user) return undefined;
    if (user.password !== loginData.password) return undefined;
    return user;
  }

  // Seed some initial data
  private seedData() {
    // Create some demo users
    const playerUser: InsertUser = {
      email: "player@example.com",
      password: "password123",
      firstName: "David",
      lastName: "Johnson",
      role: USER_ROLES.PLAYER,
    };
    
    const scoutUser: InsertUser = {
      email: "scout@example.com",
      password: "password123",
      firstName: "John",
      lastName: "Williams",
      role: USER_ROLES.SCOUT,
    };
    
    const academyUser: InsertUser = {
      email: "academy@example.com",
      password: "password123",
      firstName: "Arsenal",
      lastName: "Academy",
      role: USER_ROLES.ACADEMY,
    };

    // Create users and profiles
    this.createUser(playerUser).then(user => {
      this.createPlayerProfile({
        userId: user.id,
        position: "Forward",
        age: 21,
        location: "London, UK",
        bio: "Passionate striker with excellent finishing skills",
        achievements: "Top scorer in university league",
        overallRating: 87,
        appearances: 56,
        goals: 32,
        isEliteProspect: true,
        isVerified: true,
        stats: {
          pace: 89,
          shooting: 92,
          passing: 78,
          dribbling: 85,
          defense: 64,
          physical: 81
        }
      });

      // Add some videos for this player
      this.createVideo({
        userId: user.id,
        title: "Goal vs Manchester City U23",
        description: "Scored this goal in the finals against Manchester City U23",
        url: "https://example.com/video1.mp4",
        thumbnail: "https://example.com/thumbnail1.jpg",
        duration: 84
      }).then(video => {
        this.updateVideoStats(video.id, 245, 32);
      });

      this.createVideo({
        userId: user.id,
        title: "Assist and Skill Moves Compilation",
        description: "Compilation of my best assists and skill moves from this season",
        url: "https://example.com/video2.mp4",
        thumbnail: "https://example.com/thumbnail2.jpg",
        duration: 225
      }).then(video => {
        this.updateVideoStats(video.id, 587, 78);
      });
    });

    this.createUser(scoutUser).then(user => {
      this.createScoutProfile({
        userId: user.id,
        organization: "Arsenal FC",
        position: "Talent Scout",
        bio: "Looking for young talented players for Arsenal's academy",
        yearsOfExperience: 8,
        isVerified: true
      });
    });

    this.createUser(academyUser).then(user => {
      this.createAcademyProfile({
        userId: user.id,
        name: "Arsenal Academy",
        location: "London, UK",
        description: "One of the premier football academies in England",
        foundedYear: 1998,
        website: "https://www.arsenal.com/academy",
        isVerified: true
      });

      // Create some trials
      this.createTrial({
        creatorId: user.id,
        title: "Arsenal Academy Trial",
        organization: "Arsenal FC",
        position: "Forward",
        ageGroup: "U23",
        location: "London, UK",
        date: new Date(2023, 6, 15), // July 15, 2023
        description: "Open trials for talented forwards to join Arsenal's U23 team",
        requirements: "Exceptional technical skills and good physical attributes",
        imageUrl: "https://example.com/arsenal-trial.jpg"
      });
    });

    // Create another academy for Chelsea
    this.createUser({
      email: "chelsea@example.com",
      password: "password123",
      firstName: "Chelsea",
      lastName: "Academy",
      role: USER_ROLES.ACADEMY,
    }).then(user => {
      this.createAcademyProfile({
        userId: user.id,
        name: "Chelsea FC Elite Development",
        location: "London, UK",
        description: "Chelsea FC's elite youth development program",
        foundedYear: 1995,
        website: "https://www.chelseafc.com/academy",
        isVerified: true
      });

      // Create a trial
      this.createTrial({
        creatorId: user.id,
        title: "Chelsea FC Elite Development",
        organization: "Chelsea FC",
        position: "Attacking Midfielder",
        ageGroup: "U23",
        location: "London, UK",
        date: new Date(2023, 7, 3), // August 3, 2023
        description: "Trials for attacking midfielders to join Chelsea's elite development program",
        requirements: "Creative players with excellent vision and passing ability",
        imageUrl: "https://example.com/chelsea-trial.jpg"
      });
    });

    // Create some scout interests
    this.users.forEach((user, userId) => {
      if (user.role === USER_ROLES.PLAYER) {
        // Find a scout
        const scout = Array.from(this.users.values()).find(u => u.role === USER_ROLES.SCOUT);
        if (scout) {
          this.createScoutInterest({
            scoutId: scout.id,
            playerId: userId,
            type: "viewed_profile",
            resourceId: null
          });

          this.createScoutInterest({
            scoutId: scout.id,
            playerId: userId,
            type: "watched_video",
            resourceId: 1 // Reference to the first video
          });

          this.createScoutInterest({
            scoutId: scout.id,
            playerId: userId,
            type: "watched_video",
            resourceId: 2 // Reference to the second video
          });
        }
      }
    });

    // Create messages
    const demo_messages = [
      { from: 2, to: 1, content: "Hi David, I'm impressed by your recent performance." },
      { from: 1, to: 2, content: "Thank you! I'm working hard to improve my skills." },
      { from: 2, to: 1, content: "I'd like to arrange a meeting to discuss opportunities at Arsenal." },
      { from: 3, to: 1, content: "We've reviewed your application for the trial." },
      { from: 2, to: 1, content: "Can you provide additional match footage?" }
    ];

    demo_messages.forEach(msg => {
      this.createMessage({
        senderId: msg.from,
        receiverId: msg.to,
        content: msg.content
      });
    });
  }
}

export const storage = new MemStorage();
