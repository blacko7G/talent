import { db } from "./db";
import { users } from "@shared/schema";
import { dbStorage } from "./storage";

async function resetDatabase() {
  try {
    // Delete all users
    await db.delete(users);
    
    // Create a test user with specific credentials
    const testUser = await dbStorage.createUser({
      email: "admin@test.com",
      password: "admin123",
      firstName: "Admin",
      lastName: "User",
      role: "player"
    });
    
    console.log("Database reset successful!");
    console.log("Test user created with these credentials:");
    console.log("Email: admin@test.com");
    console.log("Password: admin123");
    console.log("\nUser details:", testUser);
    
    process.exit(0);
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase(); 