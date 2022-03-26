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

    type IncomeProfile {
        name: String!
        income: [Income!]!
        incomeFrequency: Int!
        increaseFrequency: Int!
    }

    type MarketProfile {
        name: String!
        variations: [MarketYear!]!
    }

    type Spending {
        label: String!
        amount: Float!
        frequency: Int!
    }

    type Income {
        income: Float!
        increase: Float!
        period: Int!
    }

    type MarketYear {
        year: Float!
        igr: Float!
        ir: Int!
    }

    input SpendingInput {
        label: String!
        amount: Float!
        frequency: Int!
    }

    input IncomeInput {
        income: Float!
        increase: Float!
        period: Int!
    }

    input MarketYearInput {
        year: Float!
        igr: Float!
        ir: Int!
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
        myIncomeProfileNames: [String!]
        loadIncomeProfile(name: String!): IncomeProfile
        myMarketProfileNames: [String!]
        loadMarketProfile(name: String!): MarketProfile
    }

    type Mutation {
        login(email: String!, password: String!): User
        signup(email: String!, password: String!): User
        saveSpendingsProfile(name: String!, spendings: [SpendingInput!]!, total: Float!, overwrite: Boolean): ID
        removeSpendingsProfile(name: String!): Boolean
        saveIncomeProfile(name: String!, income: [IncomeInput!]!, incomeFrequency: Int!, increaseFrequency: Int!, overwrite: Boolean): ID
        removeIncomeProfile(name: String!): Boolean
        saveMarketProfile(name: String!, variations: [MarketYearInput!]!, overwrite: Boolean): ID
        removeMarketProfile(name: String!): Boolean
    }
`;

module.exports = typeDefs;