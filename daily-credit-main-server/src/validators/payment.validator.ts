import Joi from "joi";

export default class PaymentValidator {
    public static instance: PaymentValidator = new PaymentValidator();
    private constructor() {}    
    public paymentDetailsSchema = Joi.object({
        customerId: Joi.string().required().trim().messages({
            "string.base": `"customerId" should be a type of 'text'`,
            "any.required": `"customerId" is a required field`,
        }),
        amount: Joi.number().required().messages({ 
            "number.base": `"amount" should be a type of 'number'`,
            "any.required": `"amount" is a required field`,
        }),
        paymentDate: Joi.date().required().messages({
            "date.base": `"paymentDate" should be a valid date`,
            "any.required": `"paymentDate" is a required field`,    
        }),
        note: Joi.string().optional().trim().messages({
            "string.base": `"note" should be a type of 'text'`,
        }),
        paymentType: Joi.string().valid("credit", "debit").required().messages({
            "string.base": `"paymentType" should be a type of 'text'`,
            "any.only": `"paymentType" must be either 'credit' or 'debit'`,
            "any.required": `"paymentType" is a required field`,
        }),
    });
}