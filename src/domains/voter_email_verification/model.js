//!Verify Voter Model 
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
const VoterVerificationModal = mongoose.model('voter_verification',VoterVerification)
module.exports = VoterVerificationModal