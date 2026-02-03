import express from 'express';
import { createAdminReport, getAllReports, getMyReports, updateReport, deleteReport, acknowledgeReport } from '../controllers/reportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Worker routes
router.get('/my-reports', getMyReports);
router.put('/:id/acknowledge', acknowledgeReport);

// Admin only routes
router.use(admin);
router.route('/')
    .post(createAdminReport)
    .get(getAllReports);

router.route('/:id')
    .put(updateReport)
    .delete(deleteReport);

export default router;
