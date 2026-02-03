import Joi from "joi";

export default class BusinessValidator {
    public static instance: BusinessValidator = new BusinessValidator();
    private constructor() {};
    public businessDetailsSchema = Joi.object({
        bussinessName: Joi.string()
            .min(2).required().trim()
            .messages({
                "string.base": `"bussinessName" should be a type of 'text'`,
                "string.min": `"bussinessName" must be at least 2 characters long`,
                "any.required": `"bussinessName" is a required field`,
            }),
        businessAddress: Joi.string()
            .min(5).optional().trim()
            .messages({ 
                "string.base": `"businessAddress" should be a type of 'text'`,
                "string.min": `"businessAddress" must be at least 5 characters long`,
            }),
        gstNumber: Joi.string()
            .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
            .optional().trim()
            .messages({
                "string.base": `"gstNumber" should be a type of 'text'`,
                "string.pattern.base": `"gstNumber" must be a valid GST number`,
            }),
        state: Joi.string().optional().trim().messages({
            "string.base": `"state" should be a type of 'text'`,
        }),
    });
}