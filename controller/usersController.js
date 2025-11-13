const { userInfo } = require("../modal/userSchema");

const getUsersController = async (req, res) => {
    try {
        const users = await userInfo.find().select('-password');

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { getUsersController };