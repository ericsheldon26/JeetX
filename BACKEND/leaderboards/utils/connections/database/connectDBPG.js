const { Pool } = require("pg");

// Create connection pool
const pool = new Pool({
    connectionString: process.env.POSTGRES_URI,
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
});

// Log connection events
pool.on("connect", () => {
    console.log("✅ PostgreSQL connected");
});

pool.on("error", (err) => {
    console.error("❌ PostgreSQL connection error:", err);
    process.exit(1);
});

const connectDB = async () => {
    try {
        // Test connection
        await pool.query("SELECT 1");
    } catch (error) {
        console.error("❌ PostgreSQL initial connection failed:", error);
    }
};

module.exports = {
    pool,
    connectDB,
};
