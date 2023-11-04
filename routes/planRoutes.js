const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth.js');
const { ERROR_MESSAGE } = require('../constants.js');
const { planAccessCheck } = require('../services/accessCheck.js');
const {
    validateId,
    validateName,
    validatePlanTasksId,
    validateStatusQuery,
    validatePriorityQuery,
    validateNameQuery,
    validateIdQuery,
    validateSortQuery,
} = require('../middlewares/validate.js');
const { validationResult } = require('express-validator');

const {
    getOnePlanById,
    getAllPlans,
    getTaskCount,
    createPlan,
    editPlan,
    deletePlan,
    getFilterSortedPlan,
} = require('../services/planService.js');

router.get(
    '/filter-sort',
    isAuth,
    validateIdQuery('planId'),
    validateNameQuery('planName'),
    validateStatusQuery(),
    validatePriorityQuery(),
    validateSortQuery('sortBy'),
    validateSortQuery('sortOrder'),
    async (req, res) => {
        const {
            planId,
            planName,
            tasksId,
            taskStatus,
            taskName,
            sortBy,
            sortOrder,
        } = req.query;
        const filters = {
            planId,
            planName,
            tasksId,
            taskStatus,
            taskName,
            sortBy,
            sortOrder,
        };

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const plans = await getFilterSortedPlan(filters, sortBy, sortOrder);
            res.status(200).json(plans);
        } catch (error) {
            console.error(ERROR_MESSAGE.GET_PLAN_ERROR, error.message);
            res.status(500).json({ error: ERROR_MESSAGE.GET_PLAN_ERROR });
        }
    }
);

router.get('/', isAuth, async (req, res) => {
    try {
        const plans = await getAllPlans();
        res.status(200).json(plans);
    } catch (error) {
        console.error(ERROR_MESSAGE.GET_PLAN_ERROR, error.message);
        res.status(500).json({ error: ERROR_MESSAGE.GET_PLAN_ERROR });
    }
});

router.get('/:planId', validateId('planId'), async (req, res) => {
    const planId = req.params.planId;
    const authUserId = req.headers.authorization;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

router.get('/:planId/taskCount', validateId('planId'), async (req, res) => {
    const planId = req.params.planId;
    const authUserId = req.headers.authorization;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
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

router.post('/', validateName('planName'), async (req, res) => {
    const { planName, tasksId } = req.body;
    const newPlan = { planName, tasksId };
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

router.put(
    '/:planId/',
    validateId('planId'),
    validateName('planName'),
    validatePlanTasksId('tasksId'),

    async (req, res) => {
        const planId = req.params.planId;
        const authUserId = req.headers.authorization;
        const { planName, tasksId } = req.body;
        const planChanges = { planName, tasksId };
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
    }
);

router.delete('/:planId', validateId('planId'), async (req, res) => {
    const planId = req.params.planId;
    const authUserId = req.headers.authorization;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
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
