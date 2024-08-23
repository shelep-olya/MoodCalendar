const express = require("express");
const authController = require("../controllers/authController");
const viewsController = require("../controllers/viewsController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/logout", authController.logout);
router.get("/", viewsController.getCalendarPage);
router.get("/settings", viewsController.getSettingsPage);
router.get("/deleteAccount", authController.protect, authController.deleteAccount);
module.exports = router;
