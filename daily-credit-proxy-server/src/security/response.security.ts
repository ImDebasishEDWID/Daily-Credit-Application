import type { Request, Response } from "express";
import EnvData from "../data/env.data";
import { ResponseType } from "../types/response.type";
import { ProxyPayloadType } from "../types/proxy-payload.type";
import CryptoJS from "crypto-js";
import { ResponseStatus } from "../utils/enum.utils";

export default class ResponseSecurity {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static sendResp(proxyResponse: any, request: Request, response: Response): void {
        const _write = response.write;
        let final = "";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.write = function (data: any): boolean {
            final += data.toString();
            return true; // Ensure the function returns a boolean
        };
        proxyResponse.on("end", function () {
            try {
                let payload: ProxyPayloadType;
                try {
                    payload = JSON.parse(final) as ProxyPayloadType;
                } catch (error) {
                    console.log("Error parsing JSON", error);
                    payload = {
                        status: ResponseStatus.ERROR,
                        message: final,
                    };
                }

                const resp: ResponseType = EnvData.SERVER_ENV === "DEV" ? payload : ResponseSecurity.responseEncryption(request, payload);
                response.status(proxyResponse.statusCode).json(resp);
                response.end();
            } catch (error) {
                console.log("Error in responseEncryption", error);
                const finalResponse: ResponseType = {
                    status: ResponseStatus.ERROR,
                    message: "Internal Server Error",
                };
                _write.call(response, JSON.stringify(finalResponse), "utf-8");
            }
        });
        return;
    }

    private static responseEncryption(req: Request, payload: ProxyPayloadType): ResponseType {
        const finalResp: ResponseType = {
            status: payload.status || ResponseStatus.ERROR,
            message: payload.message || "An error occurred",
        };
        const encryptionKey = EnvData.ENCRYPTION_KEY || "";
        if (req.query.encryption == "false" && process.env.SERVER_ENV == "DEV") {
            if (payload.data) {
                finalResp.data = payload.data;
            }
        } else if (req.originalUrl.includes("/api/s2s/")) {
            if (payload.data) {
                finalResp.data = payload.data;
            }
        } else if (payload.data) {
            const type = typeof payload.data;
            let data = null;
            if (type == "object") {
                data = JSON.stringify(payload.data);
            } else {
                data = payload.data;
                data = data.toString();
            }
            const encrypted = CryptoJS.AES.encrypt(data, encryptionKey);
            data = encrypted.toString();
            finalResp.data = data;
        }
        return finalResp;
    }
}
