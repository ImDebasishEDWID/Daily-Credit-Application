import express from "express";
import type { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";

import { createProxyMiddleware } from "http-proxy-middleware";
import EnvData from "./data/env.data";
import RequestSecurity from "./security/request.security";
import { ResponseType } from "./types/response.type";
import { HttpStatusCode, ResponseStatus } from "./utils/enum.utils";
import ResponseSecurity from "./security/response.security";
import AuthSecurity from "./security/auth.security";

const app = express();
app.enable("trust proxy");
app.use(cors());
app.use(helmet());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,app-id,Authorization,platform,app-version,hash,x-access-token,app-type");
    res.header("Access-Control-Expose-Headers", "x-access-token,Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction): Response | null => {
    if (err) {
        const finalResponse: ResponseType = {
            status: ResponseStatus.ERROR,
            message: "Invalid JSON payload",
        };
        return res.status(HttpStatusCode.BAD_REQUEST).json(finalResponse);
    }
    next();
    return null;
});

app.get("/", (req: Request, res: Response) => {
    res.status(HttpStatusCode.OK).send("Proxy Server is running");
});

//Global request security middleware

app.use((req, res, next) => RequestSecurity.receiveReq(req, res, next));

const authServer = createProxyMiddleware<Request, Response>({
    target: EnvData.MAIN_SERVER + "/api/v1/auth",
    secure: false,
    changeOrigin: true,
    on: {
        proxyReq: RequestSecurity.sendRes,
        proxyRes: ResponseSecurity.sendResp,
    },
});

const userServer = createProxyMiddleware<Request, Response>({
    target: EnvData.MAIN_SERVER + "/api/v1/user",
    secure: false,
    changeOrigin: true,
    on: {
        proxyReq: RequestSecurity.sendRes,
        proxyRes: ResponseSecurity.sendResp,
    },
});

const customerServer = createProxyMiddleware<Request, Response>({
    target: EnvData.MAIN_SERVER + "/api/v1/customer",
    secure: false,
    changeOrigin: true,
    on: {
        proxyReq: RequestSecurity.sendRes,
        proxyRes: ResponseSecurity.sendResp,
    },
});

const paymentServer = createProxyMiddleware<Request, Response>({
    target: EnvData.MAIN_SERVER + "/api/v1/payment",
    secure: false,
    changeOrigin: true,
    on: {
        proxyReq: RequestSecurity.sendRes,
        proxyRes: ResponseSecurity.sendResp,
    },
});

const billServer = createProxyMiddleware<Request, Response>({
    target: EnvData.MAIN_SERVER + "/api/v1/bill",
    secure: false,
    changeOrigin: true,
    on: {
        proxyReq: RequestSecurity.sendRes,
        proxyRes: ResponseSecurity.sendResp,
    },
});

const quotationServer = createProxyMiddleware<Request, Response>({
    target: EnvData.MAIN_SERVER + "/api/v1/quotation",
    secure: false,
    changeOrigin: true,
    on: {
        proxyReq: RequestSecurity.sendRes,
        proxyRes: ResponseSecurity.sendResp,
    },
});


//S2S Routes

app.use("/api/v1/auth", AuthSecurity.instance.validateAppId.bind(AuthSecurity.instance), authServer);
app.use("/api/v1/user", AuthSecurity.instance.validateToken.bind(AuthSecurity.instance), userServer);
// app.use("/api/v1/customer", AuthSecurity.instance.validateToken.bind(AuthSecurity.instance), customerServer);
// app.use("/api/v1/payment", AuthSecurity.instance.validateToken.bind(AuthSecurity.instance), paymentServer);
// app.use("/api/v1/bill", AuthSecurity.instance.validateToken.bind(AuthSecurity.instance), billServer);
// app.use("/api/v1/quotation", AuthSecurity.instance.validateToken.bind(AuthSecurity.instance), quotationServer);

//unhandled routes

app.use((req: Request, res: Response) => {
    const finalResponse: ResponseType = {
        status: ResponseStatus.ERROR,
        message: "Route not found",
    };
    res.status(HttpStatusCode.NOT_FOUND).json(finalResponse);
});

app.listen(EnvData.PORT, () => {
    console.log(`Proxy server is running on ${EnvData.SERVER_URL}`);
});
