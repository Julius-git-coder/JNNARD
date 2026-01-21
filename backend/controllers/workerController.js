import Worker from '../models/Worker.js';

// @desc    Get all workers
// @route   GET /api/workers
// @access  Public (for now)
export const getWorkers = async (req, res) => {
    try {
        const workers = await Worker.find({});
        res.json(workers);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
            res.status(404).json({ message: 'Worker not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a worker
// @route   POST /api/workers
// @access  Public
export const createWorker = async (req, res) => {
    const { name, role, email, avatar } = req.body;

    // Check if worker with email already exists (if email provided)
    if (email) {
        const workerExists = await Worker.findOne({ email });
        if (workerExists) {
            return res.status(400).json({ message: 'Worker with this email already exists' });
        }
    }

    try {
        const worker = await Worker.create({
            name,
            role,
            email,
            avatar,
        });
        res.status(201).json(worker);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
            res.status(404).json({ message: 'Worker not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
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
            res.json({ message: 'Worker removed' });
        } else {
            res.status(404).json({ message: 'Worker not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
