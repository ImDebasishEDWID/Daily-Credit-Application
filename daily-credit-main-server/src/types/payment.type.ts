import { Schema } from "mongoose";

export type PaymentType = {
    _id?: Schema.Types.ObjectId;
    customerId: Schema.Types.ObjectId;
    userId?: Schema.Types.ObjectId;
    amount: number;
    paymentDate: Date;
    note?: string;
    paymentType: "credit" | "debit";
    dueAmount?: number;
    createdAt?: Date;
    updatedAt?: Date;
};