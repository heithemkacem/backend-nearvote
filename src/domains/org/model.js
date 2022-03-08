
const mongoose= require('mongoose')
const Schema = mongoose.Schema
const organizationSchema=new Schema({
    orgName:{
        type:String,
        require:true,
        min:4,
        max:26
    },
    orgDescription:{
        type:String,
        require:false,
        max:1024
    },
    email:{
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
    token: { type: String }
})
const Org = mongoose.model('org',organizationSchema)
module.exports = Org