import mongoose, {Schema, Model} from "mongoose";
import {UserType} from "../../types/user.type.js";

type UserModelType = Model<UserType>;

const UserSchema = new mongoose.Schema<UserType>({
    mobile: {type: String, required: true, unique: true},
    language: {type: String, default: "english"},
    password: {type: String},
    deviceType: {type: String},
    isVerified: {type: Boolean, default: false},
    isActive: {type: Boolean, default: true},
    hasBusiness: {type: Boolean, default: false},
    bussinessName: {type: String},
    businessType: {type: String},
    businessCategory: {type: String},
    businessAddress: {type: String},
    gstNumber: {type: String},
    state: {type: String},
    totalCustomers: {type: Number, default: 0},
    receivedAmount: {type: Number, default: 0},
    paidAmount: {type: Number, default: 0},
    totalSales: {type: Number, default: 0},
    totalGst: {type: Number, default: 0},
    lastLogin: {type: Date},
},
{
    timestamps: {
        currentTime: () => new Date().getTime() + 5.5 * 60 * 60 * 1000, // IST Timezone
    },
    versionKey: false,
})

const UserDb: UserModelType = mongoose.model<UserType>("User", UserSchema);

export default UserDb;