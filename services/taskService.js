const Task = require('../models/TaskModel.js');
const { DEFAULT_DEADLINE, STATUS, PRIORITY } = require('../constants.js');

const createTask = ({
    name,
    status = STATUS.TODO,
    priority = PRIORITY.MEDIUM,
    userId,
    deadline = DEFAULT_DEADLINE,
}) => {
    return Task.create({
        name,
        status,
        priority,
        deadline,
        userId,
    });
};

const deleteTask = (taskId) => {
    return Task.findByIdAndDelete(taskId);
};

const editTask = (taskId, { name, status, priority, deadline }) => {
    return Task.findByIdAndUpdate(
        taskId,
        { name, status, priority, deadline },
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
