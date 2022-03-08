const express= require('express')
const router = express.Router()
const {verifyEmail} = require('./controller')
const path = require("path")

//!Verify email
router.get("/verify/:uniqueId/:uniqueString", async (req,res)=>{
    let {uniqueId,uniqueString}= req.params
    await verifyEmail({uniqueId,uniqueString})
    res.sendFile(path.join(__dirname,'./views/org_verification.html'))
})
//!Verified Page Route
router.get("/verified",(req,res)=>{
    res.sendFile(path.join(__dirname,'./views/org_verification.html'))
})
module.exports = router