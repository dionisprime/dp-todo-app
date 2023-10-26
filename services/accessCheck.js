const { getOneTaskById } = require("./taskService.js");
const { getOnePlanById } = require("./planService.js");
const { getUserById } = require("./userService.js");
const { ERROR_MESSAGE } = require("../constants.js");

async function tasksAccessCheck(taskId, authUserId) {
    if (!authUserId) {
        throw new Error(ERROR_MESSAGE.NOT_AUTHORIZED);
    }

    const task = await getOneTaskById(taskId);
    console.log("task", task);
    if (!task) {
        throw new Error(ERROR_MESSAGE.TASK_NOT_FOUND);
    }

    const userIdIsMatch = task.userId._id.toString() === authUserId;

    if (!userIdIsMatch) {
        throw new Error(ERROR_MESSAGE.ACCESS_DENIED);
    }

    if (userIdIsMatch) {
        return "Доступ разрешен";
    }
}

async function planAccessCheck(planId, authUserId) {
    if (!authUserId) {
        throw new Error(ERROR_MESSAGE.NOT_AUTHORIZED);
    }

    const plan = await getOnePlanById(planId);
    if (!plan) {
        throw new Error(ERROR_MESSAGE.PLAN_NOT_FOUND);
    }
}

async function userAccessCheck(userId, authUserId) {
    if (!authUserId) {
        throw new Error(ERROR_MESSAGE.NOT_AUTHORIZED);
    }

    const user = await getUserById(userId);

    if (!user) {
        throw new Error(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const userIdIsMatch = user._id.toString() === authUserId;

    if (!userIdIsMatch) {
        throw new Error(ERROR_MESSAGE.ACCESS_DENIED);
    }

    if (userIdIsMatch) {
        return "Доступ разрешен";
    }
}

module.exports = { tasksAccessCheck, userAccessCheck, planAccessCheck };
