import Joi from "joi";
import { Login, OtpContext } from "../utils/enum.utils";

export default class AuthValidator {
    public static instance: AuthValidator = new AuthValidator();
    private constructor() {}

    public loginSchema = Joi.object({
        mobile: Joi.string()
                .pattern(/^[6-9]\d{9}$/)
                .required()

                .trim()
                .messages({
                    "string.base": `"mobile" should be a type of 'text'`,
                    "any.required": `"mobile" is a required field`,
                    "string.pattern.base": `"mobile" must be 10 digits starting with 6-9`,
                }),
        otpId: Joi.string().trim().required().messages({
                "string.base": `"otpId" should be a type of 'text'`,
                "any.required": `"otpId" is a required field`,
            }),
        otp: Joi.string()
                .pattern(/^\d{6}$/)
                .required()
                .trim()
                .messages({
                    "string.base": `"otp" should be a type of 'text'`,
                    "string.pattern.base": `"otp" must be 6 digits`,
                    "any.required": `"otp" is a required field when type is mobile`,
                }),
    });

    public otpSendSchema = Joi.object({
        mobile: Joi.string()
            .pattern(/^[6-9]\d{9}$/)
            .required()
            .trim()
            .messages({
                "string.base": `"mobile" should be a type of 'text'`,
                "string.pattern.base": `"mobile" must be 10 digits starting with 6-9`,
                "any.required": `"mobile" is a required field`,
            }),
        context: Joi.string()
            .required()
            .trim()
            .valid(...Object.values(OtpContext))
            .messages({
                "string.base": `"context" should be a type of 'text'`,
                "any.required": `"context" is a required field`,
                "any.only": `"context" must be one of [${Object.values(OtpContext).join(", ")}]`,
            }),
    });

    public autoLoginSchema = Joi.object({
        userId: Joi.string().hex().length(24).required().messages({
            "string.base": `"userId" should be a type of 'text'`,
            "string.length": `"userId" must be 24 characters long`,
            "string.hex": `"userId" must only contain hexadecimal characters`,
            "any.required": `"userId" is a required field`,
        }),
        password: Joi.string().required().messages({
            "string.base": `"password" should be a type of 'text'`,
            "any.required": `"password" is a required field`,
        }),
        fcmToken: Joi.string().optional().trim().allow(null, "").messages({
            "string.base": `"fcmToken" should be a type of 'text'`,
        }),
    });
}
