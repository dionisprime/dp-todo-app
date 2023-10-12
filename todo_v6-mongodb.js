const { simpleShowList } = require("./functions/showFunctions.js");
const todoListCreate = require("./functions/todoListCreate.js");
const {
    createTaskFromJson,
    deleteTask,
    changeStatus,
    changePriority,
} = require("./functions/editFunctions.js");
const list = require("./todoList.json");

const myTodoList = todoListCreate(list);

//------------------------------------------
// DB Connect
const url = "mongodb://127.0.0.1:27017/test1"; // урл для сервиса с mongodb
const { MongoClient } = require("mongodb"); // конструктор клиентов mongodb
const client = new MongoClient(url); // создаем новый клиент для работы с базой
(async function () {
    try {
        await client.connect(); // подключаемся к базе
    } catch (error) {
        console.log("Не удалось подключиться к MongoDB:", error.message);
    }
})();

//------------------------------------------

//------------------------------------------
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
//------------------------------------------
// для обработки CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
//------------------------------------------
app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.send("Привет! По пути /tasks будет список задач!)");
});
app.get("/tasks", (req, res) => {
    // const tasksString = simpleShowList(myTodoList);
    // res.send(tasksString);
    res.send(myTodoList);
});

app.post("/tasks", async (req, res) => {
    const jsonTask = req.body;
    const message = createTaskFromJson(myTodoList, jsonTask);
    try {
        await client
            .db("todo-mongo-db")
            .collection("tasks")
            .insertOne(jsonTask);
    } catch (error) {
        console.log("Не удалось добавить задачу в MongoDB", error.message);
    }
    res.send(message);
});

app.put("/tasks/:name/status/:status", async (req, res) => {
    const taskName = req.params.name;
    const taskStatus = req.params.status;
    try {
        const result = await client
            .db("todo-mongo-db")
            .collection("tasks")
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

app.put("/tasks/:name/priority/:priority", async (req, res) => {
    const taskName = req.params.name;
    const taskPriority = req.params.priority;
    try {
        const result = await client
            .db("todo-mongo-db")
            .collection("tasks")
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

app.delete("/tasks/:name", async (req, res) => {
    const taskName = req.params.name;
    try {
        const result = await client
            .db("todo-mongo-db")
            .collection("tasks")
            .deleteOne({ name: taskName });
        if (result.deletedCount === 1) {
            res.send(`Задача "${taskName}" успешно удалена`);
        } else {
            res.send(`Задача "${taskName}" не найдена`);
        }
    } catch (error) {
        console.log("Не удалось удалить задачу из MongoDB", error.message);
        res.send(`Не удалось удалить задачу "${taskName}"`);
    }
});
//------------------------------------------

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
