/**
 * Strict Query Object Guard Middleware
 * Prevents NoSQL Query Pollution by ensuring req.query only contains primitive strings.
 * Blocks nested object queries (e.g., ?id[$gt]=0) which can bypass security checks.
 */
export const queryGuard = (req, res, next) => {
    if (req.method !== 'GET') return next();

    const sanitizedQuery = {};
    for (const key in req.query) {
        const value = req.query[key];
        
        // Only allow strings or numbers, reject objects/arrays to prevent $ operators
        if (typeof value === 'string' || typeof value === 'number') {
            sanitizedQuery[key] = value;
        }
    }
    
    req.query = sanitizedQuery;
    next();
};
