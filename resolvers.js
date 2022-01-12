module.exports = {
    // Role: { // how to resolve enum values to custom values
    //     USER: 'User', // by default, resolved to 'USER'
    //     ADMIN: 'Admin'
    //    },
    Query: {
        whoami: (_, { email }, { dataSources }) => dataSources.userAPI.whoAmI({ email }),
        users: (_, __, { user, dataSources }) => {
            const users = dataSources.userAPI.getAllUsers();
            return users;
        }
    },
    Mutation: {
        login: async (_, { email, password }, { dataSources }) => {
            const user = await dataSources.userAPI.loginUser({ email, password });
            return user;
        },
        signup: async (_, { email, password }, { dataSources }) => {
            const user = await dataSources.userAPI.signupUser({ email, password });
            return user;
        }
    },
};