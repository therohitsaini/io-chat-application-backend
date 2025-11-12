// soket-io/io-server.js
const { Server } = require("socket.io");
const { userInfo } = require("../modal/userSchema");
const { MessageModal } = require("../modal/messagesSchema");

const users = new Map();
function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*", // Replace with frontend URL later
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("🔌 User connected:", socket.id);

        // 👇 Track user connection
        socket.on("userConnected", async (userId) => {
            if (!userId) return;
            users.set(userId, socket.id);
            console.log("🟢 User active:", userId);
            await userInfo.findByIdAndUpdate(userId, { isOnline: true });
            io.emit("activeUsers", Array.from(users.keys()));

        });

        socket.on("sendMessage", async (message) => {
            console.log("📩 Message received from frontend:", message);

            try {
                // 💾 Save to MongoDB
                const savedChat = new MessageModal ({
                    senderId: message.senderId,
                    receiverId: message.receiverId,
                    text: message.text,
                    timestamp: message.timestamp,
                });

                await savedChat.save();

                console.log("✅ Message saved to DB:", savedChat);

                //  Send message to receiver (optional)
                io.emit("receiveMessage", savedChat);
            } catch (error) {
                console.error("❌ Error saving message:", error);
            }
            // io.emit("receiveMessage", message);
            // console.log(message)

        });

        socket.on("disconnect", async () => {
            console.log("❌ User disconnected:", socket.id);

            let disconnectedUserId = null;
            for (const [userId, sId] of users.entries()) {
                if (sId === socket.id) {
                    disconnectedUserId = userId;
                    users.delete(userId);
                    break;
                }
            }

            if (disconnectedUserId) {
                console.log("🔴 Marking offline:", disconnectedUserId);
                await userInfo.findByIdAndUpdate(disconnectedUserId, {
                    isOnline: false,
                    lastSeen: new Date(),
                });
            }

            io.emit("activeUsers", Array.from(users.keys()));
        });
    });

    return io;
}

module.exports = { initSocket };
