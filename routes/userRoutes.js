const express = require("express");
const userController = require("../controllers/userController");
// const {assignUser} = require("../middlewares/assignUserMiddleware");
const authController = require("../controllers/authController");
const router = express.Router();

// router.use(assignUser);
router.post("/save-mood", userController.saveMood);

module.exports = router;