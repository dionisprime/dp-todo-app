const mongoose = require('./dbConnect.js');

const userSchema = new mongoose.Schema({
    username: String,
    age: Number,
    email: String,
});
const User = mongoose.model('User', userSchema);

module.exports = User;
