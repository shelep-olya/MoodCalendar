const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
