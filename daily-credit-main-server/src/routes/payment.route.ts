import express from "express";
import PaymentController from "../controllers/payment/payment.controller";

export default class PaymentRoute {
    public static instance: PaymentRoute = new PaymentRoute();
    public router: express.Router = express.Router();

    private constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.post("/add-payment", PaymentController.instance.addPayment.bind(PaymentController.instance));
        this.router.get("/payments/:customerId", PaymentController.instance.getPaymentsByCustomerId.bind(PaymentController.instance));
    }
}