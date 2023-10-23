const mongoose = require('./dbConnect.js');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    status: String,
    priority: String,
    deadline: Date,
    userId: { type: 'ObjectId', ref: 'User' },
});
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
