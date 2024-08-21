const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
    mood: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

module.exports = moodSchema;
