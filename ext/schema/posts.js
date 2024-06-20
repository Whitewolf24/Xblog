const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const postSchema = new Schema
    ({
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        update_date: {
            type: Date,
            default: Date.now
        },
    });

module.exports = mongoose.model('Post', postSchema);