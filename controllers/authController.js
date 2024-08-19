const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signup = async(req, res) => {
    const {username, email, password} = req.body;
    let user = await User.findOne({email});
    if(user) return res.redirect("/login");
    const hashedPassword = await bcrypt.hash(password, 12);
    user = new User({
        username,
        email,
        password: hashedPassword,
    });
    await user.save();
    res.redirect("/login");
};

exports.login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.redirect("/");

    const isCorrect = await bcrypt.compare(password, user.password);
    if(!isCorrect) return res.send("Incorrect email or password");

    res.redirect("/auth");
}