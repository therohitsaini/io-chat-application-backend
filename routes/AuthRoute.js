const express = require('express');
const { userRegistrationContoller, userLoginController } = require('../controller/Auth');
const authRouter = express.Router();

authRouter.post('/auth/register', userRegistrationContoller);
authRouter.post('/auth/login', userLoginController);

module.exports = { authRouter };