const { DEFAULT_DEADLINE, DEFAULT_ROLE } = require('../constants.js');

module.exports = {
    async up(db, client) {
        await db
            .collection('tasks')
            .updateMany({}, { $set: { deadline: DEFAULT_DEADLINE } });

        await db
            .collection('users')
            .updateMany({}, { $set: { roles: DEFAULT_ROLE } });
    },

    async down(db, client) {
        await db
            .collection('tasks')
            .updateMany({}, { $unset: { deadline: null } });

        await db
            .collection('users')
            .updateMany({}, { $unset: { roles: null } });
    },
};
