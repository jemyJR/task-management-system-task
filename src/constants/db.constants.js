import config from "../shared/config/config.js";

export const MONGO_URL =
  config.MONGO_URI ||
  `mongodb+srv://${config.DB_USER}:` +
    `${config.DB_PASSWORD}@` +
    `${config.DB_HOST}/` +
    `${config.NODE_ENV}?` +
    `${config.DB_OPTIONS}`;
