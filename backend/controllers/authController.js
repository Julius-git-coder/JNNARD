import User from '../models/User.js';
import generateTokens from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// Random 4-digit OTP
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const file = req.file; // From Multer

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        const user = await User.create({
            name,
            email,
            password,
            avatar: file ? file.path : '',
            otp,
            otpExpires
        });

        // Send OTP Email
        const message = `Your verification code is: ${otp}`;
        try {
            await sendEmail({
                email: user.email,
                subject: 'JNNARD Email Verification',
                message,
            });
        } catch (error) {
            console.error("Email send failed", error);
            // Don't fail registration if email fails, but return warning?
            // For now, let's just log it. In prod, maybe retry.
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            message: 'Registration successful. Check email for verification code.'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Email OTP
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate tokens directly for seamless login
        const tokens = generateTokens(user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            ...tokens,
            message: 'Email verified successfully'
        });

    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({
            message: 'Verification failed. Please try again.',
            debug: error.message
        });
    }
};


// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                // Determine if we should send a new OTP here?
                // For simplified flow, let's just tell them to verify.
                return res.status(401).json({ message: 'Please verify your email first.' });
            }

            const tokens = generateTokens(user._id);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                ...tokens
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password (Send OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const message = `Your password reset code is: ${otp}`;

        await sendEmail({
            email: user.email,
            subject: 'JNNARD Password Reset Code',
            message,
        });

        res.status(200).json({ message: 'Password reset code sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid Code' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Code expired' });
        }

        user.password = password; // Will be hashed by pre-save hook
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
