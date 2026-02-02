export default class DateModule {
    public static instance: DateModule = new DateModule();
    private constructor() {}

    public getCurrentTimestamp(): number {
        return new Date().getTime() + 5.5 * 60 * 60 * 1000;
    }

    public getCurrentDate(): Date {
        const currentTimestamp: number = new Date().getTime() + 5.5 * 60 * 60 * 1000;
        const dateNow = new Date(currentTimestamp);
        return dateNow;
    }
}
