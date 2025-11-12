const mongoose = require("mongoose")
const { MessageModal } = require("../modal/messagesSchema")

const userChatController = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;
        console.log("SenderId:", senderId, "ReceiverId:", receiverId);

        // ✅ Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).send({ message: "Invalid user ID format" });
        }

        // // ✅ Ensure both users exist in DB
        // const sender = await UserModel.findById(senderId);
        // const receiver = await UserModel.findById(receiverId);

        // if (!sender || !receiver) {
        //     return res.status(404).send({ message: "User record not found!" });
        // }

        // ✅ Find all messages between them
        const messages = await MessageModal.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        }).populate("senderId receiverId");

        // ✅ If no chat found
        if (!messages.length) {
            return res.status(404).send({ message: "No messages found between these users!" });
        }

        console.log("Messages:", messages);

        return res.status(200).send({
            success: true,
            messages,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Server Error!" });
    }
};

module.exports = { userChatController }