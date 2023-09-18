// Практика ToDO list на массивах
const { STATUS, PRIORITY, STATUSES, PRIORITIES } = require('./constants.js');
const { findTaskIndex, convertItemsToArray } = require('./helpFunctions.js');
const {
    simpleShowList,
    showListBonusTask,
    showListOfPriority,
} = require('./showFunctions.js');
const list = require('./todoList.json');

const todoListCreate = (importList) => {
    const newTodoList = [];
    for (let item of importList) {
        const task = new Task(item.name, item.status, item.priority);
        newTodoList.push(task);
    }
    return newTodoList;
};

const myTodoList = todoListCreate(list);

function Task(taskName, status, priority) {
    this.name = taskName;
    this.status = status;
    this.priority = priority;
    this.changeStatus = function (statusToChange) {
        this.status = statusToChange;
    };
    this.changePriority = function (priorityToChange) {
        this.priority = priorityToChange;
    };
}

simpleShowList(myTodoList);
console.log('');

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

createTask(myTodoList, 'swim', STATUS.TODO, PRIORITY.LOW);
createTask(myTodoList, 'swim', STATUS.TODO, PRIORITY.LOW);
changeStatus(myTodoList, 'swim', STATUS.IN_PROGRESS);
changeStatus(myTodoList, 'пойти на пробежку', STATUS.IN_PROGRESS);
changePriority(myTodoList, 'пойти на пробежку', PRIORITY.MEDIUM);

simpleShowList(myTodoList);

createTask(myTodoList, 'по'); // Проверка выброса ошибки, меньшее 3х символов
createTask(myTodoList, 'вфыфывфывфывфвыфвфывфывфвфывфывфывфывфывыфвфывфывыф'); // Проверка выброса ошибки, более 30 символов
deleteTask('aaadwadwa', myTodoList);

createTask(myTodoList, 'поиграть с котом');
createTask(myTodoList, 'сходить подушнить');
createTask(myTodoList, 'сходить подушнить');
createTask(myTodoList, 'Начать писать книгу');
deleteTask('поработать работу', myTodoList);
changeStatus(myTodoList, 'поиграть с котом', STATUS.DONE);
changeStatus(myTodoList, 'сходить подушнить', STATUS.DONE);
showListBonusTask(myTodoList);
changePriority(myTodoList, 'сходить подушнить', PRIORITY.LOW);
changePriority(myTodoList, 'поиграть с котом', PRIORITY.MEDIUM);
changePriority(myTodoList, 'Начать писать книгу', PRIORITY.HIGH);
showListOfPriority(myTodoList);
changeStatus(myTodoList, 'сделать чай', STATUS.DONE);
simpleShowList(myTodoList);
