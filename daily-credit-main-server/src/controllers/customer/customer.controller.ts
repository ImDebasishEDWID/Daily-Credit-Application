import { Request, Response } from "express";
import { HeadersKeys, HttpStatusCode, ResponseStatus } from "../../utils/enum.utils";
import { UserType } from "../../types/user.type";
import CustomerDb from "../../db/mongo/customer.mongo";
import CustomerValidator from "../../validators/customer.validator";
import { CustomerType } from "../../types/customer.type";

export default class CustomerController {
    public static instance: CustomerController = new CustomerController();
    private constructor() {}
    public async getCustomers(req: Request, res: Response) {
        const userId = req.headers[HeadersKeys.xUserId] as string;
        const customers: CustomerType[] =  await CustomerDb.find({userId: userId}).select("name lastPaymentDate lastPaymentAmount lastPaymentType").lean();
        const responseData = {
            status: ResponseStatus.SUCCESS,
            message: "Customers retrieved successfully",
            data: customers,
        };
        return res.status(HttpStatusCode.OK).json(responseData);
    }
    public async addCustomerDetails(req: Request, res: Response) {
        const {error} = CustomerValidator.instance.customerDetailsSchema.validate(req.body || {});
        
        if(error){
            const responseData = {
                status: ResponseStatus.ERROR,
                message: error.message,
            };
            return res.status(HttpStatusCode.BAD_REQUEST).json(responseData);
        }
        const isExistingCustomer = await CustomerDb.findOne({name: req.body.name}).lean();
        if(isExistingCustomer){
            const responseData = {
                status: ResponseStatus.ERROR,
                message: "Customer with this name already exists",
            };
            return res.status(HttpStatusCode.CONFLICT).json(responseData);
        }
        const userId = req.headers[HeadersKeys.xUserId] as string;
        const {name, mobile, imgUrl, address} = req.body;
        const newCustomer = {
            name,
            mobile,
            imgUrl,
            address,
            userId: userId,
        };
        const createdCustomer = await CustomerDb.create(newCustomer);

        if(!createdCustomer){
            const responseData = {
                status: ResponseStatus.ERROR,
                message: "Failed to add customer details",
            };
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(responseData);
        }
        const updateUser = await CustomerDb.findByIdAndUpdate(userId,{ $inc: { totalCustomers: 1 } });
        const responseData = {
            status: ResponseStatus.SUCCESS,
            message: "Customer details added successfully",
            data: createdCustomer,
        };
        return res.status(HttpStatusCode.OK).json(responseData);
    }
}