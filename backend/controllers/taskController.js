import Task from '../models/Task.js';
import Worker from '../models/Worker.js';
import { createNotification } from './notificationController.js';
import sendError from '../utils/errorResponse.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({})
            .populate('project', 'title')
            .populate('assignedTo', 'name avatar role');
        res.json(tasks);
    } catch (error) {
        sendError(res, 500, 'Unable to retrieve tasks at this time.', error);
    }
};

// @desc    Get tasks by Project ID
// @route   GET /api/tasks/project/:projectId
// @access  Public
export const getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignedTo', 'name avatar role');
        res.json(tasks);
    } catch (error) {
        sendError(res, 500, 'Unable to retrieve tasks for this project.', error);
    }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Public
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('project', 'title')
            .populate('assignedTo', 'name avatar role');
        if (task) {
            res.json(task);
        } else {
            sendError(res, 404, 'The requested task could not be found.');
        }
    } catch (error) {
        sendError(res, 500, null, error);
    }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Admin
export const createTask = async (req, res) => {
    const { title, description, project, assignedTo, status, priority, dueDate, deliverables } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            status: status || 'To Do',
            priority: priority || 'Medium',
            dueDate: dueDate || null,
            deliverables
        });

        // Send Notification to assigned worker
        if (assignedTo) {
            const worker = await Worker.findById(assignedTo);
            if (worker && worker.userId) {
                await createNotification({
                    recipient: worker.userId,
                    sender: req.user?._id,
                    type: 'TASK_ASSIGNED',
                    title: 'New Task Assigned',
                    message: `You have been assigned a new task: ${title}`,
                    link: '/worker/tasks'
                });
            }
        }

        res.status(201).json(task);
    } catch (error) {
        sendError(res, 400, 'Failed to create task. Please ensure all required fields are correctly filled.', error);
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Admin (Full), Worker (Status only if assigned)
export const updateTask = async (req, res) => {
    try {
        const { title, description, project, assignedTo, status, priority, dueDate, deliverables } = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) {
            return sendError(res, 404, 'The task you are attempting to update was not found.');
        }

        // Permission check
        if (req.user.role !== 'admin') {
            // Check if worker is assigned to this task
            if (!req.user.workerProfile || !task.assignedTo || task.assignedTo.toString() !== req.user.workerProfile._id.toString()) {
                return sendError(res, 403, 'Permission denied. You can only update tasks assigned to you.');
            }

            // Workers can only update 'status'
            const updateFields = Object.keys(req.body);
            const forbiddenFields = updateFields.filter(field => field !== 'status');

            if (forbiddenFields.length > 0) {
                return sendError(res, 403, `Permission denied. Workers can only update task status. Forbidden fields: ${forbiddenFields.join(', ')}`);
            }
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (project !== undefined) updateData.project = project;
        if (assignedTo !== undefined) updateData.assignedTo = assignedTo || null;
        if (status !== undefined) updateData.status = status;
        if (priority !== undefined) updateData.priority = priority;
        if (dueDate !== undefined) updateData.dueDate = dueDate || null;
        if (deliverables !== undefined) updateData.deliverables = deliverables;

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('project', 'title').populate('assignedTo', 'name avatar role');

        // Notify current worker of task edits
        if (updatedTask.assignedTo) {
            const worker = await Worker.findById(updatedTask.assignedTo);
            if (worker && worker.userId) {
                const isNewAssignee = assignedTo && assignedTo.toString() !== task.assignedTo?.toString();

                await createNotification({
                    recipient: worker.userId,
                    sender: req.user?._id,
                    type: 'TASK_ASSIGNED',
                    title: isNewAssignee ? 'New Task Assigned' : 'Task Details Updated',
                    message: isNewAssignee
                        ? `You have been assigned to the task: ${updatedTask.title}`
                        : `Details for task "${updatedTask.title}" have been updated by Admin.`,
                    link: '/worker/tasks'
                });
            }
        }

        res.json(updatedTask);
    } catch (error) {
        sendError(res, 400, 'Failed to update task details. Please check your input and try again.', error);
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Admin
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            await task.deleteOne();
            res.json({ success: true, message: 'The task has been successfully removed.' });
        } else {
            sendError(res, 404, 'The task you are trying to remove was not found.');
        }
    } catch (error) {
        sendError(res, 500, 'An issue occurred while trying to remove the task.', error);
    }
};
