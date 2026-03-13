"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cms_controller_1 = require("./cms.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/:key', cms_controller_1.cmsController.get);
router.patch('/:key', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['ADMIN']), cms_controller_1.cmsController.update);
exports.default = router;
