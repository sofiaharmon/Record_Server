const { gql } = require('apollo-server');

module.exports = gql`
    type Record {
        title: String!,
        artist: String!,
        year: String!
    }
    type Query {
        findRecord(title: String!): Boolean
    }
    type Mutation {
        addRecord(title: String!, artist: String!, year: String!): Boolean
    }
`