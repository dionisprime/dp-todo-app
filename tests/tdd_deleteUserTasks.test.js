const request = require('supertest');
const app = require('../main.js');
const { addUser, deleteUser } = require('../services/userService.js');
const { createTask } = require('../services/taskService.js');
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

describe('DELETE /tasks/:userId', () => {
    it('роут должен удалять все задачи юзера по его id', async () => {
        const createdUser = await addUser(generateRandomUser());
        const randomTask1 = generateRandomTask();
        const randomTask2 = generateRandomTask();
        randomTask1.userId = createdUser._id;
        randomTask2.userId = createdUser._id;

        await createTask(randomTask1);
        await createTask(randomTask2);

        const response = await request(app).delete(
            `/tasks/user/${createdUser._id}`
        ); // удаляем все задачи юзера по его id
        expect(response.status).toEqual(200);

        await deleteUser(createdUser._id); //удаляю тестового юзера из БД
    });
});
