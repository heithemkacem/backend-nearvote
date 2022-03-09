const express= require('express')
const router = express.Router()
const {voteRoomRegisterValidation} = require('../../util/voteRoomValidation')
const {createVoteRoom} = require('./controller')
const {sendVoterVerificationEmail} = require('./../voter_email_verification/controller')
const verifyToken= require('./../../util/verifyToken')
const authorizeOrg= require('./../../util/authorizeRole')
const VoteRoom = require('./model')
const Voter = require ('./../voter/model')


router.post('/createvoteroom',async(req,res)=>{
    try{
     
        let {mainQuestion,organizationName,description,voters,startDate,endDate,ballotType,options} = req.body
        //Validate the Data with JOI
        const {error} = voteRoomRegisterValidation(req.body)
        if(error){
        res.status(400).send({message:error['details'][0]['message']})
        }
        else{
            const createdVoteRoom = await createVoteRoom({mainQuestion,organizationName,description,voters,startDate,endDate,ballotType,options})
            res.json({
                status:'Success',
                message:'Vote Room added',
                data:createdVoteRoom,
            })
        }
    }catch(error){
        throw error
    }
})


router.get('/voteroomslist',(req,res)=>{
    VoteRoom.find((err,data)=>{
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

router.post('/sendvotersemail',async(req,res)=>{
    let{id} = req.body
    VoteRoom.findOne({id},(err,data)=>{
             if(err){
                console.log(err)
             }else{
               
                data.voters.map((voter)=> 
                Voter.findOne({voter},(error,voterData)=>{
                    if(err){
                        console.log(error)
                     }else{
                        sendVoterVerificationEmail(voterData,id)
                        //todo get the voteroom id and send it to the voter
                     }
                   
                })
                
                )
             }
    })
})
module.exports = router