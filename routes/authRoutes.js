const express = require("express");
const authController = require("../controllers/authController");
const viewsController = require("../controllers/viewsController");
const router = express.Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/", viewsController.getCalendarPage);
module.exports = router
