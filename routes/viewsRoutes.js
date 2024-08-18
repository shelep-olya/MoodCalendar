const express = require("express");
const viewsController = require("../controllers/viewsController");
const router = express.Router();

router.get("/", viewsController.getMainPage);
router.get("/signup", viewsController.getSignupPage);
router.get("/login", viewsController.getLoginPage);
module.exports = router;