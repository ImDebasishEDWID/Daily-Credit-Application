import { Schema } from "mongoose";

export type UserType = {
    _id?: Schema.Types.ObjectId;
    mobile: string;
    language?: string;
    fcmToken?: string | null;
    password?: string;
    deviceType?: string;
    isVerified?: boolean;
    isActive?: boolean;
    hasBusiness?: boolean;
    bussinessName?: string;
    businessType?: string;
    businessCategory?: string;
    businessAddress?: string;
    gstNumber?: string;
    state?: string;
    totalCustomers?: number;
    receivedAmount?: number;
    paidAmount?: number;
    totalSales?: number;
    totalGst?: number;
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
};