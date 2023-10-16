require('dotenv').config();
const { ObjectId } = require('mongodb');
const Task = require('./TaskModel.js');
const express = require('express');
//------------------------------------------
const port = process.env.PORT;
const app = express();
//------------------------------------------
// для обработки CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
//------------------------------------------

app.use(express.json()); // бодипарсер

app.get('/', (req, res) => {
    res.send('Привет! По пути /tasks будет список задач!)');
});

app.get('/tasks/:taskId', async (req, res) => {
    // получение задачи из БД по id
    const taskId = req.params.taskId;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            console.log('нет такой задачи');
            res.send('нет такой задачи');
        }
        if (task) {
            res.json(task);
        }
    } catch (error) {
        console.log('Ошибка при получении задачи из MongoDB:', error.message);
        res.status(500).send('Ошибка при получении задачи');
    }
});

app.get('/tasks', async (req, res) => {
    // Получаем все таски
    try {
        const tasks = await Task.find({});

        if (tasks) {
            res.status(200).json(tasks);
        } else {
            res.status(404).json({ error: 'Задача не найдена' });
        }
    } catch (error) {
        console.error('Ошибка при получении задачи:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/tasks', async (req, res) => {
    // создание задачи из тела запроса и добавление в БД
    const { name, status, priority } = req.body;

    try {
        const task = await Task.create({
            name: name,
            status: status,
            priority: priority,
        });
        res.send(task);
    } catch (error) {
        console.log('Не удалось добавить задачу в MongoDB', error.message);
        res.send('Не удалось добавить задачу в MongoDB', error.message);
    }
});

app.put('/tasks/:taskId/status/:status', async (req, res) => {
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
            return res.status(404).json({ error: 'Task not found' });
        }

        res.send(updatedTask);
    } catch (error) {
        console.log(error.message);
        res.send('Не удалось обновить задачу');
    }
});

app.put('/tasks/:taskId/priority/:priority', async (req, res) => {
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
            return res.status(404).json({ error: 'Task not found' });
        }

        res.send(updatedTask);
    } catch (error) {
        console.log(error.message);
        res.send('Не удалось обновить задачу');
    }
});

app.delete('/tasks/:taskId', async (req, res) => {
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
        console.log('Не удалось удалить задачу из MongoDB', error.message);
        res.send(`Не удалось удалить задачу`);
    }
});

//------------------------------------------
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
