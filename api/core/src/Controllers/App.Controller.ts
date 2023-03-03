import { NextFunction, Request, Response } from "express";

import { IUserService } from "../Services/User.Service";
import {
  IExerciseLogServiceResponse,
  IExerciseService,
  IExerciseServiceResponse,
} from "../Services/Exercise.Service";
import { HttpStatusCode } from "./HttpStatusCode.Enum";
import { ILogFilters } from "../Repositories/Exercise.Repository";

export interface IAppController {
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  createExercise(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getUserExercises(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

export class AppController implements IAppController {
  private userService: IUserService;
  private exerciseService: IExerciseService;

  constructor(userService: IUserService, exerciseService: IExerciseService) {
    this.userService = userService;
    this.exerciseService = exerciseService;
    this.createUser = this.createUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.createExercise = this.createExercise.bind(this);
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
      res.status(HttpStatusCode.BadRequest).json({ error: "Invalid Input." });
      return next();
    }

    const serviceResponse = await this.userService.createUser(username);

    if (!serviceResponse) {
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ error: "Something went wrong." });
      return next();
    }

    res
      .status(HttpStatusCode.Created)
      .json({ ...serviceResponse, _id: `${serviceResponse._id}` });
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
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ error: "Something went wrong." });
      return next();
    }

    res
      .status(HttpStatusCode.OK)
      .json(serviceResponse.map((r) => ({ ...r, _id: `${r._id}` })));
  }

  /**
   * /api/users/:_id/exercises
   * A POST route for adding exercises to a user at /api/users/:_id/exercises that accepts form data with description, duration, and optionally date fields. If no date is supplied, the current date should be used. This route should add the exercise to the user and return the updated user object.
   */
  public async createExercise(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = Number(req.params._id);
    const duration = Number(req.body.duration);
    const description = req.body.description;
    const date: Date | undefined = Date.parse(`${req.body.date}`)
      ? new Date(`${req.body.date}`)
      : undefined;

    if (!userId || !description || !duration) {
      res.status(HttpStatusCode.BadRequest).json({ error: "Invalid Input." });
      return next();
    }

    const serviceResponse: IExerciseServiceResponse | null =
      await this.exerciseService.createExercise(
        userId,
        description,
        duration,
        date
      );

    if (!serviceResponse) {
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ error: "Something went wrong." });
      return next();
    }

    res.status(HttpStatusCode.Created).json({
      ...serviceResponse,
      _id: `${serviceResponse._id}`,
      date: date ? date.toDateString() : new Date().toDateString(),
    });
  }

  /**
   * /api/users/:_id/logs
   * A GET route for retrieving a user's exercise log at /api/users/:_id/logs. This route should return a user object with a count property representing the number of exercises that belong to that user and a log array containing all the exercises. The log array should contain objects with description, duration, and date properties.
   * /api/users/:_id/logs?from=&to=&limit=
   * The GET route for retrieving a user's exercise log should also accept optional query parameters from, to, and limit. The from and to parameters should be dates in yyyy-mm-dd format and the limit parameter should be an integer. The route should return a subset of the user's exercise log based on the query parameters.
   */
  public async getUserExercises(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const _id = Number(req.params._id);
    const _from: Date | undefined = Date.parse(`${req.query.from}`)
      ? new Date(`${req.query.from}`)
      : undefined;
    const _to: Date | undefined = Date.parse(`${req.query.to}`)
      ? new Date(`${req.query.to}`)
      : undefined;
    const _limit = Number(req.query.limit);

    if (!_id || isNaN(_id)) {
      res.status(HttpStatusCode.BadRequest).json({ error: "Invalid Input." });
      return next();
    }

    if (_limit && (isNaN(Number(_limit)) || Number(_limit) < 1)) {
      res
        .status(HttpStatusCode.BadRequest)
        .json({ error: "Invalid 'limit' parameter." });
      return next();
    }

    const filters: ILogFilters = {
      from: _from,
      to: _to,
      limit: _limit,
    };
    const serviceResponse: IExerciseLogServiceResponse | null =
      await this.exerciseService.getExercisesByUserId(_id, filters);

    if (!serviceResponse) {
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ error: "Something went wrong." });
      return next();
    }

    res.status(HttpStatusCode.OK).json({
      ...serviceResponse,
      _id: `${serviceResponse._id}`,
      log: serviceResponse.log.map((l) => ({
        ...l,
        date: l.date ? l.date.toDateString() : new Date().toDateString(),
      })),
    });
  }
}
