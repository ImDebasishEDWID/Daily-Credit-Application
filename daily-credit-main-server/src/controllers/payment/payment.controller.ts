import PaymentDb from "../../db/mongo/payment.mongo";
import { Request, Response } from "express";
import { HeadersKeys, HttpStatusCode, ResponseStatus } from "../../utils/enum.utils";
import { PaymentType } from "../../types/payment.type";
import CustomerDb from "../../db/mongo/customer.mongo";
import { CustomerType } from "../../types/customer.type";
import { ResponseType } from "../../types/response.type";
import PaymentValidator from "../../validators/payment.validator";
import { create } from "domain";

export default class PaymentController {
    public static instance: PaymentController = new PaymentController();
    private constructor() {}
    public async addPayment(req: Request, res: Response) {
        const {error} = PaymentValidator.instance.paymentDetailsSchema.validate(req.body || {});
        if(error){
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: error.message,
            };
            return res.status(HttpStatusCode.BAD_REQUEST).json(responseData);
        }
        const userId = req.headers[HeadersKeys.xUserId] as string;
        const {customerId, amount, paymentDate, note, paymentType} = req.body as PaymentType;
        const newPayment = {
            customerId,
            userId,
            amount,
            paymentDate,
            note,
            paymentType,
        };
        const createdPayment = await PaymentDb.create(newPayment);
        if(!createdPayment){
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "Failed to add payment details",
            };
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(responseData);
        }
        // Update customer's last payment details
        const updateCustomer = await CustomerDb.findByIdAndUpdate(
            customerId,
            {$set:{
                lastPaymentDate: newPayment.paymentDate,
                lastPaymentAmount: newPayment.amount,
                lastPaymentType: newPayment.paymentType,
            },
            $inc: {
                totalCredit: newPayment.paymentType === "credit" ? newPayment.amount : 0,
                totalDebit: newPayment.paymentType === "debit" ? newPayment.amount : 0,
                netAmount: newPayment.paymentType === "credit" ? newPayment.amount : -newPayment.amount
            }}
            ,
            { new: true }
        );
        const responseData: ResponseType = {
            status: ResponseStatus.SUCCESS,
            message: "Payment details added successfully",
            data: createdPayment,
        };
        return res.status(HttpStatusCode.OK).json(responseData);
    }
    public async getPaymentsByCustomerId(req: Request, res: Response) {
        const userId = req.headers[HeadersKeys.xUserId] as string;
        const {customerId} = req.query;
        const payments = await PaymentDb.find({userId: userId,customerId: customerId}).sort({paymentDate: -1}).lean();

        if(!payments){
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "Failed to retrieve payments",
            };
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(responseData);
        }

        const responseData: ResponseType = {
            status: ResponseStatus.SUCCESS,
            message: "Payments retrieved successfully",
            data: payments,
        };
        return res.status(HttpStatusCode.OK).json(responseData);
    }
}