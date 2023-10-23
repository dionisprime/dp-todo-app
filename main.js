require('dotenv').config();
const { PORT } = require('./constants.js');
const express = require('express');
const corsMiddleware = require('./middlewares/corsMiddleware');
const app = express();

const taskRoutes = require('./routes/taskRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

app.use(express.json());
app.use(corsMiddleware);
//------------------------------------------

app.get('/', (req, res) => {
    res.send('Привет! По пути /tasks будет список задач!)');
});

app.use('/tasks', taskRoutes);
app.use('/user', userRoutes);

//------------------------------------------
app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});
