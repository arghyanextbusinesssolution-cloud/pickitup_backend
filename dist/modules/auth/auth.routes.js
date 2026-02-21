"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => {
    res.status(200).json({ message: 'Login placeholder' });
});
router.post('/register', (req, res) => {
    res.status(200).json({ message: 'Register placeholder' });
});
exports.default = router;
