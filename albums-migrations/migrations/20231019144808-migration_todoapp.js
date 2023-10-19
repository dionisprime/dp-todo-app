module.exports = {
    async up(db, client) {
        // TODO write your migration here.
        // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
        await db
            .collection('tasks')
            .updateMany({}, { $set: { deadline: new Date('2023-12-31') } });

        await db
            .collection('users')
            .updateMany({}, { $set: { roles: 'user' } });
    },

    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
        await db
            .collection('tasks')
            .updateMany({}, { $unset: { deadline: null } });

        await db
            .collection('users')
            .updateMany({}, { $unset: { roles: null } });
    },
};

// module.exports = {
//   async up(db, client) {
//       // TODO write your migration here.
//       // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
//       // Example:
//       // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
//       // const tasks = await db
//       //     .collection('tasks')
//       //     .find({ status: 'todo' })
//       //     .toArray();
//       // console.log(tasks); // в данном случае мы ничего не мигрировали, только посмотрели
//       await db
//           .collection('tasks')
//           .updateMany({}, { $set: { deadline: null } });

//       await db
//           .collection('users')
//           .updateMany({}, { $set: { roles: 'user' } });
//   },

//   async down(db, client) {
//       // TODO write the statements to rollback your migration (if possible)
//       // Example:
//       // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
//       // const tasks = await db.collection('tasks').find().toArray();
//       // console.log(tasks);
//       await db
//           .collection('tasks')
//           .updateMany({}, { $unset: { deadline: null } });

//       await db
//           .collection('users')
//           .updateMany({}, { $unset: { roles: null } });
//   },
// };
