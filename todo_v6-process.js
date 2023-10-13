require('dotenv').config();
const client = require('./dbConnect.js');
const express = require('express');
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

app.get('/tasks', async (req, res) => {
    try {
        const allTasksFromDB = await client
            .db('todo-mongo-db')
            .collection('tasks')
            .find({})
            .toArray();
        res.send(allTasksFromDB);
    } catch (error) {
        console.log('Ошибка при получении задач из MongoDB:', error.message);
        res.status(500).send('Ошибка при получении задач');
    }
});

app.post('/tasks', async (req, res) => {
    const jsonTask = req.body;
    try {
        await client
            .db('todo-mongo-db')
            .collection('tasks')
            .insertOne(jsonTask);
        res.send('Добавляем таску');
    } catch (error) {
        console.log('Не удалось добавить задачу в MongoDB', error.message);
        res.send('Не удалось добавить задачу в MongoDB', error.message);
    }
});

app.put('/tasks/:name/status/:status', async (req, res) => {
    const taskName = req.params.name;
    const taskStatus = req.params.status;
    try {
        const result = await client
            .db('todo-mongo-db')
            .collection('tasks')
            .updateOne(
                { name: taskName },
                {
                    $set: { status: taskStatus },
                }
            );
        if (result.modifiedCount === 1) {
            res.send(
                `Статус задача "${taskName}" успешно обновлен на "${taskStatus}"`
            );
        } else {
            res.send(`Задача "${taskName}" уже имеет статус "${taskStatus}"`);
        }
    } catch (error) {
        console.log(error.message);
    }
});

app.put('/tasks/:name/priority/:priority', async (req, res) => {
    const taskName = req.params.name;
    const taskPriority = req.params.priority;
    try {
        const result = await client
            .db('todo-mongo-db')
            .collection('tasks')
            .updateOne(
                { name: taskName },
                {
                    $set: { priority: taskPriority },
                }
            );
        if (result.modifiedCount === 1) {
            res.send(
                `Приоритет задача "${taskName}" успешно обновлен на "${taskPriority}"`
            );
        } else {
            res.send(
                `Задача "${taskName}" уже имеет приоритет "${taskPriority}"`
            );
        }
    } catch (error) {
        console.log(error.message);
    }
});

app.delete('/tasks/:name', async (req, res) => {
    const taskName = req.params.name;
    try {
        const result = await client
            .db('todo-mongo-db')
            .collection('tasks')
            .deleteOne({ name: taskName });
        if (result.deletedCount === 1) {
            res.send(`Задача "${taskName}" успешно удалена`);
        } else {
            res.send(`Задача "${taskName}" не найдена`);
        }
    } catch (error) {
        console.log('Не удалось удалить задачу из MongoDB', error.message);
        res.send(`Не удалось удалить задачу "${taskName}"`);
    }
});

//------------------------------------------
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
