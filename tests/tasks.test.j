const request = require('supertest');
const app = require('../main.js');

describe('/tasks', () => {
    it('POST', async () => {
        const newTask = {
            taskName: 'what a task?',
            priority: 'high',
        };

        const { body } = await request(app) // делаем запрос к серверу
            .post('/tasks') // по нужному роуту
            .send(newTask) // отправляем объект с новой задачей
            .expect(201); // и ожидаем в ответ статус 201 - Created
        console.log('body: ', body);
        expect(body.taskName).toEqual(newTask.taskName); // проверяем что в ответе отдается созданная задача
    });
});

// describe('/tasks', () => {
//     // тестируем роут
//     it('POST', async () => {
//         // проверяем метод POST для этого роута
//         //это условный код, в котором пока что нет реального запроса
//         const task = {
//             title: 'what a task!',
//             priority: 'high',
//         };
//         expect(task.title).toEqual('what a task!'); // ожидаем что task.title будет равен строке
//     });
// });
