import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { loginSchema, registerSchema, insertPlayerProfileSchema, insertScoutProfileSchema, insertAcademyProfileSchema, insertVideoSchema, insertTrialSchema, insertTrialApplicationSchema, insertMessageSchema, insertScoutInterestSchema, USER_ROLES } from "@shared/schema";
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
        const user = await storage.validateCredentials({ email, password });
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
      const user = await storage.getUser(id);
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
      const validatedData = registerSchema.parse(req.body);
      const { confirmPassword, ...userData } = validatedData;
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create user
      const user = await storage.createUser(userData);

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

  // USER PROFILES ROUTES

  // Get player profile
  app.get('/api/profiles/player/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = await storage.getPlayerProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      const user = await storage.getUser(userId);
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
      const existingProfile = await storage.getPlayerProfile(userId);
      if (existingProfile) {
        return res.status(400).json({ message: 'Profile already exists' });
      }

      const profile = await storage.createPlayerProfile({
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
      const profile = await storage.updatePlayerProfile(userId, req.body);
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
      const profile = await storage.getScoutProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      const user = await storage.getUser(userId);
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
      const existingProfile = await storage.getScoutProfile(userId);
      if (existingProfile) {
        return res.status(400).json({ message: 'Profile already exists' });
      }

      const profile = await storage.createScoutProfile({
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
      const profile = await storage.updateScoutProfile(userId, req.body);
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
      const profile = await storage.getAcademyProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      const user = await storage.getUser(userId);
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
      const existingProfile = await storage.getAcademyProfile(userId);
      if (existingProfile) {
        return res.status(400).json({ message: 'Profile already exists' });
      }

      const profile = await storage.createAcademyProfile({
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
      const profile = await storage.updateAcademyProfile(userId, req.body);
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
      const video = await storage.getVideo(id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      // Increment views
      await storage.updateVideoStats(id, video.views + 1);
      res.status(200).json({ video: { ...video, views: video.views + 1 } });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get videos by user
  app.get('/api/videos/user/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const videos = await storage.getVideosByUser(userId);
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
      
      const video = await storage.createVideo(validatedData);
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
      const video = await storage.getVideo(id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      const updatedVideo = await storage.updateVideoStats(id, undefined, video.likes + 1);
      res.status(200).json({ video: updatedVideo });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // TRIALS ROUTES

  // Get all trials
  app.get('/api/trials', async (req, res) => {
    try {
      const trials = await storage.getAllTrials();
      res.status(200).json({ trials });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get trial by ID
  app.get('/api/trials/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trial = await storage.getTrial(id);
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
      const trials = await storage.getTrialsByCreator(creatorId);
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
      
      const trial = await storage.createTrial(validatedData);
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
      const applications = await storage.getTrialApplicationsByPlayer(playerId);
      
      // Get trial details for each application
      const applicationsWithDetails = await Promise.all(
        applications.map(async (app) => {
          const trial = await storage.getTrial(app.trialId);
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
      const applications = await storage.getTrialApplicationsByTrial(trialId);
      
      // Get player details for each application
      const applicationsWithDetails = await Promise.all(
        applications.map(async (app) => {
          const user = await storage.getUser(app.playerId);
          const playerProfile = await storage.getPlayerProfile(app.playerId);
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
      const playerApplications = await storage.getTrialApplicationsByPlayer(validatedData.playerId);
      const alreadyApplied = playerApplications.find(app => app.trialId === validatedData.trialId);
      if (alreadyApplied) {
        return res.status(400).json({ message: 'Already applied to this trial' });
      }
      
      const application = await storage.createTrialApplication(validatedData);
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
      
      const application = await storage.updateTrialApplicationStatus(id, status);
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
      const messages = await storage.getMessagesBetweenUsers(currentUserId, otherUserId);
      
      // Mark messages as read
      await Promise.all(
        messages
          .filter(msg => msg.receiverId === currentUserId && !msg.isRead)
          .map(msg => storage.markMessageAsRead(msg.id))
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
      const messages = await storage.getMessagesByUser(userId);
      
      // Group messages by conversation partner
      const conversations = new Map();
      
      for (const message of messages) {
        const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
        
        if (!conversations.has(partnerId)) {
          const partner = await storage.getUser(partnerId);
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
          if (message.createdAt > conversation.lastMessage.createdAt) {
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
      
      const message = await storage.createMessage(validatedData);
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
      const interests = await storage.getScoutInterestsByPlayer(playerId);
      
      // Get scout details for each interest
      const interestsWithDetails = await Promise.all(
        interests.map(async (interest) => {
          const scout = await storage.getUser(interest.scoutId);
          const scoutProfile = await storage.getScoutProfile(interest.scoutId);
          
          let resource = null;
          if (interest.type === 'watched_video' && interest.resourceId) {
            resource = await storage.getVideo(interest.resourceId);
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
      
      const interest = await storage.createScoutInterest(validatedData);
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
