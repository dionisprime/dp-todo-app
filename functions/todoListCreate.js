const Task = require("./Task.js");

const todoListCreate = (importList) => {
    const newTodoList = [];
    for (let item of importList) {
        const task = new Task(item.name, item.status, item.priority);
        newTodoList.push(task);
    }
    return newTodoList;
};

module.exports = todoListCreate;
