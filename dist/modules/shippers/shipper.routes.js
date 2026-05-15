"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shipper_controller_1 = require("./shipper.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/stats', auth_middleware_1.authMiddleware, shipper_controller_1.shipperController.getPaymentStats.bind(shipper_controller_1.shipperController));
// Onboarding Steps (require JWT — issued after email OTP verification)
router.patch('/me/phone', auth_middleware_1.authMiddleware, shipper_controller_1.shipperController.updatePhone.bind(shipper_controller_1.shipperController));
router.post('/me/address', auth_middleware_1.authMiddleware, shipper_controller_1.shipperController.addAddress.bind(shipper_controller_1.shipperController));
exports.default = router;
