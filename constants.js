const PORT = process.env.PORT || 3001;
const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;
const ONE_MONTH = 2629746000;
const DEFAULT_DEADLINE = new Date(Date.now() + ONE_MONTH);
const DEFAULT_ROLE = ['user'];

const STATUS = {
    TODO: 'ToDo',
    IN_PROGRESS: 'In progress',
    DONE: 'Done',
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
    GET_TASK_ERROR: 'Ошибка при получении задачи',
    ADD_TASK_ERROR: 'Не удалось добавить задачу',
    EDIT_TASK_ERROR: 'Не удалось обновить задачу',
    DELETE__TASK_ERROR: 'Не удалось удалить задачу',

    USER_NOT_FOUND: 'Пользователь не найден',
    GET_USER_ERROR: 'Ошибка при получении пользователя',
    ADD_USER_ERROR: 'Не удалось добавить пользователя',
    EDIT_USER_ERROR: 'Не удалось обновить пользователя',
    DELETE_USER_ERROR: 'Не удалось удалить пользователя',

    ACCESS_GRANTED: 'Доступ разрешен',
    ACCESS_DENIED: 'Другой пользователь. Доступ запрещен',
    ID_NOT_MATCH: 'ID не совпадает',
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
    DEFAULT_ROLE,
};
