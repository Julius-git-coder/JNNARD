import Task from '../models/Task.js';
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
// @access  Public
export const createTask = async (req, res) => {
    const { title, description, project, assignedTo, status, priority, dueDate, deliverables } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            status,
            priority,
            dueDate,
            deliverables
        });
        res.status(201).json(task);
    } catch (error) {
        sendError(res, 400, 'Failed to create task. Please ensure all required fields are correctly filled.', error);
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            task.title = req.body.title || task.title;
            task.description = req.body.description || task.description;
            task.project = req.body.project || task.project;
            task.assignedTo = req.body.assignedTo || task.assignedTo;
            task.status = req.body.status || task.status;
            task.priority = req.body.priority || task.priority;
            task.dueDate = req.body.dueDate || task.dueDate;
            task.deliverables = req.body.deliverables || task.deliverables;

            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            sendError(res, 404, 'The task you are attempting to update was not found.');
        }
    } catch (error) {
        sendError(res, 400, 'Failed to update task details. Please check your input and try again.', error);
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
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
