import sendError from '../utils/errorResponse.js';

/**
 * Middleware to enforce hard pagination limits on all GET requests.
 * Prevents DB exhaustion attacks (fetching millions of records at once).
 */
export const enforcePagination = (req, res, next) => {
    if (req.method !== 'GET') return next();

    const DEFAULT_LIMIT = 20;
    const MAX_LIMIT = 100;

    let limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
    let page = parseInt(req.query.page) || 1;

    if (limit > MAX_LIMIT) {
        limit = MAX_LIMIT;
    }

    if (limit < 1) limit = 1;
    if (page < 1) page = 1;

    req.query.limit = limit.toString();
    req.query.page = page.toString();
    
    // Add skip for Mongoose convenience
    req.skip = (page - 1) * limit;

    next();
};
