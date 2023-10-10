const { STATUS, PRIORITY, STATUSES, PRIORITIES } = require('../constants.js');
const { findTaskIndex, convertItemsToArray } = require('./helpFunctions.js');
const Task = require('./Task.js');

const createTask = (
    todoList,
    taskName,
    status = STATUS.TODO,
    priority = PRIORITY.MEDIUM
) => {
    const indexOfTask = findTaskIndex(todoList, taskName);

    try {
        if (taskName.length < 3 || taskName.length > 30) {
            throw new Error(
                'Ошибка: Имя задачи должно быть более 3х символов и менее 30'
            );
        }
        if (indexOfTask != -1) {
            throw new Error(
                `Внимание: задача "${taskName}" уже есть в списке задач\n`
            );
        } else {
            console.log(`задачи "${taskName}" нет в списке задач, добавляем\n`);
            const task = new Task(taskName, status, priority);
            todoList.push(task);
        }
    } catch (error) {
        console.log(error.message);
    }
};

const changeStatus = (todoList, taskName, statusToChange) => {
    const task = todoList[findTaskIndex(todoList, taskName)];
    try {
        if (taskName === task.name) {
            task.changeStatus(statusToChange);
        }
    } catch (error) {
        console.log(error.message);
    }
};

const changePriority = (todoList, taskName, priorityToChange) => {
    const task = todoList[findTaskIndex(todoList, taskName)];

    try {
        if (taskName === task.name) {
            task.changePriority(priorityToChange);
        }
    } catch (error) {
        console.log(error.message);
    }
};

const deleteTask = (taskName, todoList) => {
    const indexOfTask = findTaskIndex(todoList, taskName);

    try {
        if (indexOfTask != -1) {
            todoList.splice(indexOfTask, 1);
            console.log(`задача "${taskName}" удалена из списка задач\n`);
        } else {
            throw new Error(
                `Внимание: задачи "${taskName}" нет в списке задач\n`
            );
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    createTask,
    changeStatus,
    changePriority,
    deleteTask,
};
