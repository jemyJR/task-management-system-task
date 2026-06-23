import fs from "fs/promises";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dbConnect from "../../shared/config/dbConnect.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runAllMigrations = async () => {
  try {
    await dbConnect();
    console.log("Starting Database Migrations...");

    const files = await fs.readdir(__dirname);

    const migrationFiles = files
      .filter((file) => file.endsWith(".js") && file !== "index.migrate.js")
      .sort();

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}...`);

      const module = await import(`./${file}`);

      if (module.migrate && typeof module.migrate === "function") {
        await module.migrate();
      } else {
        console.warn(
          `Warning: No 'migrate' exported function found in ${file}`,
        );
      }
    }

    console.log("All migrations finished successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

runAllMigrations();
