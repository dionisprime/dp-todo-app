const express = require("express");
const router = express.Router();
const { ERROR_MESSAGE } = require("../constants.js");
const { planAccessCheck } = require("../services/accessCheck.js");

const {
    getOnePlanById,
    getAllPlans,
    getTaskCount,
    createPlan,
    editPlan,
    deletePlan,
    service,
} = require("../services/planService.js");

router.get("/filter-sort", async (req, res) => {
    // const authUserId = req.headers.authorization;

    const { planName, tasksId, taskStatus, taskName, sortBy, sortOrder } =
        req.query;
    const filters = {
        planName,
        tasksId,
        taskStatus,
        taskName,
        sortBy,
        sortOrder,
    };
    // if (!authUserId) {
    //     return res.status(401).json({ error: ERROR_MESSAGE.NOT_AUTHORIZED });
    // }

    try {
        const plans = await service(filters, sortBy, sortOrder);
        res.status(200).json(plans);
    } catch (error) {
        console.error(ERROR_MESSAGE.GET_PLAN_ERROR, error.message);
        res.status(500).json({ error: ERROR_MESSAGE.GET_PLAN_ERROR });
    }
});

router.get("/", async (req, res) => {
    const authUserId = req.headers.authorization;

    if (!authUserId) {
        return res.status(401).json({ error: ERROR_MESSAGE.NOT_AUTHORIZED });
    }

    try {
        const plans = await getAllPlans();
        res.status(200).json(plans);
    } catch (error) {
        console.error(ERROR_MESSAGE.GET_PLAN_ERROR, error.message);
        res.status(500).json({ error: ERROR_MESSAGE.GET_PLAN_ERROR });
    }
});

router.get("/:planId", async (req, res) => {
    const planId = req.params.planId;
    const authUserId = req.headers.authorization;

    try {
        await planAccessCheck(planId, authUserId);
        const plan = await getOnePlanById(planId);

        res.status(200).json(plan);
    } catch (error) {
        console.error(ERROR_MESSAGE.GET_PLAN_ERROR, error.message);
        res.status(500).json(
            `${ERROR_MESSAGE.GET_PLAN_ERROR} ${error.message}`
        );
    }
});

router.get("/:planId/taskCount", async (req, res) => {
    const planId = req.params.planId;
    const authUserId = req.headers.authorization;

    try {
        await planAccessCheck(planId, authUserId);
        const taskCount = await getTaskCount(planId);

        res.status(200).json(taskCount);
    } catch (error) {
        console.error(ERROR_MESSAGE.GET_PLAN_ERROR, error.message);
        res.status(500).json(
            `${ERROR_MESSAGE.GET_PLAN_ERROR} ${error.message}`
        );
    }
});

router.post("/", async (req, res) => {
    const { planName, tasksId } = req.body;
    const newPlan = { planName, tasksId };

    try {
        const plan = await createPlan(newPlan);

        res.status(201).send(plan);
    } catch (error) {
        console.log(ERROR_MESSAGE.ADD_PLAN_ERROR, error.message);
        res.status(404).send(
            `${ERROR_MESSAGE.ADD_PLAN_ERROR}: ${error.message}`
        );
    }
});

router.put("/:planId/", async (req, res) => {
    const planId = req.params.planId;
    const authUserId = req.headers.authorization;
    const { planName, tasksId } = req.body;
    const planChanges = { planName, tasksId };

    try {
        await planAccessCheck(planId, authUserId);

        const updatedPlan = await editPlan(planId, planChanges);

        res.status(200).send(updatedPlan);
    } catch (error) {
        console.log(ERROR_MESSAGE.EDIT_PLAN_ERROR, error.message);
        res.status(404).send(
            `${ERROR_MESSAGE.EDIT_PLAN_ERROR}: ${error.message}`
        );
    }
});

router.delete("/:planId", async (req, res) => {
    const planId = req.params.planId;
    const authUserId = req.headers.authorization;

    try {
        await planAccessCheck(planId, authUserId);

        const result = await deletePlan(planId);

        res.status(200).send(`План ${result} успешно удален`);
    } catch (error) {
        console.log(ERROR_MESSAGE.DELETE_PLAN_ERROR, error.message);
        res.status(404).send(
            `${ERROR_MESSAGE.DELETE_PLAN_ERROR}: ${error.message}`
        );
    }
});

module.exports = router;
