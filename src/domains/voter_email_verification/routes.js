const express= require('express')
const router = express.Router()
const {verifyVoterEmail} = require('./controller')
const path = require("path")

//!Verify email
router.get("/verify/:uniqueId/:uniqueString", async (req,res)=>{
    let {uniqueId,uniqueString}= req.params
    await verifyVoterEmail({uniqueId,uniqueString})
    res.sendFile(path.join(__dirname,'./views/voter_verification.html'))
})
//!Verified Page Route
router.get("/verified",(req,res)=>{
    res.sendFile(path.join(__dirname,'./views/voter_verification.html'))
})
module.exports = router