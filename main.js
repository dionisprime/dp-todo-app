require("dotenv").config();
const express = require("express");
const corsMiddleware = require("./middlewares/corsMiddleware");
const app = express();

const taskRoutes = require("./routes/taskRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

app.use(express.json()); // бодипарсер
app.use(corsMiddleware); // для обработки CORS
//------------------------------------------

app.get("/", (req, res) => {
    res.send("Привет! По пути /tasks будет список задач!)");
});

app.use("/tasks", taskRoutes);
app.use("/user", userRoutes);

//------------------------------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
