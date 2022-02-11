module.exports = {
    // Role: { // how to resolve enum values to custom values
    //     USER: 'User', // by default, resolved to 'USER'
    //     ADMIN: 'Admin'
    //    },
    Query: {
        whoami: (_, args, { dataSources }) => dataSources.userAPI.whoAmI(args),
        users: (_, __, { user, dataSources }) => {
            const users = dataSources.userAPI.getAllUsers();
            return users;
        },
        mySpendingProfileNames: (_, __, { dataSources }) => {
            const result = dataSources.simulationAPI.getMySpendingProfileNames();
            return result;
        },
        loadSpendingProfile: (_, args, { dataSources }) => dataSources.simulationAPI.getSpendingProfile(args),
    },
    Mutation: {
        login: async (_, args, { dataSources }) => {
            const user = await dataSources.userAPI.loginUser(args);
            return user;
        },
        signup: async (_, args, { dataSources }) => {
            const user = await dataSources.userAPI.signupUser(args);
            return user;
        },
        saveSpendingProfile: async (_, args, { dataSources }) => {
            const id = await dataSources.simulationAPI.saveSpendingProfile(args);
            return id;
        },
        removeSpendingProfile: async (_, args, { dataSources }) => {
            const success = await dataSources.simulationAPI.removeSpendingProfile(args);
            return success;
        }
    },
};