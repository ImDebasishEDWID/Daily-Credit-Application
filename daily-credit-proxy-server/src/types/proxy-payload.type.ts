import { ResponseStatus } from "../utils/enum.utils";

export type ProxyPayloadType = {
    message: string;
    data?: object | string | null;
    status: ResponseStatus;
};
