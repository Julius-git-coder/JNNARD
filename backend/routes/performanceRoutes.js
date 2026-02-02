import express from 'express';
import {
    getPerformanceRecords,
    getPerformanceByWorker,
    createPerformanceRecord,
    updatePerformanceRecord,
    deletePerformanceRecord,
} from '../controllers/performanceController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getPerformanceRecords)
    .post(protect, admin, createPerformanceRecord);

router.route('/worker/:workerId')
    .get(protect, getPerformanceByWorker);

router.route('/:id')
    .put(protect, admin, updatePerformanceRecord)
    .delete(protect, admin, deletePerformanceRecord);

export default router;
