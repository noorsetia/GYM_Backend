import { config } from "dotenv";
import fs from "fs";
import { connectDB } from "./config/database.js";
import Admin from "./models/Admin.js";
import Plan from "./models/Plan.js";

// Load environment variables
const envPath = fs.existsSync("./config.env") ? "./config.env" : fs.existsSync("./.env") ? "./.env" : undefined;
if (envPath) {
  config({ path: envPath });
}

// Connect to MongoDB
connectDB();

const seedData = async () => {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Admin.deleteMany();
    // await Plan.deleteMany();

    // Create default admin if not exists
    const adminExists = await Admin.findOne({ email: "admin@gym.com" });
    if (!adminExists) {
      await Admin.create({
        name: "Admin",
        email: "admin@gym.com",
        password: "admin123", // Change this password in production!
      });
      console.log("✅ Default admin created (email: admin@gym.com, password: admin123)");
    } else {
      console.log("ℹ️  Admin already exists");
    }

    // Create default plans if not exists
    const plansExist = await Plan.countDocuments();
    if (plansExist === 0) {
      await Plan.insertMany([
        {
          name: "Quarterly",
          duration: 3,
          price: 3000,
          description: "Perfect for beginners who want to try out our gym for 3 months",
          features: [
            "Access to all gym equipment",
            "Free fitness assessment",
            "Basic workout plan",
            "Locker facility",
          ],
        },
        {
          name: "Half Yearly",
          duration: 6,
          price: 5500,
          description: "Great value for committed fitness enthusiasts",
          features: [
            "Access to all gym equipment",
            "Free fitness assessment",
            "Personalized workout plan",
            "Diet consultation",
            "Locker facility",
            "Access to group classes",
          ],
        },
        {
          name: "Yearly",
          duration: 12,
          price: 10000,
          description: "Best value for serious fitness goals with maximum benefits",
          features: [
            "Access to all gym equipment",
            "Free fitness assessment (quarterly)",
            "Personalized workout plan",
            "Monthly diet consultation",
            "Locker facility",
            "Access to all group classes",
            "Personal trainer session (monthly)",
            "Free protein shake daily",
          ],
        },
      ]);
      console.log("✅ Default plans created (Quarterly, Half Yearly, Yearly)");
    } else {
      console.log("ℹ️  Plans already exist");
    }

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
