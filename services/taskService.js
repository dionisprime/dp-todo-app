const Task = require('../models/TaskModel.js');
const { DEFAULT_DEADLINE, STATUS, PRIORITY } = require('../constants.js');
const { getUserById } = require('../services/userService.js');

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

const getAllTasks = async (authUserId) => {
    const userTasks = await Task.find({
        userId: authUserId,
    });

    console.log('userTasks: ', userTasks);
    return await Promise.all(
        userTasks.map(async (task) => {
            const user = await getUserById(task.userId);

            return {
                _id: task._id,
                name: task.name,
                status: task.status,
                deadline: task.deadline,
                priority: task.priority,
                user: user,
            };
        })
    );
};

module.exports = {
    createTask,
    deleteTask,
    editTask,
    getOneTaskById,
    getAllTasks,
};
