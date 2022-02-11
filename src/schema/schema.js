const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        email: String!
        roles: [Role!]!
        token: String
    }

    type SpendingProfile {
        name: String!
        spendings: [Spending!]!
        total: Float!
    }

    type Spending {
        label: String!
        amount: Float!
        frequency: Int!
    }

    input SpendingInput {
        label: String!
        amount: Float!
        frequency: Int!
    }

    enum Role {
        USER
        ADMIN
    }

    type Query {
        whoami(email: String!): User
        users: [User!]
        mySpendingProfileNames: [String!]
        loadSpendingProfile(name: String!): SpendingProfile
    }

    type Mutation {
        login(email: String!, password: String!): User
        signup(email: String!, password: String!): User
        saveSpendingProfile(name: String!, spendings: [SpendingInput!]!, total: Float!, overwrite: Boolean): ID
        removeSpendingProfile(name: String!): Boolean
    }
`;

module.exports = typeDefs;