const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.MONGO_DB_URI;



const dbConnection = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

module.exports = { dbConnection };
