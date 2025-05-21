import { Router } from "express";
import AuthController from "../controllers/auth";

const authRouter = Router();

authRouter.route("/me")
    .get(AuthController.getUser);

authRouter.route("/register")
    .post(AuthController.register);

authRouter.route("/login")
    .post(AuthController.authenticate);

authRouter.route("/refresh")
    .get(AuthController.refresh);

authRouter.route("/logout")
    .get(AuthController.logout);

export { authRouter };