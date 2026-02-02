import mongoose, { Schema, Model } from "mongoose";
import { OtpType } from "../../types/otp.type";
import { OtpContext } from "../../utils/enum.utils";

type OtpModel = Model<OtpType>;

const OtpSchema: Schema<OtpType> = new Schema<OtpType>(
    {
        mobile: { type: String, required: true, index: true },
        otp: { type: String, required: true },
        countryCode: { type: String, required: true },
        context: { type: String, required: true, index: true, enum: OtpContext },
        expiresAt: { type: Number, required: true, index: true },
        isUsed: { type: Boolean, default: false, index: true },
    },
    {
        timestamps: {
            currentTime: () => new Date().getTime() + 5.5 * 60 * 60 * 1000,
        },
        versionKey: false,
    }
);

const OtpDb: OtpModel = mongoose.model<OtpType>("Otp", OtpSchema);

export default OtpDb;
