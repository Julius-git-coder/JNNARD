import User from '../models/User.js';
import generateTokens from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import sendError from '../utils/errorResponse.js';

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
            return sendError(res, 400, 'An account with this email address already exists. Please try logging in instead.');
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
                subject: 'JNARD Email Verification',
                message,
            });
        } catch (error) {
            console.error("Email send failed", error);
        }

        res.status(201).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            message: 'Registration successful. A verification code has been sent to your email.'
        });

    } catch (error) {
        sendError(res, 500, null, error);
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
            return sendError(res, 404, 'The requested user account was not found.');
        }

        if (user.otp !== otp) {
            return sendError(res, 400, 'The verification code provided is invalid. Please check and try again.');
        }

        if (user.otpExpires < Date.now()) {
            return sendError(res, 400, 'The verification code has expired. Please request a new one.');
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate tokens directly for seamless login
        const tokens = generateTokens(user._id);

        res.status(200).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            ...tokens,
            message: 'Your email has been verified successfully.'
        });

    } catch (error) {
        sendError(res, 500, 'We encountered an issue during verification. Please try again.', error);
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
                return sendError(res, 401, 'Please verify your email address before logging in.');
            }

            const tokens = generateTokens(user._id);

            res.json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                ...tokens
            });
        } else {
            sendError(res, 401, 'The email or password you entered is incorrect. Please try again.');
        }
    } catch (error) {
        sendError(res, 500, null, error);
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
            return sendError(res, 404, 'No account was found with that email address.');
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const message = `Your password reset code is: ${otp}`;

        await sendEmail({
            email: user.email,
            subject: 'JNARD Password Reset Code',
            message,
        });

        res.status(200).json({
            success: true,
            message: 'A password reset code has been sent to your email.'
        });
    } catch (error) {
        sendError(res, 500, null, error);
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
            return sendError(res, 404, 'The requested user account was not found.');
        }

        if (user.otp !== otp) {
            return sendError(res, 400, 'The reset code provided is invalid. Please try again.');
        }

        if (user.otpExpires < Date.now()) {
            return sendError(res, 400, 'The reset code has expired. Please request a new one.');
        }

        user.password = password; // Will be hashed by pre-save hook
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Your password has been updated successfully.'
        });

    } catch (error) {
        sendError(res, 500, null, error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.file) {
                user.avatar = req.file.path;
            } else if (req.body.avatar) {
                user.avatar = req.body.avatar;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                message: 'Your profile has been updated successfully.'
            });

        } else {
            sendError(res, 404, 'User account not found.');
        }
    } catch (error) {
        sendError(res, 500, null, error);
    }
};
