const express = require('express');
const router = express.Router();
const { findUserIdFromTaskInDataBase } = require('../helper.js');
const {
    createTask,
    deleteTask,
    editTask,
    getOneTaskById,
    getAllTasks,
} = require('../services/taskService.js');
const { getUserById } = require('../services/userService.js');

router.get('/:taskId', async (req, res) => {
    // Получаем таску по id
    const taskId = req.params.taskId;
    const authUserId = req.headers.authorization;

    const userIdFromTask = await findUserIdFromTaskInDataBase(
        taskId,
        authUserId
    );

    switch (userIdFromTask) {
        case 'notauth':
            return res.status(401).json({
                error: 'Пользователь не авторизован, доступ запрещен',
            });
        case 'notask':
            return res.status(401).json({ error: 'Задача не найдена' });
        case 'restrict':
            return res
                .status(401)
                .json({ error: 'Другой пользователь. Доступ запрещен' });
        default:
            console.log('Проверки пройдены');
            break;
    }

    try {
        const task = await getOneTaskById(taskId);
        if (!task) {
            console.log('нет такой задачи');
            res.send('нет такой задачи');
        }
        if (task) {
            const { _id, name, status, priority, deadline, userId } = task;
            const user = await getUserById(userId);

            const resultTask = {
                _id: _id,
                name: name,
                status: status,
                priority: priority,
                deadline: deadline,
                user: user,
            };

            res.json(resultTask);
        }
    } catch (error) {
        console.log('Ошибка при получении задачи из MongoDB:', error.message);
        res.status(500).send('Ошибка при получении задачи');
    }
});

router.get('/', async (req, res) => {
    // Получаем все таски для конкретного пользователя с учётом его авторизации
    const authUserId = req.headers.authorization;

    if (!authUserId) {
        // Если нет id юзера для авторизации, возвращаем ошибку 401 (Unauthorized)
        return res
            .status(401)
            .json({ error: 'Пользователь не авторизован, доступ запрещен' });
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
        console.error('Ошибка при получении задачи: ', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

router.post('/:userId', async (req, res) => {
    // создание задачи из тела запроса и добавление в БД, userId, берется из параметров запроса
    req.body.userId = req.params.userId;
    console.log(req.body);
    try {
        const task = await createTask(req.body);
        res.status(201).send(task);
    } catch (error) {
        console.log('Не удалось добавить задачу в MongoDB', error.message);
        res.send(
            `Не удалось добавить задачу в MongoDB, ошибка: ${error.message}`
        );
    }
});

router.put('/:taskId/edit', async (req, res) => {
    // изменение приоритета задачи по айди
    const taskId = req.params.taskId;
    const authUserId = req.headers.authorization;

    const userIdFromTask = await findUserIdFromTaskInDataBase(
        taskId,
        authUserId
    );

    switch (userIdFromTask) {
        case 'notauth':
            return res.status(401).json({
                error: 'Пользователь не авторизован, доступ запрещен',
            });
        case 'notask':
            return res.status(401).json({ error: 'Задача не найдена' });
        case 'restrict':
            return res
                .status(401)
                .json({ error: 'Другой пользователь. Доступ запрещен' });
        default:
            console.log('Проверки пройдены');
            break;
    }

    try {
        const updatedTask = await editTask(taskId, req.body);

        if (!updatedTask) {
            return res.status(404).json({ error: 'Задача не найдена' });
        }

        res.send(updatedTask);
    } catch (error) {
        console.log(error.message);
        res.send('Не удалось обновить задачу');
    }
});

router.delete('/:taskId', async (req, res) => {
    // удаление задачи по айди
    const taskId = req.params.taskId;
    const authUserId = req.headers.authorization;

    const userIdFromTask = await findUserIdFromTaskInDataBase(
        taskId,
        authUserId
    );

    switch (userIdFromTask) {
        case 'notauth':
            return res.status(401).json({
                error: 'Пользователь не авторизован, доступ запрещен',
            });
        case 'notask':
            return res.status(401).json({ error: 'Задача не найдена' });
        case 'restrict':
            return res
                .status(401)
                .json({ error: 'Другой пользователь. Доступ запрещен' });
        default:
            console.log('Проверки пройдены');
            break;
    }

    try {
        const result = await deleteTask(taskId);
        if (!result) {
            res.send(`Задача не найдена`);
        }
        if (result) {
            res.send(`Задача успешно удалена`);
        }
    } catch (error) {
        console.log('Не удалось удалить задачу из MongoDB', error.message);
        res.send(`Не удалось удалить задачу`);
    }
});

module.exports = router;
