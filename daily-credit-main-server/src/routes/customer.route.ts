import { Router } from "express";
import CustomerController from "../controllers/customer/customer.controller";


export default class CustomerRoute {
    public static instance: CustomerRoute = new CustomerRoute();
    public router: Router = Router();

    private constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/customers", CustomerController.instance.getCustomers.bind(CustomerController.instance));
        this.router.post("/add-customer-details", CustomerController.instance.addCustomerDetails.bind(CustomerController.instance));
    }
}