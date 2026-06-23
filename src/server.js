import mongoose from "mongoose";

import app from "./app.js";
import config from "./shared/config/config.js";
import dbConnect from "./shared/config/dbConnect.js";
import logger from "./shared/utils/logger.js";

dbConnect();

mongoose.connection.once("open", () => {
  logger.info("Connected to the database");
  app.listen(config.PORT, () => {
    logger.info(`Server is running on port ${config.PORT}`);
  });
});

mongoose.connection.on("error", (error) => {
  logger.error(`Error connecting to the database: ${error}`);
});
