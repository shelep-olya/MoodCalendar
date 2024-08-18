const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path: "./config.env"});
const app = require("./app");

const DB_URL = process.env.DB_URI;
mongoose.connect(DB_URL).then(() => {
    console.log("DB is connected!");
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT}!`);
});