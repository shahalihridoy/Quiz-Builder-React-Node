const express = require("express");
const authController = require("../controllers/auth.controller");
const rateLimiter = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/register", rateLimiter, authController.register);
router.post("/login", rateLimiter, authController.login);
router.get("/verify-token", authController.verifyToken);

module.exports = router;
