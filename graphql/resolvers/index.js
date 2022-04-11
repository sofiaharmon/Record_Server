const usersResolvers = require('./users');
const recordsResolvers = require('./records');

module.exports = {
    Query: {
        ...usersResolvers.Query,
        ...recordsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation
    }
};
