import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import apiRouter from "./api.routes.js";
import corsOptions from "./shared/config/corsOrigins.js";
import setupSwagger from "./shared/documentation/swagger.config.js";
import simpleLoggerMiddleware from "./shared/middleware/simpleLogger.middleware.js";

import { NotFoundException } from "./shared/exceptions/http.exceptions.js";
import errorHandlerMiddleware from "./shared/middleware/errorHandler.middleware.js";
import securityMiddleware from "./shared/security/security.middleware.js";

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));

securityMiddleware(app);

app.use(simpleLoggerMiddleware);

setupSwagger(app);

app.use("/api/v1", apiRouter);

app.use((req, res, next) => {
  next(
    new NotFoundException(`Route ${req.originalUrl} not found on this server`)
  );
});

app.use(errorHandlerMiddleware);

export default app;
