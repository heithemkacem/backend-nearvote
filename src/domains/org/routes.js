const express= require('express')
const {registerValidation,loginValidation} = require('../../util/orgValidation')
const verifyToken = require('../../util/verifyToken')
const {sendOTPVerificationEmail} = require('./../orgotpverification/controller')
const {createOrganization,authenticateOrg} = require('./controller')
const Org = require('./model')
const hashData = require('./../../util/hashData')
const router = express.Router()

//!Sign Up
router.post('/signup', async (req,res)=>{
    try{
        let {orgName,orgDescription,email,password} = req.body
        //String method that is used to remove whitespace characters from the start and end of a string
        orgName = orgName.trim()
        orgDescription = orgDescription.trim()
        email = email.trim()
        password = password.trim()
        //Validate the Data with JOI
        const {error} = registerValidation(req.body)
        if(error){
        res.send({status:"Failed",message:error['details'][0]['message']})
        }
        else{
            const newOrganization= await createOrganization({orgName,orgDescription,email,password})
            const emailData = await sendOTPVerificationEmail(newOrganization)
            res.json({
                status:"Success",
                message:"Verification OTP email has been sent",
                data:emailData,
                organization_data:newOrganization
            })
        }
    }catch(error){
        res.json({
            status:"Failed",
            message: error.message,
        }) 
    }
})

//!Sign In
router.post('/signin',async (req,res)=>{
    try{
        let {email,password} = req.body
        //String method that is used to remove whitespace characters from the start and end of a string
        email = email.trim()
        password = password.trim()
        //Validate the Data
        const {error} = loginValidation(req.body)
        if(error){
        res.send({status:"Failed",message:error['details'][0]['message']})
        }
        const authenticatedOrg = await authenticateOrg(email,password)
        res.json({
            status:'Success',
            message:'Signin successful ',
            data: authenticatedOrg,
        })

    }
    catch(error) {
        res.json({
            status:'Failed',
            message:error.message
        })  
    }
})

router.get('/currentorg',verifyToken,(req,res)=>{
    const {organization_id} = req.user
    Org.findById(organization_id,(err,data)=>{
             if(err){
                console.log(err)
             }else{
                    res.json({
                        data: data,
                    })
             }
    })
})

router.put('/updateorg/:orgid',async(req,res)=>{
    try{
    const {orgid} = req.params
    const {phone , orgDescription , orgName} = req.body
    const existingOrg = await Org.findById({_id:orgid})
    if(existingOrg){
        await Org.updateOne({_id:orgid},{orgName : orgName})
        await Org.updateOne({_id:orgid},{orgDescription : orgDescription})
        await Org.updateOne({_id:orgid},{phone : phone})
        res.json({
            status:"Success",
            message :"Organization has been updated",
        })  
    }else{
        res.json({
            status:"Failed",
            message :"Organization doesnt exist"
        })
    }
    }catch(error) {
        res.json({
            status:'Failed',
            message:error.message
        })  

    }
   
})
module.exports = router