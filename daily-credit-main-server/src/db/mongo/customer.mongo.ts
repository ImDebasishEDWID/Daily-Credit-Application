import mongoose, {Schema,Model} from "mongoose";
import {CustomerType} from "../../types/customer.type.js";

type CustomerModelType = Model<CustomerType>;

const CustomerSchema = new mongoose.Schema<CustomerType>({
    name: {type: String, required: true},
    mobile: {type: String},
    imgUrl: {type: String},
    address: {type: String},
    netAmount: {type: Number, default: 0},
    totalCredit: {type: Number, default: 0},
    totalDebit: {type: Number, default: 0},
    isDelete: {type: Boolean, default: false},
    userId: {type: Schema.Types.ObjectId, required: true, ref: "User"},
},{
    timestamps: {
        currentTime: () => new Date().getTime() + 5.5 * 60 * 60 * 1000, // IST Timezone
    },
    versionKey: false,  
});

const CustomerDb: CustomerModelType = mongoose.model<CustomerType>("Customer", CustomerSchema);

export default CustomerDb;