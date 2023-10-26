const Plan = require("../models/PlanModel.js");
const { ERROR_MESSAGE } = require("../constants.js");
const mongoose = require("mongoose");

const getAllPlans = async (authUserId) => {
    return Plan.find().populate("tasksId");
};

const getOnePlanById = (planId) => {
    return Plan.findById(planId).populate("tasksId");
};

const getTaskCount = (planId) => {
    id = new mongoose.Types.ObjectId(planId);

    return Plan.aggregate([
        { $match: { _id: id } },
        { $project: { _id: 0, planName: 1, taskCount: { $size: "$tasksId" } } },
    ]);
};

const createPlan = ({ planName, tasksId }) => {
    return Plan.create({
        planName,
        tasksId,
    });
};

const editPlan = (planId, { planName, tasksId }) => {
    return Plan.findByIdAndUpdate(planId, { planName, tasksId }, { new: true });
};

const deletePlan = (planId) => {
    return Plan.findByIdAndDelete(planId);
};

module.exports = {
    createPlan,
    getAllPlans,
    getOnePlanById,
    deletePlan,
    editPlan,
    getTaskCount,
};
