import Task from '../models/Task.js';

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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(400).json({ message: error.message });
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
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
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
            res.json({ message: 'Task removed' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
