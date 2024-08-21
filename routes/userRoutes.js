const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/save-mood", authController.protect, userController.saveMood);

module.exports = router;