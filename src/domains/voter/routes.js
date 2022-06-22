const express= require('express')
const router = express.Router()
const Voter=require('./model')
const {voterRegisterValidation,voterLoginValidation} = require('../../util/voterValidation')
const {createVoter,authenticateVoter,deleteVoter} = require('./controller')
const verifyToken= require('./../../util/verifyToken')
const authorizeOrg= require('./../../util/authorizeRole')
let handleDelete=[]
let handleerror=[]

//!SignUp
router.post('/votersignup',verifyToken,async(req,res)=>{
    try{
        let {organization_id} = req.user
        let {username,firstName,lastName,email,phone} = req.body
        //String method that is used to remove whitespace characters from the start and end of a string
        //Validate the Data with JOI
        const {error} = voterRegisterValidation(req.body)
        if(error){
        res.send({status:"Failed",message:error['details'][0]['message']})
        }
        else{
           
            const existingVoter = await Voter.find({email})
            const existingPhone = await Voter.find({phone})
            const existingUsername = await Voter.find({username})
                for (let i = 0; i < existingVoter.length; i++) {
                if(existingVoter.length && existingVoter[i].organization_id=== organization_id){
                   
                    res.json({
                        status : "Failed",
                        message : "A voter aleardy exist with this email"
                    })
                    return;
                }}
                for (let i = 0; i < existingPhone.length; i++) {
                     if(existingPhone.length && existingPhone[i].organization_id=== organization_id){
                        res.json({
                            status : "Failed",
                            message : "A voter aleardy exist with this Phone"
                    })
                        return;
                }}
                for (let i = 0; i < existingUsername.length; i++) {
                if(existingUsername.length && existingUsername[i].organization_id=== organization_id){
                    res.json({
                        status : "Failed",
                        message : "A voter aleardy exist with this Username"
                    })
                    return;
                }}
                const createdVoter = await createVoter({username,firstName,lastName,email,phone},organization_id)
                        res.json({
                            status:'Success',
                            message:'Voter added',
                            data:createdVoter,
                })
    }
    }catch(error){
        res.json({
            status:'Failed',
            message:error.message
        }) 
    }
})
router.post('/votersignupfromexcel',verifyToken,async(req,res)=>{
    let {organization_id} = req.user
        let {fileData} = req.body
        //String method that is used to remove whitespace characters from the start and end of a string
        //Validate the Data with JOI
    for (let i=0;i<fileData.length;i++){
    try{
                const {username,firstName,lastName,email,phone} = fileData[i]
                const existingVoter = await Voter.find({email})
                const existingPhone = await Voter.find({phone})
                const existingUsername = await Voter.find({username})
                    if(Object.values(fileData[i]).length  < 5){
                        throw new Error('Check your excel file a variable is missing')
                    }
                    for (let i = 0; i < existingVoter.length; i++) {
                    if(existingVoter.length && existingVoter[i].organization_id=== organization_id){
                        throw new Error('A voter aleardy exist with this email')
                        
                    }}
                    for (let i = 0; i < existingPhone.length; i++) {
                         if(existingPhone.length && existingPhone[i].organization_id=== organization_id){
                            throw new Error('A voter aleardy exist with this Phone')
                    }}
                    for (let i = 0; i < existingUsername.length; i++) {
                    if(existingUsername.length && existingUsername[i].organization_id=== organization_id){
                        throw new Error('A voter aleardy exist with this Username')

                    }}
                    await createVoter({username,firstName,lastName,email,phone},organization_id)
                    throw new Error('Voter has been created')
    }catch(error){
        handleerror.push(error.message + "/")
    }
    
}
handleerror.map((error)=>{
    if(error.includes('Voter has been created')){
        res.write(error)
    }else if(error.includes('Check your excel file a variable is missing')){
        res.write(error)
    }else if(error.includes('A voter aleardy exist with this email')){
        res.write(error)
    }else if(error.includes('A voter aleardy exist with this Phone')){
        res.write(error)
    }else if(error.includes('A voter aleardy exist with this Username')){
        res.write(error)
    }

})
res.end()
handleerror = []
})

router.post('/votersignin',async (req,res)=>{
    try{
        let {email,password} = req.body
        //todo String method that is used to remove whitespace characters from the start and end of a string
        email = email.trim()
        password = password.trim()
        //!Validate the Data
        const {error} = voterLoginValidation(req.body)
        if(error){
        res.send({status:"Failed",message:error['details'][0]['message']})
        }
        else{
            const authenticatedVoter = await authenticateVoter({email,password})
            if(authenticatedVoter){
                //password match
                
                res.json({
                    status:'Success',
                    message:'Signin successful ',
                    data: authenticatedVoter
                })   
            }else{
                    res.json({
                    status:'Failed',
                    message:'Enter valid credentials ',
                }) 
            }
            
        }
    }
    catch(error){
        res.json({
            status : "Failed",
            message : error.message
        })
    }
   
})

router.get('/voterlist',verifyToken,async(req,res)=>{
    let {organization_id} = req.user
    Voter.find(({organization_id:organization_id}),(error,data)=>{
        if(error){
            console.log(error)
        }else{
            if(data.length){
                res.json({
                    data: data,
                })
             }else{
                res.json({
                    data: "no data",
                })
             }
        }
    })
    
})

router.get('/voter/:voterid',(req,res)=>{
    const {voterid} = req.params
    Voter.findById(({_id:voterid}),(error,data)=>{
        if(error){
            console.log(error)
        }else{
            res.json({
                data : data
            })
        }
    })
})

router.put('/updatevoter/:voterid',async(req,res)=>{
            try{
            const {voterid} = req.params
            const existingVoter = await Voter.findById({_id:voterid})
            if(existingVoter){
                await Voter.updateOne({_id:voterid},req.body)
                res.json({
                    status:"Success",
                    message :"Voter has been updated",
                    data2 : existingVoter
                })  
            }else{
                res.json({
                    status:"Failed",
                    message :"Voter Doesnt Exist"
                })
            }
            
         
            }catch(error) {
                res.json({
                    status:'Failed',
                    message:error.message
                }) 
        
            }
           
})
router.delete('/deletevoter',async(req,res)=>{
            const data = req.body
        
            data.map((voter)=>{
                Voter.deleteOne({_id:voter} ,()=>{
                        handleDelete= [...handleDelete , "deleted"]
                    })  
            })
            handleDelete.map((error)=>{
                res.write("Voter has been deleted/")  
            })
            res.end()
            handleDelete = []
        })
        



module.exports = router