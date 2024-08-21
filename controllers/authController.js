const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createAndSendToken = (user, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    });
    user.password = undefined; 
};

exports.signup = async (req, res) => {
    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });
    createAndSendToken(user, res);
    res.redirect("/login");
};

exports.protect = async (req, res, next) => {
    let token;
    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.redirect('/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    try {
        const user = await User.findById(decoded.id);
        req.user = user;
        if (!user) {
            console.log(`User with ID ${decoded.id} not found`);
            return res.redirect('/login'); 
        }
        console.log('User found:', user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.render('error', { message: 'Internal Server Error' }); 
    }

    next();
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new Error('Please provide email and password!', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new Error('Incorrect email or password', 401));
    }
    createAndSendToken(user, res);
    res.redirect("/auth");
};