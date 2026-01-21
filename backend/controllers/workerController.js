import Worker from '../models/Worker.js';
import sendError from '../utils/errorResponse.js';

// @desc    Get all workers
// @route   GET /api/workers
// @access  Public (for now)
export const getWorkers = async (req, res) => {
    try {
        const workers = await Worker.find({});
        res.json(workers);
    } catch (error) {
        sendError(res, 500, 'Unable to retrieve workers at this time.', error);
    }
};

// @desc    Get worker by ID
// @route   GET /api/workers/:id
// @access  Public
export const getWorkerById = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);
        if (worker) {
            res.json(worker);
        } else {
            sendError(res, 404, 'The requested worker could not be found.');
        }
    } catch (error) {
        sendError(res, 500, null, error);
    }
};

// @desc    Create a worker
// @route   POST /api/workers
// @access  Public
export const createWorker = async (req, res) => {
    const { name, role, email, avatar } = req.body;

    try {
        // Check if worker with email already exists (if email provided)
        if (email) {
            const workerExists = await Worker.findOne({ email });
            if (workerExists) {
                return sendError(res, 400, 'A worker with this email address already exists.');
            }
        }

        const worker = await Worker.create({
            name,
            role,
            email,
            avatar,
        });
        res.status(201).json(worker);
    } catch (error) {
        sendError(res, 400, 'Failed to create worker. Please ensure all required fields are provided correctly.', error);
    }
};

// @desc    Update a worker
// @route   PUT /api/workers/:id
// @access  Public
export const updateWorker = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);

        if (worker) {
            worker.name = req.body.name || worker.name;
            worker.role = req.body.role || worker.role;
            worker.email = req.body.email || worker.email;
            worker.avatar = req.body.avatar || worker.avatar;
            worker.status = req.body.status || worker.status;

            const updatedWorker = await worker.save();
            res.json(updatedWorker);
        } else {
            sendError(res, 404, 'The worker profile you are trying to update was not found.');
        }
    } catch (error) {
        sendError(res, 400, 'Failed to update worker details. Please check your input and try again.', error);
    }
};

// @desc    Delete a worker
// @route   DELETE /api/workers/:id
// @access  Public
export const deleteWorker = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);

        if (worker) {
            await worker.deleteOne();
            res.json({ success: true, message: 'The worker has been successfully removed.' });
        } else {
            sendError(res, 404, 'The worker you are trying to remove was not found.');
        }
    } catch (error) {
        sendError(res, 500, 'An issue occurred while trying to remove the worker.', error);
    }
};
