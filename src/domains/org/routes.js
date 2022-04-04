const express= require('express')
const {registerValidation,loginValidation} = require('../../util/orgValidation')
const verifyToken = require('../../util/verifyToken')
const {sendVerificationEmail} = require('./../email_verification/controller')
const {createOrganization,authenticateOrg} = require('./controller')
const Org = require('./model')
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
        res.status(400).send({message:error['details'][0]['message']})
        }
        else{
            const newOrganization= await createOrganization({orgName,orgDescription,email,password})
            const emailData = await sendVerificationEmail(newOrganization)
            res.json({
                status:"Success",
                message:"Verification Email Sent",
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
        res.status(400).send({message:error['details'][0]['message']})
        }
        const authenticatedOrg = await authenticateOrg(email,password)
        res.json({
            status:'Success',
            message:'Signin Successful ',
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

module.exports = router