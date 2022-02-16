const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        email: String!
        roles: [Role!]!
        token: String
    }

    type SpendingsProfile {
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
        mySpendingsProfileNames: [String!]
        loadSpendingsProfile(name: String!): SpendingsProfile
    }

    type Mutation {
        login(email: String!, password: String!): User
        signup(email: String!, password: String!): User
        saveSpendingsProfile(name: String!, spendings: [SpendingInput!]!, total: Float!, overwrite: Boolean): ID
        removeSpendingsProfile(name: String!): Boolean
    }
`;

module.exports = typeDefs;