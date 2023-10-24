const Task = require("../models/TaskModel.js");
const {
    DEFAULT_DEADLINE,
    STATUS,
    PRIORITY,
    ERROR_MESSAGE,
} = require("../constants.js");
const { getUserById } = require("../services/userService.js");

const createTask = ({
    name,
    status = STATUS.TODO,
    priority = PRIORITY.MEDIUM,
    userId,
    deadline = DEFAULT_DEADLINE,
    subtasks,
}) => {
    return Task.create({
        name,
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

    console.log("userTasks: ", userTasks);
    return await Promise.all(
        userTasks.map(async (task) => {
            const user = await getUserById(task.userId);

            return {
                _id: task._id,
                name: task.name,
                status: task.status,
                deadline: task.deadline,
                priority: task.priority,
                subtasks: task.subtasks,
                user: user,
            };
        })
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
    console.log(task);
    task.subtasks.push({ subtaskName, description, status, createdAt });
    return await task.save();
};

const deleteSubtask = async (taskId, subtaskId) => {
    const task = await Task.findByIdAndUpdate(taskId);
    const subtaskToDelete = task.subtasks.find(
        (subtask) => subtask._id.toString() === subtaskId
    );

    console.log(subtaskToDelete);

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
