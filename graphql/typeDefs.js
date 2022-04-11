const { gql } = require('apollo-server');

module.exports = gql`
    type Record {
        title: String
        artist: String
        seller: String
        quantity: Int
        price: Float
        img: String
    }
    type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
    type Query {
        getRecords: [Record]
        findRecord(title: String!): Record
        getUsers: [User]
    }
    type Mutation {
        # addRecord(title: String!, artist: String!, year: String!): Boolean
        deleteUser(userID: String!): String!
        register(registerInput: RegisterInput): User!
    }
`