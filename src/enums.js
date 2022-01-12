class Enum {
    constructor(...keys) {
        keys.forEach((key, _) => {
        this[key] = key;
        });
        Object.freeze(this);
    }

    *[Symbol.iterator]() {
        for (let key of Object.keys(this)) yield key;
    }
}
  
const UserRoles = new Enum('USER', 'ADMIN');
  
module.exports.UserRoles = UserRoles;