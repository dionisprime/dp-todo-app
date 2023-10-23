const express = require('express');
const router = express.Router();
const { checkUserId } = require('../helper.js');
const {
    getAllUsers,
    getUserById,
    addUser,
    editUser,
    deleteUser,
} = require('../services/userService.js');
const { ERROR_MESSAGE } = require('../constants.js');

router.get('/', async (req, res) => {
    // Получаем всех юзеров
    try {
        const users = await getAllUsers();

        if (users) {
            res.status(200).json(users);
        } else {
            res.status(404).json({ error: 'Юзеры не найдены' });
        }
        // res.status(200).json(results);
    } catch (error) {
        console.error('Ошибка при получении задачи:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const authUserId = req.headers.authorization;

    const checkResult = await checkUserId(userId, authUserId);

    if (checkResult === ERROR_MESSAGE.NOT_AUTHORIZED) {
        return res.status(401).json({ error: ERROR_MESSAGE.NOT_AUTHORIZED });
    }

    if (checkResult === ERROR_MESSAGE.ID_NOT_MATCH) {
        return res.status(401).json({ error: ERROR_MESSAGE.ACCESS_DENIED });
    }

    try {
        const user = await getUserById(userId);
        if (!user) {
            console.log(ERROR_MESSAGE.USER_NOT_FOUND);
            res.send(ERROR_MESSAGE.USER_NOT_FOUND);
        }
        if (user) {
            res.json(user);
        }
    } catch (error) {
        console.log(ERROR_MESSAGE.GET_USER_ERROR, error.message);
        res.status(500).send(ERROR_MESSAGE.GET_USER_ERROR);
    }
});

router.post('/', async (req, res) => {
    const { username, age, email, roles } = req.body;
    const newUser = { username, age, email, roles };

    try {
        const user = await addUser(newUser);
        res.send(user);
    } catch (error) {
        console.log(ERROR_MESSAGE.ADD_USER_ERROR, error.message);
        res.send(`${ERROR_MESSAGE.ADD_USER_ERROR} ${error.message}`);
    }
});

router.put('/:userId/edit', async (req, res) => {
    const userId = req.params.userId;
    const authUserId = req.headers.authorization;
    const { username, age, email } = req.body;
    const userChanges = { username, age, email, roles };

    const checkResult = await checkUserId(userId, authUserId);

    if (checkResult === ERROR_MESSAGE.NOT_AUTHORIZED) {
        return res.status(401).json({ error: ERROR_MESSAGE.NOT_AUTHORIZED });
    }

    if (checkResult === ERROR_MESSAGE.ID_NOT_MATCH) {
        return res.status(401).json({ error: ERROR_MESSAGE.ACCESS_DENIED });
    }

    try {
        const updatedUser = await editUser(userId, userChanges);

        if (!updatedUser) {
            return res
                .status(404)
                .json({ error: ERROR_MESSAGE.USER_NOT_FOUND });
        }

        res.send(updatedUser);
    } catch (error) {
        console.log(error.message);
        res.send(`${ERROR_MESSAGE.EDIT_USER_ERROR} ${error.message}`);
    }
});

router.delete('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const authUserId = req.headers.authorization;

    const checkResult = await checkUserId(userId, authUserId);

    if (checkResult === ERROR_MESSAGE.NOT_AUTHORIZED) {
        return res.status(401).json({ error: ERROR_MESSAGE.NOT_AUTHORIZED });
    }

    if (checkResult === ERROR_MESSAGE.ID_NOT_MATCH) {
        return res.status(401).json({ error: ERROR_MESSAGE.ACCESS_DENIED });
    }

    try {
        const result = await deleteUser(userId);
        if (!result) {
            res.send(ERROR_MESSAGE.USER_NOT_FOUND);
        }
        if (result) {
            res.send(`Юзер успешно удален`);
        }
    } catch (error) {
        console.log(ERROR_MESSAGE.DELETE_USER_ERROR, error.message);
        res.send(`${ERROR_MESSAGE.DELETE_USER_ERROR} ${error.message}`);
    }
});

module.exports = router;
