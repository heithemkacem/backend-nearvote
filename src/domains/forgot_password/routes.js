const express= require('express')
const router = express.Router()
const {requestPasswordReset,resetPassword} = require('./controller')
router.post('/requestpasswordreset',async (req,res)=>{
    try{
        const {email} = req.body
        if(!email) throw Error("Empty credentials are not allowed")
        const emailData = await requestPasswordReset({email})
        res.json({
            status : "Pending",
            message: "Password reset email sent",
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
        res.json({
            status:'Failed',
            message:error.message
        })  
    }
   
})
module.exports = router