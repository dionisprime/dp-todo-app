const request = require('supertest');
const app = require('../main.js');
const { addUser, deleteUser } = require('../services/userService.js');
const { DEFAULT_ROLES, ERROR_MESSAGE } = require('../constants.js');
const {
    testUser,
    testPlan,
    testTask,
    generateRandomUser,
    generateRandomPlan,
    generateRandomTask,
    generateRandomSubtask,
} = require('./fixtures/fixtures.js');

describe('/user', () => {
    it('Проверка "замокания" console.log()', async () => {
        const consoleLog = jest
            .spyOn(console, 'log')
            .mockImplementation(() => 'Замоканый console.log() вернул это!');

        console.log('Это сообщение будет замокано и не выведется');
        const mockedResult = console.log();
        consoleLog.mockRestore();
        console.log(
            'Теперь console.log размокан, и мы увидим это сообщение в консоли'
        );
        console.log('mockedResult: ', mockedResult);
    });
    // Тест для GET-запроса на получение всех пользователей
    it('GET / должен вернуть всех пользователей - статус 200', async () => {
        const response = await request(app).get('/user');
        expect(response.status).toEqual(200);
    });

    it('POST / тест добавления юзера и статус 201', async () => {
        const newUser = testUser; //использую фикстуру тестового юзера

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
        const newUser = generateRandomUser(); //использую фикстуру-генератор рандомного юзера
        const createdUser = await addUser(newUser);

        const updatedData = generateRandomUser();

        const response = await request(app)
            .put(`/user/${createdUser._id}/edit`)
            .send(updatedData);

        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject(updatedData);
        await deleteUser(createdUser._id); //удаляю тестового юзера из БД
    });

    it('DELETE /:userId должен удалять пользователя по его id', async () => {
        const newUser = generateRandomUser();

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
