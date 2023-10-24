const express = require("express");
const router = express.Router();
const { ERROR_MESSAGE } = require("../constants.js");

const { tasksAccessCheck } = require("../services/accessCheck.js");
const {
    createTask,
    deleteTask,
    editTask,
    getOneTaskById,
    getAllTasks,
    editSubtask,
    createSubtask,
    deleteSubtask,
    getOneSubtaskById,
} = require("../services/taskService.js");
const { getUserById } = require("../services/userService.js");

router.get("/:taskId", async (req, res) => {
    const taskId = req.params.taskId;
    const authUserId = req.headers.authorization;

    try {
        await tasksAccessCheck(taskId, authUserId);

        const task = await getOneTaskById(taskId);
        const { _id, name, status, priority, deadline, subtasks, userId } =
            task;
        const user = await getUserById(userId);

        const resultTask = {
            _id,
            name,
            status,
            priority,
            deadline,
            subtasks,
            user,
        };

        res.json(resultTask);
    } catch (error) {
        console.log(ERROR_MESSAGE.GET_TASK_ERROR, error.message);
        res.status(500).send(
            `${ERROR_MESSAGE.GET_TASK_ERROR}: ${error.message}`
        );
    }
});

router.get("/", async (req, res) => {
    const authUserId = req.headers.authorization;

    if (!authUserId) {
        return res.status(401).json({ error: ERROR_MESSAGE.NOT_AUTHORIZED });
    }

    try {
        const results = await getAllTasks(authUserId);
        res.status(200).json(results);
    } catch (error) {
        console.error(ERROR_MESSAGE.GET_TASK_ERROR, error.message);
        res.status(500).json({ error: ERROR_MESSAGE.GET_TASK_ERROR });
    }
});

router.get("/:taskId/subtasks/:subtaskId", async (req, res) => {
    const taskId = req.params.taskId;
    const subtaskId = req.params.subtaskId;
    const authUserId = req.headers.authorization;

    try {
        await tasksAccessCheck(taskId, authUserId);
        const results = await getOneSubtaskById(taskId, subtaskId);
        res.status(200).json(results);
    } catch (error) {
        console.error(ERROR_MESSAGE.GET_TASK_ERROR, error.message);
        res.status(500).json(
            `${ERROR_MESSAGE.GET_TASK_ERROR} ${error.message}`
        );
    }
});

router.post("/:userId", async (req, res) => {
    const userId = req.params.userId;
    const { name, status, priority, deadline, subtasks } = req.body;
    const newTask = { name, status, priority, deadline, userId, subtasks };

    try {
        const task = await createTask(newTask);
        res.status(201).send(task);
    } catch (error) {
        console.log(ERROR_MESSAGE.ADD_TASK_ERROR, error.message);
        res.status(404).send(
            `${ERROR_MESSAGE.ADD_TASK_ERROR}: ${error.message}`
        );
    }
});

router.post("/:taskId/subtasks", async (req, res) => {
    const taskId = req.params.taskId;
    const authUserId = req.headers.authorization;

    const { subtaskName, description, status, createdAt } = req.body;
    const newSubtask = { subtaskName, description, status, createdAt };

    try {
        await tasksAccessCheck(taskId, authUserId);

        const task = await createSubtask(taskId, newSubtask);

        res.status(201).send(task);
    } catch (error) {
        console.log(ERROR_MESSAGE.ADD_TASK_ERROR, error.message);
        res.status(404).send(
            `${ERROR_MESSAGE.ADD_TASK_ERROR}: ${error.message}`
        );
    }
});

router.put("/:taskId/edit", async (req, res) => {
    const taskId = req.params.taskId;
    const authUserId = req.headers.authorization;
    const { name, status, priority, deadline } = req.body;
    const taskChanges = { name, status, priority, deadline };

    try {
        await tasksAccessCheck(taskId, authUserId);

        const updatedTask = await editTask(taskId, taskChanges);

        res.status(200).send(updatedTask);
    } catch (error) {
        console.log(ERROR_MESSAGE.EDIT_TASK_ERROR, error.message);
        res.status(404).send(
            `${ERROR_MESSAGE.EDIT_TASK_ERROR}: ${error.message}`
        );
    }
});

router.put("/:taskId/subtasks/:subtaskId", async (req, res) => {
    const taskId = req.params.taskId;
    const subtaskId = req.params.subtaskId;
    const authUserId = req.headers.authorization;

    const { subtaskName, description, status } = req.body;
    const subtaskChanges = { subtaskName, description, status };
    try {
        await tasksAccessCheck(taskId, authUserId);
        const updatedTask = await editSubtask(
            taskId,
            subtaskId,
            subtaskChanges
        );
        res.status(200).send(updatedTask);
    } catch (error) {
        console.log(ERROR_MESSAGE.EDIT_TASK_ERROR, error.message);
        res.status(404).send(
            `${ERROR_MESSAGE.EDIT_TASK_ERROR}: ${error.message}`
        );
    }
});

router.delete("/:taskId/subtasks/:subtaskId", async (req, res) => {
    const taskId = req.params.taskId;
    const subtaskId = req.params.subtaskId;
    const authUserId = req.headers.authorization;

    try {
        await tasksAccessCheck(taskId, authUserId);

        const result = await deleteSubtask(taskId, subtaskId);

        res.status(200).send(`${result}`);
    } catch (error) {
        console.log(ERROR_MESSAGE.DELETE__TASK_ERROR, error.message);
        res.status(404).send(
            `${ERROR_MESSAGE.DELETE__TASK_ERROR}: ${error.message}`
        );
    }
});

router.delete("/:taskId", async (req, res) => {
    const taskId = req.params.taskId;
    const authUserId = req.headers.authorization;

    try {
        await tasksAccessCheck(taskId, authUserId);

        const result = await deleteTask(taskId);

        res.status(200).send(`Задача ${result} успешно удалена`);
    } catch (error) {
        console.log(ERROR_MESSAGE.DELETE__TASK_ERROR, error.message);
        res.status(404).send(
            `${ERROR_MESSAGE.DELETE__TASK_ERROR}: ${error.message}`
        );
    }
});

module.exports = router;
