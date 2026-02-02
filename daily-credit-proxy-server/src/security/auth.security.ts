import Jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import EnvData from "../data/env.data";
import sanitize from "mongo-sanitize";
import { ResponseType } from "../types/response.type";
import { HeadersKeys, HttpStatusCode, ResponseStatus,DeviceType} from "../utils/enum.utils";
import { JwtPayload } from "../types/jwt.type";
import RedisClient from "../db/redis/client.redis";
import RedisKeys from "../db/redis/keys.redis";

export default class AuthSecurity {
    public static instance: AuthSecurity = new AuthSecurity();
    private constructor() {}

    public async validateToken(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        const authHeader = req.headers.authorization || "";
        const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        const appId = req.headers[HeadersKeys.xAppId] || "";
        const appVersion = req.headers[HeadersKeys.xAppVersion] || "";
        const platform = req.headers[HeadersKeys.xAppPlatform] || "";

        // Check for required headers
        if (!appVersion) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "App version header missing",
            };
            return res.status(HttpStatusCode.BAD_REQUEST).json(responseData);
        }

        if (!platform) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "Platform header missing",
            };
            return res.status(HttpStatusCode.BAD_REQUEST).json(responseData);
        }

        if (platform !== DeviceType.IOS && platform !== DeviceType.ANDROID && platform !== DeviceType.WEB) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "Invalid platform",
            };
            return res.status(HttpStatusCode.BAD_REQUEST).json(responseData);
        }

        if (!appId || appId !== EnvData.APP_ID) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "Invalid App ID",
            };
            return res.status(HttpStatusCode.UNAUTHORIZED).json(responseData);
        }

        if (!bearer) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "No token provided",
            };
            return res.status(HttpStatusCode.UNAUTHORIZED).json(responseData);
        }
        try {
            this.sanitizeData(req);

            const decoded = Jwt.verify(bearer, EnvData.JWT_SECRET?.toString() || "");
            if (!decoded) {
                const responseData: ResponseType = {
                    status: ResponseStatus.ERROR,
                    message: "Failed to authenticate token",
                };
                return res.status(HttpStatusCode.UNAUTHORIZED).json(responseData);
            }
            const decodedPayload = decoded as JwtPayload;
            req.headers[HeadersKeys.xUserId] = decodedPayload.userId;
            req.headers[HeadersKeys.xSessionId] = decodedPayload.sessionId;

            const isSessionValid = await this.validateSession(decodedPayload.userId, decodedPayload.sessionId);
            if (!isSessionValid) {
                const responseData: ResponseType = {
                    status: ResponseStatus.ERROR,
                    message: "Invalid session. Please log in again.",
                };
                return res.status(HttpStatusCode.UNAUTHORIZED).json(responseData);
            }
            next();
            return;
        } catch (error) {
            console.log("Token validation error:", error);
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "Failed to authenticate token",
            };
            return res.status(HttpStatusCode.UNAUTHORIZED).json(responseData);
        }
    }

    public async validateAppId(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        const appId = req.headers[HeadersKeys.xAppId] || "";
        const appVersion = req.headers[HeadersKeys.xAppVersion] || "";
        const platform = req.headers[HeadersKeys.xAppPlatform] || "";

        // Check for required headers
        if (!appVersion) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "App version header missing",
            };
            return res.status(HttpStatusCode.BAD_REQUEST).json(responseData);
        }

        if (!platform) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "Platform header missing",
            };
            return res.status(HttpStatusCode.BAD_REQUEST).json(responseData);
        }

        if (platform !== DeviceType.ANDROID) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "Invalid platform",
            };
            return res.status(HttpStatusCode.BAD_REQUEST).json(responseData);
        }

        if (!appId || appId !== EnvData.APP_ID) {
            const responseData: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "Invalid App ID",
            };
            return res.status(HttpStatusCode.UNAUTHORIZED).json(responseData);
        }
        this.sanitizeData(req);
        console.log("App ID validated successfully");
        next();
        return;
    }


    private async validateSession(userId: string, sessionId: string): Promise<boolean> {
        const getSessionId = await RedisClient.instance.getData(RedisKeys.session(userId));
        if (!getSessionId || getSessionId !== sessionId) {
            return false;
        }
        return true;
    }

    private sanitizeData(req: Request): void {
        try {
            if (req.body) {
                Object.keys(req.body).map((key) => {
                    req.body[key] = sanitize(req.body[key]);
                    if (typeof req.body[key] === "string") {
                        req.body[key] = req.body[key].trim();
                        req.body[key] = req.body[key].toString().replace(/\$/g, "");
                        req.body[key] = req.body[key].toString().replace(/==/g, "");
                        req.body[key] = req.body[key].toString().replace(/'/g, "");
                        req.body[key] = req.body[key].toString().replace(/;/g, "");
                        req.body[key] = req.body[key].toString().replace(/`/g, "");
                        req.body[key] = req.body[key].toString().replace(/"/g, "");
                    }
                });
            }
            if (req.query) {
                Object.keys(req.query).map((key) => {
                    req.query[key] = sanitize(req.query[key]);
                    if (typeof req.query[key] === "string") {
                        req.query[key] = req.query[key].trim();
                        req.query[key] = req.query[key].toString().replace(/\$/g, "");
                        req.query[key] = req.query[key].toString().replace(/==/g, "");
                        req.query[key] = req.query[key].toString().replace(/'/g, "");
                        req.query[key] = req.query[key].toString().replace(/;/g, "");
                        req.query[key] = req.query[key].toString().replace(/`/g, "");
                        req.query[key] = req.query[key].toString().replace(/"/g, "");
                    }
                });
            }
            if (req.params) {
                Object.keys(req.params).map((key) => {
                    req.params[key] = sanitize(req.params[key]);
                    if (typeof req.params[key] === "string") {
                        req.params[key] = req.params[key].trim();
                        req.params[key] = req.params[key].toString().replace(/\$/g, "");
                        req.params[key] = req.params[key].toString().replace(/==/g, "");
                        req.params[key] = req.params[key].toString().replace(/'/g, "");
                        req.params[key] = req.params[key].toString().replace(/;/g, "");
                        req.params[key] = req.params[key].toString().replace(/`/g, "");
                        req.params[key] = req.params[key].toString().replace(/"/g, "");
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
