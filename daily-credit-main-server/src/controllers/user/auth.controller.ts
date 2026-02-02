import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import AuthValidator from "../../validators/auth.validator";
import { ResponseType } from "../../types/response.type";
import { HeadersKeys, HttpStatusCode, OtpContext, ResponseStatus } from "../../utils/enum.utils";
import EnvData from "../../data/env.data";
import UserDb from "../../db/mongo/user.mongo";
import { UserType } from "../../types/user.type";
import { Device, Login } from "../../utils/enum.utils";
import RedisClient from "../../db/redis/client.redis";
import RedisKeys from "../../db/redis/keys.redis";
import { JwtPayload } from "../../types/jwt.type";
import UUIDModule from "../../modules/uuid.modules";
import OTPService from "../../service/otp.service";


export default class AuthController {
    public static instance: AuthController = new AuthController();
    private constructor() {}

    public login(req: Request, res: Response): void | Response {
        console.log("Login request received");
        console.log("Request body:", req.body);
        const { error } = AuthValidator.instance.loginSchema.validate(req.body || {});
        if (error) {
            console.log("Login request validation failed:", error.message);
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: error.message,
            };

            return res.status(HttpStatusCode.BAD_REQUEST).json(responseData);
        }
        console.log("Validated login request, proceeding to mobile login");
        this.mobileLogin(req, res);
        return;
    }
  
    public async otpSend(req: Request, res: Response): Promise<Response> {
        const { error } = AuthValidator.instance.otpSendSchema.validate(req.body || {});
        if (error) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: error.message,
            };

            return res.status(HttpStatusCode.BAD_REQUEST).json(responseData);
        }
        const { mobile, context } = req.body;
        const otpId: boolean | string = await OTPService.instance.sendOTP({
            countryCode: "+91",
            mobile: mobile,
            context: context,
        });
        if (!otpId) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "Failed to send OTP",
            };
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(responseData);
        }
        const responseData: ResponseType = {
            status: ResponseStatus.SUCCESS,
            message: "OTP sent successfully",
            data: otpId.toString(),
        };
        return res.status(HttpStatusCode.OK).json(responseData);
    }

    private async mobileLogin(req: Request, res: Response): Promise<Response> {
        const { mobile, otpId, otp } = req.body;
        const isOtpValid = await OTPService.instance.verifyOTP({
            otpId: otpId,
            mobile: mobile,
            otp: otp,
            context: OtpContext.LOGIN,
        });
        if (!isOtpValid) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "Invalid OTP",
            };
            return res.status(HttpStatusCode.UNAUTHORIZED).json(responseData);
        }

        const existingUser = await UserDb.findOne({ mobile: mobile });

        if (existingUser && existingUser.isActive === false) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "User is banned",
            };
            return res.status(HttpStatusCode.FORBIDDEN).json(responseData);
        }

        if (existingUser) {
            existingUser.password = UUIDModule.instance.generateUUID();
            await existingUser.save();
            const responseData: ResponseType = {
                status: ResponseStatus.SUCCESS,
                message: "Login successful",
                data: existingUser,
            };
            return res.status(HttpStatusCode.OK).json(responseData);
        }

        const newUser: UserType = {
            mobile: mobile,
            password: UUIDModule.instance.generateUUID(),
        };

        try {
            const userData = await UserDb.create(newUser);
            const responseData: ResponseType = {
                status: ResponseStatus.SUCCESS,
                message: "Login successful",
                data: userData
            };
            return res.status(HttpStatusCode.OK).json(responseData);
        } catch (error) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: error instanceof Error ? error.message : "Failed to create user",
            };
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(responseData);
        }
    }

    public async autoLogin(req: Request, res: Response): Promise<Response> {
        const { error } = AuthValidator.instance.autoLoginSchema.validate(req.body || {});
        if (error) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: error.message,
            };

            return res.status(HttpStatusCode.BAD_REQUEST).json(responseData);
        }
        const { userId, password } = req.body;

        const userDetails = await UserDb.findOne({ _id: userId , password: password});

        if (!userDetails) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "Invalid userId or password",
            };
            return res.status(HttpStatusCode.NOT_FOUND).json(responseData);
        }

        if (userDetails.isActive === false) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "User is banned",
            };
            return res.status(HttpStatusCode.FORBIDDEN).json(responseData);
        }

        userDetails.lastLogin = new Date();
        userDetails.password = UUIDModule.instance.generateUUID();

        await userDetails.save();
        const jwtPayload: JwtPayload = {
            userId: userDetails._id.toString(),
            sessionId: UUIDModule.instance.generateUUID(),
        };

        const jwtToken = Jwt.sign(jwtPayload, EnvData.JWT_SECRET.toString(), { expiresIn: "1d" });

        // Set Session ID in Redis with 1 day expiry
        await RedisClient.instance.setData(RedisKeys.session(userDetails._id.toString()), jwtPayload.sessionId, 86400);

        res.setHeader("Authorization", `Bearer ${jwtToken}`);

        const responseData: ResponseType = {
            status: ResponseStatus.SUCCESS,
            message: "Auto login successful",
            data: <UserType>{
                userId: userDetails._id,
                mobile: userDetails.mobile,
                hasBusiness: userDetails.hasBusiness,
                //Remining data will come after building all the api's
            },
        };

        return res.status(HttpStatusCode.OK).json(responseData);
    }
}