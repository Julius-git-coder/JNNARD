import User from '../models/User.js';
import Worker from '../models/Worker.js';
import generateTokens from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import sendError from '../utils/errorResponse.js';
import { createNotification } from './notificationController.js';

// Random 4-digit OTP
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        console.log('--- SIGNUP ATTEMPT START ---');
        const { name, email, password, role, jobType } = req.body;
        console.log('Request Body:', { name, email, role, jobType });

        const file = req.file; // From Multer
        console.log('File presence:', !!file);

        console.log('Checking if user exists...');
        const userExists = await User.findOne({ email });
        console.log('User check complete. Exists:', !!userExists);

        if (userExists) {
            return sendError(res, 400, 'An account with this email address already exists. Please try logging in instead.');
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        const userRole = role === 'admin' ? 'admin' : 'worker';
        const defaultJobType = jobType || (userRole === 'admin' ? 'admin' : 'worker');

        const avatarUrl = file ? (file.url || file.path || file.secure_url) : '';

        console.log('Creating User in DB...');
        let user = await User.create({
            name,
            email,
            password,
            avatar: avatarUrl,
            otp,
            otpExpires,
            role: userRole,
            jobType: defaultJobType
        });
        console.log('User created successfully. ID:', user._id);

        // If worker, create worker profile
        if (userRole === 'worker') {
            const worker = await Worker.create({
                name,
                email,
                role: user.jobType || 'Intern', // Use jobType for worker profile role
                avatar: user.avatar,
                userId: user._id
            });
            user.workerProfile = worker._id;
            await user.save();

            // Notify Admins
            const admins = await User.find({ role: 'admin' });
            for (const admin of admins) {
                await createNotification({
                    recipient: admin._id,
                    sender: user._id,
                    type: 'WORKER_SIGNUP',
                    title: 'New Worker Registered',
                    message: `${user.name} has signed up as a worker.`,
                    link: '/workers'
                });
            }
        }

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
            role: user.role,
            jobType: user.jobType,
            message: 'Registration successful. A verification code has been sent to your email.'
        });

    } catch (error) {
        console.error('Register Error:', error);
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

        // Generate tokens directly for seamless login
        const tokens = generateTokens(user._id);

        res.status(200).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            jobType: user.jobType,
            workerProfile: user.workerProfile,
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

            res.role = user.role;
            res.workerProfile = user.workerProfile;

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
                await user.save();
            }

            res.json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                jobType: user.jobType,
                workerProfile: user.workerProfile,
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
        console.log('--- FORGOT PASSWORD ATTEMPT ---');
        const { email } = req.body;
        console.log('Target Email:', email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for:', email);
            return sendError(res, 404, 'No account was found with that email address.');
        }
        console.log('User found:', user._id);

        const otp = generateOTP();
        const otpExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        console.log('OTP generated and saved to DB');

        const message = `Your password reset code is: ${otp}`;

        console.log('Attempting to send email via sendEmail utility...');
        await sendEmail({
            email: user.email,
            subject: 'JNARD Password Reset Code',
            message,
        });
        console.log('Email sent successfully to:', user.email);

        res.status(200).json({
            success: true,
            message: 'A password reset code has been sent to your email.'
        });
    } catch (error) {
        console.error('Forgot Password ERROR Cluster:', error);
        // Temporarily send the actual message to the frontend for debugging
        sendError(res, 500, `Production Error: ${error.message || 'Unknown'}`, error);
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

        console.log('--- PROFILE UPDATE DEBUG ---');
        console.log('User ID:', req.user._id);
        console.log('File:', req.file);
        console.log('Body:', req.body);

        if (user) {
            console.log('Found user:', user.email);
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.file) {
                const newAvatar = req.file.url || req.file.path || req.file.secure_url;
                console.log('New avatar from file:', newAvatar);
                user.avatar = newAvatar;
            } else if (req.body.avatar) {
                console.log('Avatar from body:', req.body.avatar);
                user.avatar = req.body.avatar;
            }

            if (req.body.jobType) {
                user.jobType = req.body.jobType;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

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
