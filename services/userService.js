const User = require('../models/UserModel.js');

const getAllUsers = () => {
    return User.find({});
};

const getUserById = (userId) => {
    return User.findById(userId);
};

const addUser = ({ username, age, email, roles }) => {
    return User.create({
        username: username,
        age: age,
        email: email,
        roles: roles || 'user',
    });
};

const editUser = (userId, { username, age, email }) => {
    return User.findByIdAndUpdate(
        userId,
        {
            username: username,
            age: age,
            email: email,
        },
        { new: true }
    );
};

const deleteUser = (userId) => {
    return User.findByIdAndDelete(userId);
};

module.exports = { getAllUsers, getUserById, addUser, editUser, deleteUser };
