const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const expressLayout = require("express-ejs-layouts");
const AppError = require("./utils/AppError");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const helmet = require("helmet");
const mainLayout = "../views/layouts/main.ejs";
const authLayout = "../views/layouts/auth.ejs";
const mongoSanitize = require('express-mongo-sanitize');

//routers
const viewsRouter = require("./routes/viewsRoutes");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use(helmet());

const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from thi API. Please try again in an hour.',
});
//LAYOUT MIDDLEWARE
const setLayout = (req, res, next) => {
    res.locals.layout = req.user ? authLayout :  mainLayout;
    next();
};

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
app.use(setLayout);

//ROUTING
app.use("/", viewsRouter);
app.use("/auth", authRouter);
app.use("/", userRouter);

//ERROR HANDLING
app.use((err, req, res, next) => {
    console.error(err.stack);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Something went wrong!';
    if (process.env.NODE_ENV === 'development') {
      res.status(err.statusCode).render('error', {
        layout: 'main', 
        message: err.message,
        stack: err.stack
      });
    } else if (process.env.NODE_ENV === 'production') {
      res.status(err.statusCode).render('error', {
        layout: mainLayout,
        message: err.isOperational ? err.message : 'Something went wrong!'
      });
    }
  });

process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
    process.exit(1); 
});
process.on('unhandledRejection', err => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});



module.exports = app;