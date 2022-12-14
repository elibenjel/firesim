const { DataSource } = require('apollo-datasource');
const { AuthenticationError } = require('apollo-server-express');
const bcrypt = require('bcrypt');
const { checkEmail, genToken, checkToken } = require('../utils');
const { UserRoles } = require('../enums');

class UserAPI extends DataSource {
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

    async signupUser({ email: emailArg, password: passwordArg }) {
        const email = checkEmail(emailArg);
        if (!email) {
            console.log(`The email provided is not valid: ${emailArg}`);
            return null;
        }

        const hash = await bcrypt.hash(passwordArg, parseInt(process.env.PASSWORD_SALT));

        const user = new this.models.User({
            email,
            password: hash
        });

        await user.save();
        console.log(`New user added:\n email: ${user.email}\n ID: ${user._id}`);
        const token = genToken(user);
        user.token = token;
        return user;
    }

    async loginUser({ email: emailArg, password: passwordArg }) {
        const email = checkEmail(emailArg);
        if (!email) throw new AuthenticationError('The email provided is not a valid one');

        const user = await this.models.User.findOne({email : email});
        if (!user) throw new AuthenticationError('No user exists with this email'); 
        
        const valid = await bcrypt.compare(passwordArg, user.password);
        if (!valid) throw new AuthenticationError('The credentials provided are incorrect');

        const token = genToken(user);
        user.token = token;
        console.log(`Succesfully logged in user ${user._id}.`);
        return user;
    }

    async getAllUsers() {
        if (!this.context.user?.roles.includes(UserRoles.ADMIN)) return null;
        const users =
        await this.models.User.
        find().
        exec();

        return users;
    }

    async whoAmI({ email: emailArg }) {

        const email = checkEmail(emailArg);
        if (!email) {
            console.log(`The email provided is not valid: ${emailArg}`);
            return null;
        }

        const user =
        await this.models.User.
        findOne({ email: email }).
        exec();

        return user;
    }

    static async authUser(token, models) {
        if (!token) {
            let unkownUser = await models.User.findOne({ email : 'unkown' }).exec();
            if (!unkownUser) {
                console.log('Adding a default unkown user to database...')
                unkownUser = new models.User({ email : 'unkown', password : 'unkown', roles : [UserRoles.UNKOWN]});
                await unkownUser.save();
                console.log('Done');
            }
            return unkownUser;
        }

        try {
            const { userID } = checkToken(token);
            const user =
            await this.models.User.
            findOne({ _id : userID }).
            exec();

            if (!user) throw `User ID ${userID} doesn't exist in database.`;
            return user;

        } catch (err) {
            throw AuthenticationError(err);
        }
    }
}

module.exports = UserAPI;