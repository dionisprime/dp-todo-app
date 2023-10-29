const Plan = require('../models/PlanModel.js');
const { ValidationError } = require('./CustomErrors.js');
const { ERROR_MESSAGE } = require('../constants.js');
const mongoose = require('mongoose');

const getFilterSortedPlan = (filters, sortBy, sortOrder) => {
    // const query = Plan.find({ _id: filters.planId });
    const query = Plan.find({});

    if (filters.planId) {
        query.where('_id', filters.planId);
    }

    if (filters.planName) {
        query.where('planName', filters.planName);
    }

    if (filters.tasksId) {
        query.where('tasksId', filters.tasksId);
    }

    query.populate('tasksId');

    const sortOptions = {};
    if (sortBy && sortOrder) {
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        query.sort(sortOptions);
    }

    if (filters.taskName) {
        query.populate({
            path: 'tasksId',
            match: { taskName: filters.taskName },
        });
    }

    if (filters.taskStatus) {
        query.populate({
            path: 'tasksId',
            match: { status: filters.taskStatus },
        });
    }

    return query.exec();
};

const getAllPlans = async (authUserId) => {
    return Plan.find().populate('tasksId');
};

const getOnePlanById = (planId) => {
    return Plan.findById(planId).populate('tasksId');
};

const getTaskCount = (planId) => {
    id = new mongoose.Types.ObjectId(planId);

    return Plan.aggregate([
        { $match: { _id: id } },
        { $project: { _id: 0, planName: 1, taskCount: { $size: '$tasksId' } } },
    ]);
};

const createPlan = ({ planName, tasksId }) => {
    if (planName.length < 3 || planName.length > 30) {
        throw new ValidationError(ERROR_MESSAGE.INCORRECT_LENGTH);
    }

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
    getFilterSortedPlan,
};
