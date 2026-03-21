import User from '../models/User.js';
import Worker from '../models/Worker.js';
import bcrypt from 'bcryptjs';
import generateTokens from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import sendError from '../utils/errorResponse.js';
import { createNotification } from './notificationController.js';
import { registerSchema, loginSchema, profileUpdateSchema } from '../utils/validators.js';
import { logAction } from '../utils/logger.js';

import crypto from 'crypto';

// Random 4-digit OTP using cryptographically secure random numbers
const generateOTP = () => {
    return crypto.randomInt(1000, 10000).toString();
};

const sendTokenResponse = (user, statusCode, res, message, req) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const tokens = generateTokens(user._id, ip);

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: true, // Always true for prefix to work
        sameSite: 'Strict',
        path: '/', // Required for __Host-
    };

    res
        .status(statusCode)
        .cookie('__Host-accessToken', tokens.accessToken, options)
        .cookie('__Host-refreshToken', tokens.refreshToken, options)
        .json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            jobType: user.jobType,
            workerProfile: user.workerProfile,
            message
        });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        // Validation
        const validation = registerSchema.safeParse(req.body);
        if (!validation.success) {
            return sendError(res, 400, validation.error.errors[0].message);
        }

        const { name, email, password, role, jobType } = validation.data;
        const file = req.file;
        
        const userExists = await User.findOne({ email });

        if (userExists) {
            return sendError(res, 400, 'An account with this email address already exists. Please try logging in instead.');
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // SECURITY: All public registrations are 'worker'. Admins must be promoted.
        const userRole = 'worker';
        const defaultJobType = jobType || 'worker';

        const avatarUrl = file ? (file.url || file.path || file.secure_url) : '';

        const user = await User.create({
            name,
            email,
            password,
            avatar: avatarUrl,
            otp,
            otpExpires,
            role: userRole,
            jobType: defaultJobType,
            isVerified: true // Muted email logic for now
        });

        if (user) {
            await logAction({ user: user._id, action: 'REGISTER', resource: 'USER', status: 'success' });

            // If worker, create worker profile
            if (userRole === 'worker') {
                const worker = await Worker.create({
                    name,
                    email,
                    role: user.jobType || 'Intern',
                    avatar: user.avatar,
                    userId: user._id
                });
                user.workerProfile = worker._id;
                await user.save();

                // Notify Admins
                const admins = await User.find({ role: 'admin' });
                for (const adminUser of admins) {
                    await createNotification({
                        recipient: adminUser._id,
                        sender: user._id,
                        type: 'WORKER_SIGNUP',
                        title: 'New Worker Registered',
                        message: `${user.name} has signed up as a worker.`,
                        link: '/workers'
                    });
                }
            }

            sendTokenResponse(user, 201, res, 'Registration successful.', req);
        } else {
            sendError(res, 400, 'Invalid user data');
        }
    } catch (error) {
        sendError(res, 500, 'Registration failed. Please try again.', error);
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

        sendTokenResponse(user, 200, res, 'Your email has been verified successfully.', req);
    } catch (error) {
        sendError(res, 500, 'We encountered an issue during verification. Please try again.', error);
    }
};

export const login = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return sendError(res, 400, validation.error.errors[0].message);
        }

        const { email, password } = validation.data;

        const user = await User.findOne({ email }).select('+password');

        if (user) {
            // Check if account is locked
            if (user.lockUntil && user.lockUntil > Date.now()) {
                await logAction({ user: user._id, action: 'LOGIN_LOCKED', resource: 'AUTH', status: 'failure', details: { email } });
                return sendError(res, 401, 'This account is temporarily locked due to too many failed login attempts. Please try again in 15 minutes.');
            }

            if (await user.matchPassword(password)) {
                // Reset failed attempts on success
                user.loginAttempts = 0;
                user.lockUntil = undefined;
                
                // Sync: If user is worker but has no profile, create one now
                if (user.role === 'worker' && !user.workerProfile) {
                    let worker = await Worker.findOne({ email: user.email });
                    if (!worker) {
                        worker = await Worker.create({
                            name: user.name,
                            email: user.email,
                            role: user.jobType || 'Intern',
                            avatar: user.avatar,
                            userId: user._id
                        });
                    } else {
                        worker.userId = user._id;
                        await worker.save();
                    }
                    user.workerProfile = worker._id;
                }
                
                await user.save();
                await logAction({ user: user._id, action: 'LOGIN', resource: 'AUTH', status: 'success' });
                sendTokenResponse(user, 200, res, 'Logged in successfully.', req);
                return;
            } else {
                // Increment failed attempts
                user.loginAttempts += 1;
                if (user.loginAttempts >= 5) {
                    user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 mins
                }
                await user.save();
                await logAction({ user: user._id, action: 'LOGIN_FAILED', resource: 'AUTH', status: 'failure', details: { email } });
                return sendError(res, 401, 'Invalid credentials');
            }
        } else {
            // Anti-enumeration timing defense: perform dummy check to match valid user timing
            const dummyHash = '$2b$12$K8p5O6.mN6d6S6B8S8S8Su6u6u6u6u6u6u6u6u6u6u6u6u6u6u6u';
            await bcrypt.compare(password, dummyHash);
            await logAction({ action: 'LOGIN_FAILURE', resource: 'AUTH', status: 'failure', details: { email, reason: 'user_not_found' } });
            return sendError(res, 401, 'Invalid credentials');
        }

        await logAction({ action: 'LOGIN_FAILURE', resource: 'AUTH', status: 'failure', details: { email } });
        sendError(res, 401, 'The email or password you entered is incorrect. Please try again.');
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

// @desc    Validate OTP without clearing it (for reset flow)
// @route   POST /api/auth/validate-otp
// @access  Public
export const validateOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return sendError(res, 404, 'The requested user account was not found.');
        }

        if (user.otp !== otp) {
            return sendError(res, 400, 'The verification code provided is invalid. Please try again.');
        }

        if (user.otpExpires < Date.now()) {
            return sendError(res, 400, 'The verification code has expired. Please request a new one.');
        }

        res.status(200).json({
            success: true,
            message: 'Code verified successfully.'
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
        user.isVerified = true; // Proof of email ownership
        await user.save();

        sendTokenResponse(user, 200, res, 'Your password has been updated successfully.', req);

    } catch (error) {
        sendError(res, 500, null, error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const validation = profileUpdateSchema.safeParse(req.body);
        if (!validation.success) {
            return sendError(res, 400, validation.error.errors[0].message);
        }

        const user = await User.findById(req.user._id);

        if (user) {
            user.name = validation.data.name || user.name;
            user.email = validation.data.email || user.email;

            if (req.file) {
                user.avatar = req.file.url || req.file.path || req.file.secure_url;
            } else if (req.body.avatar) {
                user.avatar = req.body.avatar;
            }

            if (validation.data.jobType) {
                user.jobType = validation.data.jobType;
            }

            if (validation.data.password) {
                user.password = validation.data.password;
            }

            const updatedUser = await user.save();
            await logAction({ user: user._id, action: 'UPDATE_PROFILE', resource: 'USER', status: 'success' });

            // Sync: If worker has a profile, update its avatar too
            if (updatedUser.workerProfile) {
                await Worker.findByIdAndUpdate(updatedUser.workerProfile, {
                    name: updatedUser.name,
                    avatar: updatedUser.avatar,
                    email: updatedUser.email,
                    role: updatedUser.jobType
                });
            }

            res.json({
                success: true,
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                jobType: updatedUser.jobType,
                message: 'Your profile has been updated successfully.'
            });

        } else {
            sendError(res, 404, 'User account not found.');
        }
    } catch (error) {
        sendError(res, 500, null, error);
    }
};
