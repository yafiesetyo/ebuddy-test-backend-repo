import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { ApiController, IApiController } from "../controller/api";
import { AuthMiddleware, IAuthMiddleware } from "../middleware/authMiddleware";
import { FirebaseConfig } from "../config/firebaseConfig";
import { errHandler } from "../entities/apiError";
import "express-async-errors";
import { AppOptions } from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";

dotenv.config();

const fbc: AppOptions = {
  credential: applicationDefault(),
};

const fb = new FirebaseConfig(fbc);
const ac: IApiController = new ApiController(fb);
const am: IAuthMiddleware = new AuthMiddleware(fb);

const app: Express = express();
const port = process.env.PORT || 3000;

const authMiddleware = function (req: Request, res: Response, next: NextFunction) {
  am.auth(req, res, next);
}

// router
// app.use(am.auth);
// app.use(errHandler);
app.use(express.json());
// app.use(authMiddleware);

app.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  await ac.fetch(req, res, next);
});

app.put("/", async (req: Request, res: Response, next: NextFunction) => {
  await ac.update(req, res, next);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
