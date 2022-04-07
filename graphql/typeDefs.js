const { gql } = require('apollo-server');

module.exports = gql`
    type Record {
        title: String!
        artist: String!
        year: String!
    }
    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        password: String!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        findRecord(title: String!): Boolean
    }
    type Mutation {
        addRecord(title: String!, artist: String!, year: String!): Boolean
        register(registerInput: RegisterInput): User!
    }
`