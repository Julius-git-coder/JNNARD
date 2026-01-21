import Performance from '../models/Performance.js';

// @desc    Get all performance records
// @route   GET /api/performance
// @access  Public
export const getPerformanceRecords = async (req, res) => {
    try {
        const records = await Performance.find({})
            .populate('worker', 'name role')
            .populate('project', 'title')
            .populate('task', 'title');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get performance by Worker ID
// @route   GET /api/performance/worker/:workerId
// @access  Public
export const getPerformanceByWorker = async (req, res) => {
    try {
        const records = await Performance.find({ worker: req.params.workerId })
            .populate('project', 'title')
            .populate('task', 'title');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a performance record
// @route   POST /api/performance
// @access  Public
export const createPerformanceRecord = async (req, res) => {
    const { worker, project, task, metric, target, actual, status, notes } = req.body;

    try {
        const record = await Performance.create({
            worker,
            project,
            task,
            metric,
            target,
            actual,
            status,
            notes
        });
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a performance record
// @route   PUT /api/performance/:id
// @access  Public
export const updatePerformanceRecord = async (req, res) => {
    try {
        const record = await Performance.findById(req.params.id);

        if (record) {
            record.metric = req.body.metric || record.metric;
            record.target = req.body.target || record.target;
            record.actual = req.body.actual || record.actual;
            record.status = req.body.status || record.status;
            record.notes = req.body.notes || record.notes;
            record.worker = req.body.worker || record.worker;
            record.project = req.body.project || record.project;
            record.task = req.body.task || record.task;

            const updatedRecord = await record.save();
            res.json(updatedRecord);
        } else {
            res.status(404).json({ message: 'Performance record not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a performance record
// @route   DELETE /api/performance/:id
// @access  Public
export const deletePerformanceRecord = async (req, res) => {
    try {
        const record = await Performance.findById(req.params.id);

        if (record) {
            await record.deleteOne();
            res.json({ message: 'Performance record removed' });
        } else {
            res.status(404).json({ message: 'Performance record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
