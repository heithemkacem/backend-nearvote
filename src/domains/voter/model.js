const mongoose= require('mongoose')
const Schema = mongoose.Schema
const VoterSignUpSchema=new Schema({
 
    username:{
        type:String,
        require:true,
        min:4,
        max:26
    },
    firstName:{
        type:String,
        require:true,
        min:4,
        max:26
    },
    lastName:{
        type:String,
        require:true,
        min:4,
        max:26
    },
    email:{
        type:String,
        require:true,
        min:6,
        max:256
    },
    phone:{
        type:String,
        require:true,
        min:6,
        max:256
    },
    password:{
        type:String,
        require:true,
        min:6,
        max:1024
    },
    date:{
        type:Date,
        default:Date.now

    },
    verified:{
        type:Boolean,
    },
    role: {
        type :String
    },
    organization_id:{
        type :String
    }
})
const Voter = mongoose.model('voter',VoterSignUpSchema)
module.exports = Voter