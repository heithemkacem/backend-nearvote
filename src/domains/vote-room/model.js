const mongoose= require('mongoose')
const Schema = mongoose.Schema
const VoteRoomSchema=new Schema({
 
    mainQuestion:{
        type:String,
        require:true,
        min:4,
        max:26
    },
    description:{
        type:String,
        require:true,
        min:4,
        max:26
    },
    organizationName:{
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
    voters:{
        type:Array,
        require:true,
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
    }
})
const VoteRoom = mongoose.model('vote-room',VoteRoomSchema)
module.exports = VoteRoom