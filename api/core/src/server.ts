import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
const multer  = require('multer')
const upload = multer()

import {
  IUserRepository,
  UserRepository,
} from "./Repositories/User.Repository";
import {
  ExerciseRepository,
  IExerciseRepository,
} from "./Repositories/Exercise.Repository";

import { UserService, IUserService } from "./Services/User.Service";
import { ExerciseService, IExerciseService } from "./Services/Exercise.Service";

import { AppController, IAppController } from "./Controllers/App.Controller";

// Instances
const userRepository: IUserRepository = new UserRepository();
const exerciseRepository: IExerciseRepository = new ExerciseRepository();

const userService: IUserService = new UserService(userRepository);
const exerciseService: IExerciseService = new ExerciseService(
  exerciseRepository,
  userRepository
);

const appController: IAppController = new AppController(
  userService,
  exerciseService
);

// Express
const app: Express = express();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(upload.none());
app.use(cors());

// Routes
app.get("/users", appController.getUsers);
app.post("/users", appController.createUser);
app.post("/users/:_id/exercise", appController.createExercise);
app.get("/users/:_id/logs", appController.getUserExercises);

// Error Handler Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Error" });
});

// Error Handler
process.on("unhandledRejection", (error: Error | any) => {
  console.error("Unhandled Rejection");
  throw new Error(error);
});

// Server port
if (!module.parent) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`API is ready at port ${PORT}`));
}

export default app;
