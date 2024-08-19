const mongoose = require("mongoose");

const moodEntrySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    mood: {
        type: String,
        enum: ["happy", "sad", "depressed", "angry", "excited", "neutural"], 
        required: true,
    },
});

module.exports = moodEntrySchema;
