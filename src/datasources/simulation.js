const { DataSource } = require('apollo-datasource');
const { ApolloError } = require('apollo-server-errors');
const { UserRoles } = require('../enums');
const { spawn } = require('child_process');


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

    async saveSpendingsProfile({ overwrite, ...spendingsProfileInfo }) {
        const userDocument = this.context.user.document;
        const { name, spendings, total } = spendingsProfileInfo;

        // returns the whole document: the user and the found subdocument (first user that have a subdocument)
        // const found = await this.models.User.findOne({ 'spendingsProfiles.name' : name }).exec();
        let found = -1;
        for (const index in userDocument.spendingsProfiles) {
            const currName = userDocument.spendingsProfiles[index].name;
            if (currName === name) {
                found = index;
                break;
            }
        }

        if (found !== -1) {
            if (!overwrite) {
                throw new ApolloError('Impossible to add a document with the same name as an existing one when both are owned by the same user', 'SPENDINGS_PROFILE_ALREADY_EXISTS');
            } else {
                userDocument.spendingsProfiles[found].name = name;
                userDocument.spendingsProfiles[found].spendings = spendings;
                userDocument.spendingsProfiles[found].total = total;
                await userDocument.save();
                console.log(`Modified spendings profile ${name} of user ${userDocument.email}`);
                return userDocument.spendingsProfiles[found]._id;
            }
        } else {
            const spendingsProfile = {
                name,
                spendings,
                total
            };
    
            userDocument.spendingsProfiles.push(spendingsProfile);
            await userDocument.save();
            const spendingsProfileID = userDocument.spendingsProfiles.at(-1)._id;
            console.log(`Saved new spendings profile of user ${userDocument.email}:\n name: ${name}\n ID: ${spendingsProfileID}`);
            return spendingsProfileID;
        }
    }

    async removeSpendingsProfile({ name }) {
        const userDocument = this.context.user.document;

        // returns the whole document: the user and the found subdocument (first user that have a subdocument)
        // const found = await this.models.User.findOne({ 'spendingsProfiles.name' : name }).exec();
        let found = -1;
        for (const index in userDocument.spendingsProfiles) {
            const currName = userDocument.spendingsProfiles[index].name;
            if (currName === name) {
                found = index;
                break;
            }
        }

        if (found === -1) {
            throw new ApolloError(`Cannot remove spendings profile ${name} of user ${userDocument.email} as it doesn't exist`, 'NO_CORRESPONDING_SPENDINGS_PROFILE');
        }
        
        userDocument.spendingsProfiles[found].remove();
        await userDocument.save();
        console.log(`Removed spendings profile ${name} of user ${userDocument.email}`);
        return true;
    }

    async getSpendingsProfile({ name }) {
        const userDocument = this.context.user.document;
        for (const item of userDocument.spendingsProfiles) {
            if (item.name === name) {
                return item;
            }
        }
    }

    async getSpendingsProfiles({ names }) {
        const data = await names.map((name) => {
            return this.getSpendingsProfile({ name });
        });

        return data;
    }

    async getMySpendingsProfileNames() {
        const userDocument = this.context.user.document;
        return userDocument.spendingsProfiles.map(item => item.name);
    }

    async saveIncomeProfile({ overwrite, ...incomeProfileInfo }) {
        const userDocument = this.context.user.document;
        const { name, income, incomeFrequency, increaseFrequency } = incomeProfileInfo;

        // returns the whole document: the user and the found subdocument (first user that have a subdocument)
        // const found = await this.models.User.findOne({ 'incomeProfiles.name' : name }).exec();
        let found = -1;
        for (const index in userDocument.incomeProfiles) {
            const currName = userDocument.incomeProfiles[index].name;
            if (currName === name) {
                found = index;
                break;
            }
        }

        if (found !== -1) {
            if (!overwrite) {
                throw new ApolloError('Impossible to add a document with the same name as an existing one when both are owned by the same user', 'INCOME_PROFILE_ALREADY_EXISTS');
            } else {
                userDocument.incomeProfiles[found].name = name;
                userDocument.incomeProfiles[found].income = income;
                userDocument.incomeProfiles[found].incomeFrequency = incomeFrequency;
                userDocument.incomeProfiles[found].increaseFrequency = increaseFrequency;
                await userDocument.save();
                console.log(`Modified income profile ${name} of user ${userDocument.email}`);
                return userDocument.incomeProfiles[found]._id;
            }
        } else {
            const incomeProfile = {
                name,
                income,
                incomeFrequency,
                increaseFrequency
            };
    
            userDocument.incomeProfiles.push(incomeProfile);
            await userDocument.save();
            const incomeProfileID = userDocument.incomeProfiles.at(-1)._id;
            console.log(`Saved new income profile of user ${userDocument.email}:\n name: ${name}\n ID: ${incomeProfileID}`);
            return incomeProfileID;
        }
    }

    async saveMarketProfile({ overwrite, ...marketProfileInfo }) {
        const userDocument = this.context.user.document;
        const { name, variations } = marketProfileInfo;

        // returns the whole document: the user and the found subdocument (first user that have a subdocument)
        // const found = await this.models.User.findOne({ 'incomeProfiles.name' : name }).exec();
        let found = -1;
        for (const index in userDocument.marketProfiles) {
            const currName = userDocument.marketProfiles[index].name;
            if (currName === name) {
                found = index;
                break;
            }
        }

        if (found !== -1) {
            if (!overwrite) {
                throw new ApolloError('Impossible to add a document with the same name as an existing one when both are owned by the same user', 'INCOME_PROFILE_ALREADY_EXISTS');
            } else {
                userDocument.marketProfiles[found].name = name;
                userDocument.marketProfiles[found].variations = variations;
                await userDocument.save();
                console.log(`Modified market profile ${name} of user ${userDocument.email}`);
                return userDocument.marketProfiles[found]._id;
            }
        } else {
            const marketProfile = {
                name,
                variations
            };
    
            userDocument.marketProfiles.push(marketProfile);
            await userDocument.save();
            const marketProfileID = userDocument.marketProfiles.at(-1)._id;
            console.log(`Saved new market profile of user ${userDocument.email}:\n name: ${name}\n ID: ${marketProfileID}`);
            return marketProfileID;
        }
    }

    async removeProfile(profileType, name) {
        const userDocument = this.context.user.document;
        const profiles = userDocument[`${profileType}Profiles`];

        // returns the whole document: the user and the found subdocument (first user that have a subdocument)
        // const found = await this.models.User.findOne({ 'spendingsProfiles.name' : name }).exec();
        let found = -1;
        for (const index in profiles) {
            const currName = profiles[index].name;
            if (currName === name) {
                found = index;
                break;
            }
        }

        if (found === -1) {
            throw new ApolloError(`Cannot remove ${profileType} profile ${name} of user ${userDocument.email} as it doesn't exist`, `NO_CORRESPONDING_${profileType.toUpperCase()}_PROFILE`);
        }
        
        profiles[found].remove();
        await userDocument.save();
        console.log(`Removed ${profileType} profile ${name} of user ${userDocument.email}`);
        return true;
    }

    // async removeSpendingsProfile({ name }) {
    //     return await this.removeProfile('spendings', name);
    // }

    async removeIncomeProfile({ name }) {
        return await this.removeProfile('income', name);
    }

    async removeMarketProfile({ name }) {
        return await this.removeProfile('market', name);
    }

    async getProfile(profileType, name) {
        const userDocument = this.context.user.document;
        for (const item of userDocument[`${profileType}Profiles`]) {
            if (item.name === name) {
                return item;
            }
        }
    }

    // async getSpendingsProfile({ name }) {
    //     return await this.getProfile('spendings', name);
    // }

    async getIncomeProfile({ name }) {
        return await this.getProfile('income', name);
    }

    async getIncomeProfiles({ names }) {
        const data = await names.map((name) => {
            return this.getIncomeProfile({ name });
        });

        return data;
    }

    async getMarketProfile({ name, randomMarketArgs }) {
        if (randomMarketArgs) {
            const randomMarket = () => {
                return new Promise((resolve, reject) => {
                    const python = spawn('python', [
                        './src/utils/generateRandomMarket.py',
                        randomMarketArgs.mean_igr.toString(),
                        randomMarketArgs.minv_igr.toString(),
                        randomMarketArgs.maxv_igr.toString(),
                        randomMarketArgs.mean_ir.toString(),
                        randomMarketArgs.minv_ir.toString(),
                        randomMarketArgs.maxv_ir.toString(),
                        randomMarketArgs.period.toString()
                    ]);

                    python.stdout.on('data', function (data) {
                        resolve(data.toString());
                    });

                    // python.on('close', (code) => {
                    //     console.log('code : ', code)
                    // });

                    python.stderr.on('data', function (data) {
                        reject(data.toString());
                    });
                });
            }

            let market = await randomMarket();
            market = JSON.parse(market);
            const startYear = 0;
            const marketProfile = {
                name: 'randomized',
                variations: market.igr.map((igr, index) => {
                    return { year : startYear + index, igr, ir : market.ir[index] }
                })
            }

            return marketProfile;
        }

        return await this.getProfile('market', name);
    }

    async getMyIncomeProfileNames() {
        const userDocument = this.context.user.document;
        return userDocument.incomeProfiles.map(item => item.name);
    }

    async getMyMarketProfileNames() {
        const userDocument = this.context.user.document;
        return userDocument.marketProfiles.map(item => item.name);
    }
}

module.exports = SimulationAPI;