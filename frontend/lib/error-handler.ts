import { toast } from 'sonner';

/**
 * Handle API errors consistently across the frontend.
 * Extracts message from backend response if available, or uses a fallback.
 */
export const handleError = (error: any, fallbackMessage: string = 'An unexpected error occurred. Please try again.') => {
    let message = fallbackMessage;

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        message = error.response.data?.message || error.response.data?.error || fallbackMessage;
    } else if (error.request) {
        // The request was made but no response was received
        message = 'We are having trouble connecting to the server. Please check your internet connection.';
    } else if (error.message) {
        // Something happened in setting up the request that triggered an Error
        message = error.message;
    }

    toast.error(message);
    return message;
};

/**
 * Enhanced success toast with professional tone.
 */
export const handleSuccess = (message: string) => {
    toast.success(message);
};
