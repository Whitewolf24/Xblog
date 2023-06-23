const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema
    ({
        username: {
            type: Number,
            required: false,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            unique: false
        },
    });

module.exports = mongoose.model('User', userSchema);