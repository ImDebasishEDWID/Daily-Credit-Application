import mongoose, {Schema, Model} from "mongoose";
import { PaymentType } from "../../types/payment.type";

type PaymentModelType = Model<PaymentType>;

const PaymentSchema = new mongoose.Schema<PaymentType>({
    customerId: {type: Schema.Types.ObjectId, required: true, ref: "Customer"},
    userId: {type: Schema.Types.ObjectId, required: true, ref: "User"},
    amount: {type: Number, required: true},
    paymentDate: {type: Date},
    note: {type: String},
    paymentType: {type: String, enum: ["credit", "debit"]},
    dueAmount: {type: Number},
},{
    timestamps: {
        currentTime: () => new Date().getTime() + 5.5 * 60 * 60 * 1000, // IST Timezone
    },
    versionKey: false,  
});

const PaymentDb: PaymentModelType = mongoose.model<PaymentType>("Payment", PaymentSchema);

export default PaymentDb;