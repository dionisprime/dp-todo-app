const PORT = process.env.PORT || 3001;
const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;
const ONE_MONTH = 2629746000;
const DEFAULT_DEADLINE = new Date(Date.now() + ONE_MONTH);
const DEFAULT_ROLES = ['user'];

const STATUS = {
    TODO: 'todo',
    IN_PROGRESS: 'in progress',
    DONE: 'done',
};
const PRIORITY = {
    LOW: 'low',
    HIGH: 'high',
    MEDIUM: 'medium',
};

const STATUSES = Object.values(STATUS);
const PRIORITIES = Object.values(PRIORITY);

const ERROR_MESSAGE = {
    NOT_AUTHORIZED: 'Пользователь не авторизован, доступ запрещен',
    TASK_NOT_FOUND: 'Задача не найдена',
    NO_TASKS_TODAY: 'Нет задач на сегодня',
    GET_TASK_ERROR: 'Ошибка при получении задачи',
    GET_TASKS_ERROR: 'Ошибка при получении задач',
    ADD_TASK_ERROR: 'Не удалось добавить задачу',
    EDIT_TASK_ERROR: 'Не удалось обновить задачу',
    DELETE__TASK_ERROR: 'Не удалось удалить задачу',
    INCORRECT_LENGTH: 'Некорректная длина, меньше 3х или более 30 символов...',
    INCORRECT_VALUE: 'Некорректное значение',

    SUBTASK_NOT_FOUND: 'Подзадача не найдена',
    MUST_BE_AN_ARRAY: 'должен быть массивом',

    USER_NOT_FOUND: 'Пользователь не найден',
    USERS_NOT_FOUND: 'Пользователи не найдены',
    GET_USER_ERROR: 'Ошибка при получении пользователя',
    GET_USERS_ERROR: 'Ошибка при получении пользователей',
    ADD_USER_ERROR: 'Не удалось добавить пользователя',
    EDIT_USER_ERROR: 'Не удалось обновить пользователя',
    DELETE_USER_ERROR: 'Не удалось удалить пользователя',

    PLAN_NOT_FOUND: 'План не найден',
    GET_PLAN_ERROR: 'Ошибка при получении плана',
    ADD_PLAN_ERROR: 'Не удалось добавить план',
    EDIT_PLAN_ERROR: 'Не удалось обновить план',
    DELETE_PLAN_ERROR: 'Не удалось удалить план',

    ACCESS_GRANTED: 'Доступ разрешен',
    ACCESS_DENIED: 'Другой пользователь. Доступ запрещен',
    ID_NOT_MATCH: 'ID не совпадает',

    REQUIRED_FIELD: 'Обязательное поле!',
};

module.exports = {
    PORT,
    STATUS,
    PRIORITY,
    STATUSES,
    PRIORITIES,
    PORT,
    DB_CONNECTION_URL,
    DEFAULT_DEADLINE,
    ERROR_MESSAGE,
    DEFAULT_ROLES,
};
