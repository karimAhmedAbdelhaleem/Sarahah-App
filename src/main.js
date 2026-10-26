import "./config/env.config.js";
import express from "express";
import envConfig from "./config/env.config.js";
import DBconnection from "./DB/db.connection.js";
import * as middlewares from "./middlewares/index.js";
import * as controllers from "./modules/index.js";
import cors from "cors";
import { corsOptions } from "./config/cors.config.js";
import { NotFoundException } from "./utilities/Error/exceptions.js";
import { redisConnection } from "./utilities/common/clients/redis-client.js";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { limiter } from "./config/limiter.config.js";
const app = express();

//DB connection
DBconnection();

// REDIS connection
redisConnection();

//cors options
app.use(cors(corsOptions), helmet(), rateLimit(limiter));

//body parser
app.use(express.json());

//uploads middleware
app.use("/uploads", express.static("uploads"));

//default route
app.get("/", (req, res, next) => {
  res.json("sarahah app is running");
});

//controllers
app.use("/api/auth", controllers.authController);
app.use("/api/message", controllers.messageController);
app.use("/api/user", controllers.userController);

//api for handling dummy routes
app.use((req, res, next) => {
  throw new NotFoundException("not found", { path: req.path });
});

//middlewares
app.use(middlewares.globalErrorHandler);

//server
const port = envConfig.APP.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});



const uri = process.env.MONGO_DB_CLOUD;
console.log(uri.replace(/:\/\/(.*?):.*@/, "://$1:****@"), uri.length);