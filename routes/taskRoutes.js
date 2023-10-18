const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const Task = require("../models/TaskModel.js");
const User = require("../models/UserModel.js");

router.get("/:taskId", async (req, res) => {
    // Получаем таску по id
    const taskId = req.params.taskId;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            console.log("нет такой задачи");
            res.send("нет такой задачи");
        }
        if (task) {
            const { _id, name, status, priority, userId } = task;
            const user = await User.findById(userId);

            const resultTask = {
                _id: _id,
                name: name,
                status: status,
                priority: priority,
                user: user,
            };

            res.json(resultTask);
        }
    } catch (error) {
        console.log("Ошибка при получении задачи из MongoDB:", error.message);
        res.status(500).send("Ошибка при получении задачи");
    }
});

router.get("/", async (req, res) => {
    // Получаем все таски
    try {
        const tasks = await Task.find({});

        const results = await Promise.all(
            tasks.map(async (task) => {
                const user = await User.findById(task.userId);
                return {
                    _id: task._id,
                    name: task.name,
                    status: task.status,
                    priority: task.priority,
                    user: user,
                };
            })
        );
        res.status(200).json(results);
    } catch (error) {
        console.error("Ошибка при получении задачи:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

router.post("/:userId", async (req, res) => {
    // создание задачи из тела запроса и добавление в БД, userId, беру из параметров запроса
    const userId = req.params.userId;
    const { name, status, priority } = req.body;

    try {
        const task = await Task.create({
            name: name,
            status: status,
            priority: priority,
            userId: new ObjectId(userId),
        });
        res.send(task);
    } catch (error) {
        console.log("Не удалось добавить задачу в MongoDB", error.message);
        res.send(
            `Не удалось добавить задачу в MongoDB, ошибка: ${error.message}`
        );
    }
});

router.put("/:taskId/status/:status", async (req, res) => {
    // изменение статуса задачи по айди
    const taskId = req.params.taskId;
    const taskStatus = req.params.status;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                status: taskStatus,
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.send(updatedTask);
    } catch (error) {
        console.log(error.message);
        res.send("Не удалось обновить задачу");
    }
});

router.put("/:taskId/priority/:priority", async (req, res) => {
    // изменение приоритета задачи по айди
    const taskId = req.params.taskId;
    const taskPriority = req.params.priority;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                priority: taskPriority,
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.send(updatedTask);
    } catch (error) {
        console.log(error.message);
        res.send("Не удалось обновить задачу");
    }
});

router.delete("/:taskId", async (req, res) => {
    // удаление задачи по айди
    const taskId = req.params.taskId;

    try {
        const result = await Task.findByIdAndDelete(taskId);
        if (!result) {
            res.send(`Задача не найдена`);
        }
        if (result) {
            res.send(`Задача успешно удалена`);
        }
    } catch (error) {
        console.log("Не удалось удалить задачу из MongoDB", error.message);
        res.send(`Не удалось удалить задачу`);
    }
});

module.exports = router;
