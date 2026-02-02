import EnvData from "../../data/env.data";
import { createClient } from "redis";

export default class RedisClient {
    public static instance: RedisClient = new RedisClient();
    private client = createClient({
        url: EnvData.DB_REDIS_URL,
        database: EnvData.DB_REDIS_PARTITIONS ? parseInt(EnvData.DB_REDIS_PARTITIONS) : 0,
        pingInterval: 10000,
    });
    private constructor() {
        console.log("Redis client initializing...");

        this.client.on("connect", () => {
            console.log("Redis client connecting...");
        });
        this.client.on("ready", () => {
            console.log("Redis client ready");
        });
        this.client.on("end", () => {
            console.log("Redis client disconnected");
        });
        this.client.on("reconnecting", () => {
            console.log("Redis client reconnecting...");
        });
        this.client.on("warning", (warning: Error) => {
            console.log("Redis Client Warning", warning);
        });
        this.client.on("error", (error: Error) => {
            console.log("Redis Client Error", error);
            process.exit(1);
        });
        this.connectClient();
    }

    private async connectClient(): Promise<void> {
        if (!this.client.isOpen) {
            try {
                await this.client.connect();
                console.log("Redis client connected");
            } catch (error) {
                console.error("Redis client connection error:", error);
                process.exit(1);
            }
        }
    }
    public async setData(key: string, value: string, expireInSec?: number): Promise<void> {
        if (!this.client.isOpen) await this.connectClient();

        key = `${EnvData.SERVER_COMMON_CODE}:${key}`; // To avoid key conflicts in shared Redis instances

        if (expireInSec) {
            await this.client.set(key, value, {
                EX: expireInSec,
            });
        } else {
            await this.client.set(key, value);
        }
    }
    public async getData(key: string): Promise<string | null> {
        if (!this.client.isOpen) await this.connectClient();

        key = `${EnvData.SERVER_COMMON_CODE}:${key}`; // To avoid key conflicts in shared Redis instances

        const value = await this.client.get(key);
        return value;
    }
    public async deleteKey(key: string): Promise<void> {
        if (!this.client.isOpen) await this.connectClient();

        key = `${EnvData.SERVER_COMMON_CODE}:${key}`; // To avoid key conflicts in shared Redis instances

        await this.client.del(key);
    }
}
