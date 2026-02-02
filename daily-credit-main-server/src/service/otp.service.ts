import EnvData from "../data/env.data";
import OtpDb from "../db/mongo/otp.mongo";
import { OtpType } from "../types/otp.type";
import { OtpContext } from "../utils/enum.utils";

export default class OTPService {
    public static instance: OTPService = new OTPService();
    private constructor() {}

    public async sendOTP({ countryCode, mobile, context }: { countryCode: string; mobile: string; context: OtpContext }): Promise<boolean | string> {
        const otp = await this.generateOTP();
        const isSent = await this.sendViaDemo({
            countryCode: countryCode,
            mobile: mobile,
            otp: otp,
        });

        if (!isSent) {
            return false;
        }

        const otpData: OtpType = {
            mobile: mobile,
            countryCode: countryCode,
            otp: otp,
            context: context,
            expiresAt: Date.now() + 5 * 60 * 1000,
            isUsed: false,
        };
        const resp = await OtpDb.create(otpData);
        if (!resp || !resp._id) {
            return false;
        }
        return resp._id.toString();
    }

    public async verifyOTP({ otpId, mobile, otp, context }: { otpId: string; mobile: string; otp: string; context: OtpContext }): Promise<boolean> {
        const otpRecord = await OtpDb.findById(otpId);
        if (!otpRecord) {
            return false;
        }
        if (otpRecord.isUsed) {
            return false;
        }
        if (otpRecord.mobile !== mobile) {
            return false;
        }
        if (otpRecord.otp !== otp) {
            return false;
        }
        if (otpRecord.context !== context) {
            return false;
        }
        if (otpRecord.expiresAt < Date.now()) {
            return false;
        }
        otpRecord.isUsed = true;
        await otpRecord.save();
        return true;
    }

    private async generateOTP(): Promise<string> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return EnvData.SERVER_ENV === "dev" ? "123456" : otp;
    }

    private async sendViaDemo({ countryCode, mobile, otp }: { countryCode: string; mobile: string; otp: string }): Promise<boolean> {
        console.log(`Sending OTP ${otp} to ${countryCode}${mobile} via Demo Service`);
        return true;
    }
}
