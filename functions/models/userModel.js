const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username: {
        type: String, 
        required:true, 
        unique:true
    },
    role: {
        type: String, 
        required:true
    },
    registrationNumber: {
        type: String
    },
    password: {
        type: String, 
        required:true
    },
    organisation: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation' },
   
});
 const user  = mongoose.model("User", userSchema ,'users');



 module.exports  =  user 