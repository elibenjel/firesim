const { UserRoles } = require('../enums');

module.exports.getModels = (mg) => {

    const spendingProfileSchema = new mg.Schema({
        createdAt: { type : Date, default : Date.now },
        updatedAt: { type : Date, default : Date.now },
        name: { type : String, required : true },
        spendings: { type : [
            { label : String, amount : Number, frequency : Number }
        ]},
        total: Number
    });

    const userSchema = new mg.Schema({
        createdAt: { type : Date, default : Date.now },
        updatedAt: { type : Date, default : Date.now },
        email: { type : String, required : true, unique : true},
        password: { type : String, required : true},
        roles: {type : [{type : String, enum : [...UserRoles]}], default : [UserRoles.USER]},
        spendingProfiles: { type : [spendingProfileSchema], default : [] }
    });
  
    const User = mg.model('User', userSchema);
    const SpendingProfile = mg.model('SpendingProfile', spendingProfileSchema);

    return { User, SpendingProfile };
}