const user = require("../models/user.js");

module.exports = {
    //Register function checks the json format is empty or not if its proper the it will send the data to user.register function
    register: async function(req, res) {
        if(!req.body.user.phone || !req.body.user.first_name || !req.body.user.last_name || !req.body.user.email || !req.body.user.password){
          return res.status(422).json({errors: {errors: "Fields can't be blank"}});
        }
        else{
          let result = await user.register(req.body) 
          res.json(result)
        }
    }
}