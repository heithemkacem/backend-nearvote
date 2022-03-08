const express= require('express')
const router = express.Router()
const {verifyEmail} = require('./controller')
const path = require("path")

//!Verify email
router.get("/verifyvoter/:uniqueId/:uniqueString", async (req,res)=>{
    let {uniqueId,uniqueString}= req.params
    await verifyVoterEmail({uniqueId,uniqueString})
    res.sendFile(path.join(__dirname,'./views/voter_verification.html'))
})
//!Verified Page Route
router.get("/verifiedvoter",(req,res)=>{
    res.sendFile(path.join(__dirname,'./views/voter_verification.html'))
})
module.exports = router