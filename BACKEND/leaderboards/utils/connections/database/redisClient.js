const { createClient } = require("redis");

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1"; // default to localhost
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = createClient({
    socket: { host: REDIS_HOST, port: REDIS_PORT },
});


let isConnected = false;

async function getRedisClient() {
    if (!isConnected) {
        await client.connect().catch((err) => console.error("Redis connection error:", err));  // happens only once
        isConnected = true;
        console.log(`✅ Redis Connected ${REDIS_HOST}:${REDIS_PORT}`);
    }
    return client;
}

module.exports = getRedisClient;