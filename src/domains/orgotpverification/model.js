const mongoose= require('mongoose')
const Schema = mongoose.Schema
const OrgOTPVerification=new Schema({
    orgID:{
        type:String
    },
    otp:{
        type:String
    },
    createdAt:{
        type:Date
    },
    expiresAt:{
        type:Date
    },
})
const OrganizationOTPVerification = mongoose.model('otp-verification',OrgOTPVerification)
module.exports = OrganizationOTPVerification