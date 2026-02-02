import express from 'express';
import {
    getAssignedProjects,
    getAssignedTasks,
    updateTaskStatus,
    submitWeeklyReport,
    getWorkerPerformance
} from '../controllers/workerDashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All worker dashboard routes require authentication

router.get('/projects', getAssignedProjects);
router.get('/tasks', getAssignedTasks);
router.patch('/tasks/:id/status', updateTaskStatus);
router.post('/reports', submitWeeklyReport);
router.get('/performance', getWorkerPerformance);

export default router;
