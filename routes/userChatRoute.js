const express = require("express")
const { userChatController } = require("../controller/userChatController")
const userChatRoutes = express.Router()


userChatRoutes.get("/find-user-chat/:senderId/:receiverId", userChatController)

module.exports = { userChatRoutes }