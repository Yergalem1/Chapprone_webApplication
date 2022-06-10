
const mongoose = require('mongoose');

const participantSchema = mongoose.Schema({
    userID: {
        type: String, 
        required:true, 
        unique:true
    },
    tripID: {
        type: String, 
        required:true
    },
    //user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'participants' },
   // trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'participants' },
    
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    
});
 const partic  = mongoose.model("Participant", participantSchema ,'participants');



module.exports =  partic 