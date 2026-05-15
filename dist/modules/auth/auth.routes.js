"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.authController.register.bind(auth_controller_1.authController));
router.post('/login', auth_controller_1.authController.login.bind(auth_controller_1.authController));
// OTP - Email Verification (Step 2 of shipper onboarding)
router.post('/otp/send', auth_controller_1.authController.sendEmailOtp.bind(auth_controller_1.authController));
router.post('/otp/verify', auth_controller_1.authController.verifyEmailOtp.bind(auth_controller_1.authController));
exports.default = router;
