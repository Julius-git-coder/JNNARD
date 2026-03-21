/**
 * Global Response Sanitizer Middleware
 * Intercepts res.json and strips sensitive fields from all outgoing bodies.
 * Provides a "Catch-All" safety net for data privacy.
 */
export const globalResponseSanitizer = (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
        const sensitiveFields = ['password', 'otp', 'otpExpires', '__v', 'resetPasswordToken'];

        const sanitize = (obj) => {
            if (Array.isArray(obj)) {
                return obj.map(sanitize);
            } else if (obj !== null && typeof obj === 'object') {
                const newObj = {};
                for (const key in obj) {
                    if (!sensitiveFields.includes(key)) {
                        newObj[key] = sanitize(obj[key]);
                    }
                }
                return newObj;
            }
            return obj;
        };

        const sanitizedData = sanitize(data);
        return originalJson.call(this, sanitizedData);
    };

    next();
};
