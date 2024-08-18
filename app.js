const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const expressLayout = require("express-ejs-layouts");
const AppError = require("./utils/AppError");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

app.use(helmet());

const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from thi API. Please try again in an hour.',
});

app.use("/", limiter);
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());

//PUBLIC PART
app.use(expressLayout);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");


app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
module.exports = app;