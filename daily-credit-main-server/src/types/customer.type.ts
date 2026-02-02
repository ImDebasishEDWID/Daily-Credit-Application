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
    isDelete?: boolean;
    userId?: Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
};