import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import CloudinaryStorage from 'multer-storage-cloudinary';
import https from 'https';
import sendError from '../utils/errorResponse.js';

const router = express.Router();

// Ensure Cloudinary is configured (it should be if imported from utils/cloudinary, or we config here)
// Importing to ensure side-effects/config run if defined there, or just re-config here to be safe
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'jnard-uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx'],
        resource_type: 'auto', // Allow other file types
    },
});

const upload = multer({ storage: storage });

// @desc    Upload a file
// @route   POST /api/upload
// @access  Public (for now)
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return sendError(res, 400, 'Please select a file to upload.');
        }
        res.json({
            name: req.file.originalname,
            url: req.file.path,
            public_id: req.file.filename,
        });
    } catch (error) {
        sendError(res, 500, 'We encountered an error while processing your file upload.', error);
    }
});

// @desc    Download a file (Proxy to bypass CORS/Browser preview)
// @route   GET /api/upload/download
// @access  Public
router.get('/download', async (req, res) => {
    const { url, name } = req.query;
    console.log(`[Download Proxy] Request received for: ${name}`);

    if (!url) {
        return sendError(res, 400, 'File URL is required for download.');
    }

    const downloadFile = (targetUrl, attempts = 0) => {
        if (attempts > 5) {
            return sendError(res, 500, 'Too many redirects while fetching file.');
        }

        console.log(`[Download Proxy] Fetching (Attempt ${attempts + 1}): ${targetUrl}`);

        const protocol = targetUrl.startsWith('https') ? https : null;
        if (!protocol) return sendError(res, 400, 'Invalid protocol in storage URL.');

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        };

        // If it's a Cloudinary URL, add Basic Auth to bypass ACL restrictions for documents
        if (targetUrl.includes('cloudinary.com')) {
            const auth = Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString('base64');
            options.headers['Authorization'] = `Basic ${auth}`;
            console.log('[Download Proxy] Adding Cloudinary Basic Auth to request');
        }

        protocol.get(targetUrl, options, (response) => {
            // Handle redirects (Cloudinary often does this)
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                console.log(`[Download Proxy] Redirecting to: ${response.headers.location}`);
                return downloadFile(response.headers.location, attempts + 1);
            }

            // If still failing with 401 on a PDF, try the signed URL as a fallback
            if (response.statusCode === 401 && targetUrl.includes('cloudinary.com') && targetUrl.endsWith('.pdf') && attempts === 0) {
                console.warn('[Download Proxy] 401 even with Basic Auth, trying Signed URL as fallback...');

                try {
                    const parts = targetUrl.split('/');
                    const uploadIndex = parts.indexOf('upload');
                    if (uploadIndex !== -1) {
                        const version = parts[uploadIndex + 1];
                        const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');

                        const signedUrl = cloudinary.url(publicIdWithExt, {
                            resource_type: 'image',
                            version: version.startsWith('v') ? version.substring(1) : undefined,
                            sign_url: true,
                            secure: true
                        });

                        return downloadFile(signedUrl, attempts + 1);
                    }
                } catch (signErr) {
                    console.error('[Download Proxy] Failed to generate signed URL:', signErr.message);
                }
            }

            if (response.statusCode !== 200) {
                console.error(`[Download Proxy] Failed. Status: ${response.statusCode}`);
                console.error(`[Download Proxy] Error Header: ${response.headers['x-cld-error'] || 'none'}`);
                return sendError(res, response.statusCode, `Storage error: ${response.statusMessage}`);
            }

            const filename = name || targetUrl.split('/').pop() || 'download';
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');

            console.log('[Download Proxy] Streaming file...');
            response.pipe(res);
        }).on('error', (error) => {
            console.error('[Download Proxy] Network error:', error.message);
            sendError(res, 500, 'Network error while proxying download.', error);
        });
    };

    downloadFile(url);
});

export default router;
