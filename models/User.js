const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique : true,
        dropDups: true
    },
    username: {
        type: String,
        required: true,
        unique : true,
        dropDups: true
    },
    password: {
        type: String,
        required: true,
        unique : true,
        dropDups: true
    },
})

const User = module.exports = mongoose.model('User', UserSchema);

/**
 * 
 * @param {String} id 
 * @param {Function} callback 
 * @description: A method to search for a user id
 */
module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

/**
 * 
 * @param {String} username 
 * @param {Function} callback 
 * @description: A method to search for username
 */
module.exports.getUserByUserName = (username, callback) => {
    const query = {username: username}
    User.findOne(query, callback);
}

/**
 * 
 * @param {User} registerUser 
 * @param {Function} callback 
 * @description: A function to add user to database
 */
module.exports.addUser = (registerUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(registerUser.password, salt, (err, hash) => {
            if(err) 
                throw err;
            registerUser.password = hash;
            registerUser.save(callback);
        });
    });
}

/**
 * 
 * @param {String} candidatePassword 
 * @param {String} hash 
 * @param {Function} callback 
 * @description: Function to compare user provided password with the encrypted 
 * password in the database
 */
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) {
            throw err;
        }
        callback(null, isMatch);
    });
}
