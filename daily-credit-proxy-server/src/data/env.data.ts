import dotenv from "dotenv";
dotenv.config();

export default class EnvData {
    static readonly SERVER_URL = process.env.SERVER_URL;
    static readonly PORT = process.env.PORT;
    static readonly SERVER_ENV = process.env.SERVER_ENV;

    static readonly SERVER_COMMON_CODE = process.env.SERVER_COMMON_CODE;
    static readonly SERVER_CODE = process.env.SERVER_CODE;

    static readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
    static readonly JWT_SECRET = process.env.JWT_SECRET;
    static readonly APP_ID = process.env.APP_ID;
    static readonly SERVER_S2S_KEY = process.env.SERVER_S2S_KEY;

    static readonly MAIN_SERVER = process.env.MAIN_SERVER;

    static readonly DB_REDIS_URL = process.env.DB_REDIS_URL;
    static readonly DB_REDIS_PARTITIONS = process.env.DB_REDIS_PARTITIONS;
}
