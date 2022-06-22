const express= require('express')
const router = express.Router()
const {verifyVoterEmail} = require('./controller')
const path = require("path")

//!Verify email
router.get("/verify/:uniqueId/:uniqueString", async (req,res)=>{
    try{
        let {uniqueId,uniqueString}= req.params
        await verifyVoterEmail({uniqueId,uniqueString})
        res.sendFile(path.join(__dirname,'./views/voter_verification.html'))
    }catch(error){
        res.json({
            status:'Failed',
            message:error.message
        })  
    }
})
//!Verified Page Route
router.get("/verified",(req,res)=>{
    try{
        res.sendFile(path.join(__dirname,'./views/voter_verification.html'))
    }catch(error){
        res.json({
            status:'Failed',
            message:error.message
        })  
    }
})
module.exports = router