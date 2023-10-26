# dp-todo-app

Создал модель для роадмапов PlanModel, организовал связь между "планами" и задачами которые в него входят. Написал CRUD для "планов". Сделал короткую агрегацию taskCount, которая считает количество задач определённого "плана". Добавил некоторое количество данных в tasks, и создал пару планов в plans с выбранными для каждого плана задачами, проверил работу.

_PLANS_
В теле POST запроса в поле tasksId передаём айдишник таски из коллекции tasks, который будет лежать в массиве tasksId конкретного "плана". Так "план" будет "знать" какие задачи относятся к нему.
Пример тела: {
"planName": "backend-1",
"tasksId": ["65377ac01a3712c857fd0725", "6535690a1d76940e243f2941"]
}

**GET**
GET All Plans http://localhost:3000/plans получить все планы
GET Plan By ID http://localhost:3000/plans/:planId получить план по id плана
GET TaskCount http://localhost:3000/plans/:planId/taskCount получить количество задач в плане по id плана

**POST**
ADD a PLAN http://localhost:3000/plans добавить план

**PUT**
PUT EDIT Plan By ID http://localhost:3000/plans/:planId изменить план

**DELETE**
DELETE Plan By ID http://localhost:3000/plans/:planId удалить план

---

Убрал "двойной" запрос в базу данных для вывода GET запросом задач пользователя с данными пользователя прямо в задаче, используя populate('userId') выводится пользователь в поле userId.
Добавил к функциям getOneTaskById и getAllTasks метод .populate('userId'); сократив код как в запросе так и в сервисах, теперь не надо делать двойной запрос еще и к юзеру в БД для вывода информации о нем в задаче

Добавил в схему Task подзадачи. Создал роуты для работы с подзадачами.

_Для подзадач:_

**GET** http://localhost:3000/tasks/taskId/subtasks/subtaskId получить подзадачу по id в конкретной задачи

**POST** http://localhost:3000/tasks/taskId/subtasks добавить подзадачу в конкретную задачу по ее id, тело запроса например такое:
{
"description": "Создать тестовую подзадачу",
"subtaskName": "Новая подзадача"
}

**PUT** http://localhost:3000/tasks/taskId/subtasks/subtaskId - изменяем конкретную подзадачу по id из определенной задачи. В теле передаём свойства для замены, например:
{
"subtaskName": "новое имя",
"description": "подзадача для замены"
}
**DELETE** http://localhost:3000/tasks/taskId/subtasks/subtaskId - удаляет конкретную подзадачу по id из определенной задачи

"Сделал рефактор кода после стрима, учёл некоторые недостатки, добавил константы, изменил логику проверки авторизации тем самым существенно сократив код роутов. Роли теперь массив, дэдлайн по умолчанию +1 месяц"

Добавил "сервисы" в проект, спрятал в них все, что связано с mongoose. Изменил в роутах запросы к БД на свои функции-сервисы, всё что связано с мангустом вывел в них создав свой уровень абстракции для тасок и юзеров. Созданы папка services и файлы taskService.js и userService.js. Так же обновил в некоторых местах код для работы с новыми свойствами "deadline" и "roles"

Добавил пакет migrate-mongo, попробовал миграцию up и down, добавил deadline таскам и roles пользователям через миграцию, установил типы данных, добавил в соответствующие схемы нужные свойства.

_Запросы CRUD для роутов пользователей_ и тасок сейчас работают с учетом переданного в заголовке Authorization айдишника юзера, то есть проверка на права доступа чтобы отдавать, обновлять и удалять задачи /tasks/ конкретного пользователя только ему самому, если айдишник не совпадает то операция не проходит. Так же и с /user/

-   По роуту http://localhost:3000/tasks

    -   GET выдаёт список текущих задач из базы, userId меняется на user в котором находится объект юзера из коллекции user создавший задачу

-   По пути http://localhost:3000/tasks/userId

    -   POST добавляет новую задачу в коллекцию в MongoDB, записывая в userId айдишник пользователя который создает задачу. Задача берется из json из body, а userId из параметров
        POST запроса, например:
        {
        "name": "изучить express",
        "status": "In progress",
        "priority": "high"
        }

    -   GET для получения задачи по id по пути http://localhost:3000/tasks/id - где id это айдишник конкретной задачи из базы данных. В ответе серверу userId меняется на user в котором находится объект юзера из коллекции user создавший задачу

-   DELETE удаляет задачу:

    -   Запрос по адресу http://localhost:3000/tasks/id - где id это id задачи из БД которую надо удалить из БД

-   PUT меняет задачу, в теле запроса передаются изменения в объекте:
    -   Запрос по адресу http://localhost:3000/tasks/id/edit

_Для Юзеров:_
GET http://localhost:3000/user получить всех юзеров
POST http://localhost:3000/user добавить юзера
GET http://localhost:3000/user/userId получить юзера по id
PUT http://localhost:3000/user/userId/edit изменить данные юзера, в теле запроса передаются изменения в объекте
DELETE http://localhost:3000/user/userId

main.js - главный файл

Используя Postman для запросов в качестве клиента - попрактиковался по GET, POST, PUT, DELETE запросам с использованием mongoose, как они работают с базой данных MongoDB.
