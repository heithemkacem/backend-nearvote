const mongoose= require('mongoose')
const Schema = mongoose.Schema
const PasswordReset=new Schema({
    uniqueId:{
        type:String
    },
    resetString:{
        type:String
    },
    createdAt:{
        type:Date
    },
    expiresAt:{
        type:Date
    },
})
const PassReset = mongoose.model('password_reset',PasswordReset )
module.exports = PassReset