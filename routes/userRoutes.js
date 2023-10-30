const express = require('express');
const router = express.Router();
const { userAccessCheck } = require('../services/accessCheck.js');
const {
    getAllUsers,
    getUserById,
    addUser,
    editUser,
    deleteUser,
} = require('../services/userService.js');
const { ERROR_MESSAGE } = require('../constants.js');

router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();

        if (users) {
            res.status(200).json(users);
        } else {
            res.status(404).send(ERROR_MESSAGE.USERS_NOT_FOUND);
        }
    } catch (error) {
        console.error(ERROR_MESSAGE.GET_USERS_ERROR, error.message);
        res.status(500).send(
            `${ERROR_MESSAGE.GET_USERS_ERROR}: ${error.message}`
        );
    }
});

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const authUserId = req.headers.authorization;

    try {
        await userAccessCheck(userId, authUserId);
        const user = await getUserById(userId);

        res.status(200).json(user);
    } catch (error) {
        console.log(ERROR_MESSAGE.GET_USER_ERROR, error.message);
        res.status(500).send(
            `${ERROR_MESSAGE.GET_USER_ERROR}: ${error.message}`
        );
    }
});

router.post('/', async (req, res) => {
    const { username, age, email, roles } = req.body;
    const newUser = { username, age, email, roles };

    try {
        const user = await addUser(newUser);
        res.status(201).send(user);
    } catch (error) {
        console.log(ERROR_MESSAGE.ADD_USER_ERROR, error.message);
        res.status(500).send(
            `${ERROR_MESSAGE.ADD_USER_ERROR}: ${error.message}`
        );
    }
});

router.put('/:userId/edit', async (req, res) => {
    const userId = req.params.userId;
    const authUserId = req.headers.authorization;
    const { username, age, email } = req.body;
    const userChanges = { username, age, email };

    try {
        // await userAccessCheck(userId, authUserId);

        const updatedUser = await editUser(userId, userChanges);

        res.status(200).send(updatedUser);
    } catch (error) {
        console.log(ERROR_MESSAGE.EDIT_USER_ERROR, error.message);
        res.status(400).send(
            `${ERROR_MESSAGE.EDIT_USER_ERROR}: ${error.message}`
        );
    }
});

router.delete('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const authUserId = req.headers.authorization;

    try {
        // await userAccessCheck(userId, authUserId);
        const result = await deleteUser(userId);

        res.status(200).send(`Юзер ${result} успешно удален`);
    } catch (error) {
        console.log(ERROR_MESSAGE.DELETE_USER_ERROR, error.message);
        res.status(401).send(
            `${ERROR_MESSAGE.DELETE_USER_ERROR} ${error.message}`
        );
    }
});

module.exports = router;
