import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendError from '../utils/errorResponse.js';

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            req.user = await User.findById(decoded.id).select('-password').populate('workerProfile');

            if (!req.user) {
                return sendError(res, 401, 'Your session is no longer valid. Please sign in again.');
            }

            next();
        } catch (error) {
            sendError(res, 401, 'Your session has expired or is invalid. Please sign in again.', error);
        }
    } else {
        sendError(res, 401, 'Access denied. Please sign in to continue.');
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        sendError(res, 403, 'Access denied. This action requires administrator privileges.');
    }
};
