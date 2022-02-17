const { UserRoles } = require('../enums');

module.exports.getModels = (mg) => {

    const spendingsProfileSchema = new mg.Schema({
        createdAt: { type : Date, default : Date.now },
        updatedAt: { type : Date, default : Date.now },
        name: { type : String, required : true },
        spendings: { type : [
            { label : String, amount : Number, frequency : Number }
        ]},
        total: Number
    });

    const incomeProfileSchema = new mg.Schema({
        createdAt: { type : Date, default : Date.now },
        updatedAt: { type : Date, default : Date.now },
        name: { type : String, required : true },
        income: { type : [
            { income : Number, increase : Number, period : Number }
        ]},
        incomeFrequency: Number,
        increaseFrequency: Number
    });

    const userSchema = new mg.Schema({
        createdAt: { type : Date, default : Date.now },
        updatedAt: { type : Date, default : Date.now },
        email: { type : String, required : true, unique : true},
        password: { type : String, required : true},
        roles: {type : [{type : String, enum : [...UserRoles]}], default : [UserRoles.USER]},
        spendingsProfiles: { type : [spendingsProfileSchema], default : [] },
        incomeProfiles: { type : [incomeProfileSchema], default : [] }
    });
  
    const User = mg.model('User', userSchema);

    return { User };
}