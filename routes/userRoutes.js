const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/save-mood", authController.protect, userController.saveMood);

router.get("/auth/statistics", authController.protect, userController.getMoodStatisctics);

module.exports = router;