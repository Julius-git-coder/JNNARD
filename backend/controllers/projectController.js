import Project from '../models/Project.js';
import Worker from '../models/Worker.js';
import { createNotification } from './notificationController.js';
import sendError from '../utils/errorResponse.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).populate('members', 'name role avatar');
        res.json(projects);
    } catch (error) {
        sendError(res, 500, 'Unable to retrieve projects at this time.', error);
    }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('members', 'name role avatar');
        if (project) {
            res.json(project);
        } else {
            sendError(res, 404, 'The requested project could not be found.');
        }
    } catch (error) {
        sendError(res, 500, null, error);
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Admin
export const createProject = async (req, res) => {
    const { title, description, status, startDate, endDate, members } = req.body;

    try {
        const project = await Project.create({
            title,
            description,
            status,
            startDate,
            endDate,
            members, // Expecting array of Worker ObjectIds
        });

        // Notify all project members
        if (members && members.length > 0) {
            for (const workerId of members) {
                const worker = await Worker.findById(workerId);
                if (worker && worker.userId) {
                    await createNotification({
                        recipient: worker.userId,
                        sender: req.user?._id,
                        type: 'GENERAL',
                        title: 'Added to New Project',
                        message: `You have been added to the project: ${title}`,
                        link: '/worker/projects'
                    });
                }
            }
        }
        res.status(201).json(project);
    } catch (error) {
        sendError(res, 400, 'Failed to create project. Please verify that all required fields are correctly filled.', error);
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Admin
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            project.title = req.body.title || project.title;
            project.description = req.body.description || project.description;
            project.status = req.body.status || project.status;
            project.startDate = req.body.startDate || project.startDate;
            project.endDate = req.body.endDate || project.endDate;

            if (req.body.members) {
                project.members = req.body.members;
                project.markModified('members');
            }

            if (req.body.attachments) {
                project.attachments = req.body.attachments;
                project.markModified('attachments');
            }

            if (req.body.issues) {
                project.issues = req.body.issues;
                project.markModified('issues');
            }

            const updatedProject = await project.save();
            const populatedProject = await updatedProject.populate('members', 'name role avatar');

            // Notify members about project updates
            if (populatedProject.members && populatedProject.members.length > 0) {
                for (const member of populatedProject.members) {
                    if (member.userId) {
                        await createNotification({
                            recipient: member.userId,
                            sender: req.user?._id,
                            type: 'GENERAL',
                            title: 'Project Updated',
                            message: `The project "${populatedProject.title}" has been updated by Admin.`,
                            link: '/worker/projects'
                        });
                    }
                }
            }

            res.json(populatedProject);
        } else {
            sendError(res, 404, 'The project you are attempting to update was not found.');
        }
    } catch (error) {
        sendError(res, 400, 'Failed to update project details. Please check your input and try again.', error);
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Admin
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            await project.deleteOne();
            res.json({ success: true, message: 'The project has been successfully removed.' });
        } else {
            sendError(res, 404, 'The project you are trying to remove was not found.');
        }
    } catch (error) {
        sendError(res, 500, 'An issue occurred while trying to remove the project.', error);
    }
};
