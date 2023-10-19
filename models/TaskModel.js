const mongoose = require('./dbConnect.js');

const taskSchema = new mongoose.Schema({
    name: String,
    status: String,
    priority: String,
    deadline: Date,
    userId: { type: 'ObjectId', ref: 'User' },
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
