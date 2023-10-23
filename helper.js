const { getOneTaskById } = require('./services/taskService.js');
const { getUserById } = require('./services/userService.js');
const { ERROR_MESSAGE } = require('./constants.js');

async function checkUserIdFromTask(taskId, authUserId) {
    if (!authUserId) {
        return ERROR_MESSAGE.NOT_AUTHORIZED;
    }

    try {
        const task = await getOneTaskById(taskId);

        const userIdIsMatch = task.userId.toString() === authUserId;

        return userIdIsMatch
            ? ERROR_MESSAGE.ACCESS_GRANTED
            : ERROR_MESSAGE.ID_NOT_MATCH;
    } catch (error) {
        console.log(error);
    }
}

async function checkUserId(userId, authUserId) {
    if (!authUserId) {
        return ERROR_MESSAGE.NOT_AUTHORIZED;
    }

    try {
        const user = await getUserById(userId);

        const userIdIsMatch = user._id.toString() === authUserId;
        console.log('authUserId: ', authUserId);
        console.log('user._id.toString(): ', user._id.toString());

        return userIdIsMatch
            ? ERROR_MESSAGE.ACCESS_GRANTED
            : ERROR_MESSAGE.ID_NOT_MATCH;
    } catch (error) {
        console.log(error);
    }
}

const checkAuth = (userIdFromTask) => {
    if (userIdFromTask === ERROR_MESSAGE.NOT_AUTHORIZED) {
        throw new Error(ERROR_MESSAGE.NOT_AUTHORIZED);
    }

    if (userIdFromTask === ERROR_MESSAGE.ID_NOT_MATCH) {
        throw new Error(ERROR_MESSAGE.ACCESS_DENIED);
    }
};

module.exports = { checkUserIdFromTask, checkUserId, checkAuth };
