const mongoose = require("mongoose");
const moodSchema = require("./moodSchema");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter username"],
    },
    email: {
        type: String,
        required: [true, "Please provide email."],
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
    },
    moodEntries: [moodSchema], 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
