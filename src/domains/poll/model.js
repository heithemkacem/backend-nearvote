const mongoose= require('mongoose')
const Schema = mongoose.Schema
const PollSchema=new Schema({
    voter_id:{
        type:String,
        require:true,
    },
    room_id:{
        type:String,
        require:true,
    },
    party_id:{
        type:String,
        require:true,
    },
    date:{
        type:Date,
        default:Date.now
    },
    
})
const VotePoll = mongoose.model('vote-poll',PollSchema)
module.exports = VotePoll