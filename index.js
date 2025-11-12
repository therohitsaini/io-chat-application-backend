// index.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { dbConnection } = require("./utils/db");

const { initSocket } = require("./soket-io/io-server"); // socket.io logic file
const { authRouter } = require("./routes/AuthRoute");
const { usersRouter } = require("./routes/usersRoute");
const { userChatRoutes } = require("./routes/userChatRoute");


dotenv.config();
dbConnection();

const app = express();
const port = 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Routes
app.get("/", (req, res) => {
    res.send("🚀 Server is running with Socket.io and Express!");
});

app.use("/api", authRouter);
app.use("/api", usersRouter);
app.use("/api-chat", userChatRoutes)

// Start server
server.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
