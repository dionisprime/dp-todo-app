const Task = require('../models/TaskModel.js');

const createTask = ({ name, status, priority, userId, deadline }) => {
    return Task.create({
        name: name,
        status: status,
        priority: priority,
        deadline: deadline || new Date('2024-12-31'),
        userId: userId,
    });
};

const deleteTask = (taskId) => {
    return Task.findByIdAndDelete(taskId);
};

const editTask = (taskId, { name, status, priority, deadline }) => {
    return Task.findByIdAndUpdate(
        taskId,
        {
            name: name,
            status: status,
            priority: priority,
            deadline: deadline,
        },
        { new: true }
    );
};

const getOneTaskById = (taskId) => {
    return Task.findById(taskId);
};

const getAllTasks = (authUserId) => {
    return Task.find({
        userId: authUserId,
    });
};

module.exports = {
    createTask,
    deleteTask,
    editTask,
    getOneTaskById,
    getAllTasks,
};
