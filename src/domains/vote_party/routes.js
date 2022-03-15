const express= require('express')
const router = express.Router()
const {votePartyRegisterValidation} = require('../../util/voteRoomValidation')
const {createVoteParty} = require('./controller')
const verifyToken= require('./../../util/verifyToken')
const authorizeOrg= require('./../../util/authorizeRole')
const VoteRoom = require('./../vote-room/model')
const Voter = require('./../voter/model')
const VoteParty = require('./model')
let votePartys = []
router.post('/addvoteparty',async(req,res)=>{
    try{
        let {mainQuestion,startDate,endDate,ballotType,options,VoteRoomId} = req.body
        //Validate the Data with JOI
        const {error} = votePartyRegisterValidation(req.body)
        if(error){
        res.status(400).send({message:error['details'][0]['message']})
        }
        else{
            const createdVoteParty = await createVoteParty({mainQuestion,startDate,endDate,ballotType,options,VoteRoomId})
            res.json({
                status:'Success',
                message:'Vote Party added',
                data:createdVoteParty,
            })
        }
    }catch(error){
        throw error
    }
})


router.get('/roompartys/:voterId/:roomId',async(req,res)=>{
    try{
        let {roomId,voterId} = req.params
        //Validate the Data with JOI
        
        VoteRoom.findOne({roomId},(err,roomData)=>{
            if(err){
                console.log(err)
               
            }else{
              
                Voter.findOne({voterId},(err,voterData)=>{
                    if(err){
                        console.log(err)
                    }else{
                        
                            VoteParty.find( (err,partyData)=>{
                                if(err){
                                    console.log(err)
                                }else{
                                    partyData.map((room)=>{
                                        if(room.room_id === roomId){
                                            votePartys = [...votePartys,room]
                                        }
                                    })
                                   
                                }
                                res.json({
                                    data : votePartys,
                                })
                                votePartys = []
                            })
                        
                    }
                })
            }
        })
    }catch(error){
        throw error
    }
})
router.get('/voterparty/:voterId/:roomId/:partyId',async(req,res)=>{
    try{
        let {roomId,voterId,partyId} = req.params
        //Validate the Data with JOI
        
        VoteRoom.findOne({roomId},(err,roomData)=>{
            if(err){
                console.log(err)
               
            }else{
              
                Voter.findOne({voterId},(err,voterData)=>{
                    if(err){
                        console.log(err)
                    }else{
                            VoteParty.findOne( {_id : partyId}, (err,partyData)=>{
                                if(err){
                                    console.log(err)
                                }else{
                                        res.send(partyData)
                                }
                                }
                            )
                    }
                })
            }
        })
    }catch(error){
        throw error
    }
})
module.exports = router