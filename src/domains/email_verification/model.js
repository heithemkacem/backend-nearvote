const mongoose= require('mongoose')
const Schema = mongoose.Schema
const OrgVerification=new Schema({
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
const OrganizationVerification = mongoose.model('org_verification',OrgVerification)
module.exports = OrganizationVerification