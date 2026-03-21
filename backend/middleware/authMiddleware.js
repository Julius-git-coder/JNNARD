import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendError from '../utils/errorResponse.js';
import TokenBlacklist from '../models/TokenBlacklist.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies['__Host-accessToken']) {
        token = req.cookies['__Host-accessToken'];
    } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            // Check if token is blacklisted
            const isBlacklisted = await TokenBlacklist.findOne({ token });
            if (isBlacklisted) {
                return sendError(res, 401, 'This session has been revoked. Please sign in again.');
            }

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
                algorithms: ['HS256'],
            });

            // IP Pinning Verification
            const currentIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            if (decoded.ip && decoded.ip !== currentIp) {
                return sendError(res, 401, 'Session bound to a different IP address. Please sign in again.');
            }

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
