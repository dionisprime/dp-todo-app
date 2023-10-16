// DB Connect
const mongoose = require('mongoose');
const url = process.env.DB_CONNECTION_URL; // урл для сервиса с mongodb
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose;
