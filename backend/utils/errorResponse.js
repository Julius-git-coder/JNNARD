/**
 * Professional error response utility
 * Standardizes error format and provides user-friendly messages for internal errors.
 */

export const sendError = (res, statusCode, message, error = null) => {
    // Log the actual error for server-side debugging
    if (error) {
        console.error(`[Error ${statusCode}]:`, error.stack || error);
    }

    // Determine the user-facing message
    let userMessage = message;

    // Provide polished messages for common scenarios if not explicitly provided
    if (statusCode === 500 && !message) {
        userMessage = 'We encountered an unexpected issue while processing your request. Please try again later.';
    } else if (statusCode === 404 && !message) {
        userMessage = 'The requested resource could not be found.';
    } else if (statusCode === 401 && !message) {
        userMessage = 'You must be logged in to access this resource.';
    } else if (statusCode === 403 && !message) {
        userMessage = 'You do not have permission to perform this action.';
    }

    return res.status(statusCode).json({
        success: false,
        message: userMessage,
        // Only include error details in non-production environments if needed
        // but generally, keep it clean for the frontend.
        ...(process.env.NODE_ENV === 'development' && error ? { stack: error.stack } : {})
    });
};

export default sendError;
