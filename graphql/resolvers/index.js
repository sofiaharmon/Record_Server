const usersResolvers = require('./users');
const recordsResolvers = require('./records');

module.exports = {
    Mutation: {
        ...usersResolvers.Mutation
    }
};
