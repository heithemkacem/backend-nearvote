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
    ballotType:{
        type:String,
        require:true,
        min:6,
        max:1024
    },
    date:{
        type:Date,
        default:Date.now
    },
    options: {
        type :Array
    },
    organization_id:{
        type :String
    },
    voted_voters: {
        type :Array
    }, 
    option_count:{
        type:Array
    },
    room_id:{
        type:String
    },
 
})
const VoteParty = mongoose.model('voteparty',VotePartySchema)
module.exports = VoteParty