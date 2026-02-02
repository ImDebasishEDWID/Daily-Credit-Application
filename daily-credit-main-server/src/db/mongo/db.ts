import mongoose from "mongoose";
import EnvData from "../../data/env.data";


export default class MongoDB {
    public static instance: MongoDB = new MongoDB();
    private constructor() {}

    public async connect(): Promise<void> {
        try {
            if (!EnvData.MONGO_URL) {
                throw new Error("MONGO_URL is not defined in environment variables");
            }
            await mongoose.connect(EnvData.MONGO_URL);
            console.log("Connected to MongoDB successfully");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            process.exit(1);
        } 
    } 
    
    public async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            console.log("Disconnected from MongoDB");
        } catch (error) {
            console.error("Error disconnecting from MongoDB:", error);
        }
    }

    public getConnection(): mongoose.Connection {
        return mongoose.connection;
    }        
}