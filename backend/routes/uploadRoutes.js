import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

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
        folder: 'jnnard-uploads',
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
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({
            name: req.file.originalname,
            url: req.file.path,
            public_id: req.file.filename,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
