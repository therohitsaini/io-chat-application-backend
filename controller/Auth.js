const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const validator = require('validator');
const dotenv = require("dotenv");
const { userInfo } = require('../modal/userSchema');
dotenv.config();



/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * user registration controller
 *  // ye controller user ko register karne ke liye hai
 */
userRegistrationContoller = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        console.log(req.body);

        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        const existingUser = await userInfo.findOne({ email }) || await userInfo.findOne({ userName });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const hardcodedPassword = await bcrypt.hash(password, 10);
        const userCreated = new userInfo({ userName, email, password: hardcodedPassword });
        await userCreated.save();
        res.status(201).json({ message: 'User registered successfully', });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * user login Controller 
 */

// apna model import kar


const userLoginController = async (req, res) => {
    try {
        const body = req.body;
     
        if (!body.email || !body.password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await userInfo.findOne({ email: body.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET,              
            { expiresIn: "7d" }
        );
     
        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Error during user login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports = { userRegistrationContoller, userLoginController };