const Task = require("../models/TaskModel.js");
const {
    DEFAULT_DEADLINE,
    STATUS,
    PRIORITY,
    ERROR_MESSAGE,
} = require("../constants.js");

const getOneTaskById = (taskId) => {
    return Task.findById(taskId).populate("userId");
};

const getAllTasks = async (authUserId) => {
    const userTasks = await Task.find({
        userId: authUserId,
    }).populate("userId");

    return userTasks;
};

const createTask = ({
    taskName,
    status = STATUS.TODO,
    priority = PRIORITY.MEDIUM,
    userId,
    deadline = DEFAULT_DEADLINE,
    subtasks,
}) => {
    return Task.create({
        taskName,
        status,
        priority,
        deadline,
        userId,
        subtasks,
    });
};

const deleteTask = (taskId) => {
    return Task.findByIdAndDelete(taskId);
};

const editTask = (taskId, { taskName, status, priority, deadline }) => {
    return Task.findByIdAndUpdate(
        taskId,
        { taskName, status, priority, deadline },
        { new: true }
    );
};

//---------------------
const getOneSubtaskById = async (taskId, subtaskId) => {
    const task = await Task.findById(taskId);

    if (!task) {
        return ERROR_MESSAGE.TASK_NOT_FOUND;
    }

    const subtask = task.subtasks.id(subtaskId);

    if (!subtask) {
        return ERROR_MESSAGE.SUBTASK_NOT_FOUND;
    }
    return subtask;
};
const createSubtask = async (
    taskId,
    { subtaskName, description, status, createdAt }
) => {
    const task = await Task.findById(taskId);
    task.subtasks.push({ subtaskName, description, status, createdAt });
    return await task.save();
};

const deleteSubtask = async (taskId, subtaskId) => {
    const task = await Task.findByIdAndUpdate(taskId);
    const subtaskToDelete = task.subtasks.find(
        (subtask) => subtask._id.toString() === subtaskId
    );

    if (!subtaskToDelete) {
        return "Подзадача не найдена";
    }

    if (subtaskToDelete) {
        task.subtasks.pull({ _id: subtaskId });
        task.save();
        return `Подзадача ${subtaskToDelete} удалена`;
    }
};

const editSubtask = async (
    taskId,
    subtaskId,
    { subtaskName, description, status }
) => {
    const task = await Task.findById(taskId);

    const subtask = task.subtasks.id(subtaskId);

    if (description) {
        subtask.description = description;
    }
    if (status) {
        subtask.status = status;
    }
    if (subtaskName) {
        subtask.subtaskName = subtaskName;
    }

    return await task.save();
};

module.exports = {
    createTask,
    deleteTask,
    editTask,
    getOneTaskById,
    getAllTasks,
    editSubtask,
    createSubtask,
    deleteSubtask,
    getOneSubtaskById,
};
