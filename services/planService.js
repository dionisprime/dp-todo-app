const Plan = require("../models/PlanModel.js");
const { ERROR_MESSAGE } = require("../constants.js");
const mongoose = require("mongoose");

const service = (filters, sortBy, sortOrder) => {
    const query = Plan.find();

    if (filters.planName) {
        query.where("planName", filters.planName);
    }

    if (filters.tasksId) {
        query.where("tasksId", filters.tasksId);
    }

    // query.populate("tasksId");

    const sortOptions = {};
    if (sortBy && sortOrder) {
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
        query.sort(sortOptions);
    }

    // if (filters.taskName) {
    //     query.populate({
    //         path: "tasksId",
    //         match: { taskName: filters.taskName },
    //     });
    //     query.where({ tasksId: { $ne: [] } });
    // }

    // if (filters.taskStatus) {
    //     query.populate({
    //         path: "tasksId",
    //         match: { status: filters.taskStatus },
    //         // options: {
    //         //     match: { status: { $exists: true } },
    //         //     select: "status",
    //         // },
    //     });
    // }

    return query.exec();
};

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
    service,
};
