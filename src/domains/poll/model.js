const mongoose= require('mongoose')
const Schema = mongoose.Schema
const PollSchema=new Schema({
    voter_id:{
        type:String,
    },
    room_id:{
        type:String,
    },
    party_id:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    },

    
})
const VotePoll = mongoose.model('vote-poll',PollSchema)
module.exports = VotePoll