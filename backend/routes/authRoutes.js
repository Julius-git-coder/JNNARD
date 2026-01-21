import express from 'express';
import { register, login, verifyEmail, forgotPassword, resetPassword, updateProfile, validateOTP } from '../controllers/authController.js';
import { parser } from '../utils/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', parser.single('avatar'), register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/validate-otp', validateOTP);
router.put('/profile', protect, parser.single('avatar'), updateProfile);

export default router;
