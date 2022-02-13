const { DataSource } = require('apollo-datasource');
const { ApolloError } = require('apollo-server-errors');
const { UserRoles } = require('../enums');

class SimulationAPI extends DataSource {
    constructor({ models }) {
        super();
        this.models = models;
    }

    /**
     * This is a function that gets called by ApolloServer when being setup.
     * This function gets called with the datasource config including things
     * like caches and context. We'll assign this.context to the request context
     * here, so we can know about the user making requests
     */
    initialize(config) {
        this.context = config.context;
    }

    async saveSpendingProfile({ overwrite, ...spendingProfileInfo }) {
        const userDocument = this.context.user.document;
        const { name, spendings, total } = spendingProfileInfo;

        // returns the whole document: the user and the found subdocument (first user that have a subdocument)
        // const found = await this.models.User.findOne({ 'spendingProfiles.name' : name }).exec();
        let found = -1;
        for (const index in userDocument.spendingProfiles) {
            const currName = userDocument.spendingProfiles[index].name;
            if (currName === name) {
                found = index;
                break;
            }
        }

        if (found !== -1) {
            if (!overwrite) {
                throw new ApolloError('Impossible to add a document with the same name as an existing one when both are owned by the same user', 'SPENDING_PROFILE_ALREADY_EXISTS');
            } else {
                userDocument.spendingProfiles[found].name = name;
                userDocument.spendingProfiles[found].spendings = spendings;
                userDocument.spendingProfiles[found].total = total;
                await userDocument.save();
                console.log(`Modified spending profile ${name} of user ${userDocument.email}`);
                return userDocument.spendingProfiles[found]._id;
            }
        } else {
            const spendingProfile = new this.models.SpendingProfile({
                name,
                spendings,
                total
            });
    
            userDocument.spendingProfiles.push(spendingProfile);
            await userDocument.save();
            console.log(`Saved new spending profile of user ${userDocument.email}:\n name: ${name}\n ID: ${spendingProfile._id}`);
            return spendingProfile._id;
        }
    }

    async removeSpendingProfile({ name }) {
        const userDocument = this.context.user.document;

        // returns the whole document: the user and the found subdocument (first user that have a subdocument)
        // const found = await this.models.User.findOne({ 'spendingProfiles.name' : name }).exec();
        let found = -1;
        for (const index in userDocument.spendingProfiles) {
            const currName = userDocument.spendingProfiles[index].name;
            if (currName === name) {
                found = index;
                break;
            }
        }

        if (found === -1) {
            throw new ApolloError(`Cannot remove spending profile ${name} of user ${userDocument.email} as it doesn't exist`, 'NO_CORRESPONDING_SPENDING_PROFILE');
        }
        
        userDocument.spendingProfiles[found].remove();
        await userDocument.save();
        console.log(`Removed spending profile ${name} of user ${userDocument.email}`);
        return true;
    }

    async getSpendingProfile({ name }) {
        const userDocument = this.context.user.document;
        for (const item of userDocument.spendingProfiles) {
            if (item.name === name) {
                return item;
            }
        }
    }

    async getMySpendingProfileNames() {
        const userDocument = this.context.user.document;
        return userDocument.spendingProfiles.map(item => item.name);
    }
}

module.exports = SimulationAPI;