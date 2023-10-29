const mongoose = require("../services/dbConnect.js");

const planSchema = new mongoose.Schema({
    planName: { type: String, required: true },
    tasksId: [{ type: "ObjectId", ref: "Task" }],
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
