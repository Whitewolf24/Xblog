const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

const connectDB = async () => {

    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO);
        //console.log('Database conn');
    }
    catch (error) {
        console.log(error);
    }

}

module.exports = connectDB;