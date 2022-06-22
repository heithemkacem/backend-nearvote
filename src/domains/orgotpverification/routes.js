const express= require('express')
const router = express.Router()
const {verifyOTPEmail,resendOTP} = require('./controller')

//!Verify email
router.post("/verify/:orgID", async (req,res)=>{
    try{

   
    let {otp}= req.body
    let {orgID}=req.params
    await verifyOTPEmail({orgID,otp})
    res.json({
        status:"Success",
        message:"You have been verified"
    })
    }catch(error){
        res.json({
            status:'Failed',
            message:error.message
        })  
    }
})
router.post("/resendOTP", async (req,res)=>{
    try{
    let {orgID,email}= req.body
    const resendEmail = await resendOTP({orgID,email})
    if(resendEmail === true){
        res.json({
            status:'Success',
            message:"OTP has been resent"
        })  
    }
    }catch(error){
        res.json({
            status:'Failed',
            message:error.message
        })  
    }
})
module.exports = router