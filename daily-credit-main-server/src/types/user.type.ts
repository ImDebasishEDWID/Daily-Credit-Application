import { Schema } from "mongoose";

export type UserType = {
    _id?: Schema.Types.ObjectId;
    mobile: string;
    password?: string;
    isRegister?: boolean;
    isActive?: boolean;
    hasBusiness?: boolean;
    bussinessName?: string;
    businessAddress?: string;
    gstNumber?: string;
    state?: string;
    receivedAmount?: number;
    paidAmount?: number;
    totalSales?: number;
    totalGst?: number;
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
};