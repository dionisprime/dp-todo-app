const express = require("express");
const router = express.Router();
const User = require("../models/UserModel.js");

router.get("/", async (req, res) => {
    // Получаем всех юзеров
    try {
        const users = await User.find({});

        if (users) {
            res.status(200).json(users);
        } else {
            res.status(404).json({ error: "Юзеры не найдены" });
        }
        // res.status(200).json(results);
    } catch (error) {
        console.error("Ошибка при получении задачи:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

router.get("/:userId", async (req, res) => {
    // Получаем юзера по id
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log("нет такого юзера");
            res.send("нет такого юзера");
        }
        if (user) {
            res.json(user);
        }
    } catch (error) {
        console.log("Ошибка при получении юзера из MongoDB:", error.message);
        res.status(500).send("Ошибка при получении юзера");
    }
});

router.post("/", async (req, res) => {
    // создание юзера из тела запроса и добавление его в БД
    const { username, age, email } = req.body;

    try {
        const user = await User.create({
            username: username,
            age: age,
            email: email,
        });
        res.send(user);
    } catch (error) {
        console.log("Не удалось добавить юзера в MongoDB", error.message);
        res.send(
            `Не удалось добавить юзера в MongoDB, ошибка: ${error.message}`
        );
    }
});

router.put("/:userId/edit", async (req, res) => {
    // изменение данных юзера по айди
    const userId = req.params.userId;
    const { username, age, email } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                username: username,
                age: age,
                email: email,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "Юзер не найден" });
        }

        res.send(updatedUser);
    } catch (error) {
        console.log(error.message);
        res.send(`Не удалось обновить юзера, ошибка: ${error.message}`);
    }
});

router.delete("/:userId", async (req, res) => {
    // удаление юзера по айди
    const userId = req.params.userId;

    try {
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            res.send(`Юзер не найден`);
        }
        if (result) {
            res.send(`Юзер успешно удален`);
        }
    } catch (error) {
        console.log("Не удалось удалить юзера из MongoDB", error.message);
        res.send(
            `Не удалось удалить юзера в MongoDB, ошибка: ${error.message}`
        );
    }
});

module.exports = router;
