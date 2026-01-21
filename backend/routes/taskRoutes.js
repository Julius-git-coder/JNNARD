import express from 'express';
import {
    getTasks,
    getTasksByProject,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/project/:projectId')
    .get(getTasksByProject);

router.route('/:id')
    .get(getTaskById)
    .put(updateTask)
    .delete(deleteTask);

export default router;
