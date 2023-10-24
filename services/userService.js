const { DEFAULT_ROLES } = require('../constants.js');
const User = require('../models/UserModel.js');

const getAllUsers = () => {
    return User.find({});
};

const getUserById = (userId) => {
    return User.findById(userId);
};

const addUser = ({ username, age, email, roles = DEFAULT_ROLES }) => {
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
