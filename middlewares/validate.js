const { ERROR_MESSAGE } = require('../constants.js');
const { body, query, param, matchedData } = require('express-validator');

const validateId = (id) =>
    param(id)
        .isMongoId()
        .withMessage(`${id} ${ERROR_MESSAGE.INCORRECT_VALUE}`)
        .escape();

const validateName = (name) =>
    body(name)
        .trim()
        .isString()
        .notEmpty()
        .withMessage(`${name} ${ERROR_MESSAGE.REQUIRED_FIELD}`)
        .isLength({ min: 3, max: 30 })
        .withMessage(ERROR_MESSAGE.INCORRECT_LENGTH)
        .escape();

//--------------USER---------------------------------
const validateEmail = () =>
    body('email')
        .trim()
        .notEmpty()
        .isEmail()
        .toLowerCase()
        .withMessage(ERROR_MESSAGE.INCORRECT_VALUE);

const validateAge = () => body('age').trim().optional().isInt().escape();

//-----------------PLAN------------------------------

const validatePlanTasksId = (tasksId) =>
    body(tasksId)
        .optional()
        .isArray()
        .withMessage(`${tasksId} ${ERROR_MESSAGE.MUST_BE_AN_ARRAY}`);

//--------------------TASKS---------------------------
const validateStatus = () =>
    body('status')
        .trim()
        .isString()
        .isLength({ min: 3, max: 30 })
        .optional()
        .withMessage(ERROR_MESSAGE.INCORRECT_LENGTH)
        .escape();

const validatePriority = () =>
    body('priority')
        .trim()
        .isString()
        .optional()
        .isLength({ min: 3, max: 30 })
        .withMessage(ERROR_MESSAGE.INCORRECT_LENGTH)
        .escape();

const validateDeadline = () => body('deadline').trim().optional().isDate();
const validateSubtasks = () => body('subtasks').trim().optional();
//--------------------SUBTASKS---------------------------

const validateDescription = () =>
    body('description').trim().isString().optional().escape();

//--------------------query---------------------------

const validateDeadlineQuery = () =>
    query('deadline').trim().optional().isDate();
const validateStatusQuery = () =>
    query('status')
        .trim()
        .isString()
        .isLength({ min: 1, max: 10 })
        .optional()
        .escape();

const validatePriorityQuery = () =>
    query('priority')
        .trim()
        .isString()
        .isLength({ min: 1, max: 10 })
        .optional()
        .escape();
const validateNameQuery = (name) =>
    query(name)
        .trim()
        .isString()
        .isLength({ min: 3, max: 30 })
        .withMessage(ERROR_MESSAGE.INCORRECT_LENGTH)
        .optional()
        .escape();

const validateIdQuery = (id) =>
    query(id)
        .isMongoId()
        .withMessage(`${id} ${ERROR_MESSAGE.INCORRECT_VALUE}`)
        .optional()
        .escape();

const validateSortQuery = (sort) =>
    query(sort)
        .trim()
        .isString()
        .isLength({ min: 1, max: 10 })
        .optional()
        .escape();

module.exports = {
    validateEmail,
    validateAge,
    validateId,
    validateName,
    validatePlanTasksId,
    validateStatus,
    validatePriority,
    validateDeadline,
    validateSubtasks,
    validateDescription,
    validateDeadlineQuery,
    validateStatusQuery,
    validatePriorityQuery,
    validateNameQuery,
    validateIdQuery,
    validateSortQuery,
};
