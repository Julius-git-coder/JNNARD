import express from 'express';
import {
    getTasks,
    getTasksByProject,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
} from '../controllers/taskController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getTasks)
    .post(protect, admin, createTask);

router.route('/project/:projectId')
    .get(getTasksByProject);

router.route('/:id')
    .get(getTaskById)
    .put(protect, admin, updateTask)
    .delete(protect, admin, deleteTask);

export default router;
