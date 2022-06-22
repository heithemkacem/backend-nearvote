const express= require('express')
const router = express.Router()
const {VoterRequestPasswordReset,VoterResetPassword} = require('./controller')

router.post('/voterrequestpasswordreset',async (req,res)=>{
    try{
        const {email} = req.body
        if(!email) throw Error("Empty Credentials Are Not Allowed")
        const emailData = await VoterRequestPasswordReset({email})
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
//!Actually reset the Passsword
router.post("/voterresetpassword",async (req,res)=>{
    try{
    let {uniqueId,resetString,newPassword}=req.body
    await VoterResetPassword({uniqueId,resetString,newPassword})
    res.json({
                status:'Success',
                message:'Password has been reset '
    })
    }
    catch(error){
        res.json({
            status:'Failed',
            message:error.message
        }) 
    }
   
})
module.exports = router