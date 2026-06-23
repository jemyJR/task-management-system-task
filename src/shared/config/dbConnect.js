import mongoose from "mongoose";

import { MONGO_URL } from "../../constants/db.constants.js";

const dbConnect = async () => {
  try {
    await mongoose.connect(MONGO_URL);
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
};

export default dbConnect;
