const user = require("../models/user.js");

module.exports = {
    //Register function checks the json format is empty or not if its proper the it will send the data to user.register function
    register: async function(req, res) {
        if(!req.body.user.phone || !req.body.user.first_name || !req.body.user.last_name || !req.body.user.email || !req.body.user.password || !req.body.user.ConfirmPassword){
          return res.status(422).json({errors: {errors: "Fields can't be blank"}});
        }
        else if(req.body.user.password != req.body.user.ConfirmPassword){
          return res.status(422).json({errors: {errors: "Password must be same for confirm password"}});
        }
        else{
          let result = await user.register(req.body) 
          res.json(result)
        }
    },

    registerPhone: async function(req, res){
      if(!req.body.user.phone){
        return res.status(422).json({errors: {errors: "You must enter phone number to register."}});
      }
      else{
        let result = await user.registerPhone(req.body) 
        res.json(result)
      }
    },

    verifyOTP: async function(req, res){
      if(!req.body.user.phone || !req.body.user.otp){
        return res.status(422).json({errors: {errors: "You must enter phone number and otp to verify"}});
      }
      else{
        let result = await user.verifyOTP(req.body) 
        res.json(result)
      }
    }
}
