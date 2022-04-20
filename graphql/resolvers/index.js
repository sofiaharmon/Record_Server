const usersResolvers = require('./users');
const recordsResolvers = require('./records');
const sellersResolvers = require('./sellers');

module.exports = {
    Query: {
        ...usersResolvers.Query,
        ...recordsResolvers.Query,
        ...sellersResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...recordsResolvers.Mutation,
        ...sellersResolvers.Mutation
    }
};
