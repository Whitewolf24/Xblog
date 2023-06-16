const mongoose = require('mongoose');
const connectDB = async () => {

    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGO);
        console.log('Database conn');
    }
    catch (error) {
        console.log(error);
    }

}

module.exports = connectDB;