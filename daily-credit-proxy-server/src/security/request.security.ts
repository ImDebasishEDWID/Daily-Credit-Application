import type { Request, Response, NextFunction } from "express";
import EnvData from "../data/env.data";
import { ResponseType } from "../types/response.type";
import { HttpStatusCode, ResponseStatus } from "../utils/enum.utils";
import CryptoJS from "crypto-js";

export default class RequestSecurity {
    public static receiveReq = (req: Request, res: Response, next: NextFunction): Response | null => {
        const encryptionKey = EnvData.ENCRYPTION_KEY || "";
        if (req.query.encryption == "false" && EnvData.SERVER_ENV === "DEV") {
            console.log("Bypassing encryption for dev environment");
            next();
            return null;
        }
        if(EnvData.SERVER_ENV === "DEV"){
            console.log("Bypassing encryption for dev environment");
            next();
            return null;
        }
       
        if (req.method == "GET" || req.method == "DELETE") {
            if (req.headers["hash"]) {
                try {
                    const decrypted = CryptoJS.AES.decrypt(req.headers["hash"] as string, encryptionKey);
                    const data = decrypted.toString(CryptoJS.enc.Utf8); 
                    const url = req.originalUrl;
                    if (data != url) {
                        const finalResponse: ResponseType = {
                            status: ResponseStatus.ERROR,
                            message: "Invalid request",
                        };
                        return res.status(HttpStatusCode.BAD_REQUEST).json(finalResponse);
                    }
                    next();
                    return null;
                } catch (error) {
                    console.log("error", error);
                    const finalResponse: ResponseType = {
                        status: ResponseStatus.ERROR,
                        message: "Invalid request",
                    };
                    return res.status(HttpStatusCode.BAD_REQUEST).json(finalResponse);
                }
            } else {
                const finalResponse: ResponseType = {
                    status: ResponseStatus.ERROR,
                    message: "Invalid request",
                };
                return res.status(HttpStatusCode.BAD_REQUEST).json(finalResponse);
            }
        } else if (req.method == "POST" || req.method == "PATCH" || req.method == "PUT") {
            if (req.body?.data) {
                try {
                    const decrypted = CryptoJS.AES.decrypt(req.body.data, encryptionKey);
                    const data = decrypted.toString(CryptoJS.enc.Utf8);
                    if (data) {
                        req.body = JSON.parse(data);
                        delete req.body.data; 
                        next();
                        return null;
                    } else {
                        const finalResponse: ResponseType = {
                            status: ResponseStatus.ERROR,
                            message: "Invalid request",
                        };
                        return res.status(HttpStatusCode.BAD_REQUEST).json(finalResponse);
                    }
                } catch (error) {
                    console.log("error", error);
                    const finalResponse: ResponseType = {
                        status: ResponseStatus.ERROR,
                        message: "Invalid request",
                    };
                    return res.status(HttpStatusCode.BAD_REQUEST).json(finalResponse);
                }
            } else if (req.headers["hash"]) {
                try {
                    const decrypted = CryptoJS.AES.decrypt(req.headers["hash"] as string, encryptionKey);
                    const data = decrypted.toString(CryptoJS.enc.Utf8);
                    const url = req.originalUrl;
                    if (data != url) {
                        const finalResponse: ResponseType = {
                            status: ResponseStatus.ERROR,
                            message: "Invalid request",
                        };
                        return res.status(HttpStatusCode.BAD_REQUEST).json(finalResponse);
                    }
                    next();
                    return null;
                } catch (error) {
                    console.log("error", error);
                    const finalResponse: ResponseType = {
                        status: ResponseStatus.ERROR,
                        message: "Invalid request",
                    };
                    return res.status(HttpStatusCode.BAD_REQUEST).json(finalResponse);
                }
            } else {
                const finalResponse: ResponseType = {
                    status: ResponseStatus.ERROR,
                    message: "Invalid request",
                };
                return res.status(HttpStatusCode.BAD_REQUEST).json(finalResponse);
            }
        } else {
            const finalResponse: ResponseType = {
                status: ResponseStatus.ERROR,
                message: "Invalid request",
            };
            return res.status(HttpStatusCode.BAD_REQUEST).json(finalResponse);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    public static sendRes = (proxyReq: any, req: Request, res: Response): void => {
        console.log(req.body);
        if (req.method == "GET" || req.method == "DELETE") {
            req.body = {};
        }
        if (req.body && Object.keys(req.body).length > 0) {
            const postData = JSON.stringify(req.body);
            proxyReq.setHeader("Content-Length", Buffer.byteLength(postData));
            proxyReq.setHeader("Content-Type", "application/json");
            proxyReq.write(postData);
            proxyReq.end();
        } else {
            console.log("No request body, sending empty object to target server");
            const postData = JSON.stringify({});
            proxyReq.setHeader("Content-Length", Buffer.byteLength(postData));
            proxyReq.setHeader("Content-Type", "application/json");
            proxyReq.write(postData);
            proxyReq.end();
        }
        console.log("Request forwarded to target server");
        return;
    };
}
