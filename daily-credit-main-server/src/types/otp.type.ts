import { Schema } from "mongoose";
import { OtpContext } from "../utils/enum.utils";

export type OtpType = {
    _id?: string | Schema.Types.ObjectId;
    mobile: string;
    otp: string;
    countryCode: string;
    context: OtpContext;
    expiresAt: number;
    isUsed: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
