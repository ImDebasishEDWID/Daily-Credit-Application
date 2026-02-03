import express from 'express';
import UserController from '../controllers/user/user.controller';

export default class UserRoute {
    public static instance: UserRoute = new UserRoute();
    public router: express.Router = express.Router();

    private constructor() {
        this.initializeRoutes();
    } 
    private initializeRoutes() {
        this.router.post('/add-business-details', UserController.instance.addBusinessDetails.bind(UserController.instance));
    }  
}