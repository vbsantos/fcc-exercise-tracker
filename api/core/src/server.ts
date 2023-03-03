import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import multer from "multer";
const upload = multer();

import { Container } from "inversify";
import "reflect-metadata";

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
const container = new Container();

// DI Bindings
container.bind<IUserRepository>("IUserRepository").to(UserRepository);
container
  .bind<IExerciseRepository>("IExerciseRepository")
  .to(ExerciseRepository);
container.bind<IUserService>("IUserService").to(UserService);
container.bind<IExerciseService>("IExerciseService").to(ExerciseService);
container.bind<IAppController>("IAppController").to(AppController);

const appController = container.get<IAppController>("IAppController");

// Express
const app: Express = express();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(upload.none());
app.options("*", cors({ origin: false }));

// Routes
app.get("/users", appController.getUsers);
app.post("/users", appController.createUser);
app.post("/users/:_id/exercises", appController.createExercise);
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
