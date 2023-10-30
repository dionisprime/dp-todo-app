const request = require('supertest');
const app = require('../main.js');
const { addUser, deleteUser } = require('../services/userService');

const { DEFAULT_ROLES, ERROR_MESSAGE } = require('../constants');

describe('/user', () => {
    // Тест для GET-запроса на получение всех пользователей
    it('GET / должен вернуть всех пользователей - статус 200', async () => {
        const response = await request(app).get('/user');
        expect(response.status).toEqual(200);
    });

    it('POST / тест добавления юзера и статус 201', async () => {
        const newUser = {
            username: 'NewUser',
            age: 28,
            email: 'newuser@example.com',
            roles: DEFAULT_ROLES,
        };

        const { body } = await request(app) //деструктуризация объекта ответа
            .post('/user')
            .send(newUser)
            .expect(201); //тест на статус
        expect(body.username).toEqual(newUser.username); // тест на добавление юзера

        await deleteUser(body._id); //удаляю тестового юзера из БД
    });

    it('POST / тест некорректных полей юзера и статус 500', async () => {
        const newUser = {
            userнейм: 'NewUser',
            ages: 28,
            email: 'newuser@example.com',
            roles: DEFAULT_ROLES,
        };

        const { body } = await request(app)
            .post('/user')
            .send(newUser)
            .expect(500);
    });

    it('PUT /:userId/edit должен изменять данные пользователя', async () => {
        const newUser = {
            username: 'UserToEdit',
            age: 35,
            email: 'usertoedit@example.com',
            roles: DEFAULT_ROLES,
        };
        const createdUser = await addUser(newUser);

        const updatedData = {
            username: 'UpdatedUser',
            age: 40,
            email: 'updateduser@example.com',
        };

        const response = await request(app)
            .put(`/user/${createdUser._id}/edit`)
            .send(updatedData);

        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject(updatedData);
        await deleteUser(createdUser._id); //удаляю тестового юзера из БД
    });

    it('DELETE /:userId должен удалять пользователя по его id', async () => {
        const newUser = {
            username: 'UserToDelete',
            age: 45,
            email: 'usertodelete@example.com',
            roles: DEFAULT_ROLES,
        };

        const createdUser = await addUser(newUser);
        const response = await request(app).delete(`/user/${createdUser._id}`);
        expect(response.status).toEqual(200);
    });
});

describe('/plans', () => {
    it('GET / должен отдать все планы', async () => {
        const response = await request(app).get('/plans');
        expect(response.status).toBe(200);
    });

    it('GET /plans/filter-sort без авторизации выдаст статус 401', async () => {
        const response = await request(app).get(
            '/plans/filter-sort?sortBy=planName'
        );
        expect(response.status).toBe(401);
    });
});
