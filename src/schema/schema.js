const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        email: String!
        roles: [Role!]!
        token: String
    }

    enum Role {
        USER
        ADMIN
    }

    type Query {
        whoami(email: String!): User
        users: [User!]
    }

    type Mutation {
        login(email: String!, password: String!): User
        signup(email: String!, password: String!): User
    }
`;

module.exports = typeDefs;