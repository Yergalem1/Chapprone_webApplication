const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
    name: {
        type: String, 
        required:true, 
        unique:true
    },
    description: {
        type: String, 
        required:true
    },
    
trip_leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
organisation: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation' },

});
//  const trip  = mongoose.model("Trip", tripSchema ,'trips');
const Trip  = mongoose.model("Trip", tripSchema);

module.exports = Trip