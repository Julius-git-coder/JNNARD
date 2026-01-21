import express from 'express';
import {
    getPerformanceRecords,
    getPerformanceByWorker,
    createPerformanceRecord,
    updatePerformanceRecord,
    deletePerformanceRecord,
} from '../controllers/performanceController.js';

const router = express.Router();

router.route('/')
    .get(getPerformanceRecords)
    .post(createPerformanceRecord);

router.route('/worker/:workerId')
    .get(getPerformanceByWorker);

router.route('/:id')
    .put(updatePerformanceRecord)
    .delete(deletePerformanceRecord);

export default router;
