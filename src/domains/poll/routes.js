const express= require('express')
const router = express.Router()
const {createVotePoll} = require('./controller')
const VotePoll = require('./model')
const Voter = require('./../voter/model')
const VoteRoom = require('./../vote-room/model')
const VoteParty = require('./../vote_party/model')
router.post('/createpoll',async(req,res)=>{
    try{
            let {voter_id,room_id,party_id,voter_option} = req.body
            const existingVoter = await Voter.findById({_id:voter_id})
            const existingVoteRoom = await VoteRoom.findById({_id:room_id})
            const existingVoteParty = await VoteParty.findById({_id:party_id})
            const existingPoll =await VotePoll.findOne({voter_id : voter_id} && {room_id : room_id} && {party_id : party_id})
           
                if(existingVoter){
                    if(existingVoteRoom){
                        if(existingVoteParty){
                                if(existingPoll){
                                        res.json({
                                                    status:'Failed',
                                                    message:'Vote has been aleardy submited',
                                        }) 
                                }else{
                                    await createVotePoll({voter_id,room_id,party_id})
                                    existingVoteParty.voted_voters = [...existingVoteParty.voted_voters ,voter_id ]
                                    existingVoteParty.option_count = [...existingVoteParty.option_count ,voter_option ]
                                    await VoteParty.findByIdAndUpdate({_id : party_id},{voted_voters : existingVoteParty.voted_voters,option_count :existingVoteParty.option_count })
                                    res.json({                                                
                                    status:'Success',
                                    message:'Vote has been submited',
                                    data : existingVoteParty
                                    }) 
                                }
                        }else{
                            res.json({
                                status:"Failed",
                                message:"Vote Party Doeasnt Exist"
                            })
                        }
                    }else{
                        res.json({
                            status:"Failed",
                            message:"Vote Room Doeasnt Exist"
                        })
                    }
                }else{
                    res.json({
                        status:"Failed",
                        message:"Voter Doeasnt Exist",
                    })
                }
    }catch(error){
        throw error
    }
})

module.exports = router