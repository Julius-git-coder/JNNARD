import WeeklyReport from '../models/WeeklyReport.js';
import Worker from '../models/Worker.js';
import { createNotification } from './notificationController.js';
import sendError from '../utils/errorResponse.js';

// @desc    Create a report for a worker
// @route   POST /api/reports
// @access  Private (Admin)
export const createAdminReport = async (req, res) => {
    try {
        const { workerId, taskId, projectId, summary, deliverableUrl } = req.body;
        console.log('Report Submission Request:', { workerId, taskId, projectId, summary, deliverableUrl });
        console.log('Author ID:', req.user._id);

        if (!workerId || !taskId || !projectId || !summary) {
            console.log('Validation failed: missing fields');
            return sendError(res, 400, 'Please provide all required fields for the report.');
        }

        const report = await WeeklyReport.create({
            worker: workerId,
            author: req.user._id,
            task: taskId,
            project: projectId,
            summary,
            deliverableUrl
        });

        // Notify worker about the new report
        const workerObj = await Worker.findById(workerId);
        if (workerObj && workerObj.userId) {
            console.log(`Sending notification to worker user: ${workerObj.userId}`);
            await createNotification({
                recipient: workerObj.userId,
                sender: req.user._id,
                type: 'REPORT_SUBMITTED',
                title: 'New Performance Report',
                message: `Admin has submitted a new performance report for you.`,
                link: '/worker/reports'
            });
        }

        res.status(201).json({
            success: true,
            data: report,
            message: 'Report submitted successfully.'
        });
    } catch (error) {
        console.error('Report Submission Error:', error);
        sendError(res, 500, null, error);
    }
};

// @desc    Get all reports (for admins)
// @route   GET /api/reports
// @access  Private (Admin)
export const getAllReports = async (req, res) => {
    try {
        const reports = await WeeklyReport.find({})
            .populate('worker', 'name role avatar')
            .populate('author', 'name email role avatar')
            .populate('project', 'title')
            .populate('task', 'title')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        sendError(res, 500, null, error);
    }
};

// @desc    Get reports for the current worker
// @route   GET /api/reports/my-reports
// @access  Private (Worker)
export const getMyReports = async (req, res) => {
    try {
        if (!req.user.workerProfile) {
            return sendError(res, 404, 'Worker profile not found.');
        }

        const reports = await WeeklyReport.find({ worker: req.user.workerProfile._id })
            .populate('author', 'name role avatar')
            .populate('project', 'title')
            .populate('task', 'title')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        sendError(res, 500, null, error);
    }
};

// @desc    Acknowledge a report (for workers)
// @route   PUT /api/reports/:id/acknowledge
// @access  Private (Worker)
export const acknowledgeReport = async (req, res) => {
    try {
        const report = await WeeklyReport.findById(req.params.id);

        if (!report) {
            return sendError(res, 404, 'Report not found.');
        }

        // Check if report belongs to this worker
        if (report.worker.toString() !== req.user.workerProfile?._id.toString()) {
            return sendError(res, 403, 'Unauthorized to acknowledge this report.');
        }

        report.status = 'Acknowledged';
        await report.save();

        // Notify admin
        await createNotification({
            recipient: report.author,
            sender: req.user._id,
            type: 'REPORT_ACKNOWLEDGED',
            title: 'Report Acknowledged',
            message: `${req.user.name} has acknowledged your performance report for task: ${report.summary.substring(0, 30)}...`,
            link: '/reports'
        });

        res.status(200).json({
            success: true,
            data: report,
            message: 'Report acknowledged successfully.'
        });
    } catch (error) {
        console.error('Report Acknowledgment Error:', error);
        sendError(res, 500, null, error);
    }
};

// @desc    Update a report
// @route   PUT /api/reports/:id
// @access  Private (Admin)
export const updateReport = async (req, res) => {
    try {
        let report = await WeeklyReport.findById(req.params.id);

        if (!report) {
            return sendError(res, 404, 'Report not found.');
        }

        // Update fields
        const { summary, deliverableUrl, taskId, projectId, workerId } = req.body;

        if (summary) report.summary = summary;
        if (deliverableUrl !== undefined) report.deliverableUrl = deliverableUrl;
        if (taskId) report.task = taskId;
        if (projectId) report.project = projectId;
        if (workerId) report.worker = workerId;

        await report.save();

        res.status(200).json({
            success: true,
            data: report,
            message: 'Report updated successfully.'
        });
    } catch (error) {
        sendError(res, 500, null, error);
    }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private (Admin)
export const deleteReport = async (req, res) => {
    try {
        const report = await WeeklyReport.findById(req.params.id);

        if (!report) {
            return sendError(res, 404, 'Report not found.');
        }

        await report.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
            message: 'Report removed successfully.'
        });
    } catch (error) {
        sendError(res, 500, null, error);
    }
};
