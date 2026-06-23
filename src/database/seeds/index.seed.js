import mongoose from "mongoose";
import dbConnect from "../../shared/config/dbConnect.js";

import { seedUsers } from "./users.seed.js";

const runAllSeeds = async () => {
  try {
    await dbConnect();
    console.log("🌱 Starting Database Seeding...");
    await seedUsers();

    console.log("All seeds finished successfully!");
  } catch (error) {
    console.error(" Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

runAllSeeds();
