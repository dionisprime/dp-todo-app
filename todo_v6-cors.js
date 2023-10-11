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

app.post("/tasks", (req, res) => {
    const jsonTask = req.body;
    // myTodoList.push(jsonTask);
    // res.send(`Добавляем таску "${req.body.name}"`);
    const message = createTaskFromJson(myTodoList, jsonTask);
    res.send(message);
});

app.put("/tasks/:name/status/:status", (req, res) => {
    const taskName = req.params.name;
    const taskStatus = req.params.status;
    // const {}
    changeStatus(myTodoList, taskName, taskStatus);
    console.log(`Изменяем статус задачи на "${taskStatus}"`);
    res.send(req.params);
});

app.put("/tasks/:name/priority/:priority", (req, res) => {
    const taskName = req.params.name;
    const taskPriority = req.params.priority;
    // const {}
    changePriority(myTodoList, taskName, taskPriority);
    console.log(`Изменяем статус задачи на "${taskPriority}"`);
    res.send(req.params);
});

app.delete("/tasks/:name", (req, res) => {
    const taskName = req.params.name;
    console.log(taskName);
    deleteTask(myTodoList, taskName);
    res.send(`удаление задачи "${taskName}"`);
});
//------------------------------------------

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
