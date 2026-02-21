import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
    res.status(200).json({ message: 'Login placeholder' });
});

router.post('/register', (req, res) => {
    res.status(200).json({ message: 'Register placeholder' });
});

export default router;
