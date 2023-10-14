// DB Connect
const { MongoClient } = require("mongodb"); // конструктор клиентов mongodb
const url = process.env.DB_CONNECTION_URL; // урл для сервиса с mongodb
const client = new MongoClient(url); // создаем новый клиент для работы с базой
client.connect(); // подключаемся к базе
module.exports = client;
