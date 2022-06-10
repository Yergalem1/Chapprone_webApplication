const mongoose = require('mongoose');

const orgSchema = mongoose.Schema({
    username: {
        type: String, 
        required:true, 
        unique:true
    },
    city: {
        type: String, 
        required:true
    }
   
});
 const org  = mongoose.model("Organisation", orgSchema);




 

 module.exports =  org 