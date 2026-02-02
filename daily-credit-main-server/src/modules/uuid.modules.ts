import CryptoJS from "crypto-js";

export default class UUIDModule {
    public static instance: UUIDModule = new UUIDModule();
    private constructor() {
        this.generateUUID();
    }

    public generateUUID(): string {
        const timestamp = new Date().getTime().toString();
        const randomNum = Math.floor(Math.random() * 1e9).toString();
        const rawUUID = `${timestamp}-${randomNum}`;
        const uuid: string = CryptoJS.SHA256(rawUUID).toString(CryptoJS.enc.Hex);
        return uuid;
    }

    public generateSKU(): string {
        const timestamp = new Date().getTime().toString();
        const randomNum = Math.floor(Math.random() * 1e6)
            .toString()
            .padStart(6, "0");
        const rawSKU = `SKU-${timestamp}-${randomNum}`;
        // const sku: string = CryptoJS.MD5(rawSKU).toString(CryptoJS.enc.Hex).toUpperCase();
        return rawSKU;
    }
}
