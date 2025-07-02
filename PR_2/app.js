const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const managerRoutes = require("./routes/managerRoutes");
const connectDB = require("./config/db");
const authMiddleware = require("./middleware/authenticateAdmin");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/manager", authMiddleware, managerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDB();
});