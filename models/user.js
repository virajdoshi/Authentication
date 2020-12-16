var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var UserSchema = new mongoose.Schema({
    phone: {type: String, unique: true, required: [true, "can't be blank"], match: [/^[0-9]+$/, 'is invalid'], index: true},
    email: {type: String, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    first_name: {type: String, required: [true, "can't be blank"]},
    last_name: {type: String, required: [true, "can't be blank"]},
    password: {type: String, required: [true, "can't be blank"]}
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

const userModel = mongoose.model('User', UserSchema);

module.exports = {
    register: async function(data){
        return new Promise(function(resolve) {
            userModel.findOne({phone: data.user.phone}, function(err, foundUser){
                bcrypt.hash(data.user.password, saltRounds, (err, hash) => {
                    const newUser = new userModel({
                        phone: data.user.phone,
                        email: data.user.email,
                        first_name: data.user.first_name,
                        last_name: data.user.last_name,
                        password: hash
                    })
                    newUser.save(function(err){
                        if(err){
                            return resolve("Message: Registration Failed beacause your phone number already exist");
                        }
                        else{
                            resolve("Message: Registration Successfull");
                        }
                    })
                })
            })
        })
    }
}

