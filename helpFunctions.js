const findTaskIndex = (todoList, taskName) => {
    return todoList.findIndex((el) => el.name === taskName);
};

const convertItemsToArray = (todoList) => {
    return todoList.map((item) => [item.name, item.status, item.priority]);
};

module.exports = {
    findTaskIndex,
    convertItemsToArray,
};
