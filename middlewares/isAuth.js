const { getUserById } = require('../services/userService.js');
const { ERROR_MESSAGE } = require('../constants.js');

const isAuth = async (req, res, next) => {
    const authUserId = req.headers.authorization;

    const userInDataBase = await getUserById(authUserId || null);
    try {
        if (!userInDataBase) {
            return res.status(401).send(ERROR_MESSAGE.NOT_AUTHORIZED);
        }
        next();
    } catch (error) {
        console.error(ERROR_MESSAGE.INCORRECT_VALUE, error.message);
        return res
            .status(400)
            .send(`${ERROR_MESSAGE.INCORRECT_VALUE} ${error.message}`);
    }
};

module.exports = isAuth;
