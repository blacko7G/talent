import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { dbStorage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { 
  loginSchema, registerSchema, insertPlayerProfileSchema, 
  insertScoutProfileSchema, insertAcademyProfileSchema, 
  insertVideoSchema, insertTrialSchema, insertTrialApplicationSchema, 
  insertMessageSchema, insertScoutInterestSchema, USER_ROLES,
  TrialApplication, Message, ScoutInterest
} from "@shared/schema";
import { ZodError } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { format } from "date-fns";

// Configure session store
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'footballscoutingsecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  }
};

// Setup file upload
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const videoDir = path.join(uploadDir, 'videos');
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

const imageDir = path.join(uploadDir, 'images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, videoDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const videoUpload = multer({ storage: videoStorage });
const imageUpload = multer({ storage: imageStorage });

// Error handling for zod validation
const handleZodError = (error: ZodError) => {
  return error.errors.map(err => ({
    path: err.path.join('.'),
    message: err.message
  }));
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize session
  app.use(session(sessionConfig));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await dbStorage.validateCredentials({ email, password });
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Serialize and deserialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await dbStorage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
  };

  const hasRole = (roles: string[]) => {
    return (req: Request, res: Response, next: Function) => {
      const user = req.user as any;
      if (user && roles.includes(user.role)) {
        return next();
      }
      res.status(403).json({ message: 'Forbidden' });
    };
  };

  // AUTH ROUTES
  
  // Login route
  app.post('/api/auth/login', (req, res, next) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.status(200).json({ 
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              profileImage: user.profileImage
            }
          });
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: handleZodError(error) });
      }
      next(error);
    }
  });

  // Register route
  app.post('/api/auth/register', async (req, res, next) => {
    try {
      // Validate registration data
      const validatedData = registerSchema.parse(req.body);
      const { confirmPassword, termsAccepted, ...userData } = validatedData;
      
      // Check if email already exists
      const existingUser = await dbStorage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create user with default role
      const user = await dbStorage.createUser({
        ...userData,
        role: USER_ROLES.PLAYER // Set a default role
      });

      // Log in the user
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(201).json({ 
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: handleZodError(error) });
      }
      next(error);
    }
  });

  // Logout route
  app.post('/api/auth/logout', (req, res) => {
    req.logout(() => {
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  // Get current user
  app.get('/api/auth/me', isAuthenticated, (req, res) => {
    const user = req.user as any;
    res.status(200).json({ 
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  });

  // Update user role
  app.put('/api/auth/update-role', isAuthenticated, async (req, res, next) => {
    try {
      const { role } = req.body;
      if (!Object.values(USER_ROLES).includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      const userId = (req.user as any).id;
      const updatedUser = await dbStorage.updateUserRole(userId, role);
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ 
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
          profileImage: updatedUser.profileImage
        }
      });
    } catch (error) {
      next(error);
    }
  });

  // USER PROFILES ROUTES

  // Get player profile
  app.get('/api/profiles/player/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = await dbStorage.getPlayerProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      const user = await dbStorage.getUser(userId);
      res.status(200).json({ profile, user });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Create player profile
  app.post('/api/profiles/player', isAuthenticated, hasRole([USER_ROLES.PLAYER]), async (req, res) => {
    try {
      const validatedData = insertPlayerProfileSchema.parse(req.body);
      const userId = (req.user as any).id;
      
      // Check if profile already exists
      const existingProfile = await dbStorage.getPlayerProfile(userId);
      if (existingProfile) {
        return res.status(400).json({ message: 'Profile already exists' });
      }

      const profile = await dbStorage.createPlayerProfile({
        ...validatedData,
        userId
      });
      
      res.status(201).json({ profile });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: handleZodError(error) });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update player profile
  app.put('/api/profiles/player', isAuthenticated, hasRole([USER_ROLES.PLAYER]), async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const profile = await dbStorage.updatePlayerProfile(userId, req.body);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.status(200).json({ profile });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get scout profile
  app.get('/api/profiles/scout/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = await dbStorage.getScoutProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      const user = await dbStorage.getUser(userId);
      res.status(200).json({ profile, user });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Create scout profile
  app.post('/api/profiles/scout', isAuthenticated, hasRole([USER_ROLES.SCOUT]), async (req, res) => {
    try {
      const validatedData = insertScoutProfileSchema.parse(req.body);
      const userId = (req.user as any).id;
      
      // Check if profile already exists
      const existingProfile = await dbStorage.getScoutProfile(userId);
      if (existingProfile) {
        return res.status(400).json({ message: 'Profile already exists' });
      }

      const profile = await dbStorage.createScoutProfile({
        ...validatedData,
        userId
      });
      
      res.status(201).json({ profile });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: handleZodError(error) });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update scout profile
  app.put('/api/profiles/scout', isAuthenticated, hasRole([USER_ROLES.SCOUT]), async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const profile = await dbStorage.updateScoutProfile(userId, req.body);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.status(200).json({ profile });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get academy profile
  app.get('/api/profiles/academy/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = await dbStorage.getAcademyProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      const user = await dbStorage.getUser(userId);
      res.status(200).json({ profile, user });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Create academy profile
  app.post('/api/profiles/academy', isAuthenticated, hasRole([USER_ROLES.ACADEMY]), async (req, res) => {
    try {
      const validatedData = insertAcademyProfileSchema.parse(req.body);
      const userId = (req.user as any).id;
      
      // Check if profile already exists
      const existingProfile = await dbStorage.getAcademyProfile(userId);
      if (existingProfile) {
        return res.status(400).json({ message: 'Profile already exists' });
      }

      const profile = await dbStorage.createAcademyProfile({
        ...validatedData,
        userId
      });
      
      res.status(201).json({ profile });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: handleZodError(error) });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update academy profile
  app.put('/api/profiles/academy', isAuthenticated, hasRole([USER_ROLES.ACADEMY]), async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const profile = await dbStorage.updateAcademyProfile(userId, req.body);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.status(200).json({ profile });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // VIDEOS ROUTES

  // Get video by ID
  app.get('/api/videos/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await dbStorage.getVideo(id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      // Increment views
      await dbStorage.updateVideoStats(id, (video.views ?? 0) + 1);
      res.status(200).json({ video: { ...video, views: (video.views ?? 0) + 1 } });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get videos by user
  app.get('/api/videos/user/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const videos = await dbStorage.getVideosByUser(userId);
      res.status(200).json({ videos });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Upload video
  app.post('/api/videos', isAuthenticated, videoUpload.single('videoFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Video file is required' });
      }

      const validatedData = insertVideoSchema.parse({
        ...req.body,
        userId: (req.user as any).id,
        url: `/uploads/videos/${req.file.filename}`,
        thumbnail: req.body.thumbnail || null
      });
      
      const video = await dbStorage.createVideo(validatedData);
      res.status(201).json({ video });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: handleZodError(error) });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Like video
  app.post('/api/videos/:id/like', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await dbStorage.getVideo(id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      const updatedVideo = await dbStorage.updateVideoStats(id, undefined, (video.likes ?? 0) + 1);
      res.status(200).json({ video: updatedVideo });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // TRIALS ROUTES

  // Get all trials
  app.get('/api/trials', async (req, res) => {
    try {
      const trials = await dbStorage.getAllTrials();
      res.status(200).json({ trials });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get trial by ID
  app.get('/api/trials/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trial = await dbStorage.getTrial(id);
      if (!trial) {
        return res.status(404).json({ message: 'Trial not found' });
      }
      res.status(200).json({ trial });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get trials created by user
  app.get('/api/trials/creator/:creatorId', async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const trials = await dbStorage.getTrialsByCreator(creatorId);
      res.status(200).json({ trials });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Create trial
  app.post('/api/trials', isAuthenticated, hasRole([USER_ROLES.ACADEMY]), async (req, res) => {
    try {
      const validatedData = insertTrialSchema.parse({
        ...req.body,
        creatorId: (req.user as any).id
      });
      
      const trial = await dbStorage.createTrial(validatedData);
      res.status(201).json({ trial });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: handleZodError(error) });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  // TRIAL APPLICATIONS ROUTES

  // Get trial applications by player
  app.get('/api/applications/player', isAuthenticated, hasRole([USER_ROLES.PLAYER]), async (req, res) => {
    try {
      const playerId = (req.user as any).id;
      const applications = await dbStorage.getTrialApplicationsByPlayer(playerId);
      
      // Get trial details for each application
      const applicationsWithDetails = await Promise.all(
        applications.map(async (app: TrialApplication) => {
          const trial = await dbStorage.getTrial(app.trialId);
          return { ...app, trial };
        })
      );
      
      res.status(200).json({ applications: applicationsWithDetails });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get trial applications by trial
  app.get('/api/applications/trial/:trialId', isAuthenticated, hasRole([USER_ROLES.ACADEMY]), async (req, res) => {
    try {
      const trialId = parseInt(req.params.trialId);
      const applications = await dbStorage.getTrialApplicationsByTrial(trialId);
      
      // Get player details for each application
      const applicationsWithDetails = await Promise.all(
        applications.map(async (app: TrialApplication) => {
          const user = await dbStorage.getUser(app.playerId);
          const playerProfile = await dbStorage.getPlayerProfile(app.playerId);
          return { ...app, player: { ...user, profile: playerProfile } };
        })
      );
      
      res.status(200).json({ applications: applicationsWithDetails });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Apply for trial
  app.post('/api/applications', isAuthenticated, hasRole([USER_ROLES.PLAYER]), async (req, res) => {
    try {
      const validatedData = insertTrialApplicationSchema.parse({
        ...req.body,
        playerId: (req.user as any).id
      });
      
      // Check if already applied
      const playerApplications = await dbStorage.getTrialApplicationsByPlayer(validatedData.playerId);
      const alreadyApplied = playerApplications.find((app: TrialApplication) => app.trialId === validatedData.trialId);
      if (alreadyApplied) {
        return res.status(400).json({ message: 'Already applied to this trial' });
      }
      
      const application = await dbStorage.createTrialApplication(validatedData);
      res.status(201).json({ application });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: handleZodError(error) });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update application status
  app.put('/api/applications/:id/status', isAuthenticated, hasRole([USER_ROLES.ACADEMY]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (!['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const application = await dbStorage.updateTrialApplicationStatus(id, status);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      res.status(200).json({ application });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // MESSAGES ROUTES

  // Get messages between users
  app.get('/api/messages/:userId', isAuthenticated, async (req, res) => {
    try {
      const currentUserId = (req.user as any).id;
      const otherUserId = parseInt(req.params.userId);
      const messages = await dbStorage.getMessagesBetweenUsers(currentUserId, otherUserId);
      
      // Mark messages as read
      await Promise.all(
        messages
          .filter((msg: Message) => msg.receiverId === currentUserId && !msg.isRead)
          .map((msg: Message) => dbStorage.markMessageAsRead(msg.id))
      );
      
      res.status(200).json({ messages });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get all user conversations
  app.get('/api/messages', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const messages = await dbStorage.getMessagesByUser(userId);
      
      // Group messages by conversation partner
      const conversations = new Map();
      
      for (const message of messages) {
        const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
        
        if (!conversations.has(partnerId)) {
          const partner = await dbStorage.getUser(partnerId);
          conversations.set(partnerId, {
            partner: {
              id: partner?.id,
              firstName: partner?.firstName,
              lastName: partner?.lastName,
              role: partner?.role,
              profileImage: partner?.profileImage
            },
            lastMessage: message,
            unreadCount: message.receiverId === userId && !message.isRead ? 1 : 0
          });
        } else {
          const conversation = conversations.get(partnerId);
          // Update last message if this one is newer
          if (message.createdAt && message.createdAt > conversation.lastMessage.createdAt) {
            conversation.lastMessage = message;
          }
          // Count unread messages
          if (message.receiverId === userId && !message.isRead) {
            conversation.unreadCount += 1;
          }
        }
      }
      
      // Convert to array and sort by last message date
      const conversationsArray = Array.from(conversations.values())
        .sort((a, b) => b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime());
      
      res.status(200).json({ conversations: conversationsArray });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Send message
  app.post('/api/messages', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse({
        ...req.body,
        senderId: (req.user as any).id
      });
      
      const message = await dbStorage.createMessage(validatedData);
      res.status(201).json({ message });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: handleZodError(error) });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  // SCOUT INTERESTS ROUTES

  // Get scout interests by player
  app.get('/api/interests/player/:playerId', async (req, res) => {
    try {
      const playerId = parseInt(req.params.playerId);
      const interests = await dbStorage.getScoutInterestsByPlayer(playerId);
      
      // Get scout details for each interest
      const interestsWithDetails = await Promise.all(
        interests.map(async (interest: ScoutInterest) => {
          const scout = await dbStorage.getUser(interest.scoutId);
          const scoutProfile = await dbStorage.getScoutProfile(interest.scoutId);
          
          let resource = null;
          if (interest.type === 'watched_video' && interest.resourceId) {
            resource = await dbStorage.getVideo(interest.resourceId);
          }
          
          return { 
            ...interest, 
            scout: { ...scout, profile: scoutProfile },
            resource
          };
        })
      );
      
      res.status(200).json({ interests: interestsWithDetails });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Record scout interest
  app.post('/api/interests', isAuthenticated, hasRole([USER_ROLES.SCOUT]), async (req, res) => {
    try {
      const validatedData = insertScoutInterestSchema.parse({
        ...req.body,
        scoutId: (req.user as any).id
      });
      
      const interest = await dbStorage.createScoutInterest(validatedData);
      res.status(201).json({ interest });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: handleZodError(error) });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    // Check if user is authenticated for private files
    // You can implement more granular access control here
    next();
  }, express.static(uploadDir));

  const httpServer = createServer(app);

  return httpServer;
}
