const express = require('express');
const router = express.Router();
const { ERROR_MESSAGE } = require('../constants.js');
const isAuth = require('../middlewares/isAuth.js');
const {
    validateId,
    validateName,
    validateStatus,
    validatePriority,
    validateDeadline,
    validateSubtasks,
    validateDescription,
    validateDeadlineQuery,
    validateStatusQuery,
    validatePriorityQuery,
    validateNameQuery,
    validateIdQuery,
    validateSortQuery,
} = require('../middlewares/validate.js');
const { validationResult } = require('express-validator');
const { tasksAccessCheck } = require('../services/accessCheck.js');
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
    getFilterSortedTasks,
    getTodayTasks,
    getNext7DaysTasks,
    deleteAllUserTasks,
} = require('../services/taskService.js');

router.get(
    '/filter-sort',
    validateIdQuery('userId'),
    validateNameQuery('taskName'),
    validateDeadlineQuery(),
    validateStatusQuery(),
    validatePriorityQuery(),
    validateSortQuery('sortBy'),
    validateSortQuery('sortOrder'),
    async (req, res) => {
        const authUserId = req.headers.authorization;
        if (!authUserId) {
            return res
                .status(401)
                .json({ error: ERROR_MESSAGE.NOT_AUTHORIZED });
        }

        const {
            taskName,
            priority,
            status,
            deadline,
            userId,
            sortBy,
            sortOrder,
        } = req.query;
        const filters = {
            taskName,
            priority,
            status,
            deadline,
            userId,
        };

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const tasks = await getFilterSortedTasks(
                filters,
                sortBy,
                sortOrder
            );
            res.status(200).json(tasks);
        } catch (error) {
            console.error(ERROR_MESSAGE.GET_TASKS_ERROR, error.message);
            res.status(500).json({ error: ERROR_MESSAGE.GET_TASKS_ERROR });
        }
    }
);

router.get('/today', async (req, res) => {
    try {
        const todayTasks = await getTodayTasks();
        res.status(200).json(todayTasks);
    } catch (error) {
        console.error(ERROR_MESSAGE.GET_TASKS_ERROR, error.message);
        res.status(500).json({ error: ERROR_MESSAGE.GET_TASKS_ERROR });
    }
});

router.get('/next7days', async (req, res) => {
    try {
        const next7days = await getNext7DaysTasks();
        res.status(200).json(next7days);
    } catch (error) {
        console.error(ERROR_MESSAGE.GET_TASKS_ERROR, error.message);
        res.status(500).json({ error: ERROR_MESSAGE.GET_TASKS_ERROR });
    }
});

router.get('/', isAuth, async (req, res) => {
    const authUserId = req.headers.authorization;

    try {
        const results = await getAllTasks(authUserId);
        res.status(200).json(results);
    } catch (error) {
        console.error(ERROR_MESSAGE.GET_TASKS_ERROR, error.message);
        res.status(500).json({ error: ERROR_MESSAGE.GET_TASKS_ERROR });
    }
});

router.get('/:taskId', validateId('taskId'), async (req, res) => {
    const taskId = req.params.taskId;
    const authUserId = req.headers.authorization;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        await tasksAccessCheck(taskId, authUserId);
        const task = await getOneTaskById(taskId);
        res.json(task);
    } catch (error) {
        console.log(ERROR_MESSAGE.GET_TASK_ERROR, error.message);
        res.status(500).send(
            `${ERROR_MESSAGE.GET_TASK_ERROR}: ${error.message}`
        );
    }
});

router.get(
    '/:taskId/subtasks/:subtaskId',
    validateId('taskId'),
    validateId('subtaskId'),
    async (req, res) => {
        const taskId = req.params.taskId;
        const subtaskId = req.params.subtaskId;
        const authUserId = req.headers.authorization;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
    }
);

router.post(
    '/:userId',
    validateId('userId'),
    validateName('taskName'),
    validateStatus(),
    validatePriority(),
    validateDeadline(),
    validateSubtasks(),
    async (req, res) => {
        const userId = req.params.userId;
        const { taskName, status, priority, deadline, subtasks } = req.body;
        const newTask = {
            taskName,
            status,
            priority,
            deadline,
            userId,
            subtasks,
        };

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const task = await createTask(newTask);
            res.status(201).send(task);
        } catch (error) {
            console.log(ERROR_MESSAGE.ADD_TASK_ERROR, error.message);
            res.status(404).send(
                `${ERROR_MESSAGE.ADD_TASK_ERROR}: ${error.message}`
            );
        }
    }
);

router.post(
    '/:taskId/subtasks',
    validateId('taskId'),
    validateName('subtaskName'),
    validateDescription(),
    async (req, res) => {
        const taskId = req.params.taskId;
        const authUserId = req.headers.authorization;

        const { subtaskName, description, status, createdAt } = req.body;
        const newSubtask = { subtaskName, description, status, createdAt };

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
    }
);

router.put(
    '/:taskId/edit',
    validateId('taskId'),
    validateName('taskName'),
    validateStatus(),
    validatePriority(),
    validateDeadline(),
    async (req, res) => {
        const taskId = req.params.taskId;
        const authUserId = req.headers.authorization;
        const { taskName, status, priority, deadline } = req.body;
        const taskChanges = { taskName, status, priority, deadline };

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
    }
);

router.put(
    '/:taskId/subtasks/:subtaskId',
    validateId('taskId'),
    validateId('subtaskId'),
    validateName('subtaskName'),
    validateStatus(),
    validateDescription(),
    validateSubtasks(),
    async (req, res) => {
        const taskId = req.params.taskId;
        const subtaskId = req.params.subtaskId;
        const authUserId = req.headers.authorization;

        const { subtaskName, description, status } = req.body;
        const subtaskChanges = { subtaskName, description, status };

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
    }
);

router.delete(
    '/:taskId/subtasks/:subtaskId',
    validateId('taskId'),
    validateId('subtaskId'),
    async (req, res) => {
        const taskId = req.params.taskId;
        const subtaskId = req.params.subtaskId;
        const authUserId = req.headers.authorization;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
    }
);

router.delete('/:taskId', validateId('taskId'), async (req, res) => {
    const taskId = req.params.taskId;
    const authUserId = req.headers.authorization;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

router.delete('/user/:userId', validateId('userId'), async (req, res) => {
    const userId = req.params.userId;

    try {
        const result = await deleteAllUserTasks(userId);
        res.status(200).send(result);
    } catch (error) {
        console.log(ERROR_MESSAGE.DELETE_TASKS_ERROR, error.message);
        res.status(400).send(
            `${ERROR_MESSAGE.DELETE_TASKS_ERROR}: ${error.message}`
        );
    }
});

module.exports = router;
