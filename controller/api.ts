import { NextFunction, Request, Response } from "express";
import { IUserRepository, UserRepository } from "../repository/userCollection";
import { IResponse } from "../entities/response";
import { ToUserDto } from "../repository/dto/user";
import { IFirebase } from "../config/firebaseConfig";
import bcrypt from "bcryptjs";

export interface IApiController {
  update(req: Request, res: Response, next: NextFunction): Promise<void>;
  fetch(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class ApiController implements IApiController {
  public repo: IUserRepository;

  constructor(firebase: IFirebase) {
    this.repo = new UserRepository(firebase);
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const data = req.body;
    const id = res.locals.uid;
    const password = bcrypt.hashSync(data.password, 10);
    const dto = ToUserDto(id, data.name, data.username, password);

    try {
      await this.repo.update(dto);
      const response: IResponse = {
        data: null,
        message: "Ok",
        status: 200,
      };

      res.status(response.status).json(response);
    } catch (e) {
      const resp: IResponse = {
        data: null,
        message: (e as Error).message,
        status: 500,
      };
      res.status(500).json(resp);
    }
  }

  async fetch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.repo.fetch();
      const response: IResponse = {
        data: users,
        message: "Ok",
        status: 200,
      };

      res.status(response.status).json(response);
    } catch (e) {
      const resp: IResponse = {
        data: null,
        message: (e as Error).message,
        status: 500,
      };

      res.status(500).json(resp);
    }
  }
}
