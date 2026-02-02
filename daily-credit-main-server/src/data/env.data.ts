import dotenv from "dotenv";
dotenv.config();

export default class EnvData {
    static readonly SERVER_URL = process.env.SERVER_URL;
    static readonly PORT = process.env.PORT;
    static readonly SERVER_ENV = process.env.SERVER_ENV ?? "dev";

    static readonly SERVER_COMMON_CODE = process.env.SERVER_COMMON_CODE;
    static readonly SERVER_CODE = process.env.SERVER_CODE;

    static readonly JWT_SECRET = process.env.JWT_SECRET ?? "your_jwt_secret";

    static readonly MONGO_URL = process.env.MONGO_URL;

    static readonly DB_REDIS_URL = process.env.DB_REDIS_URL;
    static readonly DB_REDIS_PARTITIONS = process.env.DB_REDIS_PARTITIONS;

    // static readonly DIGITAL_OCEAN_ACCESS_KEY = process.env.DIGITAL_OCEAN_ACCESS_KEY;
    // static readonly DIGITAL_OCEAN_SPACES_SECRET = process.env.DIGITAL_OCEAN_SPACES_SECRET;
    // static readonly DIGITAL_OCEAN_SPACES_BUCKET = process.env.DIGITAL_OCEAN_SPACES_BUCKET;
    // static readonly DIGITAL_OCEAN_SPACES_ENDPOINT = process.env.DIGITAL_OCEAN_SPACES_ENDPOINT;
    // static readonly DIGITAL_OCEAN_SPACES_REGION = process.env.DIGITAL_OCEAN_SPACES_REGION;
    // static readonly DIGITAL_OCEAN_SPACES_BASE_URL = process.env.DIGITAL_OCEAN_SPACES_BASE_URL;
}
