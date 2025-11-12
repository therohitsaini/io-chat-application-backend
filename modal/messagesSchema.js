const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user-info",  
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user-info",  
        required: true,
    },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const MessageModal = mongoose.model("Message", messageSchema);

module.exports = { MessageModal }
