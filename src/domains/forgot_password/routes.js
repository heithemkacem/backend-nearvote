const express= require('express')
const router = express.Router()
const {requestPasswordReset,resetPassword,VoterRequestPasswordReset,VoterResetPassword} = require('./controller')
router.post('/requestpasswordreset',async (req,res)=>{
    try{
        const {email,redirectUrl} = req.body
        if(!email) throw Error("Empty Credentials Are Not Allowed")
        const emailData = await requestPasswordReset({email,redirectUrl})
        res.json({
            status : "Pending",
            message: "Password Reset Email Sent",
            data:emailData
        })
    }
    catch(error) {
        res.json({
            status : "Failed",
            message: error.message
        })
    }

})
//!Actually Reset The Passsword
router.post("/resetpassword",async (req,res)=>{
    try{
    let {uniqueId,resetString,newPassword}=req.body
    await resetPassword({uniqueId,resetString,newPassword})
    res.json({
                status:'Success',
                message:'Password has been reset '
    })
    }
    catch(error){

    }
   
})
router.post('/voterrequestpasswordreset',async (req,res)=>{
    try{
        const {email,redirectUrl} = req.body
        if(!email) throw Error("Empty Credentials Are Not Allowed")
        const emailData = await VoterRequestPasswordReset({email,redirectUrl})
        res.json({
            status : "Pending",
            message: "Password Reset Email Sent",
            data:emailData
        })
    }
    catch(error) {
        res.json({
            status : "Failed",
            message: error.message
        })
    }

})
//!Actually Reset The Passsword
router.post("/voterresetpassword",async (req,res)=>{
    try{
    let {uniqueId,resetString,newPassword}=req.body
    await resetPassword({uniqueId,resetString,newPassword})
    res.json({
                status:'Success',
                message:'Password has been reset '
    })
    }
   
    catch(error){

    }
   
})

module.exports = router