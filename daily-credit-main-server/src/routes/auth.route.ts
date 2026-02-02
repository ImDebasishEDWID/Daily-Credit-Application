import express from "express";
import AuthController from "../controllers/user/auth.controller";

export default class AuthRoute {
    public static instance: AuthRoute = new AuthRoute();
    public router: express.Router = express.Router();
    private constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.post("/login", AuthController.instance.login.bind(AuthController.instance));
        this.router.post("/auto-login", AuthController.instance.autoLogin.bind(AuthController.instance));
        this.router.post("/otp-send", AuthController.instance.otpSend.bind(AuthController.instance));
    }
}
