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
        mySpendingsProfileNames: (_, __, { dataSources }) => {
            const result = dataSources.simulationAPI.getMySpendingsProfileNames();
            return result;
        },
        myIncomeProfileNames: (_, __, { dataSources }) => {
            const result = dataSources.simulationAPI.getMyIncomeProfileNames();
            return result;
        },
        loadSpendingsProfile: (_, args, { dataSources }) => dataSources.simulationAPI.getSpendingsProfile(args),
        loadIncomeProfile: (_, args, { dataSources }) => dataSources.simulationAPI.getIncomeProfile(args),
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
        saveSpendingsProfile: async (_, args, { dataSources }) => {
            const id = await dataSources.simulationAPI.saveSpendingsProfile(args);
            return id;
        },
        removeSpendingsProfile: async (_, args, { dataSources }) => {
            const success = await dataSources.simulationAPI.removeSpendingsProfile(args);
            return success;
        },
        saveIncomeProfile: async (_, args, { dataSources }) => {
            const id = await dataSources.simulationAPI.saveIncomeProfile(args);
            return id;
        },
        removeIncomeProfile: async (_, args, { dataSources }) => {
            const success = await dataSources.simulationAPI.removeIncomeProfile(args);
            return success;
        }
    },
};