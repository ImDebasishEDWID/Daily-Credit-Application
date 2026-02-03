import Joi from "joi";

export default class CustomerValidator {
    public static instance: CustomerValidator = new CustomerValidator();
    private constructor() {};
    public customerDetailsSchema = Joi.object({
        name: Joi.string().required().min(2).max(40).trim().messages({
            "string.base": `"name" should be a type of 'text'`,
            "any.required": `"name" is a required field`,
        }),
        mobile: Joi.string()
            .pattern(/^[6-9]\d{9}$/)
            .optional()
            .trim().messages({
                "string.base": `"mobile" should be a type of 'text'`,
                "string.pattern.base": `"mobile" must be 10 digits starting with 6-9`,
            }),
        imgUrl: Joi.string().uri().optional().trim().messages({
            "string.base": `"imgUrl" should be a type of 'text'`,
            "string.uri": `"imgUrl" must be a valid URI`,
        }),
        address: Joi.string().optional().trim().messages({
            "string.base": `"address" should be a type of 'text'`,
        }),
        lastPaymentDate: Joi.date().optional().messages({
            "date.base": `"lastPaymentDate" should be a valid date`,
        }),
        lastPaymentAmount: Joi.number().optional().messages({
            "number.base": `"lastPaymentAmount" should be a number`,
        }),
        lastPaymentType: Joi.string().valid("credit", "debit").optional().messages({
            "string.base": `"lastPaymentType" should be a string`,
            "any.only": `"lastPaymentType" must be either 'credit' or 'debit'`,
        }),
    });
}