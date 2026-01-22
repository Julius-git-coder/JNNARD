import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const downloadFile = async (url: string, filename: string) => {
    console.log('Initiating download via proxy for:', filename);
    try {
        // 1. Primary Attempt: Use Backend Proxy (Public)
        // This is 100% reliable as the backend handles headers and CORS
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const proxyUrl = `${backendUrl}/api/upload/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(filename)}`;

        const link = document.createElement('a');
        link.href = proxyUrl;
        link.setAttribute('target', '_self');
        document.body.appendChild(link);
        link.click();
        link.remove();
        return;
    } catch (proxyError) {
        console.warn('Backend proxy download failed, falling back to direct methods:', proxyError);
    }

    try {
        // 2. Secondary Attempt: Cloudinary Transformation (Fallback)
        if (url.includes('cloudinary.com')) {
            const cloudinaryRegex = /(\/(upload|private|authenticated)\/)/;
            const match = url.match(cloudinaryRegex);

            if (match) {
                const [fullMatch] = match;
                const downloadUrl = url.replace(fullMatch, `${fullMatch}fl_attachment/`);
                window.open(downloadUrl, '_blank');
                return;
            }
        }

        // 3. Last Resort: Open in new tab
        window.open(url, '_blank');
    } catch (error) {
        console.error('All download attempts failed:', error);
        window.open(url, '_blank');
    }
};
