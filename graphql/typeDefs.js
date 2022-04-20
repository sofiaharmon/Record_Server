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
    type Seller {
        name: String!
        phone: String!
        email: String!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    input AddRecordInput {
        title: String!
        artist: String!
        seller: String!
        quantity: Int!
        price: Float!
        img: String!
    }
    input SearchInput {
        title: String
        artist: String
        seller: String
        inStock: Boolean
        priceHigh: Float
        priceLow: Float
    }
    type Query {
        # record queries
        getRecords: [Record]
        findRecord(title: String!): Record
        # user queries
        getUsers: [User]
        # seller queries
        getSellers: [Seller]
        getOutOfStockSellers: [Seller]
    }
    type Mutation {
        # record muts
        recordSearch(searchInput: SearchInput): [Record]
        addRecord(addRecordInput: AddRecordInput!): Record!
        increaseAll(incPer: Int!): [Record]
        decreaseAll(percentToDec: Int!): [Record]
        changePrice(title: String!, newPrice: Float!): Record!
        increment(title: String!, amtToInc: Int!): Record!
        decrement(title: String!, amtToDec: Int!): Record!
        # user muts
        login(username: String!, password: String!): User!
        deleteUser(username: String!): String!
        register(registerInput: RegisterInput): User!
        # seller muts
        addSeller(name: String!, phone: String!, email: String!): Seller
        getRecordsBySeller(seller: String!): [Record]
        outOfStockBySeller(seller: String!): [Record]
    }
`