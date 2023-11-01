const { ERROR_MESSAGE } = require('../constants.js');

const fieldsValidator = (fields) => {
    return (req, res, next) => {
        for (const field of fields) {
            const fieldInBody = field in req.body;
            if (!fieldInBody) {
                return res.status(400).json({
                    error: `${ERROR_MESSAGE.ADD_TASK_ERROR}: '${field}' ${ERROR_MESSAGE.REQUIRED_FIELD}`,
                });
            }
        }
        next();
    };
};

module.exports = fieldsValidator;
