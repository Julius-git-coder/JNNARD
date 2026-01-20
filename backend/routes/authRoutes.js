import express from 'express';
import { register, login, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js';
import { parser } from '../utils/cloudinary.js';

const router = express.Router();

router.post('/register', parser.single('avatar'), register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
