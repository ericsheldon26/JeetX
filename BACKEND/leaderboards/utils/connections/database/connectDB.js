const mongoose = require("mongoose");
// Enable Mongoose debug mode
// mongoose.set("debug", true);

// Log connection events
mongoose.connection.on("connected", () => console.log("✅ MongoDB connected"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB connection error:", err));
mongoose.connection.on("disconnected", () => console.log("⚠️ MongoDB disconnected"));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

    } catch (error) {
        console.error(error);
    }
}

module.exports = connectDB;