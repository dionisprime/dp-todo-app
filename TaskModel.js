const mongoose = require('./dbConnect.js');

//Определение модели
const taskSchema = new mongoose.Schema({
    // определяем схему
    name: String,
    status: String,
    priority: String,
});
const Task = mongoose.model('Task', taskSchema); // создаем модель по схеме

module.exports = Task;
