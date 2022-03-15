const mongoose= require('mongoose')
const Schema = mongoose.Schema
const VoteRoomSchema=new Schema({
    roomDescription:{
        type:String,
        require:true,
        min:4,
        max:26
    },
    roomName:{
        type:String,
        require:true,
        min:4,
        max:26
    },
    voters:{
        type:Array,
        require:true,
    },
    date:{
        type:Date,
        default:Date.now
    },
    
    organization_id:{
        type :String
    }
})
const VoteRoom = mongoose.model('vote-room',VoteRoomSchema)
module.exports = VoteRoom