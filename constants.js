const STATUS = {
    TODO: 'ToDo',
    IN_PROGRESS: 'In progress',
    DONE: 'Done',
};
const PRIORITY = {
    LOW: 'low',
    HIGH: 'high',
    MEDIUM: 'medium',
};

const STATUSES = Object.values(STATUS);
const PRIORITIES = Object.values(PRIORITY);

module.exports = {
    STATUS,
    PRIORITY,
    STATUSES,
    PRIORITIES,
};
