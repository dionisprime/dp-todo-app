const mongoose = require('./dbConnect.js');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    age: Number,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    roles: {
        type: Array,
        required: true,
    },
});
const User = mongoose.model('User', userSchema);

module.exports = User;
