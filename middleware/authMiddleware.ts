import { IFirebase } from "config/firebaseConfig";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../entities/apiError";
import { IResponse } from "../entities/response";

interface IAuthMiddleware {
  auth(req: Request, res: Response, next: NextFunction): Promise<void>;
}

class AuthMiddleware implements IAuthMiddleware {
  firebase: IFirebase;

  constructor(firebase: IFirebase) {
    this.firebase = firebase;
  }

  async auth(req: Request, res: Response, next: NextFunction): Promise<void> {
    const fbAuth = this.firebase.auth();
    const auth = req.headers.authorization;
    if (!auth || auth == undefined) {
      const resp: IResponse = {
        data: null,
        message: "invalid token",
        status: 401,
      };
      
      res.status(500).json(resp);
    }

    try {
      const decodedTd = await fbAuth.verifyIdToken(auth!);
      const id = decodedTd.uid;

      res.locals.uid = id;
      next();
    } catch (e) {
      const resp: IResponse = {
        data: null,
        message: (e as Error).message,
        status: 401,
      };
      
      res.status(401).json(resp);
    }
  }
}

export { IAuthMiddleware, AuthMiddleware };
