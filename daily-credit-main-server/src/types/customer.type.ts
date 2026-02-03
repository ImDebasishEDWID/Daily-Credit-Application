import { Schema } from "mongoose";

export type CustomerType = {
    _id?: Schema.Types.ObjectId;
    name: string;
    mobile?: string;
    imgUrl?: string;
    address?: string;
    netAmount?: number;
    totalCredit?: number;
    totalDebit?: number;
    lastPaymentDate?: Date;
    lastPaymentAmount?: number;
    lastPaymentType?: "credit" | "debit";
    isDelete?: boolean;
    userId?: Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
};