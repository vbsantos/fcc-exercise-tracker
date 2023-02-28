import { NextFunction, Request, Response } from "express";

import { IUserService } from "../Services/User.Service";
import { IExerciseService } from "../Services/Exercise.Service";

export interface IAppController {
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  createUserExercise(req: Request, res: Response): Promise<void>;
  getUserExercises(req: Request, res: Response): Promise<void>;
}

export class AppController implements IAppController {
  private userService: IUserService;
  private exerciseService: IExerciseService;

  constructor(userService: IUserService, exerciseService: IExerciseService) {
    this.userService = userService;
    this.exerciseService = exerciseService;
    this.createUser = this.createUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.createUserExercise = this.createUserExercise.bind(this);
    this.getUserExercises = this.getUserExercises.bind(this);
  }

  /**
   * Create a new user and return a response object with username and _id properties
   */
  public async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { username } = req.body;

    if (!username) {
      res.status(422).json({ error: "Invalid Input." });
      return next();
    }

    const serviceResponse = await this.userService.createUser(username);

    if (!serviceResponse) {
      res.status(500).json({ error: "Something went wrong." });
      return next();
    }

    res.status(200).json(serviceResponse);
  }

  /**
   * Return an array of user objects with username and _id properties
   */
  public async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const serviceResponse = await this.userService.getUsers();

    if (!serviceResponse) {
      res.status(500).json({ error: "Something went wrong." });
      return next();
    }

    res.status(200).json(serviceResponse);
  }

  /**
   * /api/users/:_id/exercises
   * A POST route for adding exercises to a user at /api/users/:_id/exercises that accepts form data with description, duration, and optionally date fields. If no date is supplied, the current date should be used. This route should add the exercise to the user and return the updated user object.
   */
  public async createUserExercise(req: Request, res: Response): Promise<void> {
    const { userId, description, duration, date } = req.body;
  }

  /**
   * /api/users/:_id/logs
   * A GET route for retrieving a user's exercise log at /api/users/:_id/logs. This route should return a user object with a count property representing the number of exercises that belong to that user and a log array containing all the exercises. The log array should contain objects with description, duration, and date properties.
   * /api/users/:_id/logs?from=&to=&limit=
   * The GET route for retrieving a user's exercise log should also accept optional query parameters from, to, and limit. The from and to parameters should be dates in yyyy-mm-dd format and the limit parameter should be an integer. The route should return a subset of the user's exercise log based on the query parameters.
   */
  public async getUserExercises(req: Request, res: Response): Promise<void> {
    const { _id } = req.params;
    const { from, to, limit } = req.query;
  }
}
