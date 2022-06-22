const mongoose= require('mongoose')
const Schema = mongoose.Schema
const VotePartySchema=new Schema({
    mainQuestion:{
        type:String,
        require:true,
        min:4,
        max:26
    },
    startDate:{
        type:String,
        require:true,
        min:6,
        max:256
    },
    endDate:{
        type:String,
        require:true,
        min:6,
        max:256
    },
   
    date:{
        type:Date,
        default:Date.now
    },
    
    option1: {
        type :String
    },
    option2: {
        type :String
    },
    organization_id:{
        type :String
    },
    
    room_id:{
        type:String
    },
 
})
const VoteParty = mongoose.model('voteparty',VotePartySchema)
module.exports = VoteParty