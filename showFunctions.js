const { STATUS, PRIORITY, STATUSES, PRIORITIES } = require('./constants.js');
const { findTaskIndex, convertItemsToArray } = require('./helpFunctions.js');

const simpleShowList = (todoList) => {
    console.log('Список дел:');
    STATUSES.forEach((status) => {
        const tasks = todoList.filter((task) => task.status === status);

        if (tasks.length > 0) {
            tasks.forEach((task) => {
                console.log(
                    `"${task.name}": ${task.status} - ${task.priority}`
                );
            });
        } else {
            console.log(`Nothing is ${status}`);
        }
    });
};

const showListBonusTask = (todoList) => {
    console.log('Список дел с сортировкой по статусу: ');
    STATUSES.forEach((status) => {
        const todoItems = convertItemsToArray(todoList)
            .filter((entry) => entry[1] === status)
            .map((entry) => '   ' + entry[0])
            .join('\n');

        console.log(status + ':');
        todoItems.length > 0 ? console.log(todoItems) : console.log('   -');
    });
    console.log('');
};

const showListOfPriority = (todoList) => {
    console.log('Список дел по приоритету: ');
    PRIORITIES.forEach((priority) => {
        const todoItems = convertItemsToArray(todoList)
            .filter((entry) => entry[2] === priority)
            .map((entry) => '   ' + entry[0])
            .join('\n');

        console.log(priority + ':');
        todoItems.length > 0 ? console.log(todoItems) : console.log('   -');
    });
    console.log('');
};

const showListOfStatusAndPriority = (todoList) => {};

module.exports = {
    simpleShowList,
    showListBonusTask,
    showListOfPriority,
};
