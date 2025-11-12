const express = require('express');
const { getUsersController } = require('../controller/usersController');
const usersRouter = express.Router();

usersRouter.get('/get-users', getUsersController);

module.exports = { usersRouter };