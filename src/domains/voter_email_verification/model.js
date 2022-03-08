const mongoose= require('mongoose')
const Schema = mongoose.Schema
const VoterVerification=new Schema({
    uniqueId:{
        type:String
    },
    uniqueString:{
        type:String
    },
    createdAt:{
        type:Date
    },
    expiresAt:{
        type:Date
    },
})
const VoterVerificationModal = mongoose.model('org_verification',VoterVerification)
module.exports = VoterVerificationModal