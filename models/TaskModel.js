const mongoose = require('../services/dbConnect.js');
const { STATUS } = require('../constants.js');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    status: String,
    priority: String,
    deadline: Date,
    userId: { type: 'ObjectId', ref: 'User' },
    subtasks: [
        {
            subtaskName: {
                type: String,
                required: true,
            },
            description: String,
            status: { type: String, default: STATUS.TODO },
            createdAt: { type: Date, default: Date.now },
        },
    ],
});
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
