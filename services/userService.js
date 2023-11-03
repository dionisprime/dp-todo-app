const User = require('../models/UserModel.js');
const { ValidationError } = require('./CustomErrors.js');
const { ERROR_MESSAGE } = require('../constants.js');
const { DEFAULT_ROLES } = require('../constants.js');

const getAllUsers = () => {
    return User.find({});
};

const getUserById = (userId) => {
    return User.findById(userId);
};

const addUser = ({ username, age, email, roles = DEFAULT_ROLES }) => {
    if (username.length < 3 || username.length > 30) {
        throw new ValidationError(ERROR_MESSAGE.INCORRECT_LENGTH);
    }
    return User.create({
        username,
        age,
        email,
        roles,
    });
};

const editUser = (userId, { username, age, email }) => {
    return User.findByIdAndUpdate(
        userId,
        {
            username,
            age,
            email,
        },
        { new: true }
    );
};

const deleteUser = (userId) => {
    return User.findByIdAndDelete(userId);
};

module.exports = { getAllUsers, getUserById, addUser, editUser, deleteUser };
