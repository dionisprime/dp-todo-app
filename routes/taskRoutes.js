const express = require('express');
const router = express.Router();
const { ERROR_MESSAGE } = require('../constants.js');

const { tasksAccessCheck } = require('../helper.js');
const {
    createTask,
    deleteTask,
    editTask,
    getOneTaskById,
    getAllTasks,
} = require('../services/taskService.js');
const { getUserById } = require('../services/userService.js');

router.get('/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const authUserId = req.headers.authorization;

    try {
        await tasksAccessCheck(taskId, authUserId);

        const task = await getOneTaskById(taskId);
        const { _id, name, status, priority, deadline, userId } = task;
        const user = await getUserById(userId);

        const resultTask = {
            _id,
            name,
            status,
            priority,
            deadline,
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

router.get('/', async (req, res) => {
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

router.post('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { name, status, priority, deadline } = req.body;
    const newTask = { name, status, priority, deadline, userId };

    try {
        const task = await createTask(newTask);
        res.status(201).send(task);
    } catch (error) {
        console.log(ERROR_MESSAGE.ADD_TASK_ERROR, error.message);
        res.send(`${ERROR_MESSAGE.ADD_TASK_ERROR}: ${error.message}`);
    }
});

router.put('/:taskId/edit', async (req, res) => {
    const taskId = req.params.taskId;
    const authUserId = req.headers.authorization;
    const { name, status, priority, deadline } = req.body;
    const taskChanges = { name, status, priority, deadline };

    try {
        await tasksAccessCheck(taskId, authUserId);

        const updatedTask = await editTask(taskId, taskChanges);

        res.send(updatedTask);
    } catch (error) {
        console.log(ERROR_MESSAGE.EDIT_TASK_ERROR, error.message);
        res.send(`${ERROR_MESSAGE.EDIT_TASK_ERROR}: ${error.message}`);
    }
});

router.delete('/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const authUserId = req.headers.authorization;

    try {
        await tasksAccessCheck(taskId, authUserId);

        const result = await deleteTask(taskId);

        res.send(`Задача ${result} успешно удалена`);
    } catch (error) {
        console.log(ERROR_MESSAGE.DELETE__TASK_ERROR, error.message);
        res.send(`${ERROR_MESSAGE.DELETE__TASK_ERROR}: ${error.message}`);
    }
});

module.exports = router;
