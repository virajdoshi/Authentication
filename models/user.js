var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var UserSchema = new mongoose.Schema({
    phone: {type: String, unique: true,  match: [/^[0-9]+$/, 'is invalid'], index: true},
    email: {type: String, unique: true, index: true},
    first_name: {type: String},
    last_name: {type: String},
    password: {type: String},
    otp: {type: Number},
    isVerified: {type: Boolean}
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

const userModel = mongoose.model('User', UserSchema);

module.exports = {
    register: async function(data){
        return new Promise(function(resolve) {
            userModel.exists({phone: data.user.phone, email: data.user.email}, function(err, results){
                if(results === true){
                    resolve("Message: Registration Failed beacause you are already registered")
                }
                else{
                    userModel.exists({phone: data.user.phone, isVerified: true}, function(err, results){
                        if(results === true){
                            bcrypt.hash(data.user.password, saltRounds, (err, hash) => {    
                                userModel.updateOne({phone: data.user.phone},{$set: {
                                    email: data.user.email,
                                    first_name: data.user.first_name,
                                    last_name: data.user.last_name,
                                    password: hash
                                }}, function(err, results){
                                    if(err){
                                        resolve("Message: This email is already registered");
                                    }
                                    else
                                        resolve("Message: Registration successfully completed now you can login.")
                                })
                            })
                        }
                        else{
                            return resolve("Message: Before you registered your personal details first verify your phone number.");
                        }
                    })
                }
            })
        })
    },

    registerPhone: async function(data){
        return new Promise(function(resolve) {
            userModel.exists({phone: data.user.phone}, function(err, results){
                if(results === false){
                    var otp = Math.floor(100000 + Math.random() * 900000);
                    const newUser = new userModel({
                        phone: data.user.phone,
                        otp: otp
                    })
                    newUser.save(function(err){
                        if(err)
                            console.log(err)
                        else
                            resolve("Message: Your otp is "+ otp + ". Now verify this otp at /verify-otp");
                    })
                }
                else{
                    resolve("Message: Registration failed because your are already registered your phone number");
                }
            })
        })
    },

    verifyOTP: async function(data){
        return new Promise(function(resolve){
            userModel.exists({phone: data.user.phone, otp: data.user.otp}, function(err, results){
                if(results === false){
                    resolve("Message: Before you verify first register your phone at /register-phone or check your otp properly.");
                }
                else{
                    userModel.updateOne({phone: data.user.phone}, {$set: {isVerified: true}}, function(err, results){
                        console.log(results);
                    })
                    resolve("Message: Your phone number is verified now you must register your personal details at /register")
                }
            })
        })
    }
}
