import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const configSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid("development", "staging", "production")
    .default("development"),

  MONGO_URI: Joi.string().required(),

  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_OPTIONS: Joi.string().default(""),

  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRY: Joi.string().default("5m"),
  REFRESH_TOKEN_EXPIRY: Joi.string().default("7d"),

  ALLOWED_ORIGINS: Joi.string().required(),

  LOG_LEVEL: Joi.string()
    .valid("debug", "info", "warn", "error")
    .default("debug"),
  ENABLE_DB_LOGGING: Joi.boolean().truthy("true").falsy("false").default(false),
});

const { error, value: config } = configSchema.validate(process.env, {
  allowUnknown: true,
  stripUnknown: true,
});

if (error) {
  console.error("Invalid environment variables:", error);
  process.exit(1);
}

export default config;
