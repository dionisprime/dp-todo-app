const { simpleShowList } = require('./functions/showFunctions.js');
const todoListCreate = require('./functions/todoListCreate.js');
const list = require('./todoList.json');

const myTodoList = todoListCreate(list);

//------------------------------------------
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
//------------------------------------------
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Привет! По пути /tasks будет список задач!)');
});
app.get('/tasks', (req, res) => {
    const tasksString = simpleShowList(myTodoList);
    res.send(tasksString);
});

app.post('/tasks', (req, res) => {
    const jsonTask = req.body;
    console.log(req.body);
    myTodoList.push(jsonTask);
    res.send(`Добавляем таску "${req.body.name}"`);
});
//------------------------------------------

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
