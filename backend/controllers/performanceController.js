import Performance from '../models/Performance.js';
import sendError from '../utils/errorResponse.js';

// @desc    Get all performance records
// @route   GET /api/performance
// @access  Public
export const getPerformanceRecords = async (req, res) => {
    try {
        const records = await Performance.find({})
            .populate('worker', 'name role avatar')
            .populate('project', 'title')
            .populate('task', 'title');
        res.json(records);
    } catch (error) {
        sendError(res, 500, 'Unable to retrieve performance records at this time.', error);
    }
};

// @desc    Get performance by Worker ID
// @route   GET /api/performance/worker/:workerId
// @access  Public
export const getPerformanceByWorker = async (req, res) => {
    try {
        const records = await Performance.find({ worker: req.params.workerId })
            .populate('worker', 'name role avatar')
            .populate('project', 'title')
            .populate('task', 'title');
        res.json(records);
    } catch (error) {
        sendError(res, 500, 'Unable to retrieve performance records for this worker.', error);
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
        sendError(res, 400, 'Failed to create performance record. Please ensure all required fields are correctly filled.', error);
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
            sendError(res, 404, 'The performance record you are attempting to update was not found.');
        }
    } catch (error) {
        sendError(res, 400, 'Failed to update performance record details. Please check your input and try again.', error);
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
            res.json({ success: true, message: 'The performance record has been successfully removed.' });
        } else {
            sendError(res, 404, 'The performance record you are trying to remove was not found.');
        }
    } catch (error) {
        sendError(res, 500, 'An issue occurred while trying to remove the performance record.', error);
    }
};
