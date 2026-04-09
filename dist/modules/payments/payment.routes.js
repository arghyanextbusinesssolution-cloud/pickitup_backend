"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// NOTE: The webhook route must NOT use the authMiddleware because Stripe calls it.
// Also, it requires the RAW body. 
// We will handle the RAW body middleware in app.ts to ensure it's applied correctly.
router.post('/webhook', payment_controller_1.paymentController.webhook);
// These routes require authentication
router.post('/create-checkout-session', auth_middleware_1.authMiddleware, payment_controller_1.paymentController.createCheckoutSession);
router.post('/confirm-payment', auth_middleware_1.authMiddleware, payment_controller_1.paymentController.confirmPayment);
exports.default = router;
