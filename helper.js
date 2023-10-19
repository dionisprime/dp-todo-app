const Task = require("./models/TaskModel.js");
const User = require("./models/UserModel.js");

async function findUserIdFromTaskInDataBase(taskId, authUserId) {
    if (!authUserId) {
        return "notauth";
    }

    try {
        const task = await Task.findOne({ _id: taskId });

        if (!task) {
            return "notask";
            // return "Задача не найдена";
        }

        const userId = task.userId.toString();

        if (userId !== authUserId) {
            // Доступ запрещен, userId не совпадает с заголовком Authorization
            return "restrict";
        } else {
            return "granted";
        }
    } catch (error) {
        console.log(error);
    }
}

async function checkUserId(userId, authUserId) {
    if (!authUserId) {
        return "notauth";
    }

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return "nouser";
        }

        const userIdString = user._id.toString();

        if (userIdString !== authUserId) {
            // Доступ запрещен, userId не совпадает с заголовком Authorization
            return "restrict";
        } else {
            return "granted";
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { findUserIdFromTaskInDataBase, checkUserId };
