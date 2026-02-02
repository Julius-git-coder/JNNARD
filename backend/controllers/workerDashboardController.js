import Project from '../models/Project.js';
import Task from '../models/Task.js';
import WeeklyReport from '../models/WeeklyReport.js';
import Performance from '../models/Performance.js';
import sendError from '../utils/errorResponse.js';

// @desc    Get projects assigned to the current worker
// @route   GET /api/worker/projects
// @access  Private (Worker)
export const getAssignedProjects = async (req, res) => {
    try {
        if (!req.user.workerProfile) {
            return sendError(res, 404, 'Worker profile not found for this user.');
        }

        const projects = await Project.find({
            members: req.user.workerProfile
        }).populate('members', 'name role avatar');

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        sendError(res, 500, null, error);
    }
};

// @desc    Get tasks assigned to the current worker
// @route   GET /api/worker/tasks
// @access  Private (Worker)
export const getAssignedTasks = async (req, res) => {
    try {
        if (!req.user.workerProfile) {
            return sendError(res, 404, 'Worker profile not found for this user.');
        }

        const tasks = await Task.find({
            assignedTo: req.user.workerProfile
        }).populate('project', 'title description');

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        sendError(res, 500, null, error);
    }
};

// @desc    Update task status
// @route   PATCH /api/worker/tasks/:id/status
// @access  Private (Worker)
export const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['To Do', 'In Progress', 'Done', 'Blocked'];

        if (!validStatuses.includes(status)) {
            return sendError(res, 400, 'Invalid status update.');
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return sendError(res, 404, 'Task not found.');
        }

        // Check if the task is assigned to the current worker
        if (!task.assignedTo || task.assignedTo.toString() !== req.user.workerProfile._id.toString()) {
            return sendError(res, 403, 'You are not authorized to update this task.');
        }

        task.status = status;
        await task.save();

        res.status(200).json({
            success: true,
            data: task,
            message: `Task status updated to ${status}.`
        });
    } catch (error) {
        sendError(res, 500, null, error);
    }
};

// @desc    Submit a weekly report
// @route   POST /api/worker/reports
// @access  Private (Worker)
export const submitWeeklyReport = async (req, res) => {
    try {
        const { taskId, projectId, weekStartDate, weekEndDate, summary, deliverableUrl } = req.body;

        if (!taskId || !projectId || !weekStartDate || !weekEndDate || !summary) {
            return sendError(res, 400, 'Please provide all required fields for the report.');
        }

        const report = await WeeklyReport.create({
            worker: req.user.workerProfile,
            task: taskId,
            project: projectId,
            weekStartDate,
            weekEndDate,
            summary,
            deliverableUrl
        });

        res.status(201).json({
            success: true,
            data: report,
            message: 'Weekly report submitted successfully.'
        });
    } catch (error) {
        sendError(res, 500, null, error);
    }
};

// @desc    Get performance and feedback
// @route   GET /api/worker/performance
// @access  Private (Worker)
export const getWorkerPerformance = async (req, res) => {
    try {
        if (!req.user.workerProfile) {
            return sendError(res, 404, 'Worker profile not found.');
        }

        const performanceData = await Performance.find({
            worker: req.user.workerProfile
        }).populate('project', 'title').populate('task', 'title');

        res.status(200).json({
            success: true,
            count: performanceData.length,
            data: performanceData
        });
    } catch (error) {
        sendError(res, 500, null, error);
    }
};
