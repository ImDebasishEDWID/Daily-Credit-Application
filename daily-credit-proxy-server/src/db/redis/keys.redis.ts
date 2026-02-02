export default class RedisKeys {
    static readonly session = (userId: string) => {
        return `user:${userId}:sessionId`;
    };
}
