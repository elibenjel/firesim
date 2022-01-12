const { UserRoles } = require('./enums');

module.exports.getModels = (mg) => {

    const userSchema = new mg.Schema({
        createdAt: { type : Date, default : Date.now },
        updatedAt: { type : Date, default : Date.now },
        email: { type : String, required : true, unique : true},
        password: { type : String, required : true},
        roles: {type : [{type : String, enum : [...UserRoles]}], default : [UserRoles.USER]}
    });
  
    const User = mg.model('User', userSchema);
  
    return { User };
}