import express from 'express';
import {
    getWorkers,
    getWorkerById,
    createWorker,
    updateWorker,
    deleteWorker,
} from '../controllers/workerController.js';

const router = express.Router();

router.route('/')
    .get(protect, getWorkers)
    .post(protect, admin, createWorker);

router.route('/:id')
    .get(protect, getWorkerById)
    .put(protect, admin, updateWorker)
    .delete(protect, admin, deleteWorker);

export default router;
