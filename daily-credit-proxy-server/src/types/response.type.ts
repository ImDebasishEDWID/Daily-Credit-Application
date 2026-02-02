import { ResponseStatus } from "../utils/enum.utils";

export type ResponseType = {
    message: string;
    data?: object | string | null;
    status: ResponseStatus;
};
