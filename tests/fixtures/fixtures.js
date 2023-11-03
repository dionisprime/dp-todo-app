const { faker } = require('@faker-js/faker');
const { DEFAULT_ROLES, STATUS, PRIORITY } = require('../../constants.js');

const testUser = {
    username: 'NewUser',
    age: 28,
    email: 'newuser@example.com',
    roles: DEFAULT_ROLES,
};

const testPlan = {
    planName: 'Backend Roadmap - 101',
};

const testTask = {
    taskName: 'Изучаем Базы Данных',
    subtasks: [
        {
            description: 'Изучаем No SQL базу данных MongoDB',
            subtaskName: 'MongoDB',
        },
        {
            description: 'ODM для MongoDB',
            subtaskName: 'Mongoose',
        },
    ],
};

const generateRandomUser = () => {
    const username = faker.internet.userName();
    const age = faker.number.int({ min: 18, max: 60 });
    const email = faker.internet.email();
    const roles = DEFAULT_ROLES;

    return { username, age, email, roles };
};
const randomUser = generateRandomUser();

const generateRandomPlan = () => {
    const planName = faker.lorem.word().toLowerCase();

    return { planName };
};
const randomPlan = generateRandomPlan();

const generateRandomTask = () => {
    const taskName = faker.lorem.word().toLowerCase();
    const status = STATUS.TODO;
    const priority = PRIORITY.MEDIUM;

    return { taskName, status, priority };
};
const randomTask = generateRandomTask();

const generateRandomSubtask = () => {
    const subtaskName = faker.lorem.word().toLowerCase();
    const description = faker.lorem.sentence();
    const status = STATUS.TODO;
    const createdAt = new Date(Date.now());
    return { subtaskName, description, status, createdAt };
};
const randomSubtask = generateRandomSubtask();

module.exports = {
    testUser,
    testPlan,
    testTask,
    generateRandomUser,
    generateRandomPlan,
    generateRandomTask,
    generateRandomSubtask,
};
