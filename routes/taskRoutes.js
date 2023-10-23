const express = require('express');
const router = express.Router();
const { ERROR_MESSAGE } = require('../constants.js');

const { checkUserIdFromTask, checkAuth } = require('../helper.js');
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

    const userIdFromTask = await checkUserIdFromTask(taskId, authUserId);

    if (userIdFromTask === ERROR_MESSAGE.NOT_AUTHORIZED) {
        return res.status(401).json({ error: ERROR_MESSAGE.NOT_AUTHORIZED });
    }

    if (userIdFromTask === ERROR_MESSAGE.ID_NOT_MATCH) {
        return res.status(401).json({ error: ERROR_MESSAGE.ACCESS_DENIED });
    }

    // const checkResult = await checkUserIdFromTask(taskId, authUserId);
    try {
        // checkAuth(checkResult);
        const task = await getOneTaskById(taskId);
        if (!task) {
            console.log(ERROR_MESSAGE.TASK_NOT_FOUND);
            res.send(ERROR_MESSAGE.TASK_NOT_FOUND);
        }
        if (task) {
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
        }
    } catch (error) {
        console.log(ERROR_MESSAGE.GET_TASK_ERROR, error.message);
        res.status(500).send(
            ERROR_MESSAGE.GET_TASK_ERROR + ' ' + error.message
        );
    }
});

router.get('/', async (req, res) => {
    const authUserId = req.headers.authorization;

    if (!authUserId) {
        return res.status(401).json({ error: ERROR_MESSAGE.NOT_AUTHORIZED });
    }

    try {
        const tasks = await getAllTasks(authUserId);

        const results = await Promise.all(
            tasks.map(async (task) => {
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
        res.send(`${ERROR_MESSAGE.ADD_TASK_ERROR} ${error.message}`);
    }
});

router.put('/:taskId/edit', async (req, res) => {
    const taskId = req.params.taskId;
    const authUserId = req.headers.authorization;
    const { name, status, priority, deadline } = req.body;
    const taskChanges = { name, status, priority, deadline, userId };

    const userIdFromTask = await checkUserIdFromTask(taskId, authUserId);

    if (userIdFromTask === ERROR_MESSAGE.NOT_AUTHORIZED) {
        return res.status(401).json({ error: ERROR_MESSAGE.NOT_AUTHORIZED });
    }

    if (userIdFromTask === ERROR_MESSAGE.ID_NOT_MATCH) {
        return res.status(401).json({ error: ERROR_MESSAGE.ACCESS_DENIED });
    }

    try {
        const updatedTask = await editTask(taskId, taskChanges);

        if (!updatedTask) {
            return res
                .status(404)
                .json({ error: ERROR_MESSAGE.TASK_NOT_FOUND });
        }

        res.send(updatedTask);
    } catch (error) {
        console.log(error.message);
        res.send(ERROR_MESSAGE.EDIT_TASK_ERROR);
    }
});

router.delete('/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const authUserId = req.headers.authorization;

    const userIdFromTask = await checkUserIdFromTask(taskId, authUserId);

    if (userIdFromTask === ERROR_MESSAGE.NOT_AUTHORIZED) {
        return res.status(401).json({ error: ERROR_MESSAGE.NOT_AUTHORIZED });
    }

    if (userIdFromTask === ERROR_MESSAGE.ID_NOT_MATCH) {
        return res.status(401).json({ error: ERROR_MESSAGE.ACCESS_DENIED });
    }

    try {
        const result = await deleteTask(taskId);
        if (!result) {
            res.send(ERROR_MESSAGE.TASK_NOT_FOUND);
        }
        if (result) {
            res.send(`Задача успешно удалена`);
        }
    } catch (error) {
        console.log(ERROR_MESSAGE.DELETE__TASK_ERROR, error.message);
        res.send(ERROR_MESSAGE.DELETE__TASK_ERROR);
    }
});

module.exports = router;
