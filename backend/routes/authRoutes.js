import express from 'express';
import { register, login, verifyEmail, forgotPassword, resetPassword, updateProfile, validateOTP } from '../controllers/authController.js';
import { parser } from '../utils/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';
import TokenBlacklist from '../models/TokenBlacklist.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', parser.single('avatar'), register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/validate-otp', validateOTP);

router.post('/logout', protect, async (req, res) => {
    try {
        const accessToken = req.cookies['__Host-accessToken'];
        const refreshToken = req.cookies['__Host-refreshToken'];

        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, { algorithms: ['HS256'] });
                await TokenBlacklist.create({ token: accessToken, expiresAt: new Date(decoded.exp * 1000) });
            } catch (err) { /* already invalid */ }
        }

        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] });
                await TokenBlacklist.create({ token: refreshToken, expiresAt: new Date(decoded.exp * 1000) });
            } catch (err) { /* already invalid */ }
        }

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/',
            expires: new Date(0)
        };

        res.cookie('__Host-accessToken', '', cookieOptions);
        res.cookie('__Host-refreshToken', '', cookieOptions);
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error during logout' });
    }
});
router.put('/profile', protect, parser.single('avatar'), updateProfile);

export default router;
