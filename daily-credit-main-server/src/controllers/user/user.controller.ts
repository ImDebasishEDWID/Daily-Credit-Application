import { Request, Response } from "express";
import { HeadersKeys, HttpStatusCode, ResponseStatus } from "../../utils/enum.utils";
import { UserType } from "../../types/user.type";
import { ResponseType } from "../../types/response.type";
import BusinessValidator from "../../validators/business.validator";
import UserDb from "../../db/mongo/user.mongo";

export default class UserController {
    public static instance: UserController = new UserController();

    private constructor() {}

    public async addBusinessDetails(req: Request, res: Response) {
        const {error} = BusinessValidator.instance.businessDetailsSchema.validate(req.body || {});
        if(error){
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: error.message,
            };
            return res.status(HttpStatusCode.BAD_REQUEST).json(responseData);
        }
        const userId = req.headers[HeadersKeys.xUserId] as string;
        const user = await UserDb.findById(userId).select("mobile").lean();
        if (!user) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "User not found",
            };
            return res.status(HttpStatusCode.NOT_FOUND).json(responseData);
        }
        // Update business details
        const { bussinessName, businessAddress, gstNumber, state } = req.body;
        const update = {
            bussinessName,
            businessAddress,
            gstNumber,
            state,
            hasBusiness: true
        };
        const updatedUser = await UserDb.findByIdAndUpdate(
            userId,
            { $set: update },
            { new: true }
        ).select("-password -__v -createdAt -updatedAt -password -totalGst -totalSales").lean();
        if (!updatedUser) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "No changes made to the profile",
            };
            return res.status(HttpStatusCode.OK).json(responseData);
        }
        const responseData: ResponseType = {
            status: ResponseStatus.SUCCESS,
            message: "Business details added successfully",
            data: updatedUser,
        };
        return res.status(HttpStatusCode.OK).json(responseData);
    }
}