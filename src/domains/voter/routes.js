const express= require('express')
const router = express.Router()
const Voter=require('./model')
const {voterRegisterValidation,voterLoginValidation} = require('../../util/voterValidation')
const {createVoter,authenticateVoter,deleteVoter} = require('./controller')
const verifyToken= require('./../../util/verifyToken')
const authorizeOrg= require('./../../util/authorizeRole')
//!SignUp

router.post('/votersignup',verifyToken,async(req,res)=>{

    try{
        let {organization_id} = req.user
        let {username,firstName,lastName,email,phone} = req.body
        //String method that is used to remove whitespace characters from the start and end of a string
        //Validate the Data with JOI
        const {error} = voterRegisterValidation(req.body)
        if(error){
        res.status(400).send({message:error['details'][0]['message']})
        }
        else{
            const createdVoter = await createVoter({username,firstName,lastName,email,phone},organization_id)
            res.json({
                status:'Success',
                message:'Voter added',
                data:createdVoter,
            })
        }
    }catch(error){
        throw error
    }
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
        res.status(400).send({message:error['details'][0]['message']})
        }
        else{
            const authenticatedVoter = await authenticateVoter({email,password})
            res.json({
                status:'Success',
                message:'Signin Successful ',
                data: authenticatedVoter
            })     
        }
    }
    catch(error){
        res.json({
            status : "Failed",
            message : error.message
        })
    }
   
})


router.get('/voterlist',(req,res)=>{
    
    Voter.find((err,data)=>{
             if(err){
                console.log(err)
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


router.post('/exportdata',verifyToken,(req,res)=>{
    var wb = XLSX.utils.book_new() //new workbook
    Voter.find((err,data)=>{
        if(err){
            console.log(err)
        }else{
            var temp = JSON.stringify(data)
            temp = JSON.parse(temp)
            var ws = XLSX.utils.json_to_sheet(temp)
            var down = __dirname+'/public/exportdata.xlsx'
            XLSX.utils.book_append_sheet(wb,ws,"sheet1")
            XLSX.writeFile(wb,down)
            res.download(down)
        }
    })
})

router.delete('/deletevoter',verifyToken,async(req,res)=>{
    let{id} = req.body
    Voter.findOneAndDelete({id},(err)=>{
             if(err){
                console.log(err)
             }else{
                res.json({
                    status:'Success',
                    message:'Voter has been deleted ',
                })  
             }
    })
})

module.exports = router